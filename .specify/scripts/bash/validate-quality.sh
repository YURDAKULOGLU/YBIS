#!/usr/bin/env bash

# Validate code against established quality standards
# Integrates with existing Spec-Kit infrastructure

set -e
set -u
set -o pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

eval $(get_feature_paths)

log_info() {
    echo "INFO: $1"
}

log_success() {
    echo "✓ $1"
}

log_error() {
    echo "ERROR: $1" >&2
}

log_warning() {
    echo "WARNING: $1" >&2
}

check_pattern_consistency() {
    log_info "Checking pattern consistency..."
    local violations=0

    # State Management: Only ONE pattern
    local context_count=$(find "$REPO_ROOT" -name "*.ts" -o -name "*.tsx" 2>/dev/null | xargs grep -l "createContext\|useContext" | wc -l)
    local redux_count=$(find "$REPO_ROOT" -name "*.ts" -o -name "*.tsx" 2>/dev/null | xargs grep -l "useSelector\|useDispatch\|@reduxjs" | wc -l)

    if [[ $context_count -gt 0 && $redux_count -gt 0 ]]; then
        log_error "PATTERN VIOLATION: Both React Context ($context_count files) and Redux ($redux_count files) detected"
        violations=$((violations + 1))
    fi

    # UI Library: Check for multiple
    local ui_libraries=()
    grep -r "from.*@mui" "$REPO_ROOT" >/dev/null 2>&1 && ui_libraries+=("MUI")
    grep -r "from.*antd" "$REPO_ROOT" >/dev/null 2>&1 && ui_libraries+=("Antd")
    grep -r "from.*@chakra" "$REPO_ROOT" >/dev/null 2>&1 && ui_libraries+=("Chakra")

    if [[ ${#ui_libraries[@]} -gt 1 ]]; then
        log_error "PATTERN VIOLATION: Multiple UI libraries detected: ${ui_libraries[*]}"
        violations=$((violations + 1))
    fi

    return $violations
}

check_test_coverage() {
    log_info "Checking test coverage requirements..."
    local violations=0

    # New components without tests
    if [[ -d "$REPO_ROOT/src" ]]; then
        local component_files=$(find "$REPO_ROOT/src" -name "*.tsx" | wc -l)
        local test_files=$(find "$REPO_ROOT" -name "*.test.*" -o -name "*.spec.*" | wc -l)

        if [[ $component_files -gt 0 && $test_files -eq 0 ]]; then
            log_error "TEST VIOLATION: $component_files components found but no test files"
            violations=$((violations + 1))
        fi

        # Check critical paths have tests
        if grep -r "api\/" "$REPO_ROOT/src" >/dev/null 2>&1; then
            local api_tests=$(find "$REPO_ROOT" -name "*.test.*" | xargs grep -l "api" | wc -l)
            if [[ $api_tests -eq 0 ]]; then
                log_error "TEST VIOLATION: API calls found but no API tests"
                violations=$((violations + 1))
            fi
        fi
    fi

    return $violations
}

analyze_change_impact() {
    log_info "Analyzing change impact..."

    # Find recently changed files
    if command -v git >/dev/null 2>&1; then
        local changed_files=$(git diff --name-only HEAD~1 2>/dev/null || echo "")
        if [[ -n "$changed_files" ]]; then
            echo "$changed_files" | while read -r file; do
                if [[ -f "$file" ]]; then
                    local usage_count=$(grep -r "$(basename "$file" .ts .tsx)" "$REPO_ROOT" | wc -l)
                    if [[ $usage_count -gt 5 ]]; then
                        log_warning "HIGH IMPACT: $file is used in $usage_count places"
                    fi
                fi
            done
        fi
    fi
}

validate_quality_standards() {
    local standards_file="$REPO_ROOT/.specify/quality/standards-*.md"

    if [[ ! -f $standards_file ]]; then
        log_warning "No quality standards found. Run /quality-standards first."
        return 1
    fi

    log_info "Validating against established quality standards..."
    local total_violations=0

    # NEW: Pattern consistency check
    check_pattern_consistency
    total_violations=$((total_violations + $?))

    # NEW: Test coverage check
    check_test_coverage
    total_violations=$((total_violations + $?))

    # NEW: Impact analysis
    analyze_change_impact

    # Check dependency rules
    if command -v npm >/dev/null 2>&1; then
        log_info "Checking dependencies..."
        if npm run validate:deps 2>/dev/null; then
            log_success "Dependency validation passed"
        else
            log_error "Dependency validation failed"
            total_violations=$((total_violations + 1))
        fi
    fi

    # Check structure rules
    log_info "Checking file structure..."
    local max_lines=500
    local violation_found=false

    if [[ -d "$REPO_ROOT/src" ]]; then
        find "$REPO_ROOT/src" -name "*.ts" -o -name "*.tsx" 2>/dev/null | while read -r file; do
        local line_count=$(wc -l < "$file")
        if [[ $line_count -gt $max_lines ]]; then
            log_warning "File $file has $line_count lines (max: $max_lines)"
            violation_found=true
        fi
        done
    else
        log_info "No src directory found, skipping structure validation"
    fi

    if [[ "$violation_found" == false ]]; then
        log_success "Structure validation passed"
    fi

    # Check TypeScript compilation
    if command -v tsc >/dev/null 2>&1; then
        log_info "Checking TypeScript compilation..."
        if tsc --noEmit; then
            log_success "TypeScript validation passed"
        else
            log_error "TypeScript validation failed"
            total_violations=$((total_violations + 1))
        fi
    fi

    if [[ $total_violations -eq 0 ]]; then
        log_success "Quality validation completed"
        return 0
    else
        log_error "Quality validation failed with $total_violations violations"
        return 1
    fi
}

main() {
    log_info "=== Quality Standards Validation ==="
    
    if validate_quality_standards; then
        log_success "All quality checks passed"
        exit 0
    else
        log_error "Quality validation failed"
        exit 1
    fi
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi