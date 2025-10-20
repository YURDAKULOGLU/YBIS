#!/usr/bin/env python3
"""
Dual-Write Rule Validator

Ensures session-context.md and DEVELOPMENT_LOG.md stay synchronized.
"""

import re
from pathlib import Path
from datetime import datetime

def extract_ad_decisions(session_context_path):
    """Extract AD-XXX decisions from session-context.md"""
    with open(session_context_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Pattern: ### AD-XXX: Title
    pattern = r'### (AD-\d+): (.+?)\n- \*\*Date:\*\* (\d{4}-\d{2}-\d{2})'
    matches = re.findall(pattern, content)

    return [
        {"id": m[0], "title": m[1], "date": m[2]}
        for m in matches
    ]

def check_development_log(dev_log_path, ad_id):
    """Check if AD-XXX exists in DEVELOPMENT_LOG.md"""
    with open(dev_log_path, 'r', encoding='utf-8') as f:
        content = f.read()

    pattern = f'### {ad_id}:'
    return pattern in content

def validate_dual_write():
    """Main validation function"""
    session_context = Path('.YBIS_Dev/Veriler/memory/session-context.md')
    dev_log = Path('docs/Güncel/DEVELOPMENT_LOG.md')

    if not session_context.exists() or not dev_log.exists():
        print("ERROR: Required files not found")
        return False

    decisions = extract_ad_decisions(session_context)

    print(f"Checking {len(decisions)} AD decisions...")

    missing = []
    for decision in decisions:
        if not check_development_log(dev_log, decision['id']):
            missing.append(decision)

    if missing:
        print("\nFAILED: DUAL-WRITE VALIDATION FAILED")
        print(f"\n{len(missing)} decisions in session-context.md not found in DEVELOPMENT_LOG.md:")
        for d in missing:
            print(f"  - {d['id']}: {d['title']} ({d['date']})")
        return False
    else:
        print("\nSUCCESS: DUAL-WRITE VALIDATION PASSED")
        print("All AD decisions synchronized between session-context and dev log.")
        return True

if __name__ == '__main__':
    import sys
    success = validate_dual_write()
    sys.exit(0 if success else 1)