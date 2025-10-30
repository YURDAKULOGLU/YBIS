# 🔍 Git Stash Review Notes

**Stash:** `stash@{0}` - "Expo 54.0.21 update + TypeScript fixes - partial work"  
**Branch:** `copilot/refactor-ui-for-modern-design`  
**Date:** Pre-bug-fix (before UI modernization session)  
**Status:** ⏳ Pending Review

---

## 📋 STASH İÇERİĞİ ÖZET

**Stats:**
- 37 dosya değişmiş
- +1,584 satır eklendi
- -2,319 satır silindi

---

## 🎯 KATEGORİ BAZINDA ANALİZ

### **1. Documentation & AI Sistem (✅ SAFE)**
```
.YBIS_Dev/AI_CONTENT_CONVENTIONS.md         (+22 satır)   ✅ Yeni dosya
.YBIS_Dev/AI_GENEL_ANAYASA.md              (+81 satır)   ✅ Güncellenmiş
.YBIS_Dev/Veriler/YBIS_COMMAND_INDEX.md    (+131 satır)  ✅ Yeni dosya
.YBIS_Dev/Veriler/documentation-taxonomy.md (+170 satır)  ✅ Yeni dosya
AGENTS.md                                   (+102 satır)  ✅ Güncellenmiş
docs/YBIS_PROJE_ANAYASASI.md               (+36 satır)   ✅ Güncellenmiş
```

**Çakışma Riski:** ❌ **YOK** (Bu dosyalar bugün zaten güncellendi/oluşturuldu)

**Action:** Skip - bugünkü versiyonlar daha güncel

---

### **2. Mobile App - Auth Screen (⚠️ CRITICAL)**
```
apps/mobile/app/(auth)/login.tsx            (+157 satır)  🔴 REVIEW REQUIRED
```

**Muhtemel Değişiklikler:**
- Auth flow iyileştirmesi?
- Error handling?
- UI/UX değişiklikleri?
- Form validation?

**Action Required:**
```powershell
# Diff'i patch dosyasına kaydet
git stash show stash@{0} -p apps/mobile/app/(auth)/login.tsx > stash-login.patch

# İçeriği incele
cat stash-login.patch

# Manuel review:
# - Hangi fonksiyonlar eklendi?
# - Error handling var mı?
# - Bugünkü kod ile uyumlu mu?
```

**Karar Kriterleri:**
- ✅ Apply ise: Auth flow'u iyileştiriyorsa
- ❌ Skip ise: Sadece cosmetic değişiklikse
- 🔄 Merge ise: Bazı parçalar yararlıysa

---

### **3. Mobile App - Dashboard (🔴 HIGH CONFLICT)**
```
apps/mobile/app/(tabs)/index.tsx            (+237 satır)  🔴 CRITICAL CONFLICT
```

**Durum:** Bu dosya bugün 237+ satır değiştirildi (keyboard handling, widget, spacing)

**Çakışma Sebebi:**
- Bugün: SafeAreaView, keyboard API, dynamic spacing
- Stash: Bilinmeyen değişiklikler (+237 satır)

**Action Required:**
```powershell
# Diff'i kaydet
git stash show stash@{0} -p apps/mobile/app/(tabs)/index.tsx > stash-index.patch

# Bugünkü versiyonla karşılaştır
git diff HEAD apps/mobile/app/(tabs)/index.tsx > current-index.patch

# Side-by-side comparison
code --diff stash-index.patch current-index.patch
```

**Strateji:**
1. **Manuel merge:** Stash'teki yeni özellikler varsa al
2. **Skip:** Sadece bug fix'ler varsa (bugün zaten düzeltildi)
3. **Cherry-pick:** Belirli fonksiyonları al

**Karar Noktaları:**
- Stash'te yeni widget feature var mı?
- Chat handling farklı mı?
- State management değişiklikleri var mı?

---

### **4. Chat Feature - Widget (⚠️ MODERATE CONFLICT)**
```
apps/mobile/src/features/chat/components/Widget.tsx     (+94 satır)
apps/mobile/src/features/chat/components/ChatInput.tsx  (+6 satır)
apps/mobile/src/features/chat/hooks/useChat.ts          (+49 satır)
```

