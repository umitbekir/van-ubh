import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Bg, Chip, clamp, ramp, SAFE, Words, type Tone } from "../kit";
import { C, FONT_DISPLAY, FONT_SANS, GRAD_BRAND, GRAD_FEATHER } from "../theme";

/* ═════════════════════════ SINAV TAKVİMİ (tek kaynak) ═════════════════════════
   VARSAYIM: TYT-AYT hafta sonlarında Cumartesi = TYT, Pazar = AYT.
   Gerçek sıra farklıysa yalnız `cumartesi` / `pazar` alanlarını değiştir; tüm ekranlar buradan türetilir.
   Seslendirme metinleri (src/vo/SinavN.json) ayrıca elle güncellenmeli. */
export type Tur = "TYT-AYT" | "LGS";
export const TAKVIM = {
  yil: 2026,
  cumartesi: "TYT",
  pazar: "AYT",
  haftalar: [
    { tur: "TYT-AYT" as Tur, ay: 11, gunler: [21, 22] },
    { tur: "LGS" as Tur, ay: 11, gunler: [28] },
    { tur: "TYT-AYT" as Tur, ay: 12, gunler: [5, 6] },
    { tur: "LGS" as Tur, ay: 12, gunler: [12] },
    { tur: "TYT-AYT" as Tur, ay: 12, gunler: [19, 20] },
    { tur: "LGS" as Tur, ay: 12, gunler: [26] },
  ],
};

export const AY: Record<number, { ad: string; buyuk: string; kisa: string }> = {
  11: { ad: "Kasım", buyuk: "KASIM", kisa: "KAS" },
  12: { ad: "Aralık", buyuk: "ARALIK", kisa: "ARA" },
};
const GUN_AD = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
const GUN_BUYUK = ["PAZAR", "PAZARTESİ", "SALI", "ÇARŞAMBA", "PERŞEMBE", "CUMA", "CUMARTESİ"];
export const haftaGunu = (ay: number, gun: number) => GUN_AD[new Date(TAKVIM.yil, ay - 1, gun).getDay()];
export const haftaGunuBuyuk = (ay: number, gun: number) => GUN_BUYUK[new Date(TAKVIM.yil, ay - 1, gun).getDay()];
/** O günün sınavı: LGS ya da (Cumartesi/Pazar varsayımına göre) TYT / AYT */
export const sinavAdi = (tur: Tur, ay: number, gun: number) => {
  if (tur === "LGS") return "LGS";
  return new Date(TAKVIM.yil, ay - 1, gun).getDay() === 6 ? TAKVIM.cumartesi : TAKVIM.pazar;
};
export type Gun = { ay: number; gun: number; tur: Tur; sinav: string; gunAd: string };
export const DENEME_GUNLERI: Gun[] = TAKVIM.haftalar.flatMap((h) =>
  h.gunler.map((g) => ({ ay: h.ay, gun: g, tur: h.tur, sinav: sinavAdi(h.tur, h.ay, g), gunAd: haftaGunu(h.ay, g) })),
);
export const hafta = (ay: number, ilkGun: number) => TAKVIM.haftalar.find((h) => h.ay === ay && h.gunler[0] === ilkGun)!;
export const haftaGunleri = (ay: number, ilkGun: number): Gun[] => DENEME_GUNLERI.filter((d) => d.ay === ay && hafta(ay, ilkGun).gunler.includes(d.gun));
export const gunAraligi = (h: { gunler: number[] }) => h.gunler.join("-");

/* renk kodu: TYT-AYT = camgöbeği (brand), LGS = mercan (feather) */
export const TUR_RENK: Record<Tur, string> = { "TYT-AYT": C.cyan, LGS: C.coral };
export const TUR_GRAD: Record<Tur, string> = { "TYT-AYT": GRAD_BRAND, LGS: GRAD_FEATHER };
const AMBER_GRAD = `linear-gradient(100deg, ${C.amberSoft}, ${C.amber} 50%, ${C.coral})`;
const toneCol = (t: Tone) => (t === "brand" ? C.cyan : t === "feather" ? C.coral : C.amber);
const toneGrad = (t: Tone) => (t === "brand" ? GRAD_BRAND : t === "feather" ? GRAD_FEATHER : AMBER_GRAD);

