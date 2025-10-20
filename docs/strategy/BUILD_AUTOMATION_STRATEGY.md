# Build Süreci Otomasyon Stratejisi

**Tarih:** 21 Ekim 2025
**Durum:** Stratejik Değerlendirme

## 1. Problem Tanımı

`@ybis/logging` gibi yeni bir workspace paketi eklendiğinde, bu paketin `build` komutunu manuel olarak çalıştırmayı unutmak, `Unable to resolve` hatasına yol açtı. Geliştirici deneyimini (DX) iyileştirmek ve bu tür hataları engellemek için bu derleme sürecinin otomatikleştirilmesi gerekmektedir.

## 2. Otomasyon Seçenekleri

Bu süreci otomatikleştirmek için üç temel yaklaşım bulunmaktadır:

### Seçenek 1: "İyi" - Basit Otomasyon (`prestart` script'i)

`pnpm`, bir script'i çalıştırmadan önce o script'in "pre" ön ekli versiyonunu otomatik olarak çalıştırır. Bu özellikten faydalanılabilir.

- **Uygulama:** `apps/mobile/package.json` dosyasına, `start` komutundan önce ana dizindeki `pnpm build` komutunu tetikleyecek bir `prestart` script'i eklenir.
- **Avantaj:** Kurulumu en basit yöntemdir. `pnpm start` komutunu çalıştırmayı unutmayı imkansız hale getirir.
- **Dezavantaj:** Kodda hiçbir değişiklik olmasa bile, uygulamayı *her* başlattığınızda tüm paketleri yeniden derlemeye çalışır. Bu, uygulama başlangıcını gereksiz yere yavaşlatabilir.

### Seçenek 2: "Daha İyi" - Gerçek Zamanlı Derleme (`watch` modu)

Her paketin, kendi kodunda bir değişiklik olduğunda otomatik olarak yeniden derlenmesi sağlanır.

- **Uygulama:** Her paketin `package.json` dosyasına `tsc -w` (`--watch`) komutunu içeren bir `dev` script'i eklenir. Geliştirici, çalışmaya başlamadan önce ilgili paketler için ayrı terminallerde `pnpm dev` komutunu çalıştırır.
- **Avantaj:** Sadece değiştirilen paket anında ve çok hızlı bir şekilde yeniden derlenir.
- **Dezavantaj:** Geliştiricinin birden fazla terminal sürecini manuel olarak yönetmesini gerektirir.

### Seçenek 3: "En İyi" - Akıllı Önbellekleme (NX)

Bu, YBIS gibi modern monorepo'lar için endüstri standardı olan en verimli çözümdür.

- **Uygulama:** Projeye `nx` entegre edilir. `pnpm build` yerine `nx build` gibi komutlar kullanılır.
- **Avantajlar:**
    - **Akıllı Derleme:** NX, projenin bağımlılık ağacını anlar ve sadece değiştirilmiş paketleri ve onlara bağımlı olan diğer paketleri yeniden derler.
    - **Önbellekleme (Caching):** Değişmemiş paketler için daha önce yapılmış derleme sonuçlarını önbellekten alarak saniyeler içinde işlemi tamamlar. Bu, geliştirme hızını ve CI/CD süreçlerini dramatik ölçüde artırır.
    - **Otomatik Sıralama:** Hangi paketin önce derlenmesi gerektiğini kendisi bilir, manuel sıralama gerekmez.
- **Dezavantaj:** Projeye yeni bir araç ve yapılandırma katmanı ekler. Ancak projenin mevcut paket sayısı ve karmaşıklığı, anayasada belirtilen bu adıma geçiş kriterlerini karşılamaktadır.

## 3. Öneri

Projenin mevcut yapısı, hedefleri ve sizin de NX'e olan aşinalığınız göz önünde bulundurulduğunda, uzun vadeli en doğru ve verimli çözüm **Seçenek 3: NX Entegrasyonu**'dur. Bu entegrasyon, yaşadığımız "build unutma" sorununu ve benzeri tüm gelecekteki sorunları kökünden çözecektir.

Bu doküman, ileride yapılacak "uzun vadeli entegrasyon" seansı için bir yol haritası olarak kullanılabilir.
