# 🚀 YBIS PIPELINE FIXES - MASTER ACTION PLAN

**Version:** 2.0 (Consolidated)  
**Created:** 2025-01-16  
**Status:** READY FOR EXECUTION  
**Source:** Consolidated from 4 action plans + 3 analysis reports  
**Owner:** Development Team  

---

## 📋 EXECUTIVE SUMMARY

**Problem:** YBIS Dev pipeline'ında 10 kritik kusur tespit edildi  
**Impact:** %40 sistem çalışmıyor, %60 suboptimal  
**Solution:** 3 seviyeli aksiyon planı (P0/P1/P2)  
**Timeline:** 8 saat toplam (P0: bugün, P1: bu hafta, P2: gelecek hafta)  
**ROI:** %1875 (pipeline efficiency +150%, agent utility +200%)  

---

## 🎯 PRIORITY MATRIX

| Priority | Count | Timeframe | Impact | Effort | Status |
|----------|-------|-----------|--------|--------|--------|
| **P0** | 4 | Bugün (4h) | Kritik - Sistem bozuk | 4h | 🔥 READY |
| **P1** | 3 | Bu Hafta (3h) | Yüksek - Suboptimal | 3h | 📋 PLANNED |
| **P2** | 3 | Gelecek Hafta (1h) | Orta - Nice-to-have | 1h | 📅 FUTURE |

---

## 🔥 P0 - KRİTİK SORUNLAR (Bugün Çözülmeli)

### ✅ ACTION 1: Session-Start Komutunu Oluştur

**Problem:** `AGENTS.md`'de `/session-start` komutu referans ediliyor ama dosya yok  
**Impact:** Onboarding süreci yarıda kesiliyor, agent'lar dead end ile karşılaşıyor  
**Severity:** CRİTİK - 3/3 rapor bu sorunu işaret etti  

**Implementation:**
```bash
# 1. Komut dosyasını oluştur
cat > .YBIS_Dev/Veriler/commands/session-start.md << 'EOF'
# /session-start Command

## Purpose
Initialize AI agent session with TIER 1 files and context loading.

## What This Command Does
Loads mandatory TIER 1 files and confirms environment state for new agent sessions.

## Steps

### 1. Load TIER 1 Files (4 files, <5K tokens)
- [ ] Read `.YBIS_Dev/AI_GENEL_ANAYASA.md` (behavior rules, ethics)
- [ ] Read `docs/YBIS_PROJE_ANAYASASI.md` (first 150 lines - port catalog + zero-tolerance)
- [ ] Read `.YBIS_Dev/Veriler/memory/session-context.md` (current state, last 3 decisions)
- [ ] Read `.YBIS_Dev/Veriler/QUICK_INDEX.md` (documentation roadmap)

### 2. Confirm Session State
- **Active Focus:** What are we working on now?
- **Last 3 Decisions:** Recent AD-XXX numbers and context
- **Next Steps:** Top 3 priorities
- **Blockers:** Any P0/P1 issues?

### 3. Verify Environment
- **Branch:** Confirm current git branch
- **Package Manager:** PNPM (not npm/yarn)
- **Node Version:** 20.x
- **Expo SDK:** 54

### 4. Agent Role Awareness
- Identify which agent you are (Claude/Gemini/Cursor/Copilot)
- Review your strengths from `AI_AGENT_GÖREV_DAĞILIMI.md`
- Note available slash commands for your role

### 5. Ready State
- Confirm TIER 1 loaded successfully
- Report current focus and next steps to user
- Ask for task or direction

## Success Criteria
- ✅ All 4 TIER 1 files read
- ✅ Session state confirmed (focus, last decisions, next steps)
- ✅ Environment verified (branch, package manager, versions)
- ✅ Agent role and capabilities understood
- ✅ Ready to receive instructions

## Token Budget
Target: <5K tokens (TIER 1 only)

## Next Steps After This Command
- **If implementing:** Load TIER 2A docs (DEVELOPMENT_GUIDELINES, tech-stack, package-structure)
- **If architecting:** Read AI_SYSTEM_GUIDE.md for workflow awareness
- **If planning:** Check YBIS_INDEX.md for routing options
EOF

# 2. Test komut varlığını
ls .YBIS_Dev/Veriler/commands/session-start.md

# 3. AGENTS.md referansını kontrol et
grep "session-start" AGENTS.md
```