const gradText = (g: string): React.CSSProperties => ({ backgroundImage: g, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" });
const sp = (f: number, fps: number, cfg: Partial<{ damping: number; stiffness: number; mass: number }> = {}) =>
  spring({ frame: f, fps, config: { damping: 14, stiffness: 170, mass: 0.7, ...cfg } });

/* ─────────── ortak küçük parçalar ─────────── */

const Tick: React.FC<{ p: number; col: string; size?: number }> = ({ p, col, size = 44 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.3,
      background: p > 0.05 ? col : "transparent",
      border: `3px solid ${p > 0.05 ? col : C.line}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transform: `scale(${1 + Math.sin(Math.min(1, p) * Math.PI) * 0.25})`,
      boxShadow: p > 0.5 ? `0 0 18px ${col}88` : undefined,
      flexShrink: 0,
    }}
  >
    <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24">
      <path d="M4 12.5l5 5L20 6.5" fill="none" stroke="white" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={26} strokeDashoffset={26 * (1 - Math.min(1, p))} />
    </svg>
  </div>
);

/** Uygulama içi başlık çubuğu */
const AppBar: React.FC<{ title: string; sub: string; col?: string }> = ({ title, sub, col = C.blue }) => {
  const f = useCurrentFrame();
  const o = ramp(f, 6, 18);
  return (
    <div style={{ padding: "8px 34px 14px", opacity: o, transform: `translateY(${(1 - o) * 20}px)`, display: "flex", alignItems: "center", gap: 18 }}>
      <div style={{ width: 62, height: 62, borderRadius: 20, background: `linear-gradient(135deg, ${col}, ${C.navy})`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 34 }}>V</div>
      <div>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 36, color: C.ink, lineHeight: 1.05 }}>{title}</div>
        <div style={{ fontSize: 22, color: C.inkMuted, fontWeight: 500 }}>{sub}</div>
      </div>
    </div>
  );
};

/** Parlayan sayaç */
const Count: React.FC<{ to: number; at: number; dur?: number; dec?: number; style?: React.CSSProperties }> = ({ to, at, dur = 30, dec = 0, style }) => {
  const f = useCurrentFrame();
  const v = ramp(f, at, at + dur, 0, to, Easing.out(Easing.cubic));
  return <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>{v.toFixed(dec).replace(".", ",")}</span>;
};

/** Işık süpürmesi (kart üstünde) */
const Sweep: React.FC<{ at: number; radius?: number }> = ({ at, radius = 36 }) => {
  const f = useCurrentFrame();
  const p = ramp(f, at, at + 22, 0, 1, Easing.inOut(Easing.cubic));
  if (p <= 0 || p >= 1) return null;
  return (
    <div style={{ position: "absolute", inset: 0, borderRadius: radius, overflow: "hidden", pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: -100, bottom: -100, left: `${-40 + 160 * p}%`, width: "28%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)", transform: "rotate(16deg)" }} />
    </div>
  );
};

/** Yükselen parıltı tozları */
const Sparks: React.FC<{ col: string; n?: number; x0?: number; x1?: number; y0?: number; y1?: number }> = ({ col, n = 18, x0 = 80, x1 = 900, y0 = 400, y1 = 1400 }) => {
  const f = useCurrentFrame();
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const r = (k: number) => ((Math.sin(i * 91.7 + k * 13.3) + 1) / 2);
        const speed = 1.2 + r(1) * 2.2;
        const y = y1 - ((f * speed + r(2) * (y1 - y0)) % (y1 - y0));
        const x = x0 + r(3) * (x1 - x0) + Math.sin((f + i * 20) / 22) * 18;
        const s = 6 + r(4) * 10;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: "50%", background: col, boxShadow: `0 0 ${s * 2}px ${col}`, opacity: 0.25 + r(5) * 0.5 }} />;
      })}
    </>
  );
};

/** Üst başlık bloğu (özel sahneler için) */
const Head: React.FC<{ kicker?: string; title: string; tone: Tone; size?: number }> = ({ kicker, title, tone, size = 84 }) => (
  <div style={{ position: "absolute", top: SAFE.top + 40, left: 0, width: 1080, display: "flex", flexDirection: "column", alignItems: "center" }}>
    {kicker && <Chip tone={tone} style={{ marginBottom: 26 }}>{kicker}</Chip>}
    <div style={{ padding: "0 60px" }}>
      <Words text={title} delay={3} size={size} tone={tone} stagger={3} />
    </div>
  </div>
);

/* ═════════════════════════ 1) TAKVİM EKRANI (telefon içi) ═════════════════════════ */

const ayHucreleri = (ay: number) => {
  const first = (new Date(TAKVIM.yil, ay - 1, 1).getDay() + 6) % 7; // Pazartesi başlangıçlı
  const days = new Date(TAKVIM.yil, ay, 0).getDate();
  const cells: (number | null)[] = Array(first).fill(null);
  for (let d = 1; d <= days; d++) cells.push(d);
  while (cells.length % 7) cells.push(null);
  return cells;
};

const AyIzgara: React.FC<{ ay: number; litAt: (gun: number) => number | null }> = ({ ay, litAt }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cells = ayHucreleri(ay);
  return (
    <div style={{ width: 540, display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 }}>
      {["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"].map((d, i) => (
        <div key={d} style={{ textAlign: "center", fontSize: 22, fontWeight: 700, color: i >= 5 ? C.ink : C.inkMuted, paddingBottom: 4 }}>{d}</div>
      ))}
      {cells.map((d, i) => {
        if (d === null) return <div key={i} style={{ height: 66 }} />;
        const g = DENEME_GUNLERI.find((x) => x.ay === ay && x.gun === d);
        const at = g ? litAt(d) : null;
        const s = at !== null ? sp(f - at, fps, { damping: 9, stiffness: 220 }) : 0;
        const lit = at !== null && f >= at;
        const col = g ? TUR_RENK[g.tur] : C.ink;
        const pulse = lit ? 0.5 + 0.5 * Math.sin((f - (at ?? 0)) / 7) : 0;
        return (
          <div
            key={i}
            style={{
              position: "relative",
              height: 66,
              borderRadius: 16,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: lit ? (g ? TUR_GRAD[g.tur] : C.surface) : C.surface,
              border: `2px solid ${lit ? "transparent" : C.line}`,
              color: lit ? (g!.tur === "LGS" ? "white" : C.navy) : C.ink,
              transform: `scale(${lit ? 0.75 + 0.25 * s + (1 - s) * 0.35 : 1})`,
              boxShadow: lit ? `0 0 ${16 + pulse * 18}px ${col}${g!.tur === "LGS" ? "aa" : "ff"}` : undefined,
              zIndex: lit ? 2 : 1,
            }}
          >
            <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1 }}>{d}</div>
            {lit && <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 0.5, marginTop: 3, opacity: Math.min(1, s * 2) }}>{g!.sinav}</div>}
          </div>
        );
      })}
    </div>
  );
};

/** Kasım→Aralık takvimi; deneme günleri sırayla parlar. aylar=[12] verilirse yalnız Aralık. */
export const TakvimEkran: React.FC<{ aylar?: number[]; start?: number; step?: number; slideAt?: number }> = ({ aylar = [11, 12], start = 30, step = 11, slideAt = 82 }) => {
  const f = useCurrentFrame();
  const gunler = DENEME_GUNLERI.filter((g) => aylar.includes(g.ay));
  // ay başına yanma zamanı: ilk ay start'tan, ikinci ay kaydırmadan sonra
  const litTable = new Map<string, number>();
  let k = 0;
  aylar.forEach((ay, ai) => {
    const base = ai === 0 ? start : slideAt + 16;
    gunler.filter((g) => g.ay === ay).forEach((g, j) => {
      litTable.set(`${ay}-${g.gun}`, base + j * step);
      k++;
    });
  });
  const slide = aylar.length > 1 ? ramp(f, slideAt, slideAt + 16, 0, 1, Easing.inOut(Easing.cubic)) : 0;
  const litCount = gunler.filter((g) => f >= (litTable.get(`${g.ay}-${g.gun}`) ?? 1e9)).length;
  const lastLit = Math.max(...Array.from(litTable.values()));
  const done = ramp(f, lastLit + 6, lastLit + 18);
  return (
    <div>
      <AppBar title="Sınav Takvimi" sub={`Deneme günlerin • ${TAKVIM.yil}`} col={C.amber} />
      {/* ay sekmeleri */}
      {aylar.length > 1 && (
        <div style={{ margin: "4px 34px 14px", position: "relative", display: "flex", background: C.pastelButter, borderRadius: 18, padding: 6 }}>
          <div style={{ position: "absolute", top: 6, bottom: 6, left: 6 + slide * 264, width: 264, borderRadius: 14, background: C.surface, boxShadow: "0 4px 12px rgba(0,0,0,0.12)" }} />
          {aylar.map((a) => (
            <div key={a} style={{ position: "relative", flex: 1, textAlign: "center", padding: "10px 0", fontWeight: 700, fontSize: 26, color: C.ink }}>{AY[a].ad} {TAKVIM.yil}</div>
          ))}
        </div>
      )}
      {aylar.length === 1 && (
        <div style={{ margin: "4px 34px 14px", fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 40, color: C.ink }}>{AY[aylar[0]].ad} {TAKVIM.yil}</div>
      )}
      <div style={{ overflow: "hidden", width: 608 }}>
        <div style={{ display: "flex", transform: `translateX(${-slide * 608}px)` }}>
          {aylar.map((a) => (
            <div key={a} style={{ width: 608, display: "flex", justifyContent: "center", flexShrink: 0 }}>
              <AyIzgara ay={a} litAt={(d) => litTable.get(`${a}-${d}`) ?? null} />
            </div>
          ))}
        </div>
      </div>
      {/* lejant + sayaç */}
      <div style={{ display: "flex", gap: 14, margin: "18px 34px 0" }}>
        {(["TYT-AYT", "LGS"] as Tur[]).map((t, i) => {
          const o = ramp(f, 14 + i * 6, 26 + i * 6);
          return (
            <div key={t} style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 16, background: C.surface, border: `2px solid ${C.line}`, opacity: o, transform: `translateY(${(1 - o) * 20}px)` }}>
              <div style={{ width: 26, height: 26, borderRadius: 8, background: TUR_GRAD[t] }} />
              <div style={{ fontWeight: 700, fontSize: 24, color: C.ink }}>{t} <span style={{ color: C.inkMuted, fontWeight: 500, fontSize: 20 }}>denemesi</span></div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          margin: "16px 34px 0",
          padding: "16px 24px",
          borderRadius: 20,
          background: `linear-gradient(100deg, ${C.navy}, ${C.deep})`,
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: done > 0 ? `0 0 ${30 * done}px ${C.amber}88` : undefined,
        }}
      >
        <div style={{ fontSize: 24, fontWeight: 600, color: C.ice }}>İşaretli deneme günü</div>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 46, ...gradText(AMBER_GRAD), transform: `scale(${1 + done * 0.08})` }}>{litCount} gün</div>
      </div>
    </div>
  );
};

/* ═════════════════════════ 2) DÖNÜŞÜMLÜ ZAMAN ÇİZELGESİ (tam ekran) ═════════════════════════ */

export const ZamanCizelgesi: React.FC<{ tone?: Tone; finalAt?: number; haftalar?: typeof TAKVIM.haftalar; title?: string; kicker?: string }> = ({
  tone = "amber",
  finalAt = 150,
  haftalar = TAKVIM.haftalar,
  title = "İki tür, *dönüşümlü*",
  kicker = "2 HAFTADA BİR + 2 HAFTADA BİR",
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = haftalar.length;
  const top = 640;
  const gap = n > 4 ? 124 : 160;
  const spineX = 500;
  const drawEnd = 30 + n * 16;
  const spineP = ramp(f, 22, drawEnd, 0, 1, Easing.inOut(Easing.cubic));
  const spineH = (n - 1) * gap * spineP;
  const fin = sp(f - finalAt, fps, { damping: 10, stiffness: 220 });
  const wave = f - finalAt; // final anında yukarıdan aşağı ışık dalgası
  return (
    <AbsoluteFill>
      <Bg tone={tone} />
      <Head kicker={kicker} title={title} tone={tone} size={80} />
      {/* sütun başlıkları */}
      {(["TYT-AYT", "LGS"] as Tur[]).map((t, i) => {
        const o = sp(f - 10 - i * 5, fps);
        return (
          <div key={t} style={{ position: "absolute", top: 500, left: i === 0 ? 110 : 540, width: 350, textAlign: "center", opacity: o, transform: `translateY(${(1 - o) * 30}px)` }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 48, ...gradText(TUR_GRAD[t]) }}>{t}</div>
            <div style={{ fontFamily: FONT_SANS, fontSize: 26, color: C.ice, opacity: 0.8 }}>2 haftada bir</div>
          </div>
        );
      })}
      {/* omurga */}
      <div style={{ position: "absolute", left: spineX - 4, top, width: 8, height: (n - 1) * gap, borderRadius: 4, background: "rgba(225,239,255,0.12)" }} />
      <div style={{ position: "absolute", left: spineX - 4, top, width: 8, height: spineH, borderRadius: 4, background: AMBER_GRAD, boxShadow: `0 0 24px ${C.amber}` }} />
      {haftalar.map((h, i) => {
        const y = top + i * gap;
        const at = 22 + ((drawEnd - 22) * i) / Math.max(1, n - 1) - 2;
        const s = sp(f - at, fps, { damping: 11, stiffness: 200 });
        const left = h.tur === "TYT-AYT";
        const col = TUR_RENK[h.tur];
        const hit = wave >= i * 4 && wave < i * 4 + 14 ? 1 - (wave - i * 4) / 14 : 0;
        const x = left ? 110 : 540;
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: spineX - 20, top: y - 20, width: 40, height: 40, borderRadius: 20, background: f >= at ? col : C.night, border: `4px solid ${col}`, boxShadow: `0 0 ${20 + hit * 40}px ${col}`, transform: `scale(${s + hit * 0.5})` }} />
            <div
              style={{
                position: "absolute",
                left: x,
                top: y - 50,
                width: 350,
                height: 100,
                borderRadius: 26,
                background: "rgba(5,1,46,0.78)",
                border: `3px solid ${col}`,
                boxShadow: `0 0 ${18 + hit * 50}px ${col}66, inset 0 0 30px ${col}22`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 26px",
                opacity: Math.min(1, s * 2),
                transform: `translateX(${(1 - s) * (left ? -260 : 260)}px) scale(${1 + hit * 0.06})`,
              }}
            >
              <div>
                <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 46, color: C.white, lineHeight: 1 }}>{gunAraligi(h)} {AY[h.ay].kisa}</div>
                <div style={{ fontFamily: FONT_SANS, fontWeight: 600, fontSize: 22, color: col, marginTop: 6 }}>{h.gunler.map((g) => sinavAdi(h.tur, h.ay, g)).join(" • ")}</div>
              </div>
              <div style={{ fontFamily: FONT_SANS, fontWeight: 700, fontSize: 20, color: C.ice, opacity: 0.7, textAlign: "right" }}>{i + 1}.<br />hafta</div>
            </div>
          </React.Fragment>
        );
      })}
      {/* 2 hafta yayları */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
        {haftalar.map((h, i) => {
          const j = haftalar.findIndex((x, k) => k > i && x.tur === h.tur);
          if (j < 0) return null;
          const left = h.tur === "TYT-AYT";
          const xx = left ? 104 : 896;
          const bulge = left ? 56 : 926;
          const y1 = top + i * gap, y2 = top + j * gap;
          const at = 30 + ((drawEnd - 22) * j) / Math.max(1, n - 1);
          const p = ramp(f, at, at + 16);
          const len = 2 * (y2 - y1);
          return (
            <path key={i} d={`M ${xx} ${y1} Q ${bulge} ${(y1 + y2) / 2} ${xx} ${y2}`} fill="none" stroke={TUR_RENK[h.tur]} strokeWidth={4} strokeDasharray={`${len}`} strokeDashoffset={len * (1 - p)} strokeLinecap="round" opacity={0.75} />
          );
        })}
      </svg>
      {/* final rozeti */}
      {f >= finalAt && (
        <div style={{ position: "absolute", left: 0, width: 1000, top: top + (n - 1) * gap + 70, display: "flex", justifyContent: "center" }}>
          <div
            style={{
              padding: "20px 46px",
              borderRadius: 999,
              background: AMBER_GRAD,
              color: C.navy,
              fontFamily: FONT_DISPLAY,
              fontWeight: 800,
              fontSize: 56,
              transform: `scale(${2 - fin})`,
              opacity: Math.min(1, fin * 2),
              boxShadow: `0 0 70px ${C.amber}aa`,
              whiteSpace: "nowrap",
            }}
          >
            = HER HAFTA DENEME
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ═════════════════════════ 3) SINAV BİLETİ ═════════════════════════ */

export const Bilet: React.FC<{ g: Gun; at: number; w?: number; h?: number; extra?: string }> = ({ g, at, w = 800, h = 290, extra = "Deneme Sınavı" }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = sp(f - at, fps, { damping: 12, stiffness: 110, mass: 0.9 });
  const rot = (1 - s) * 180; // arka yüzden öne çevrilir
  const col = TUR_RENK[g.tur];
  const front = rot < 90;
  const stub = 190;
  const face: React.CSSProperties = { position: "absolute", inset: 0, borderRadius: 36, overflow: "hidden" };
  return (
    <div style={{ width: w, height: h, perspective: 2000, opacity: f < at ? 0 : 1 }}>
      <div style={{ position: "relative", width: "100%", height: "100%", transform: `rotateY(${rot}deg) translateZ(0) scale(${0.85 + 0.15 * s})`, transformStyle: "preserve-3d" }}>
        {front ? (
          <div style={{ ...face, background: `linear-gradient(120deg, #141a5e, ${C.navy} 60%, #1b0b4a)`, border: `3px solid ${col}aa`, boxShadow: `0 30px 70px rgba(0,0,0,0.5), 0 0 50px ${col}44`, display: "flex" }}>
            {/* koçan */}
            <div style={{ width: stub, background: TUR_GRAD[g.tur], display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: g.tur === "LGS" ? "white" : C.navy }}>
              <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 64, lineHeight: 1 }}>{g.sinav}</div>
              <div style={{ display: "flex", gap: 4, marginTop: 20 }}>
                {Array.from({ length: 11 }).map((_, i) => (
                  <div key={i} style={{ width: i % 3 === 0 ? 7 : 3, height: 46, background: "currentColor", opacity: 0.75 }} />
                ))}
              </div>
            </div>
            {/* delikli çizgi */}
            <div style={{ width: 0, borderLeft: `4px dashed ${col}88`, margin: "18px 0" }} />
            <div style={{ flex: 1, padding: "26px 36px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ fontFamily: FONT_SANS, fontWeight: 700, fontSize: 28, letterSpacing: 4, color: col }}>{haftaGunuBuyuk(g.ay, g.gun)}</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 104, lineHeight: 1, color: C.white, letterSpacing: -3 }}>
                {g.gun} <span style={{ ...gradText(TUR_GRAD[g.tur]) }}>{AY[g.ay].buyuk}</span>
              </div>
              <div style={{ fontFamily: FONT_SANS, fontWeight: 600, fontSize: 30, color: C.ice, marginTop: 6 }}>{g.sinav} {extra}</div>
            </div>
            <Sweep at={at + 22} />
          </div>
        ) : (
          <div style={{ ...face, transform: "rotateY(180deg)", background: TUR_GRAD[g.tur], display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 120, color: "rgba(5,1,46,0.35)" }}>VANOKSİA</div>
          </div>
        )}
      </div>
    </div>
  );
};

/** İki bilet (hafta sonu) sahnesi */
export const BiletSahnesi: React.FC<{ ay: number; ilkGun: number; tone?: Tone; title?: string; kicker?: string; footer?: string }> = ({ ay, ilkGun, tone = "amber", title = "*İki gün,* iki deneme", kicker = "HAFTA SONU", footer = "Gerçek sınav provası" }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const gs = haftaGunleri(ay, ilkGun);
  const fo = sp(f - 70, fps);
  const plus = sp(f - 46, fps, { damping: 8 });
  return (
    <AbsoluteFill>
      <Bg tone={tone} />
      <Sparks col={toneCol(tone)} />
      <Head kicker={kicker} title={title} tone={tone} />
      <div style={{ position: "absolute", left: 100, top: 520 }}>
        <Bilet g={gs[0]} at={10} />
      </div>
      <div style={{ position: "absolute", left: 470, top: 822, width: 60, height: 60, borderRadius: 30, background: AMBER_GRAD, color: C.navy, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 52, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${plus}) rotate(${(1 - plus) * 180}deg)`, zIndex: 3, boxShadow: `0 0 40px ${C.amber}` }}>+</div>
      {gs[1] && (
        <div style={{ position: "absolute", left: 100, top: 860 }}>
          <Bilet g={gs[1]} at={36} />
        </div>
      )}
      <div style={{ position: "absolute", left: 0, width: 1000, top: 1220, display: "flex", justifyContent: "center", opacity: fo, transform: `translateY(${(1 - fo) * 40}px)` }}>
        <div style={{ padding: "18px 40px", borderRadius: 999, border: `3px solid ${toneCol(tone)}`, background: "rgba(5,1,46,0.7)", color: C.white, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 48 }}>{footer}</div>
      </div>
    </AbsoluteFill>
  );
};

/* ═════════════════════════ 4) SONUÇ / ANALİZ EKRANI (telefon içi) ═════════════════════════ */

const KISILER = ["Zeynep A.", "Mert D.", "Can Y."];

/** Soru soru analiz ızgarası + sıralama satırları. */
export const AnalizEkran: React.FC<{ baslik: string; alt: string; col?: string; soru?: number; netBolen?: number }> = ({ baslik, alt, col = C.cyan, soru = 40, netBolen = 4 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  // temsilî cevap deseni
  const durum = (i: number) => {
    const r = (Math.sin(i * 12.9898) * 43758.5453) % 1;
    const x = Math.abs(r);
    return x < 0.74 ? "d" : x < 0.9 ? "y" : "b";
  };
  const cells = Array.from({ length: soru }, (_, i) => durum(i));
  const D = cells.filter((c) => c === "d").length;
  const Y = cells.filter((c) => c === "y").length;
  const B = soru - D - Y;
  const net = D - Y / netBolen;
  const swap = sp(f - 92, fps, { damping: 13, stiffness: 120 });
  // "Sen" satırı 4. sıradan 2. sıraya çıkar
  const rows = [KISILER[0], "SEN", KISILER[1], KISILER[2]];
  const rowY = (name: string) => {
    const orderBefore: Record<string, number> = { [KISILER[0]]: 0, [KISILER[1]]: 1, [KISILER[2]]: 2, SEN: 3 };
    const orderAfter: Record<string, number> = { [KISILER[0]]: 0, SEN: 1, [KISILER[1]]: 2, [KISILER[2]]: 3 };
    return interpolate(swap, [0, 1], [orderBefore[name], orderAfter[name]]) * 66;
  };
  return (
    <div>
      <AppBar title={baslik} sub={alt} col={col} />
      {/* sayaçlar */}
      <div style={{ display: "flex", gap: 12, margin: "6px 30px 0" }}>
        {[
          { l: "Doğru", v: D, c: C.green },
          { l: "Yanlış", v: Y, c: C.red },
          { l: "Boş", v: B, c: C.inkMuted },
          { l: "Net", v: net, c: C.blue, dec: 2 },
        ].map((x, i) => {
          const o = ramp(f, 10 + i * 4, 22 + i * 4);
          return (
            <div key={x.l} style={{ flex: 1, padding: "12px 0", borderRadius: 18, background: i === 3 ? C.navy : C.surface, border: `2px solid ${i === 3 ? C.navy : C.line}`, textAlign: "center", opacity: o, transform: `translateY(${(1 - o) * 20}px)` }}>
              <div style={{ fontSize: 19, fontWeight: 600, color: i === 3 ? C.ice : C.inkMuted }}>{x.l}</div>
              <Count to={x.v} at={18} dur={60} dec={x.dec ?? 0} style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 40, color: i === 3 ? C.cyan : x.c }} />
            </div>
          );
        })}
      </div>
      {/* soru soru */}
      <div style={{ margin: "20px 30px 8px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 30, color: C.ink }}>Soru soru analiz</div>
        <div style={{ fontSize: 20, color: C.inkMuted, fontWeight: 600 }}>{Math.min(soru, Math.max(0, Math.floor(ramp(f, 18, 78, 0, soru, Easing.linear))))}/{soru}</div>
      </div>
      <div style={{ margin: "0 30px", display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 6 }}>
        {cells.map((c, i) => {
          const at = 18 + i * 1.5;
          const s = sp(f - at, fps, { damping: 10, stiffness: 260 });
          const on = f >= at;
          const bg = !on ? C.surface : c === "d" ? C.green : c === "y" ? C.red : "#cfc8bc";
          return (
            <div key={i} style={{ height: 46, borderRadius: 10, background: bg, border: `2px solid ${on ? bg : C.line}`, color: on ? "white" : C.inkMuted, fontSize: 18, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${on ? 0.7 + 0.3 * s : 1})` }}>
              {i + 1}
            </div>
          );
        })}
      </div>
      {/* sıralama */}
      <div style={{ margin: "22px 30px 8px", fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 30, color: C.ink, opacity: ramp(f, 70, 80) }}>Sıralama</div>
      <div style={{ position: "relative", margin: "0 30px", height: 4 * 66, opacity: ramp(f, 72, 84) }}>
        {rows.map((name) => {
          const me = name === "SEN";
          const y = rowY(name);
          const rank = Math.round(y / 66) + 1;
          return (
            <div
              key={name}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: y,
                height: 58,
                borderRadius: 16,
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "0 18px",
                background: me ? `linear-gradient(100deg, ${C.amberSoft}, ${C.amber})` : C.surface,
                border: `2px solid ${me ? C.amber : C.line}`,
                boxShadow: me ? `0 8px ${20 + swap * 20}px ${C.amber}88` : undefined,
                zIndex: me ? 2 : 1,
                transform: me ? `scale(${1 + Math.sin(swap * Math.PI) * 0.05})` : undefined,
              }}
            >
              <div style={{ width: 40, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 28, color: me ? C.navy : C.inkMuted }}>{rank}.</div>
              <div style={{ flex: 1, fontWeight: 700, fontSize: 24, color: me ? C.navy : C.ink }}>{me ? "Elif K. (Sen)" : name}</div>
              {me && swap > 0.2 && <div style={{ fontWeight: 800, fontSize: 24, color: C.navy, opacity: swap }}>▲ 2</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ═════════════════════════ 5) KOPARMALI TAKVİM: "Sonraki" ═════════════════════════ */

type Sayfa = { ust: string; buyuk: string; alt: string; tur: Tur };
export const haftaSayfasi = (h: { tur: Tur; ay: number; gunler: number[] }): Sayfa => ({
  ust: AY[h.ay].buyuk,
  buyuk: gunAraligi(h),
  alt: h.gunler.map((g) => `${haftaGunu(h.ay, g)} ${sinavAdi(h.tur, h.ay, g)}`).join(" • "),
  tur: h.tur,
});

const TakvimSayfasi: React.FC<{ p: Sayfa; w: number; h: number }> = ({ p, w, h }) => (
  <div style={{ width: w, height: h, borderRadius: 40, background: C.surface, overflow: "hidden", boxShadow: "0 40px 90px rgba(0,0,0,0.5)", display: "flex", flexDirection: "column" }}>
    <div style={{ height: 130, background: TUR_GRAD[p.tur], display: "flex", alignItems: "center", justifyContent: "center", color: p.tur === "LGS" ? "white" : C.navy, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 70, letterSpacing: 4 }}>{p.ust}</div>
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: p.buyuk.length > 2 ? 210 : 270, lineHeight: 0.95, color: C.navy, letterSpacing: -8 }}>{p.buyuk}</div>
      <div style={{ marginTop: 16, padding: "10px 26px", borderRadius: 999, background: C.pastelButter, fontFamily: FONT_SANS, fontWeight: 700, fontSize: 28, color: C.ink }}>{p.alt}</div>
    </div>
  </div>
);