**Durum:** Widget bugün keyboard handling için değiştirildi

**Action Required:**
```powershell
# Widget diff
git stash show stash@{0} -p apps/mobile/src/features/chat/components/Widget.tsx > stash-widget.patch

# Karşılaştır
git diff HEAD apps/mobile/src/features/chat/components/Widget.tsx > current-widget.patch
```

**Muhtemel Çakışmalar:**
- Animation logic
- Collapse/expand handling
- Keyboard integration

**Strateji:** Manuel review + selective merge

---

### **5. Settings Screen (⚠️ MODERATE)**
```
apps/mobile/app/(tabs)/settings.tsx         (+65 satır)
```

**Action Required:**
```powershell
git stash show stash@{0} -p apps/mobile/app/(tabs)/settings.tsx > stash-settings.patch
```

**Muhtemel Değişiklikler:**
- Yeni settings option'ları?
- UI iyileştirmeleri?
- State management?

---

### **6. Packages - Auth (✅ MINOR CONFLICT)**
```
packages/auth/src/index.ts                  (+6 satır)   ⚠️ Bugün değişti
packages/auth/package.json                  (+3 satır)   ⚠️ Bugün değişti
```

**Durum:** Bugün SupabaseAuthAdapter ve EmailPasswordCredentials export edildi

**Action:**
```powershell
git stash show stash@{0} -p packages/auth/src/index.ts > stash-auth-index.patch
```

**Karar:** Bugünkü exports zaten ekli. Stash'teki ek export varsa al.

---

### **7. Root Layout & Config (⚠️ MODERATE)**
```
apps/mobile/app/_layout.tsx                 (+31 satır)
apps/mobile/tamagui.config.ts              (+8 satır)
```

**Action:**
```powershell
git stash show stash@{0} -p apps/mobile/app/_layout.tsx > stash-root-layout.patch
git stash show stash@{0} -p apps/mobile/tamagui.config.ts > stash-tamagui.patch
```

---

### **8. Dependencies (❌ SKIP)**
```
pnpm-lock.yaml                              (-1851 satır)  ❌ IGNORE
apps/mobile/package.json                    (+10 satır)     ⚠️ Check versions
```

**Durum:** pnpm-lock bugün yeniden oluşturuldu (Node 20 migration)

**Action:**
```powershell
# Sadece package.json version diff'ini kontrol et
git stash show stash@{0} -p apps/mobile/package.json
```

**Karar:**
- pnpm-lock.yaml → **SKIP** (bugünkü versiyon kullanılacak)
- package.json → Sadece version numaralarını karşılaştır (Expo 54.0.21 vs 54.0.0)

---

## 🔄 SEÇICI APPLY STRATEJİSİ

### **Method 1: File-by-File Cherry-Pick**
```powershell
# Specific bir dosyayı stash'ten al
git checkout stash@{0} -- apps/mobile/app/(auth)/login.tsx

# Kontrol et
git diff apps/mobile/app/(auth)/login.tsx

# Test et
pnpm lint
pnpm type-check

# Gerekirse geri al
git checkout HEAD -- apps/mobile/app/(auth)/login.tsx
```

---

### **Method 2: Patch-Based Apply**
```powershell
# Patch oluştur
git stash show stash@{0} -p apps/mobile/app/(auth)/login.tsx > login.patch

# Önce test et (dry-run)
git apply --check login.patch

# Uygula
git apply login.patch

# Eğer conflict varsa
git apply --3way login.patch  # 3-way merge ile uygula
```

---

### **Method 3: Manual Merge (En Güvenli)**
```powershell
# 1. Stash'teki değişiklikleri diff dosyasına kaydet
git stash show stash@{0} -p > full-stash.patch

# 2. VS Code ile aç
code full-stash.patch

# 3. Manuel olarak review et:
# - Yararlı değişiklikleri kopyala
# - Bugünkü kod ile merge et
# - Test et
```