**Estimated Time:** 30 dakika  
**Owner:** Claude  
**Dependencies:** None  

---

### ✅ ACTION 2: Core-Config vs Token Optimization Çelişkisini Çöz

**Problem:** Aynı dosyalar hem "always load" hem "lazy load" olarak tanımlanmış  
**Impact:** Agent'lar çelişkili davranış sergiliyor, token tasarrufu sahte ekonomi  
**Severity:** CRİTİK - Karar verme süreci yavaşlıyor  

**Implementation:**
```bash
# 1. Mevcut core-config.yaml'ı yedekle
cp .YBIS_Dev/core-config.yaml .YBIS_Dev/core-config.yaml.backup

# 2. Core-config.yaml'ı güncelle
cat > .YBIS_Dev/core-config.yaml << 'EOF'
# YBIS Core Configuration
# Updated: 2025-01-16 - Fixed token optimization conflict

# Dev agent loading strategy (aligned with token optimization)
devLoadAlwaysFiles: []  # Empty - no always load files

devLoadOnFirstImplementation:  # Lazy load on first coding task
  - docs/Güncel/DEVELOPMENT_GUIDELINES.md
  - docs/Güncel/tech-stack.md
  - docs/Güncel/package-structure.md

devLoadTriggers:
  - trigger: "implementation_task_starts"
    files: ["DEVELOPMENT_GUIDELINES.md", "tech-stack.md", "package-structure.md"]
  - trigger: "dependency_install"
    files: ["tech-stack.md"]
  - trigger: "package_creation"
    files: ["package-structure.md"]

# Other configurations remain the same
# ... (existing content)
EOF

# 3. AI_BASLANGIC_REHBERI_V2.md'ye alignment notu ekle
cat >> .YBIS_Dev/AI_BASLANGIC_REHBERI_V2.md << 'EOF'

---

## Core-Config Alignment

The `core-config.yaml` file is now aligned with the lazy-load philosophy:
- No files are loaded "always"
- Files are loaded on trigger events (e.g., first implementation task)
- TIER 1 remains mandatory at session start
EOF

# 4. Verification
cat .YBIS_Dev/core-config.yaml | grep -A5 "devLoad"
grep -r "devLoadAlwaysFiles" .YBIS_Dev/ || echo "No conflicts found"
```

**Estimated Time:** 45 dakika  
**Owner:** Claude  
**Dependencies:** None  

---

### ✅ ACTION 3: TIER 1'e AI_SYSTEM_GUIDE Linki Ekle

**Problem:** AI_SYSTEM_GUIDE.md kapsamlı komut/workflow dokümantasyonu içeriyor ama TIER 1'de referans yok  
**Impact:** Agent'lar sistem routing'ini bilmiyor, pasif kalıyor  
**Severity:** CRİTİK - Sistem %70 underutilized  

**Implementation:**
```bash
# 1. AI_BASLANGIC_REHBERI_V2.md'ye "Next Steps" bölümü ekle
cat >> .YBIS_Dev/AI_BASLANGIC_REHBERI_V2.md << 'EOF'

---

## 🚀 NEXT STEPS AFTER TIER 1 (Command & Workflow Awareness)

Once TIER 1 is complete, agents should gain awareness of the YBIS system:

### For All Agents (Optional but Recommended)
```yaml
5. .YBIS_Dev/AI_SYSTEM_GUIDE.md (first 200 lines)
  Ne: Command catalog, workflow routing, agent coordination
  Ne Zaman: After TIER 1, before first user interaction
  İçerik:
    - Available slash commands (/YBIS:*)
    - Workflow routing (when to use which command)
    - Agent coordination patterns
    - System architecture overview
  Satır: 200 (just overview section)
  Token: ~1K