/** Eski sayfa yukarı koparılır, alttaki yeni tarih görünür. pages[0] = eski; sonra sırayla. chips = altta kalıcı liste */
export const Koparmali: React.FC<{ pages: Sayfa[]; tone?: Tone; title: string; kicker?: string; chips?: { t: string; tur: Tur }[]; firstAt?: number; every?: number; chipsAt?: number }> = ({
  pages,
  tone = "amber",
  title,
  kicker = "SIRADAKİ",
  chips = [],
  firstAt = 22,
  every = 40,
  chipsAt,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const W = 600, H = 620, X = 490 - W / 2, Y = 520;
  const inS = sp(f, fps, { damping: 12, stiffness: 140 });
  return (
    <AbsoluteFill>
      <Bg tone={tone} />
      <Sparks col={toneCol(tone)} n={12} />
      <Head kicker={kicker} title={title} tone={tone} />
      <div style={{ position: "absolute", left: X, top: Y, width: W, height: H, transform: `translateY(${(1 - inS) * 500}px) rotate(${(1 - inS) * -8}deg)`, perspective: 1800 }}>
        {/* halkalar */}
        {[0.25, 0.5, 0.75].map((r) => (
          <div key={r} style={{ position: "absolute", top: -26, left: W * r - 14, width: 28, height: 60, borderRadius: 14, background: "linear-gradient(#e9e2d6, #8a8396)", zIndex: 50 }} />
        ))}
        {pages
          .map((p, i) => {
            const tearAt = firstAt + i * every;
            const isLast = i === pages.length - 1;
            const t = isLast ? 0 : ramp(f, tearAt, tearAt + 18, 0, 1, Easing.in(Easing.cubic));
            if (t >= 1) return null;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 40 - i,
                  transformOrigin: "50% 0%",
                  transform: `rotateX(${t * 110}deg) translateY(${-t * 200}px) rotateZ(${t * -14}deg)`,
                  opacity: 1 - t * 0.6,
                }}
              >
                <TakvimSayfasi p={p} w={W} h={H} />
              </div>
            );
          })
          .reverse()}
      </div>
      {/* alt çipler */}
      <div style={{ position: "absolute", top: Y + H + 60, left: 70, width: 840, display: "flex", flexWrap: "wrap", gap: 18, justifyContent: "center" }}>
        {chips.map((c, i) => {
          const at = (chipsAt ?? firstAt + (pages.length - 1) * every + 6) + i * 8;
          const s = sp(f - at, fps, { damping: 10, stiffness: 200 });
          return (
            <div key={i} style={{ padding: "16px 30px", borderRadius: 999, background: "rgba(5,1,46,0.75)", border: `3px solid ${TUR_RENK[c.tur]}`, color: C.white, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 40, transform: `scale(${s})`, opacity: Math.min(1, s * 2), boxShadow: `0 0 30px ${TUR_RENK[c.tur]}55` }}>
              {c.t}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ═════════════════════════ 6) BÜYÜK TARİH KARTI (tek gün) ═════════════════════════ */

export const TarihKarti: React.FC<{ g: Gun; tone?: Tone; kicker?: string; title?: string }> = ({ g, tone = "feather", kicker, title }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = sp(f, fps, { damping: 11, stiffness: 120, mass: 0.9 });
  const roll = Math.round(ramp(f, 2, 26, 1, g.gun, Easing.out(Easing.cubic)));
  const land = f >= 26 ? Math.max(0, 1 - (f - 26) / 10) : 0;
  const col = TUR_RENK[g.tur];
  const W = 780, H = 860;
  const top = title ? 470 : 380;
  return (
    <AbsoluteFill>
      <Bg tone={tone} intensity={1.2} />
      <Sparks col={col} n={22} />
      {(kicker || title) && <Head kicker={kicker} title={title ?? ""} tone={tone} size={70} />}
      {/* dönen hale */}
      <div style={{ position: "absolute", left: 490 - 520, top: top + H / 2 - 520, width: 1040, height: 1040, borderRadius: "50%", background: `conic-gradient(from ${f * 2}deg, transparent, ${col}55, transparent 30%, ${C.amber}44, transparent 60%)`, filter: "blur(30px)", opacity: s }} />
      <div style={{ position: "absolute", left: 490 - W / 2, top, width: W, height: H, perspective: 2000 }}>
        <div
          style={{
            position: "relative",
            width: W,
            height: H,
            borderRadius: 50,
            background: `linear-gradient(160deg, #1a1466, ${C.navy} 55%, #2b0640)`,
            border: `4px solid ${col}`,
            boxShadow: `0 50px 110px rgba(0,0,0,0.55), 0 0 ${60 + land * 80}px ${col}88`,
            transform: `rotateY(${(1 - s) * -70}deg) rotateX(${(1 - s) * 20}deg) scale(${0.6 + 0.4 * s + land * 0.04})`,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ width: "100%", padding: "34px 0", background: TUR_GRAD[g.tur], textAlign: "center", fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 64, color: g.tur === "LGS" ? "white" : C.navy, letterSpacing: 2 }}>
            {g.sinav} DENEMESİ
          </div>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 400, lineHeight: 1, marginTop: 20, color: C.white, letterSpacing: -16, fontVariantNumeric: "tabular-nums", textShadow: `0 0 60px ${col}88` }}>{roll}</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 110, lineHeight: 1, ...gradText(TUR_GRAD[g.tur]), paddingBottom: 8 }}>{AY[g.ay].buyuk}</div>
          <div style={{ marginTop: 26, padding: "14px 40px", borderRadius: 999, border: `3px solid ${col}`, color: C.white, fontFamily: FONT_SANS, fontWeight: 700, fontSize: 40, letterSpacing: 6, opacity: ramp(f, 24, 34) }}>{haftaGunuBuyuk(g.ay, g.gun)}</div>
          <Sweep at={30} radius={50} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ═════════════════════════ 7) LGS FORMAT EKRANI (telefon içi) ═════════════════════════ */

