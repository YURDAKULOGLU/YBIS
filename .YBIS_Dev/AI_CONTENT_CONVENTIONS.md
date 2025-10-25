# AI İçerik Ayrım Kuralı

**Prensip:** AI tarafından yönetilen veya AI'a yönelik talimatlar içeren metin blokları, dokümanın ana içeriğinden net bir şekilde ayrılmalıdır.

**Kural:**

Tüm AI talimatları, sistem tarafından oluşturulan notlar veya bir insan tarafından okunması gerekmeyen meta-veriler, HTML yorum blokları (`<!-- ... -->`) içine alınmalıdır.

**Amaç:**

1.  **İnsan Odaklı Okunabilirlik:** Dokümanları okuyan insanlar, sadece kendileri için anlamlı olan içeriğe odaklanabilir.
2.  **AI Farkındalığı:** Gelecekte dokümanı okuyacak bir AI, bu blokların kendisine yönelik bir talimat veya sistem notu olduğunu anlar ve bunları dokümanın bir parçası olarak işlemeye veya silmeye kalkışmaz.
3.  **Güvenlik:** Bu format, AI'ın yanlışlıkla kendi talimatlarını içerik olarak yorumlamasını engeller.

--- 

### Örnek Kullanım

**DOĞRU:**
```markdown
<!-- 
AI TALİMATI: Bu bölümdeki görev listesini, story'nin kabul kriterlerine göre oluştur. 
Her görevin başına T-X.X formatında bir ID ekle.
-->

### Görevler

- [ ] T-1.1: Kullanıcı arayüzü bileşenini oluştur.
- [ ] T-1.2: Bileşeni ana ekrana entegre et.
```

**DOĞRU:**
```markdown
<!-- Powered by BMAD™ Core -->

# Story 1.1: Kullanıcı Girişi
... Geri kalan içerik ...
```

**YANLIŞ:**
```markdown
AI TALİMATI: Bu bölümdeki görev listesini oluştur.

### Görevler
- [ ] Görev 1
```