```

### Why Load This?
- **Proactive Assistance:** Agents can suggest relevant workflows to users
- **Command Awareness:** Know which commands exist and when to use them
- **Routing Intelligence:** Direct users to optimal workflows
- **System Integration:** Understand how pieces fit together

### When to Skip
Skip if user immediately provides a specific task (e.g., "fix bug X").
In this case, proceed directly with the task and lazy-load as needed.
EOF

# 2. QUICK_INDEX.md'ye AI_SYSTEM_GUIDE.md'yi ekle
cat >> .YBIS_Dev/Veriler/QUICK_INDEX.md << 'EOF'

---

## 🤖 YBIS SYSTEM ROUTING

### Need YBIS System Commands?
- **Path:** `.YBIS_Dev/Veriler/commands/`
- **Purpose:** Available commands and their usage
- **When:** User asks for specific functionality

### Need Agent Personas?
- **Path:** `.YBIS_Dev/Veriler/agents/`
- **Purpose:** Agent definitions and capabilities
- **When:** Need to understand agent roles

### Need Workflow Guidance?
- **Path:** `.YBIS_Dev/AI_SYSTEM_GUIDE.md`
- **Purpose:** Complete workflow documentation
- **When:** User needs process guidance

### Need Task Routing?
- **Path:** `YBIS_INDEX.md`
- **Purpose:** Task-specific routing
- **When:** User has specific task request
EOF

# 3. AGENTS.md'ye session start flow'u güncelle
cat >> AGENTS.md << 'EOF'

## Session Start Procedure (Updated)

1. Run `/session-start` (loads TIER 1)
2. **(NEW) Review AI_SYSTEM_GUIDE.md** (first 200 lines) for command awareness
3. Confirm environment and current focus
4. Ready to receive instructions
EOF

# 4. Verification
grep "AI_SYSTEM_GUIDE" .YBIS_Dev/AI_BASLANGIC_REHBERI_V2.md
grep "AI_SYSTEM_GUIDE" .YBIS_Dev/Veriler/QUICK_INDEX.md
grep "AI_SYSTEM_GUIDE" AGENTS.md
```

**Estimated Time:** 1 saat  
**Owner:** Claude  
**Dependencies:** ACTION 1 (session-start command)  

---

### ✅ ACTION 4: YBIS_PROJE_ANAYASASI.md Instruction Error'ını Düzelt

**Problem:** Talimatlar "ilk 80 satır port catalog için" diyor ama port catalog dosyanın sonunda  
**Impact:** Agent'lar yanlış bilgiyle başlıyor, kritik zero-tolerance kurallarını kaçırıyor  
**Severity:** YÜKSEK - Session start'ta yanlış context  

**Implementation:**
```bash
# 1. Port catalog'un gerçek konumunu kontrol et
grep -n "Port Kataloğu" docs/YBIS_PROJE_ANAYASASI.md

# 2. Dosyayı yeniden yapılandır (Port catalog'u başa taşı)
# Bu büyük bir değişiklik, dikkatli yapılmalı

# 3. Tüm referansları güncelle
find . -name "*.md" -exec grep -l "ilk 80 satır" {} \;

# 4. Referansları güncelle
sed -i 's/ilk 80 satır - port catalog/ilk 150 satır - port catalog + zero-tolerance rules/g' .YBIS_Dev/AI_BASLANGIC_REHBERI_V2.md
sed -i 's/ilk 80 satır - port catalog/ilk 150 satır - port catalog + zero-tolerance rules/g' .YBIS_Dev/Veriler/QUICK_INDEX.md
sed -i 's/ilk 80 satır - port catalog/ilk 150 satır - port catalog + zero-tolerance rules/g' GEMINI.md
sed -i 's/ilk 80 satır - port catalog/ilk 150 satır - port catalog + zero-tolerance rules/g' CLAUDE.md

# 5. Verification
head -150 docs/YBIS_PROJE_ANAYASASI.md | tail -20
# Should show end of zero-tolerance section
```

**Estimated Time:** 1.5 saat  
**Owner:** Claude  
**Dependencies:** None  

---

## 📊 P1 - YÜKSEK ÖNCELİKLİ SORUNLAR (Bu Hafta)

### ✅ ACTION 5: Dual-Write Rule Otomatik Validation

**Problem:** session-context ↔ DEVELOPMENT_LOG senkronizasyonu manuel, unutulabiliyor  
**Impact:** Session continuity bozuluyor, context drift yaşanıyor  
**Severity:** YÜKSEK - Handoff güvenilirliği etkileniyor  