const LGS_DERS = [
  { ad: "Türkçe", soru: 20, net: 17.5 },
  { ad: "Matematik", soru: 20, net: 14.25 },
  { ad: "Fen Bilimleri", soru: 20, net: 16.75 },
  { ad: "T.C. İnkılap Tarihi", soru: 10, net: 9 },
  { ad: "Din Kültürü", soru: 10, net: 9.75 },
  { ad: "Yabancı Dil", soru: 10, net: 8.5 },
];

export const LgsEkran: React.FC<{ g: Gun }> = ({ g }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = LGS_DERS.reduce((a, d) => a + d.net, 0);
  const rk = sp(f - 120, fps, { damping: 9 });
  return (
    <div>
      <AppBar title="LGS Denemesi" sub={`${g.gun} ${AY[g.ay].ad} ${g.gunAd} • 90 soru`} col={C.coral} />
      <div style={{ margin: "6px 30px 10px", display: "flex", gap: 10 }}>
        {["Sözel 50", "Sayısal 40"].map((t, i) => (
          <div key={t} style={{ padding: "8px 20px", borderRadius: 999, background: i ? C.pastelBlue : C.pastelLilac, fontWeight: 700, fontSize: 22, color: C.ink, transform: `scale(${sp(f - 10 - i * 5, fps)})` }}>{t}</div>
        ))}
      </div>
      <div style={{ margin: "0 30px", display: "flex", flexDirection: "column", gap: 12 }}>
        {LGS_DERS.map((d, i) => {
          const at = 20 + i * 9;
          const p = ramp(f, at, at + 34, 0, 1, Easing.out(Easing.cubic));
          const o = ramp(f, at - 6, at + 4);
          const weak = i === 1;
          return (
            <div key={d.ad} style={{ padding: "12px 18px", borderRadius: 18, background: C.surface, border: `2px solid ${weak && f > 110 ? C.coral : C.line}`, opacity: o, transform: `translateX(${(1 - o) * 60}px)` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 24, color: C.ink }}>{d.ad} <span style={{ color: C.inkMuted, fontWeight: 500, fontSize: 19 }}>{d.soru} soru</span></div>
                <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 28, color: C.ink }}>
                  <Count to={d.net} at={at} dur={34} dec={2} /> <span style={{ fontSize: 18, color: C.inkMuted }}>net</span>
                </div>
              </div>
              <div style={{ height: 14, borderRadius: 7, background: C.line, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(d.net / d.soru) * 100 * p}%`, borderRadius: 7, background: GRAD_FEATHER, boxShadow: `0 0 12px ${C.coral}` }} />
              </div>
              {weak && f > 110 && <div style={{ marginTop: 8, fontSize: 19, fontWeight: 700, color: C.coral, opacity: ramp(f, 110, 118) }}>Soru soru analiz: 4 soru tekrar listende</div>}
            </div>
          );
        })}
      </div>
      <div style={{ margin: "14px 30px 0", padding: "14px 22px", borderRadius: 20, background: C.navy, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ color: C.ice, fontSize: 20, fontWeight: 600 }}>Toplam net</div>
          <Count to={total} at={20} dur={90} dec={2} style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 44, ...gradText(GRAD_FEATHER) }} />
        </div>
        <div style={{ padding: "10px 20px", borderRadius: 16, background: GRAD_FEATHER, color: "white", fontWeight: 800, fontSize: 24, transform: `scale(${rk})` }}>Sıralaman ▲</div>
      </div>
    </div>
  );
};

/* ═════════════════════════ 8) SINAV PAKETİ EKRANI (telefon içi) ═════════════════════════ */

export const PAKET_MADDELER = [
  { t: "LGS / TYT / AYT formatında deneme", at: 40 },
  { t: "Soru soru analiz", at: 146 },
  { t: "Sıralama", at: 189 },
  { t: "Her hafta düzenli deneme", at: 225 },
];

export const PaketEkran: React.FC<{ maddeler?: { t: string; at: number }[] }> = ({ maddeler = PAKET_MADDELER }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lid = sp(f - 12, fps, { damping: 12, stiffness: 90 });
  const done = maddeler.filter((m) => f >= m.at + 8).length;
  const last = maddeler[maddeler.length - 1].at;
  const act = sp(f - last - 26, fps, { damping: 12 });
  return (
    <div>
      <AppBar title="Sınav Paketi" sub="Tüm dönem denemeleri" col={C.amber} />
      {/* kutu */}
      <div style={{ margin: "10px 30px 0", position: "relative", height: 210, perspective: 1200 }}>
        <div style={{ position: "absolute", inset: "50px 0 0 0", borderRadius: 26, background: `linear-gradient(135deg, ${C.navy}, #2b0a5e)`, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${C.amber} 0%, transparent 65%)`, opacity: lid * 0.8, transform: `scale(${0.4 + lid})` }} />
          <div style={{ position: "relative", display: "flex", gap: 12 }}>
            {(["LGS", "TYT", "AYT"] as const).map((t, i) => {
              const s = sp(f - 26 - i * 6, fps, { damping: 9, stiffness: 200 });
              const tur: Tur = t === "LGS" ? "LGS" : "TYT-AYT";
              return (
                <div key={t} style={{ padding: "12px 24px", borderRadius: 16, background: TUR_GRAD[tur], color: tur === "LGS" ? "white" : C.navy, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 36, transform: `translateY(${(1 - s) * 60}px) scale(${s})`, opacity: Math.min(1, s * 2) }}>{t}</div>
              );
            })}
          </div>
        </div>
        {/* kapak */}
        <div style={{ position: "absolute", left: -6, right: -6, top: 30, height: 70, borderRadius: 20, background: AMBER_GRAD, transformOrigin: "50% 0%", transform: `rotateX(${lid * 120}deg)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 30, color: C.navy, letterSpacing: 4, opacity: 1 - lid }}>
          SINAV PAKETİ
        </div>
      </div>
      {/* maddeler */}
      <div style={{ margin: "20px 30px 0", display: "flex", flexDirection: "column", gap: 16 }}>
        {maddeler.map((m, i) => {
          const o = ramp(f, m.at - 10, m.at);
          const p = ramp(f, m.at, m.at + 10);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, padding: "22px 20px", borderRadius: 20, background: p > 0.5 ? "#fff8ea" : C.surface, border: `2px solid ${p > 0.5 ? C.amber : C.line}`, opacity: 0.35 + 0.65 * o, transform: `translateX(${(1 - o) * 30}px)` }}>
              <Tick p={p} col={C.amber} />
              <div style={{ fontWeight: 700, fontSize: 28, color: C.ink, lineHeight: 1.2 }}>{m.t}</div>
            </div>
          );
        })}
      </div>
      <div style={{ margin: "18px 30px 0", padding: "16px 22px", borderRadius: 20, background: C.navy, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ color: C.ice, fontWeight: 600, fontSize: 24 }}>Pakete dahil: <b style={{ color: C.amberSoft }}>{done}/{maddeler.length}</b></div>
        <div style={{ width: 96, height: 52, borderRadius: 26, background: act > 0.5 ? C.green : "#4a4766", position: "relative", boxShadow: act > 0.5 ? `0 0 24px ${C.green}` : undefined }}>
          <div style={{ position: "absolute", top: 6, left: 6 + act * 44, width: 40, height: 40, borderRadius: 20, background: "white" }} />
        </div>
      </div>
    </div>
  );
};

/* ═════════════════════════ 9) YAKLAŞAN TARİHLER LİSTESİ (tam ekran) ═════════════════════════ */

export const TarihListesi: React.FC<{ tone?: Tone; title?: string; kicker?: string; haftalar?: typeof TAKVIM.haftalar; hits?: number[]; spot?: boolean }> = ({
  tone = "feather",
  title = "Tüm tarihler *tek pakette*",
  kicker = "YAKLAŞAN DENEMELER",
  haftalar = TAKVIM.haftalar,
  hits,
  spot = false,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = haftalar.length;
  const rowH = n > 4 ? 124 : 150;
  const top = 500;
  const H = hits ?? haftalar.map((_, i) => 80 + i * 12);
  return (
    <AbsoluteFill>
      <Bg tone={tone} />
      <Head kicker={kicker} title={title} tone={tone} size={80} />
      {haftalar.map((h, i) => {
        const at = 12 + i * 8;
        const s = sp(f - at, fps, { damping: 13, stiffness: 160 });
        const col = TUR_RENK[h.tur];
        const passed = f >= H[i] + 4;
        const hit = f >= H[i] && f < H[i] + 16 ? Math.sin(((f - H[i]) / 16) * Math.PI) : 0;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 80,
              width: 820,
              top: top + i * rowH,
              height: rowH - 18,
              borderRadius: 28,
              background: passed ? `linear-gradient(100deg, rgba(5,1,46,0.9), ${col}33)` : "rgba(5,1,46,0.72)",
              border: `3px solid ${passed ? col : "rgba(225,239,255,0.18)"}`,
              boxShadow: `0 0 ${10 + hit * 50}px ${col}66`,
              display: "flex",
              alignItems: "center",
              padding: "0 28px",
              gap: 26,
              opacity: Math.min(1, s * 2),
              transform: `translateX(${(1 - s) * 900}px) scale(${1 + hit * 0.04})`,
            }}
          >
            <div style={{ width: 200 }}>
              <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 58, color: C.white, lineHeight: 1 }}>{gunAraligi(h)}</div>
              <div style={{ fontFamily: FONT_SANS, fontWeight: 700, fontSize: 24, color: col, letterSpacing: 3 }}>{AY[h.ay].buyuk}</div>
            </div>
            <div style={{ flex: 1, display: "flex", gap: 12, flexWrap: "wrap" }}>
              {h.gunler.map((g) => (
                <div key={g} style={{ padding: "8px 18px", borderRadius: 999, background: TUR_GRAD[h.tur], color: h.tur === "LGS" ? "white" : C.navy, fontFamily: FONT_SANS, fontWeight: 700, fontSize: 24 }}>
                  {({ Cumartesi: "Cmt", Pazar: "Paz" } as Record<string, string>)[haftaGunu(h.ay, g)] ?? haftaGunu(h.ay, g)} • {sinavAdi(h.tur, h.ay, g)}
                </div>
              ))}
            </div>
            <Tick p={ramp(f, H[i] + 2, H[i] + 10)} col={col} size={50} />
          </div>
        );
      })}
      {spot && (() => {
        let cur = -1;
        H.forEach((h, i) => { if (f >= h) cur = i; });
        if (cur < 0) return null;
        const h = haftalar[cur];
        const s = sp(f - H[cur], fps, { damping: 11, stiffness: 200 });
        const col = TUR_RENK[h.tur];
        return (
          <div key={cur} style={{ position: "absolute", left: 80, width: 820, top: top + n * rowH + 20, height: 230, borderRadius: 36, background: TUR_GRAD[h.tur], boxShadow: `0 0 70px ${col}88`, display: "flex", alignItems: "center", justifyContent: "center", gap: 34, transform: `perspective(1400px) rotateX(${(1 - s) * 70}deg) scale(${0.8 + 0.2 * s})`, opacity: Math.min(1, s * 2), color: h.tur === "LGS" ? "white" : C.navy }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 150, lineHeight: 1, letterSpacing: -5 }}>{gunAraligi(h)}</div>
            <div>
              <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 56, lineHeight: 1 }}>{AY[h.ay].buyuk}</div>
              {h.gunler.map((g) => (
                <div key={g} style={{ fontFamily: FONT_SANS, fontWeight: 700, fontSize: 32, marginTop: 6 }}>{haftaGunu(h.ay, g)} • {sinavAdi(h.tur, h.ay, g)}</div>
              ))}
            </div>
          </div>
        );
      })()}
    </AbsoluteFill>
  );
};

/* ═════════════════════════ 10) ÖZEL KANCALAR (6–10. videolar için) ═════════════════════════ */

/** Ekran ikiye yarılır: sol TYT, sağ AYT; ortada tarih. 0. karede tamamen okunur. */
export const HookSplit: React.FC<{ ay: number; ilkGun: number; kicker: string }> = ({ ay, ilkGun, kicker }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const gs = haftaGunleri(ay, ilkGun);
  const s = sp(f, fps, { damping: 10, stiffness: 160 });
  const cut = ramp(f, 0, 10, 0, 1, Easing.out(Easing.exp));
  const date = sp(f - 8, fps, { damping: 9, stiffness: 220 });
  const shake = f < 18 ? Math.sin(f * 2.6) * 14 * (1 - f / 18) : 0;
  return (
    <AbsoluteFill>
      <Bg tone="amber" intensity={1.2} />
      <Sparks col={C.amber} n={20} />
      <AbsoluteFill style={{ transform: `translateX(${shake}px)` }}>
        <div style={{ position: "absolute", top: SAFE.top + 60, width: 1080, display: "flex", justifyContent: "center" }}>
          <Chip tone="amber" delay={-20}>{kicker}</Chip>
        </div>
        {/* iki yarım */}
        {gs.map((g, i) => {
          const left = i === 0;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: 420,
                height: 560,
                left: left ? 80 : 520,
                width: 400,
                borderRadius: 44,
                background: left ? GRAD_BRAND : `linear-gradient(100deg, ${C.blue}, ${C.sky} 60%, ${C.cyan})`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${1.05 - 0.05 * cut}) rotate(${(left ? -1 : 1) * (3 + (1 - s) * 6)}deg)`,
                boxShadow: `0 40px 90px rgba(0,0,0,0.45), 0 0 60px ${C.cyan}55`,
                color: C.navy,
              }}
            >
              <div style={{ fontFamily: FONT_SANS, fontWeight: 700, fontSize: 34, letterSpacing: 4 }}>{haftaGunuBuyuk(g.ay, g.gun)}</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 260, lineHeight: 0.95, letterSpacing: -10 }}>{g.gun}</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 110, lineHeight: 1, color: C.white, textShadow: "0 6px 20px rgba(5,1,46,0.4)" }}>{g.sinav}</div>
            </div>
          );
        })}
        <div style={{ position: "absolute", top: 1030, width: 1000, display: "flex", justifyContent: "center" }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 150, lineHeight: 1, letterSpacing: -5, ...gradText(AMBER_GRAD), transform: `scale(${1.12 - 0.12 * date})`, paddingBottom: 10 }}>{AY[ay].buyuk}</div>
        </div>
        <div style={{ position: "absolute", top: 1210, width: 1000, display: "flex", justifyContent: "center", opacity: ramp(f, 24, 34) }}>
          <div style={{ fontFamily: FONT_SANS, fontWeight: 600, fontSize: 48, color: C.ice }}>TYT • AYT denemesi</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Mühür kancası: dev tarih ekranda, "DENEME GÜNÜ" damgası çarpar. */
