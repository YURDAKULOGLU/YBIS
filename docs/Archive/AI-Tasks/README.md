# AI Asenkron İletişim Klasörü

## Amaç
Bu klasör, YBIS projesinde çalışan farklı AI asistanlarının birbirleriyle dosya tabanlı asenkron iletişim kurması içindir.

## Yapı

```
docs/AI/
├── README.md (bu dosya)
├── gemini/
│   ├── incoming/    # Claude → Gemini talimatlar
│   └── outgoing/    # Gemini → Claude cevaplar
├── claude/
│   ├── incoming/    # Gemini → Claude talimatlar
│   └── outgoing/    # Claude → Gemini cevaplar
└── shared/          # Ortak çıktılar (epic, story vb.)
```

## Protokol

### 1. Görev Talebi (Request)
**Gönderen AI** → `{hedef-ai}/incoming/TASK-{timestamp}.md` oluşturur

Örnek: `gemini/incoming/TASK-20251009-143000.md`

Format:
```markdown
# TASK-{ID}
**From:** Claude Code
**To:** Gemini
**Type:** Epic Creation
**Priority:** High
**Created:** 2025-10-09 14:30

## Context
[Bağlam bilgisi]

## Request
[Ne yapılması isteniyor]

## Expected Output
[Beklenen çıktı formatı]

## References
- [İlgili dosyalar]
```

### 2. Görev Cevabı (Response)
**Hedef AI** → `{kendi-ai}/outgoing/RESPONSE-{task-id}.md` oluşturur

Örnek: `gemini/outgoing/RESPONSE-TASK-20251009-143000.md`

Format:
```markdown
# RESPONSE-{TASK-ID}
**From:** Gemini
**To:** Claude Code
**Task:** TASK-20251009-143000
**Status:** Completed
**Completed:** 2025-10-09 15:00

## Output
[Üretilen içerik]

## Next Steps
[Öneriler]
```

### 3. Ortak Çıktılar (Shared)
Her iki AI de okuması gereken dökümanlar `shared/` altına:
- `shared/epics/`
- `shared/stories/`
- `shared/specs/`

## Kullanım Örneği

### Claude → Gemini: Epic oluştur
1. Claude: `gemini/incoming/TASK-epic-ports.md` yazar
2. Gemini: Dosyayı okur, epic'i oluşturur
3. Gemini: `gemini/outgoing/RESPONSE-TASK-epic-ports.md` + `shared/epics/tier1-ports.md` yazar
4. Claude: Response'u okur, epic'e göre kod yazar

## Cleanup Policy
- Tamamlanan task'lar 7 gün sonra arşivlenir
- `shared/` altındaki aktif dökümanlar kalır
- Arşiv: `archive/{year}/{month}/`

## Status Tracking
- `PENDING` - Henüz okunmadı
- `IN_PROGRESS` - AI üzerinde çalışıyor
- `COMPLETED` - Tamamlandı
- `BLOCKED` - Ek bilgi gerekiyor