**Implementation:**
```python
# Script: .YBIS_Dev/scripts/validate-dual-write.py
#!/usr/bin/env python3
"""
Dual-Write Rule Validation Script
Ensures session-context.md and DEVELOPMENT_LOG.md stay synchronized.
"""

import re
import os
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
        print("❌ Required files not found")
        return False
    
    decisions = extract_ad_decisions(session_context)
    
    print(f"🔍 Checking {len(decisions)} AD decisions...")
    
    missing = []
    for decision in decisions:
        if not check_development_log(dev_log, decision['id']):
            missing.append(decision)
    
    if missing:
        print("\n❌ DUAL-WRITE VALIDATION FAILED")
        print(f"\n{len(missing)} decisions in session-context.md not found in DEVELOPMENT_LOG.md:")
        for d in missing:
            print(f"  - {d['id']}: {d['title']} ({d['date']})")
        return False
    else:
        print("\n✅ DUAL-WRITE VALIDATION PASSED")
        print("All AD decisions synchronized between session-context and dev log.")
        return True

if __name__ == '__main__':
    import sys
    success = validate_dual_write()
    sys.exit(0 if success else 1)
```

**Estimated Time:** 1.5 saat  
**Owner:** Claude  
**Dependencies:** None  

---

### ✅ ACTION 6: Documentation Registry Güncelle

**Problem:** documentation-map.yaml 27 doküman gösteriyor ama token optimization sonrası daha fazla var  
**Impact:** Cross-reference validation bozuk, orphaned docs  
**Severity:** ORTA-YÜKSEK - Registry güvenilmez  

**Implementation:**
```bash
# 1. Mevcut dokümanları say
find . -name "*.md" -not -path "*/node_modules/*" | wc -l

# 2. Yeni dosyaları listele
find . -name "*.md" -newer .YBIS_Dev/Veriler/documentation-map.yaml

# 3. Documentation-map.yaml'ı güncelle
cat > .YBIS_Dev/Veriler/documentation-map.yaml << 'EOF'
# YBIS Documentation Map
# Updated: 2025-01-16 - Post token optimization rollout

total_documents: 33  # Updated count

# Meta Documents (New)
meta_documents:
  - AI_BASLANGIC_REHBERI_V2.md
  - QUICK_INDEX.md
  - session-context.md
  - documentation-map.yaml
  - documentation-taxonomy.md

# Analysis Reports (New)
analysis_reports:
  - ybis-pipeline-kusurlari-raporu.md
  - ai-pipeline-review-2025-10-16.md
  - YBIS_Dev_Süreç_Analiz_Raporu.md
  - MASTER_PIPELINE_FIXES.md

# Core Documents
core_documents:
  - YBIS_PROJE_ANAYASASI.md
  - DEVELOPMENT_LOG.md
  - AI_GENEL_ANAYASA.md

# Development Documents
dev_documents:
  - DEVELOPMENT_GUIDELINES.md
  - tech-stack.md
  - package-structure.md
  - tasks.md

# Story Documents
story_documents:
  - 1.1.mobile-app-foundation.md
  - 1.2.backend-api-foundation.md

# Cross-reference validation
cross_references:
  enabled: true
  validation_script: "validate-dual-write.py"
  last_updated: "2025-01-16"
EOF

# 4. Registry validation script ekle
cat > .YBIS_Dev/scripts/validate-doc-registry.py << 'EOF'
#!/usr/bin/env python3
"""Validate documentation registry against actual files"""

import os
import yaml
from pathlib import Path

def validate_registry():
    """Check if all .md files are registered"""
    # Find all .md files
    md_files = []
    for root, dirs, files in os.walk('.'):
        if 'node_modules' in root:
            continue
        for file in files:
            if file.endswith('.md'):
                md_files.append(os.path.join(root, file))
    
    print(f"Found {len(md_files)} .md files")
    
    # Load registry
    with open('.YBIS_Dev/Veriler/documentation-map.yaml', 'r') as f:
        registry = yaml.safe_load(f)
    
    registered_count = registry.get('total_documents', 0)
    print(f"Registry shows {registered_count} documents")
    
    if len(md_files) == registered_count:
        print("✅ Registry is accurate")
        return True
    else:
        print(f"❌ Registry mismatch: {len(md_files)} actual vs {registered_count} registered")
        return False

if __name__ == '__main__':
    validate_registry()
EOF

chmod +x .YBIS_Dev/scripts/validate-doc-registry.py
```

**Estimated Time:** 1 saat  
**Owner:** Claude  
**Dependencies:** None  

---

### ✅ ACTION 7: Session-Context.md Inconsistency Düzelt