export const HookStamp: React.FC<{ g: Gun; stamp: string; kicker: string; tone?: Tone; sub?: string }> = ({ g, stamp, kicker, tone = "feather", sub }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const st = sp(f - 6, fps, { damping: 9, stiffness: 260, mass: 0.8 });
  const hit = f >= 10 && f < 24 ? Math.pow(1 - (f - 10) / 14, 2) : 0;
  const col = TUR_RENK[g.tur];
  return (
    <AbsoluteFill>
      <Bg tone={tone} intensity={1.3} />
      <AbsoluteFill style={{ transform: `translate(${Math.sin(f * 2.7) * 20 * hit}px, ${Math.cos(f * 3.1) * 14 * hit}px)` }}>
        <div style={{ position: "absolute", top: SAFE.top + 60, width: 1080, display: "flex", justifyContent: "center" }}>
          <Chip tone={tone} delay={-20}>{kicker}</Chip>
        </div>
        <div style={{ position: "absolute", top: 400, width: 1000, textAlign: "center" }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 520, lineHeight: 0.9, letterSpacing: -24, color: C.white, textShadow: `0 0 80px ${col}88` }}>{g.gun}</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 150, lineHeight: 1, letterSpacing: -4, ...gradText(TUR_GRAD[g.tur]), paddingBottom: 10 }}>{AY[g.ay].buyuk}</div>
          {sub && <div style={{ marginTop: 20, fontFamily: FONT_SANS, fontWeight: 600, fontSize: 46, color: C.ice, opacity: ramp(f, 26, 36) }}>{sub}</div>}
        </div>
        {/* damga */}
        <div
          style={{
            position: "absolute",
            left: 140,
            top: 700,
            width: 720,
            padding: "22px 0",
            textAlign: "center",
            border: `10px solid ${col}`,
            borderRadius: 30,
            color: col,
            fontFamily: FONT_DISPLAY,
            fontWeight: 800,
            fontSize: 96,
            letterSpacing: 4,
            background: "rgba(5,1,46,0.55)",
            transform: `rotate(-10deg) scale(${f < 6 ? 2.4 : 2.4 - 1.4 * st})`,
            opacity: f < 6 ? 0 : Math.min(1, 0.4 + st),
            boxShadow: `0 0 ${40 + hit * 80}px ${col}aa`,
          }}
        >
          {stamp}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Ay ızgarası kancası: 0. karede tüm Aralık ızgarası, deneme günleri art arda yanar. */
