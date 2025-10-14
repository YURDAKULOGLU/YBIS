# LLM Görev Dağılımı: Claude, Gemini ve Codex Karşılaştırması

Bu doküman, proje geliştirme süreçlerinde Claude, Gemini ve Codex yapay zeka modellerinin hangi görevlerde daha etkili olduğunu anlamak ve görev dağılımını optimize etmek için bir rehber niteliğindedir.

### Genel Bakış ve Güçlü Yanlar

| Görev Türü | **Claude** | **Gemini** | **Codex** |
| :--- | :--- | :--- | :--- |
| **Karmaşık Mantık ve Algoritma** | ⭐⭐⭐⭐⭐ (Çok güçlü) | ⭐⭐⭐⭐ (Güçlü) | ⭐⭐⭐ (Yeterli) |
| **Kod Refactoring ve Analiz** | ⭐⭐⭐⭐⭐ (Çok güçlü) | ⭐⭐⭐⭐ (Güçlü) | ⭐⭐⭐ (Yeterli) |
| **Hızlı ve Basit Kod Üretimi** | ⭐⭐⭐ (Yeterli) | ⭐⭐⭐⭐ (Güçlü) | ⭐⭐⭐⭐⭐ (Çok güçlü) |
| **Hata Ayıklama (Debugging)** | ⭐⭐⭐⭐ (Güçlü) | ⭐⭐⭐⭐⭐ (Çok güçlü) | ⭐⭐⭐ (Yeterli) |
| **Dokümantasyon ve Açıklama** | ⭐⭐⭐⭐⭐ (Çok güçlü) | ⭐⭐⭐⭐ (Güçlü) | ⭐⭐ (Daha az odaklı) |
| **Farklı Diller Arası Çeviri** | ⭐⭐⭐ (Yeterli) | ⭐⭐⭐⭐ (Güçlü) | ⭐⭐⭐⭐⭐ (Çok güçlü) |
| **Yeni Teknolojiler ve Yaratıcılık**| ⭐⭐⭐⭐ (Güçlü) | ⭐⭐⭐⭐⭐ (Çok güçlü) | ⭐⭐⭐ (Yeterli) |
| **Kurallara ve Kısıtlara Uyma** | ⭐⭐⭐⭐⭐ (Çok güçlü) | ⭐⭐⭐⭐ (Güçlü) | ⭐⭐⭐ (Yeterli) |

---

### Detaylı Açıklamalar ve Görev Dağılımı Önerisi

#### 1. **Claude (Anthropic)**

Claude, genellikle büyük resme odaklanma, karmaşık talimatları anlama ve güvenlik odaklı kod yazma konularında çok başarılıdır. Geniş bağlam penceresi (context window) sayesinde, büyük dosyalardaki kodları analiz etme ve refactor etme gibi görevlerde öne çıkar.

**Claude'a verilmesi gereken görevler:**
*   **Büyük Ölçekli Refactoring:** "Mevcut `auth.js` dosyasını analiz et, güvenlik açıklarını bul ve modern en iyi pratiklere göre yeniden yaz."
*   **Karmaşık İş Mantığı (Business Logic) Yazma:** "Kullanıcının abonelik seviyesine ve kullanım geçmişine göre dinamik fiyatlandırma hesaplayan bir fonksiyon yaz."
*   **Detaylı Teknik Dokümantasyon ve Kod Açıklamaları:** "Bu projenin mimarisini açıklayan bir `ARCHITECTURE.md` dosyası oluştur."
*   **Güvenlik ve Standartlara Odaklı Geliştirme:** "SQL injection ve XSS saldırılarına karşı korumalı bir veritabanı sorgu katmanı oluştur."

#### 2. **Gemini (Google)**

Gemini, çok yönlü (multimodal) ve genel amaçlı bir model olarak hız, yaratıcılık ve farklı görevler arasında geçiş yapma esnekliği sunar. Hata ayıklama, hızlı prototipleme ve test yazma gibi pratik ve anlık çözüm gerektiren konularda çok güçlüdür.

**Gemini'ye verilmesi gereken görevler:**
*   **Hata Ayıklama (Debugging):** "Bu kod bloğundaki `TypeError` hatasının nedenini bul ve düzelt."
*   **Hızlı Prototipleme ve Yeni Özellik Geliştirme:** "Kullanıcıların profil resmi yükleyebileceği bir React bileşeni oluştur."
*   **Birim (Unit) ve Entegrasyon Testleri Yazma:** "Mevcut `ApiService` sınıfı için test senaryoları yaz."
*   **Genel Amaçlı Kodlama:** "Verilen bir JSON verisini CSV formatına dönüştüren bir script yaz."
*   **Farklı Teknolojileri Birleştiren Görevler:** "Bir Python backend'i ile iletişim kuracak bir TypeScript frontend servisi yaz."

#### 3. **Codex (OpenAI / GitHub Copilot'un temelindeki model)**

Codex, özellikle saf kod üretimi ve tamamlama konusunda uzmandır. Milyarlarca satır kod üzerinde eğitildiği için, standart algoritmaları, API kullanımını ve belirli bir dildeki kalıpları çok hızlı bir şekilde yazabilir.

**Codex'e verilmesi gereken görevler:**
*   **Boilerplate (Tekrar Eden) Kod Yazma:** "Standart bir Express.js sunucusu iskeleti oluştur." veya "Bir Redux reducer'ı için temel yapıyı oluştur."
*   **Diller Arası Kod Çevirisi:** "Bu Python fonksiyonunu al ve birebir aynısını JavaScript olarak yaz."
*   **Spesifik ve Bilinen Fonksiyonları Yazma:** "Bir diziyi sıralayan bir `bubble sort` algoritması yaz."
*   **API/SDK Kullanımı:** "Stripe API'sini kullanarak bir ödeme işlemi başlatan bir fonksiyon yaz."

### Özetle:

*   **Strateji ve Mimari için -> Claude:** Projenin temelini, güvenliğini ve uzun vadeli sağlığını düşünüyorsan.
*   **Hız, Çeviklik ve Günlük Geliştirme için -> Gemini:** Hızlı sonuç alman, hata ayıklaman veya yeni bir şeyler denemen gerekiyorsa.
*   **Saf Kod Üretimi ve Otomasyon için -> Codex:** Tekrar eden, standart ve net tanımlanmış kod bloklarını hızlıca yazdırmak istiyorsan.