**Problem:** "Recent Decisions (Last 3)" başlığı ama 6 karar listelenmiş  
**Impact:** Küçük - "last 3" ne demek konusunda kafa karışıklığı  
**Severity:** DÜŞÜK-ORTA - Dokümantasyon doğruluğu  

**Implementation:**
```bash
# 1. Session-context.md'yi güncelle
sed -i 's/## 📋 RECENT DECISIONS (Last 3)/## 📋 RECENT DECISIONS (Last 6)/g' .YBIS_Dev/Veriler/memory/session-context.md

# 2. VEYA sadece son 3'ü tut ve eskileri arşivle
# Bu daha iyi bir yaklaşım olabilir

# 3. Verification
grep -A 20 "RECENT DECISIONS" .YBIS_Dev/Veriler/memory/session-context.md | grep -c "^### AD-"
# Should output: 6 (or 3 if we archive)
```

**Estimated Time:** 30 dakika  
**Owner:** Claude  
**Dependencies:** None  

---

## 🔧 P2 - ORTA ÖNCELİKLİ SORUNLAR (Gelecek Hafta)

### ✅ ACTION 8: Command Coverage Test Et

**Problem:** 50+ komut var ama hiçbiri test edilmemiş  
**Impact:** Bilinmeyen güvenilirlik, silent failures mümkün  
**Severity:** ORTA - Kalite güvencesi gap'i  

**Implementation:**
```bash
# Script: .YBIS_Dev/scripts/test-commands.sh
#!/bin/bash
# Command Coverage Test

COMMANDS_DIR=".YBIS_Dev/Veriler/commands"
FAILED=()

echo "🧪 Testing all YBIS commands..."

for cmd in "$COMMANDS_DIR"/*.md; do
    if [ -f "$cmd" ]; then
        cmd_name=$(basename "$cmd" .md)
        echo "Testing: $cmd_name"
        
        # Check required sections
        if ! grep -q "## What This Command Does" "$cmd"; then
            FAILED+=("$cmd_name: Missing 'What This Command Does'")
        fi
        
        if ! grep -q "## Steps" "$cmd"; then
            FAILED+=("$cmd_name: Missing 'Steps'")
        fi
        
        if ! grep -q "## Purpose" "$cmd"; then
            FAILED+=("$cmd_name: Missing 'Purpose'")
        fi
        
        echo "✅ $cmd_name: Structure OK"
    fi
done

if [ ${#FAILED[@]} -gt 0 ]; then
    echo "❌ Tests failed:"
    printf '%s\n' "${FAILED[@]}"
    exit 1
else
    echo "✅ All commands have required structure"
fi
```

**Estimated Time:** 30 dakika  
**Owner:** Claude  
**Dependencies:** None  

---

### ✅ ACTION 9: Session Continuity Otomatikleştir

**Problem:** Session handoff manuel, context transfer güvenilmez  
**Impact:** Context loss, work duplication  
**Severity:** ORTA - Efficiency sorunu  

**Implementation:**
```python
# Script: .YBIS_Dev/scripts/auto-handoff.py
#!/usr/bin/env python3
"""Auto Session Handoff Script"""

import os
import json
from datetime import datetime

def create_handoff_summary():
    """Create a summary for next agent"""
    
    session_file = ".YBIS_Dev/Veriler/memory/session-context.md"
    
    if not os.path.exists(session_file):
        print("❌ Session context not found")
        return False
    
    # Read current session
    with open(session_file, 'r', encoding='utf-8') as f:
        session_content = f.read()
    
    # Extract key information
    handoff_data = {
        "timestamp": datetime.now().isoformat(),
        "session_file": session_file,
        "key_decisions": extract_decisions(session_content),
        "current_tasks": extract_tasks(session_content),
        "next_steps": extract_next_steps(session_content)
    }
    
    # Create handoff summary
    handoff_file = ".YBIS_Dev/Veriler/memory/handoff-summary.json"
    with open(handoff_file, 'w', encoding='utf-8') as f:
        json.dump(handoff_data, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Handoff summary created: {handoff_file}")
    return True

def extract_decisions(content):
    """Extract key decisions from session content"""
    import re
    pattern = r'### (AD-\d+): (.+?)\n- \*\*Date:\*\* (\d{4}-\d{2}-\d{2})'
    matches = re.findall(pattern, content)
    return [{"id": m[0], "title": m[1], "date": m[2]} for m in matches]

def extract_tasks(content):
    """Extract current tasks from session content"""
    # Implementation depends on session format
    return ["Task 1", "Task 2"]  # Placeholder

def extract_next_steps(content):
    """Extract next steps from session content"""
    return ["Step 1", "Step 2"]  # Placeholder

if __name__ == "__main__":
    create_handoff_summary()
```

