# van-ubh — Vanoksia Instagram Reels

[Vanoksia](https://agora.vanoksia.com) (öğrenci ve öğretmen için tek platform) için Remotion ile üretilmiş dikey (1080×1920) Instagram Reels videoları. Seslendirme ElevenLabs ile yapıldı.

- `videolar/` — hazır mp4'ler (öğretmen, öğrenci, sınav, ek seriler)
- `METINLER.md` — her videonun kancası, sahneleri ve seslendirme metni
- `src/` — Remotion kaynak kodu, `src/vo/` seslendirme metinleri
- `docs/AJAN_BRIFI.md` — üretim kuralları (Instagram güvenli alanları, ilk 3 saniye kanca, içerik doğruluğu)

**32 video hazır:** 10 öğretmen · 10 öğrenci · 10 sınav duyurusu · Marka1 (Eğitimde mega dönüşüm) · Arac1 (puan hesaplama).
Liste, süreler, kanca türleri, ekran ve seslendirme metinleri: [METINLER.md](METINLER.md). Instagram kapakları: `kapaklar/`.

Yeniden üretmek: `npm i` → `node scripts/seslendir.mjs <Id>` (ElevenLabs anahtarı macOS Anahtar Zinciri `elevenlabs-api-key`) → `./scripts/hepsini-render.sh`.
