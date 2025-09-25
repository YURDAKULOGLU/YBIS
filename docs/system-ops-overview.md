# Sistem Operasyonlari Ozeti

## Amac
- Metro/RN bundle hatalarinin (RNGestureHandlerRootView, StackView undefined) temel sebebi olan cogul node_modules kopyalarini temizlemek.
- Monorepo icindeki Claude/Specify otomasyon yapisini anlamak ve ilerideki entegrasyon adimlarina hazirlik yapmak.

## Yapilan Somut Adimlar
1. **Klasor Temizligi**
   - apps/mobile/node_modules, packages/*/node_modules, backend/node_modules ve .tmp dizini kok (C:\Projeler\YBIS_2) altinda silindi.
   - Silme sonrasi kontrol: Get-ChildItem -Directory -Recurse -Filter node_modules ciktilari yalnizca kok node_modules agacini gosterdi.
2. **Bagimlilik Kurulumu**
   - npm ci kok dizinde calistirildi; 1119 paket kuruldu, yalnizca bilinen deprecated uyarilari gozlemlendi.
   - Kurulum, workspace yapisi nedeniyle apps/mobile/node_modules altini yeniden olusturdu.
3. **Metro Port Yonetimi**
   - Get-NetTCPConnection -LocalPort 8081 ile Metro sureci tespit edilip Stop-Process ile sonlandirildi.
4. **Claude/Specify Incelemesi**
   - .claude/settings.local.json izin politikasi, .claude/commands/* komut dosyalari ve .specify/memory/constitution.md sablonu incelendi.
   - Plan/spec/tasks uretim akisinin script bagimliliklari ve versiyonlama kurallari not alindi.

## Cikarimlar
- npm ci sonrasinda mobil workspace icin lokal node_modules tekrar olustugundan Metro reseti oncesi yeniden temizlenmesi gerekiyor; aksi halde Metro iki kopya gorur.
- .claude/commands dosyalari, constitution -> spec -> plan -> tasks -> implement hattini otomasyona bagliyor; guncel constitution icerigi olmadan diger adimlar eksik kalacak.
- settings.local.json yalnizca yetkilendirilmis komutlarin calismasina izin veriyor; yeni akislar bu izin setine uyarlanilmali.

## Bekleyen Isler
- Metro cache reset (npm start -- --reset-cache) ve Android deploy (npx react-native run-android) henuz yapilmadi.
- .specify/memory/constitution.md icindeki placeholderlarin gercek degerlerle doldurulmasi gerekiyor; sonucunda plan/spec/tasks sablonlariyla senkronizasyon yapilacak.
- Temizlik sonrasi apps/mobile/node_modules tekrar olustugu icin Metro oncesi yeniden silinmeli; kalici cozum icin workspace bagimlilik stratejisi gozden gecirilebilir.