---

## 📊 ÖNCELİK SIRASI

### **P1 - CRITICAL (Önce bunları incele)**
1. 🔴 `apps/mobile/app/(auth)/login.tsx` (+157)
   - Auth flow critical
   - Production'a girecek
   - Manuel review zorunlu

2. 🔴 `apps/mobile/app/(tabs)/index.tsx` (+237)
   - Dashboard ana ekran
   - Bugün 237 satır değiştirildi
   - High conflict risk

3. 🔴 `apps/mobile/src/features/chat/components/Widget.tsx` (+94)
   - Chat feature core
   - Bugün keyboard handling değişti
   - Moderate conflict risk

---

### **P2 - HIGH (Sonra bunlar)**
4. 🟡 `apps/mobile/app/(tabs)/settings.tsx` (+65)
5. 🟡 `apps/mobile/app/_layout.tsx` (+31)
6. 🟡 `packages/auth/src/index.ts` (+6)

---

### **P3 - MEDIUM (İhtiyaç varsa)**
7. 🟢 `apps/mobile/src/features/chat/hooks/useChat.ts` (+49)
8. 🟢 `apps/mobile/tamagui.config.ts` (+8)
9. 🟢 Chat diğer bileşenler

---

### **P4 - LOW (Skip edilebilir)**
10. ⚪ Documentation dosyaları (zaten güncellendi)
11. ⚪ pnpm-lock.yaml (ignore)

---

## 🎯 NEXT SESSION ACTION PLAN

### **Step 1: Critical Files Review (30 dakika)**
```powershell
# Login.tsx
git stash show stash@{0} -p apps/mobile/app/(auth)/login.tsx | less

# Index.tsx (Dashboard)
git stash show stash@{0} -p apps/mobile/app/(tabs)/index.tsx | less

# Widget.tsx
git stash show stash@{0} -p apps/mobile/src/features/chat/components/Widget.tsx | less
```

**Karar:** Her dosya için → Apply / Skip / Merge

---

### **Step 2: Selective Apply (Her dosya için)**
```powershell
# Eğer apply kararı verildiyse:
git checkout stash@{0} -- <file-path>
pnpm lint
pnpm type-check
git add <file-path>
git commit -m "feat: Apply stash changes for <component> - <reason>"

# Eğer conflict varsa:
# Manuel merge yap
# Test et
# Commit et
```

---

### **Step 3: Final Verification**
```powershell
pnpm lint
pnpm type-check
pnpm mobile  # Test app launch
```

---

## 📝 NOTLAR

### **Stash'i Koruma**
```powershell
# Stash'i silme! (reference olarak tut)
# Sonra lazım olabilir

# Eğer yanlış apply yapılırsa geri al:
git reset --hard HEAD
```

---

### **Karar Matrisi**

| Dosya | Satır | Conflict Risk | Action | Priority |
|-------|-------|---------------|---------|----------|
| login.tsx | +157 | ❌ LOW | ✅ REVIEW | P1 |
| index.tsx | +237 | 🔴 HIGH | 🔄 MERGE | P1 |
| Widget.tsx | +94 | 🟡 MODERATE | 🔄 MERGE | P1 |
| settings.tsx | +65 | ⚪ LOW | ✅ REVIEW | P2 |
| auth/index.ts | +6 | 🟡 MINOR | ✅ CHECK | P2 |
| pnpm-lock.yaml | -1851 | ❌ N/A | ❌ SKIP | - |

---

## 🚀 ÖZET

**Stash Status:** 37 dosya, kritik değişiklikler var  
**Conflict Risk:** HIGH (3 core dosya bugün değişti)  
**Strategy:** Seçici apply + Manuel merge  
**Timeline:** 1-2 saat (dikkatli review gerekli)

**Next Action:**
1. Node 20 kur + App test et
2. Stash'i dosya bazında incele
3. P1 dosyaları için karar ver
4. Seçici apply + test
5. Git commit

---

**Created:** 2025-10-29  
**Status:** 📝 Ready for Review  
**Owner:** Next Session AI
