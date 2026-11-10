# Vanoksia Instagram Reels — ortak üretim brifi

Proje: `~/Desktop/Projelerim/Vanoksia Videolar` (Remotion 4.0.534, React 19). Ürün: **Vanoksia** — https://agora.vanoksia.com
Slogan: "Yapay zekâ destekli, öğretmen odaklı, öğrenci merkezli eğitim platformu" / "Öğrenci ve öğretmen için tek platform".

## Önce oku
- `src/kit.tsx` — hazır parçalar: `Bg`, `Words` (`*vurgu*` ve `\n`), `Chip`, `Logo`, kancalar `HookSlam` / `HookStrike` / `HookCounter` / `HookQuestion`, `Phone`, `Callout`, `FeatureScene`, `CTA`, `Reel`, `withVo`, `SAFE`, `useSp`, `ramp`.
- `src/theme.ts` — palet `C`, fontlar, `SITE`.
- `src/videos/ornek.tsx` + `src/vo/Ornek.json` — REFERANS video. Aynı kalıbı kullan.
- `scripts/seslendir.mjs` — ElevenLabs seslendirmesi (ses kullanıcı tarafından onaylandı, DEĞİŞTİRME).

## Dosya sahipliği (paralel çalışan 3 ajan var)
- YALNIZ kendi dosyalarına yaz: `src/videos/<grup>.tsx`, `src/widgets/<grup>.tsx`, `src/vo/<KendiIdlerin>.json`, `out/<grup>/`, `build/<grup>/`.
- `kit.tsx`, `theme.ts`, `Root.tsx`, `types.ts`, `ornek.tsx`, `seslendir.mjs` DOKUNMA. Kitte eksik varsa kendi widgets dosyanda yaz.
- git çalıştırma.