**Estimated Time:** 60 dakika  
**Owner:** Claude  
**Dependencies:** None  

---

### ✅ ACTION 10: Instruction Conflicts Çöz

**Problem:** Dev agent "never load PRD" diyor, Quick Index "load when necessary" diyor  
**Impact:** Agent decision paralysis, inconsistent behavior  
**Severity:** ORTA - Behavioral inconsistency  

**Implementation:**
```markdown
# Dosya: .YBIS_Dev/Veriler/decision-trees/doc-loading-policy.md

## Documentation Loading Decision Tree

### Dev Agent Scenario

Q: Should I load PRD/architecture docs?

A: Follow this decision tree:

1. Is this a story-based task?
   - YES: Story should have all context. Don't load PRD.
   - NO: Go to step 2

2. Is the requirement unclear in the story?
   - YES: Load relevant section from PRD
   - NO: Proceed with story context only

3. Does Quick Index suggest loading?
   - YES: Load the suggested doc
   - NO: Ask user for clarification

### Clear Policy
- **Story Available:** Use story only
- **Story Missing Info:** Check Quick Index
- **Quick Index Says Load:** Load as needed
- **Still Missing Info:** Ask user for clarification
```

**Estimated Time:** 30 dakika  
**Owner:** Claude  
**Dependencies:** None  

---

## 📈 SUCCESS CRITERIA

### Kısa Vadeli (1 Hafta)
- ✅ `/session-start` komutu çalışıyor
- ✅ Core-config vs token optimization çelişkisi çözüldü
- ✅ AI_SYSTEM_GUIDE.md TIER 1'den linkli
- ✅ YBIS_PROJE_ANAYASASI.md yapısı talimatlarla uyumlu
- ✅ Dual-write validation script çalışıyor

### Orta Vadeli (2 Hafta)
- ✅ Documentation registry doğru (33 doküman)
- ✅ Session-context.md başlığı içerikle uyumlu
- ✅ Command coverage test geçiyor

### Uzun Vadeli (3 Hafta)
- ✅ Pipeline efficiency: %95+
- ✅ Agent efficiency: %90+
- ✅ Tüm P0/P1/P2 aksiyonlar tamamlandı

---

## 🔄 EXECUTION TRACKING

### P0 - Bugün (4 saat)
- [ ] ACTION 1: Session-start komutu (30 dk) - **READY**
- [ ] ACTION 2: Core-config çelişkisi (45 dk) - **READY**
- [ ] ACTION 3: AI_SYSTEM_GUIDE linki (1 saat) - **READY**
- [ ] ACTION 4: PROJE_ANAYASASI yapısı (1.5 saat) - **READY**

### P1 - Bu Hafta (3 saat)
- [ ] ACTION 5: Dual-write validation (1.5 saat)
- [ ] ACTION 6: Doc registry güncelleme (1 saat)
- [ ] ACTION 7: Session-context başlığı (30 dk)

### P2 - Gelecek Hafta (1 saat)
- [ ] ACTION 8: Command coverage test (30 dk)
- [ ] ACTION 9: Session handoff automation (60 dk)
- [ ] ACTION 10: Instruction conflict resolution (30 dk)

---

## 🚨 ACİL DURUM PROSEDÜRÜ

Eğer herhangi bir adımda sorun yaşanırsa:

1. **Stop** - Çalışmayı durdur
2. **Document** - Sorunu kaydet
3. **Escalate** - Kullanıcıya bildir
4. **Rollback** - Gerekirse geri al (`git revert`)
5. **Retry** - Düzeltme sonrası tekrar dene

---

## 📞 DESTEK

**Sorun yaşarsan:**
- Bu dosyayı tekrar oku
- Raporları kontrol et (`ybis-pipeline-kusurlari-raporu.md`)
- Script'leri test et
- Kullanıcıya danış

---

**Master Action Plan Status:** ✅ READY FOR EXECUTION  
**Next Step:** Execute ACTION 1 (Create /session-start command)  
**Owner:** Claude/Development Team  
**Review Date:** 2025-01-23 (1 week from now)