export const HookAyIzgara: React.FC<{ ay: number; baslik: string; sub: string }> = ({ ay, baslik, sub }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cells = ayHucreleri(ay);
  const gunler = DENEME_GUNLERI.filter((g) => g.ay === ay);
  const titleS = sp(f, fps, { damping: 10, stiffness: 200 });
  return (
    <AbsoluteFill>
      <Bg tone="amber" intensity={1.25} />
      <div style={{ position: "absolute", top: SAFE.top + 40, width: 1080, textAlign: "center" }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 150, lineHeight: 1, letterSpacing: -5, ...gradText(AMBER_GRAD), transform: `scale(${1.15 - 0.15 * titleS})`, paddingBottom: 8 }}>{baslik}</div>
        <div style={{ fontFamily: FONT_SANS, fontWeight: 600, fontSize: 46, color: C.ice, marginTop: 4 }}>{sub}</div>
      </div>
      <div style={{ position: "absolute", left: 90, top: 560, width: 820, display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 12 }}>
        {["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"].map((d) => (
          <div key={d} style={{ textAlign: "center", fontFamily: FONT_SANS, fontWeight: 700, fontSize: 28, color: C.ice, opacity: 0.7 }}>{d}</div>
        ))}
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />;
          const g = gunler.find((x) => x.gun === d);
          const k = g ? gunler.indexOf(g) : -1;
          const at = k * 7; // ilk gün 0. karede yanar
          const s = g ? sp(f - at, fps, { damping: 9, stiffness: 240 }) : 0;
          const lit = g && f >= at;
          const col = g ? TUR_RENK[g.tur] : C.ice;
          return (
            <div
              key={i}
              style={{
                height: 104,
                borderRadius: 22,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: lit ? TUR_GRAD[g!.tur] : "rgba(225,239,255,0.07)",
                border: `2px solid ${lit ? "transparent" : "rgba(225,239,255,0.14)"}`,
                color: lit ? (g!.tur === "LGS" ? "white" : C.navy) : "rgba(225,239,255,0.6)",
                fontFamily: FONT_DISPLAY,
                fontWeight: 800,
                fontSize: 40,
                transform: lit ? `scale(${k === 0 ? 1 : 1.5 - 0.5 * s})` : undefined,
                boxShadow: lit ? `0 0 ${30 + 14 * Math.sin(f / 6 + k)}px ${col}` : undefined,
                zIndex: lit ? 2 : 1,
              }}
            >
              <div style={{ lineHeight: 1 }}>{d}</div>
              {lit && <div style={{ fontFamily: FONT_SANS, fontSize: 18, fontWeight: 800, marginTop: 4 }}>{g!.sinav}</div>}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