## Video kalıbı (1080×1920, 30 fps, 15–25 sn)
1. **Kanca (0–3 sn, çapa):** 0. kare tek başına kapak olabilecek kadar okunur ve çarpıcı (boş/siyah açılış YOK). İlk 0,5 sn'de güçlü hareket. Grubunda 4 kanca türünü de kullan, iki video aynı kancayla başlamasın. Kanca sesi ≤ 8 kelime, ~2,5 sn.
2. **2–3 özellik sahnesi:** `FeatureScene` + `Phone` içinde **canlı hareket eden uygulama arayüzü maketi** (kendi widget'ların: ilerleyen çubuklar, sayan sayaçlar, işaretlenen kutular, yer değiştiren sıralama satırları, yazılan metin vb.). Statik ekran yok, her sahnede en az 2 hareket olayı olsun. Telefon yanında 1–2 `Callout`.
3. **CTA (≈3 sn):** `CTA` bileşeni.

Görsel çıta: gelişmiş motion design. Spring tabanlı giriş, katmanlı derinlik, ışık ve parlama, ritimli kurgu. Sahneler ses bitince değil, sesle birlikte akar. Metinleri Türkçe karakterle (İ, ş, ğ) doğrudan yaz. CSS `text-transform` kullanma.

## Instagram yerleşimi (zorunlu)
- Üst 0–220 px: kullanıcı adı ve Reels başlığı burada → metin koyma.
- Alt 1500–1920 px: açıklama ve ses satırı burada → önemli içerik koyma. Telefonun alt kısmı buraya taşabilir, ama telefon içindeki önemli bilgi ekranın üst ~%65'inde olsun.
- Sağ 930–1080 px (y > 1000): beğeni, yorum ve paylaş ikonları burada → Callout veya metin koyma.
- Göz önce merkezin biraz üstüne düşer (y ≈ 700–1000). Ana mesaj orada olsun.
- Profil ızgarası 3:4 kırpar (y 240–1680). Kapak = 0. kare, kanca metni bu alanda kalmalı.
- Doğrulama için `<Id>-Kilavuz` kompozisyonunu kullan. Kırmızı alanlar yasak bölge, sarı kesikli çizgi ızgara kırpımı, yeşil çizgi göz hattı.

## Seslendirme
- `src/vo/<Id>.json` → `{ "metinler": [sahne0, sahne1, ...] }`. Sıra, `withVo` içindeki sahne sırasıyla birebir aynı olmalı. Sessiz sahne için `""` kullan.
- Ton: derin, epik, kısa ve vurucu reklam cümleleri. Ekrandaki metinle uyumlu olsun ama kelimesi kelimesine aynı olmak zorunda değil. Toplam ~35–55 kelime.
- Sayıları ve sembolleri okunuşuyla yaz: "%65" → "yüzde altmış beş", "500 ₺" → "beş yüz lira", "TYT" → "Te Ye Te", "AYT" → "A Ye Te", "LGS" → "Le Ge Se", "21-22 Kasım" → "yirmi bir, yirmi iki Kasım". Marka adı "Vanoksia".
- Çalıştır: `node scripts/seslendir.mjs <Id1> <Id2> ...` → `src/vo/<Id>.sure.json` oluşur, sahne süreleri buna göre otomatik uzar. Metin değişmezse yeniden üretmez.

## Doğruluk kuralları (sitede yazanlar dışında iddia yok)
Kullanılabilecek gerçekler:
- **Öğrenci:** Çalış (video, doküman, ses, etkileşimli içerik tek oynatıcıda; not alma, transkript). Pratik (konuya özel yapay zekâ soru seti, fotoğrafla adım adım çözüm). Sınav (seviye tespiti, LGS/TYT/AYT formatında deneme, soru soru analiz ve sıralama). Soru Kampı (davet koduyla arkadaşlarla canlı soru çözme + liderlik tablosu). Koç öğretmen ve canlı ders (koçla mesajlaşma, özel ders talebi, canlı derse kayıt). Planla (hedef üniversite/bölüm veya liseye göre çalışma planı + ilerleme takibi). Konu testinde %80 ve üzeri başarı konuyu "tamamlandı" yapar. Ücretsiz kayıt. Yeni öğrenciler ilk 3 gün tüm ücretli içerikleri dener. Paketler: Keşif, Uzman, Şampiyon.
- **Öğretmen:** İçerik stüdyosu (video, ses, doküman yükle, müfredat konusuna bağla). Soru havuzu (zengin metin editörü, branş onayıyla yayın). Sınav oluşturucu (filtreli havuzdan sınav, süre ve erişim ayarı). Koçluk ve özel ders (müsaitlik takvimi, ders ücreti, ödev ve sınav atama). Canlı dersler + Stüdyo analitiği (ders planlama, katılım takibi, izlenme ve beğeni). Kazanç: abonelik tahsilatının %65'i içerik üreticilerine ayrılır (havuz modeli). Özel derslerde platform komisyonu %10. Seviye çarpanı Yeni → Kıdemli → Süper Hoca, izlenme payını etkiler. Bakiye 500 ₺ olunca çekim talebi. Öğretmenler için Öğretmen Premium paketi gerekir.
- **Genel:** 200.000+ onaylı soru, 20.000+ müfredat konusu. LGS, TYT, AYT (ayrıca DGS, KPSS, YDS).
- YASAK: fiyat uydurmak, "Türkiye geneli", "garanti", "kesin kazanç", "derece garantisi", gerçek kişi, kurum veya üniversite logosu. Maket ekranlardaki isimler ve sayılar temsilî olabilir (ör. öğrenci "Elif K.").
- Öğretmen videolarında "ücretsiz" deme (Premium paket gerekir). CTA butonu: "Öğretmen Olarak Katıl". Öğrenci CTA'sı: "Ücretsiz Kayıt Ol" + not "İlk 3 gün tüm ücretli içerikler açık".

## Render ve doğrulama (paralel ajanlarla çakışmasın diye)
```bash
cd ~/Desktop/Projelerim/"Vanoksia Videolar"
npx tsc --noEmit -p .
npx remotion bundle src/index.ts --out-dir build/<grup> --bundle-cache=false --log=error
npx remotion still build/<grup> <Id>-Kilavuz out/<grup>/kare/<Id>_<kare>.png --frame=<kare> --log=error
npx remotion render build/<grup> <Id> out/<grup>/<Id>.mp4 --codec=h264 --concurrency=4 --log=error
```
- Kodu her değiştirdiğinde önce bundle'ı yenile. Render'ları sırayla çalıştır.
- Her video için en az şu karelere bak: 0, 20, 45, 80 ve her sahnenin ortası (kare listesini sure.json'dan hesapla). PNG'leri `ffmpeg ... hstack` ile şerit yapıp Read ile GÖZLE kontrol et. Kontrol listesi: taşma ve kesilme yok, yasak bölgede metin yok, 0. kare güçlü, telefon arayüzü dolu ve canlı.
- Son mp4'te `ffprobe` ile hem video hem audio akışı olmalı.

## Rapor (Türkçe)
Her video için: Id, süre, kanca türü, seslendirme metni, mp4 yolu, kontrol sonucu. Varsa yapamadığın veya emin olmadığın noktalar.
