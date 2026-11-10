import React from "react";
import { AbsoluteFill, Easing, Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Bg, Chip, ramp, SAFE, Words, type Tone } from "../kit";
import { C, FONT_DISPLAY, FONT_SANS, GRAD_BRAND, GRAD_FEATHER } from "../theme";

/* ═════════════ ortak yardımcılar ═════════════ */

const GRAD_AMBER = `linear-gradient(100deg, ${C.amberSoft}, ${C.amber} 50%, ${C.coral})`;
const grad = (t: Tone) => (t === "brand" ? GRAD_BRAND : t === "feather" ? GRAD_FEATHER : GRAD_AMBER);
const tcol = (t: Tone) => (t === "brand" ? C.cyan : t === "feather" ? C.coral : C.amber);

const rnd = (seed: number) => {
  const x = Math.sin(seed * 9301.7 + 49297.3) * 233280.1;
  return x - Math.floor(x);
};
const trNum = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const useSpring = (delay: number, cfg: Partial<{ damping: number; stiffness: number; mass: number }> = {}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: { damping: 13, stiffness: 170, mass: 0.7, ...cfg } });
};

const gradText = (g: string): React.CSSProperties => ({ backgroundImage: g, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" });

/** Genişleyen ışık halkası */
const Ring: React.FC<{ at: number; x: number; y: number; col: string; size?: number; dur?: number }> = ({ at, x, y, col, size = 1100, dur = 24 }) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < 0 || t > dur) return null;
  const p = Easing.out(Easing.cubic)(t / dur);
  const r = (size / 2) * p;
  return (
    <div
      style={{
        position: "absolute",
        left: x - r,
        top: y - r,
        width: r * 2,
        height: r * 2,
        borderRadius: "50%",
        border: `${14 * (1 - p) + 2}px solid ${col}`,
        boxShadow: `0 0 50px ${col}, inset 0 0 40px ${col}88`,
        opacity: (1 - p) * 0.9,
        pointerEvents: "none",
      }}
    />
  );
};

/** Bir noktadan saçılan parçacıklar */
const Burst: React.FC<{ at: number; x: number; y: number; cols: string[]; n?: number; spread?: number; seed?: number }> = ({ at, x, y, cols, n = 26, spread = 420, seed = 1 }) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < 0 || t > 40) return null;
  const p = t / 40;
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const a = rnd(seed * 31 + i) * Math.PI * 2;
        const d = spread * (0.4 + 0.6 * rnd(seed * 17 + i * 3)) * Easing.out(Easing.cubic)(p);
        const g = 260 * p * p;
        const s = 10 + 14 * rnd(i * 7 + seed);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + Math.cos(a) * d - s / 2,
              top: y + Math.sin(a) * d + g - s / 2,
              width: s,
              height: s * (i % 3 === 0 ? 2.2 : 1),
              borderRadius: i % 2 ? s : 3,
              background: cols[i % cols.length],
              transform: `rotate(${t * 18 + i * 40}deg)`,
              opacity: 1 - p,
              boxShadow: `0 0 14px ${cols[i % cols.length]}`,
            }}
          />
        );
      })}
    </>
  );
};

/** Dönen ışık huzmeleri */
const Rays: React.FC<{ col: string; y?: number; op?: number }> = ({ col, y = SAFE.eye, op = 0.5 }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: 540 - 1400,
        top: y - 1400,
        width: 2800,
        height: 2800,
        borderRadius: "50%",
        background: `repeating-conic-gradient(from ${f * 0.6}deg, ${col}00 0deg, ${col}40 6deg, ${col}00 14deg, ${col}00 30deg)`,
        maskImage: "radial-gradient(circle, black 0%, transparent 55%)",
        WebkitMaskImage: "radial-gradient(circle, black 0%, transparent 55%)",
        opacity: op,
      }}
    />
  );
};

/* ═════════════ ikonlar (SVG) ═════════════ */

type IconP = { size?: number; col?: string; sw?: number };
export const IPlay: React.FC<IconP> = ({ size = 40, col = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d="M7 4.5v15l13-7.5z" fill={col} /></svg>
);
export const IDoc: React.FC<IconP> = ({ size = 40, col = "#fff", sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8z" />
    <path d="M14 3v5h5M8.5 13h7M8.5 16.5h5" />
  </svg>
);
export const ISpark: React.FC<IconP> = ({ size = 40, col = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M10 2l1.9 5.6L17.5 9.5l-5.6 1.9L10 17l-1.9-5.6L2.5 9.5l5.6-1.9z" fill={col} />
    <path d="M18.5 13l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9z" fill={col} opacity={0.8} />
  </svg>
);
export const IExam: React.FC<IconP> = ({ size = 40, col = "#fff", sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <path d="M8 8l1.5 1.5L12 7M8 14l1.5 1.5L12 13M14.5 8.5H17M14.5 14.5H17" />
  </svg>
);
export const ICheck: React.FC<IconP> = ({ size = 40, col = "#fff", sw = 3 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7" /></svg>
);
export const IUpload: React.FC<IconP> = ({ size = 40, col = "#fff", sw = 2.2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4M7 9l5-5 5 5M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" /></svg>
);
export const ICal: React.FC<IconP> = ({ size = 40, col = "#fff", sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>
);
export const ICoin: React.FC<IconP> = ({ size = 40, col = "#fff", sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth={sw} strokeLinecap="round"><circle cx="12" cy="12" r="8.5" /><path d="M14.8 9.2c-.6-.9-1.6-1.4-2.8-1.4-1.6 0-2.8.8-2.8 2.1 0 2.9 5.8 1.5 5.8 4.3 0 1.3-1.3 2.1-3 2.1-1.3 0-2.4-.6-3-1.5M12 6v1.8M12 16.2V18" /></svg>
);
export const ICompass: React.FC<IconP> = ({ size = 40, col = "#fff", sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth={sw} strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2 5-5 2 2-5z" fill={col} /></svg>
);
export const IStar: React.FC<IconP> = ({ size = 40, col = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z" fill={col} /></svg>
);
export const ITrophy: React.FC<IconP> = ({ size = 40, col = "#fff", sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 4h10v5a5 5 0 0 1-10 0z" fill={col} fillOpacity={0.3} />
    <path d="M7 6H4v1.5A3.5 3.5 0 0 0 7.5 11M17 6h3v1.5a3.5 3.5 0 0 1-3.5 3.5M12 14v3.5M8 21h8M9.5 17.5h5" />
  </svg>
);
/** open: 0 = kilitli, 1 = açık (halka kalkar ve döner) */
export const ILock: React.FC<IconP & { open: number }> = ({ size = 60, col = "#fff", open }) => {
  const lift = open * 5;
  const rot = open * -38;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" overflow="visible">
      <g transform={`translate(0 ${-lift}) rotate(${rot} 16.5 10.5)`}>
        <path d="M7.5 10.5V7.5a4.5 4.5 0 0 1 9 0v3" stroke={col} strokeWidth={2.4} strokeLinecap="round" />
      </g>
      <rect x="4.5" y="10.5" width="15" height="11" rx="2.6" fill={col} />
      <circle cx="12" cy="15.4" r="1.6" fill="rgba(0,0,0,0.35)" />
      <rect x="11.3" y="15.6" width="1.4" height="3.2" rx="0.7" fill="rgba(0,0,0,0.35)" />
    </svg>
  );
};

/* ═════════════ telefon içi ortak parçalar ═════════════ */

const AppBar: React.FC<{ title: string; sub?: string; right?: React.ReactNode; accent?: string }> = ({ title, sub, right, accent = C.blue }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 34px 18px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ width: 54, height: 54, borderRadius: 16, background: `linear-gradient(135deg, ${accent}, ${C.navy})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Img src={staticFile("logo-dark.svg")} style={{ width: 38 }} />
      </div>
      <div>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 34, color: C.ink, lineHeight: 1.05 }}>{title}</div>
        {sub && <div style={{ fontSize: 21, color: C.inkMuted, marginTop: 3 }}>{sub}</div>}
      </div>
    </div>
    {right}
  </div>
);

const card: React.CSSProperties = { background: C.surface, borderRadius: 26, boxShadow: "0 10px 30px rgba(43,36,64,0.10)", border: `1.5px solid ${C.line}` };

/* ══════════════════════════════════════════════════════════════
   MARKA1
   ══════════════════════════════════════════════════════════════ */

const SUBJ = [
  { n: "Matematik", c: C.blue },
  { n: "Fizik", c: C.magenta },
  { n: "Türkçe", c: C.coral },
  { n: "Kimya", c: "#7c3aed" },
  { n: "Biyoloji", c: C.green },
  { n: "Tarih", c: C.amber },
  { n: "Coğrafya", c: C.sky },
  { n: "İngilizce", c: "#db2777" },
];
const TOPICS = ["Türev", "Paragraf", "Hücre Bölünmesi", "Kuvvet ve Hareket", "Osmanlı Kuruluş", "Mol Kavramı", "Fonksiyonlar", "Üslü Sayılar", "İklim Tipleri", "Optik", "Present Perfect", "Olasılık", "Kalıtım", "Sözcükte Anlam", "Asit ve Bazlar", "Limit"];

const MiniQ: React.FC<{ seed: number }> = ({ seed }) => {
  const s = SUBJ[seed % SUBJ.length];
  const ok = seed % 4;
  return (
    <div style={{ width: 250, padding: 18, borderRadius: 22, background: "#fff", boxShadow: "0 20px 40px rgba(0,0,0,0.35)", fontFamily: FONT_SANS }}>
      <div style={{ display: "inline-block", padding: "4px 12px", borderRadius: 99, background: `${s.c}22`, color: s.c, fontSize: 17, fontWeight: 700 }}>{s.n}</div>
      <div style={{ height: 11, borderRadius: 6, background: "#e6e1ea", marginTop: 12, width: "92%" }} />
      <div style={{ height: 11, borderRadius: 6, background: "#e6e1ea", marginTop: 8, width: "64%" }} />
      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        {["A", "B", "C", "D"].map((l, i) => (
          <div key={l} style={{ flex: 1, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 700, background: i === ok ? C.green : "#f1edf3", color: i === ok ? "#fff" : C.inkMuted }}>{l}</div>
        ))}
      </div>
    </div>
  );
};

/** Arka planda derinlikli yağan soru kartları ve konu etiketleri */
const CardRain: React.FC<{ topicsFrom: number }> = ({ topicsFrom }) => {
  const f = useCurrentFrame();
  const items = Array.from({ length: 22 }).map((_, i) => {
    const z = 0.45 + rnd(i + 3) * 0.75;
    const x = rnd(i * 5 + 1) * 1080 - 120;
    const off = rnd(i * 11 + 2) * 2300;
    const sp = 9 + 9 * z;
    const y = ((off + f * sp) % 2300) - 300;
    const rot = (rnd(i * 13) - 0.5) * 50 + f * (rnd(i) - 0.5) * 0.8;
    return { i, z, x, y, rot };
  });
  const tops = Array.from({ length: 16 }).map((_, i) => {
    const t = f - topicsFrom - i * 2.5;
    const z = 0.55 + rnd(i * 7 + 9) * 0.7;
    const x = 60 + rnd(i * 3 + 7) * 900;
    const y = -120 + t * (18 + 10 * z);
    return { i, z, x, y, t };
  });
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {items
        .sort((a, b) => a.z - b.z)
        .map(({ i, z, x, y, rot }) => (
          <div key={i} style={{ position: "absolute", left: x, top: y, transform: `scale(${z}) rotate(${rot}deg)`, filter: `blur(${Math.max(0, (1 - z) * 7)}px)`, opacity: 0.25 + 0.55 * z }}>
            <MiniQ seed={i} />
          </div>
        ))}
      {tops.map(({ i, z, x, y, t }) =>
        t < 0 ? null : (
          <div
            key={`t${i}`}
            style={{
              position: "absolute",
              left: x - 140,
              top: y,
              transform: `scale(${z}) rotate(${(rnd(i) - 0.5) * 30}deg)`,
              padding: "14px 26px",
              borderRadius: 999,
              background: i % 2 ? "rgba(253,81,49,0.9)" : "rgba(245,165,36,0.9)",
              color: C.navy,
              fontFamily: FONT_DISPLAY,
              fontWeight: 800,
              fontSize: 36,
              whiteSpace: "nowrap",
              opacity: 0.3 + 0.6 * z,
              filter: `blur(${Math.max(0, (1 - z) * 5)}px)`,
              boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
            }}
          >
            {TOPICS[i]}
          </div>
        ),
      )}
    </AbsoluteFill>
  );
};

const BigCount: React.FC<{ value: number; from: number; to: number; label: string; tone: Tone; top: number; kicker: string }> = ({ value, from, to, label, tone, top, kicker }) => {
  const f = useCurrentFrame();
  const p = ramp(f, from, to, 0, 1, Easing.out(Easing.exp));
  const s = useSpring(from - 4, { damping: 11, stiffness: 200 });
  const done = f >= to;
  const pop = done ? 1 + 0.14 * Math.max(0, 1 - (f - to) / 9) : 1;
  const plus = useSpring(to, { damping: 8, stiffness: 260 });
  const glow = done ? 0.6 + 0.4 * Math.sin((f - to) / 8) : 0.3;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", flexDirection: "column", alignItems: "center", opacity: Math.min(1, s * 2), transform: `scale(${(0.6 + 0.4 * s) * pop})` }}>
      <div style={{ fontFamily: FONT_SANS, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: tcol(tone), marginBottom: 6 }}>{kicker}</div>
      <div style={{ position: "relative", display: "flex", alignItems: "flex-start" }}>
        <div
          style={{
            position: "absolute",
            inset: "-10% -15%",
            background: `radial-gradient(closest-side, ${tcol(tone)}${Math.round(glow * 90).toString(16).padStart(2, "0")}, transparent)`,
            filter: "blur(30px)",
          }}
        />
        <div style={{ position: "relative", fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 210, lineHeight: 1, letterSpacing: -8, fontVariantNumeric: "tabular-nums", ...gradText(grad(tone)), paddingBottom: 12, filter: `drop-shadow(0 12px 40px rgba(0,0,0,0.5))` }}>
          {trNum(f >= to ? value : value * p)}
        </div>
        <div style={{ position: "relative", fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 170, lineHeight: 1, color: C.white, transform: `scale(${plus}) rotate(${(1 - plus) * 90}deg)`, opacity: done ? 1 : 0, marginLeft: 6 }}>+</div>
      </div>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 70, color: C.white, marginTop: -6, letterSpacing: -1.5, textShadow: "0 8px 30px rgba(0,0,0,0.6)" }}>{label}</div>
    </div>
  );
};

/** Sahne 1: dev sayaçlar + kart yağmuru */
export const StatsScene: React.FC = () => {
  const f = useCurrentFrame();
  const shake = (at: number) => {
    const t = f - at;
    if (t < 0 || t > 12) return 0;
    return Math.sin(t * 2.8) * 14 * Math.pow(1 - t / 12, 2);
  };
  const sx = shake(52) + shake(118);
  return (
    <AbsoluteFill>
      <Bg tone="brand" intensity={1.1} />
      <CardRain topicsFrom={70} />
      <AbsoluteFill style={{ background: "radial-gradient(70% 45% at 50% 46%, rgba(5,1,46,0.92) 30%, rgba(5,1,46,0.55) 70%, transparent 100%)" }} />
      <AbsoluteFill style={{ transform: `translate(${sx}px, ${sx * 0.6}px)` }}>
        <BigCount value={200000} from={6} to={52} label="onaylı soru" tone="brand" top={330} kicker="SORU HAVUZU" />
        <BigCount value={20000} from={72} to={118} label="müfredat konusu" tone="feather" top={790} kicker="KONU KÜTÜPHANESİ" />
        <div style={{ position: "absolute", left: 0, right: 0, top: 1250, display: "flex", justifyContent: "center", gap: 18 }}>
          {["LGS", "TYT", "AYT", "KPSS", "DGS", "YDS"].map((x, i) => {
            const s = spring({ frame: f - 128 - i * 3, fps: 30, config: { damping: 11, stiffness: 220 } });
            return (
              <div key={x} style={{ padding: "12px 22px", borderRadius: 18, border: `2px solid ${C.ice}55`, background: "rgba(5,1,46,0.7)", color: C.ice, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 34, transform: `scale(${s}) translateY(${(1 - s) * 40}px)`, opacity: s }}>
                {x}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <Ring at={52} x={540} y={470} col={C.cyan} />
      <Ring at={118} x={540} y={930} col={C.coral} />
      <Burst at={52} x={760} y={440} cols={[C.cyan, C.sky, C.white]} seed={3} />
      <Burst at={118} x={760} y={900} cols={[C.coral, C.amber, C.white]} seed={8} />
    </AbsoluteFill>
  );
};

/* ───── Sahne 2: bölünmüş ekran öğrenci / öğretmen ───── */

const Tile: React.FC<{ x: number; y: number; delay: number; tone: Tone; icon: React.ReactNode; word: string; label: string; children: React.ReactNode }> = ({ x, y, delay, tone, icon, word, label, children }) => {
  const s = useSpring(delay, { damping: 12, stiffness: 180 });
  const f = useCurrentFrame();
  if (f < delay - 1) return null;
  const col = tcol(tone);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 262, height: 330, perspective: 900 }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 32,
          padding: 20,
          boxSizing: "border-box",
          background: "linear-gradient(160deg, rgba(255,255,255,0.14), rgba(255,255,255,0.04))",
          border: `2px solid ${col}66`,
          boxShadow: `0 24px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.25), 0 0 ${40 * s}px ${col}33`,
          backdropFilter: "blur(10px)",
          transform: `translateY(${(1 - s) * 120}px) rotateX(${(1 - s) * 50}deg) scale(${0.7 + 0.3 * s})`,
          opacity: Math.min(1, s * 2),
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ width: 64, height: 64, borderRadius: 20, background: grad(tone), display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 8px 24px ${col}66` }}>{icon}</div>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 50, color: C.white, marginTop: 12, letterSpacing: -1.5, lineHeight: 1 }}>{word}</div>
        <div style={{ fontFamily: FONT_SANS, fontSize: 20, color: C.ice, opacity: 0.8, marginTop: 6 }}>{label}</div>
        <div style={{ flex: 1, marginTop: 12, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>{children}</div>
      </div>
    </div>
  );
};

const MiniVideo: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame();
  const p = ramp(f, d + 8, d + 90, 0, 1, Easing.linear);
  return (
    <div style={{ borderRadius: 16, overflow: "hidden", background: `linear-gradient(135deg, ${C.blue}, ${C.plum})`, height: 100, position: "relative" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 46, height: 46, borderRadius: 23, background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + Math.sin(f / 5) * 0.06})` }}><IPlay size={24} /></div>
      </div>
      <div style={{ position: "absolute", left: 10, right: 10, bottom: 10, height: 7, borderRadius: 4, background: "rgba(255,255,255,0.25)" }}>
        <div style={{ width: `${p * 100}%`, height: "100%", borderRadius: 4, background: C.cyan, boxShadow: `0 0 10px ${C.cyan}` }} />
      </div>
    </div>
  );
};

const MiniOptions: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame();
  const t = f - d;
  const cur = t < 34 ? Math.floor(Math.max(0, t) / 8) % 4 : 2;
  const locked = t >= 34;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      {["A", "B", "C", "D"].map((l, i) => {
        const on = i === cur;
        return (
          <div key={l} style={{ height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 24, background: on ? (locked ? C.green : "rgba(52,237,239,0.35)") : "rgba(255,255,255,0.1)", color: C.white, transform: `scale(${on && locked ? 1 + 0.15 * Math.max(0, 1 - (t - 34) / 8) : 1})` }}>
            {on && locked ? <ICheck size={22} /> : l}
          </div>
        );
      })}
    </div>
  );
};

const MiniRing: React.FC<{ d: number; label: string; to: number; col: string }> = ({ d, label, to, col }) => {
  const f = useCurrentFrame();
  const p = ramp(f, d + 6, d + 50, 0, 1, Easing.out(Easing.cubic));
  const r = 38;
  const L = 2 * Math.PI * r;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <svg width={96} height={96} viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={r} stroke="rgba(255,255,255,0.15)" strokeWidth={10} fill="none" />
        <circle cx="48" cy="48" r={r} stroke={col} strokeWidth={10} fill="none" strokeDasharray={L} strokeDashoffset={L * (1 - p * to / 100)} strokeLinecap="round" transform="rotate(-90 48 48)" />
        <text x="48" y="56" textAnchor="middle" fontFamily={FONT_DISPLAY} fontWeight={800} fontSize={24} fill="#fff">{Math.round(p * to)}</text>
      </svg>
      <div style={{ fontFamily: FONT_SANS, fontSize: 19, color: C.ice, lineHeight: 1.25, fontWeight: 600, whiteSpace: "pre-line" }}>{label}</div>
    </div>
  );
};

const MiniUpload: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame();
  const p = ramp(f, d + 6, d + 40, 0, 1, Easing.inOut(Easing.cubic));
  const live = f > d + 42;
  const s = spring({ frame: f - d - 42, fps: 30, config: { damping: 9, stiffness: 240 } });
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT_SANS, fontSize: 19, color: C.ice, marginBottom: 8 }}>
        <span>ders-video.mp4</span>
        <span style={{ fontWeight: 700 }}>%{Math.round(p * 100)}</span>
      </div>
      <div style={{ height: 12, borderRadius: 6, background: "rgba(255,255,255,0.15)" }}>
        <div style={{ width: `${p * 100}%`, height: "100%", borderRadius: 6, background: GRAD_FEATHER }} />
      </div>
      <div style={{ marginTop: 12, height: 40, display: "inline-flex", alignItems: "center", gap: 6, padding: "0 16px", borderRadius: 99, background: live ? C.green : "rgba(255,255,255,0.1)", color: "#fff", fontFamily: FONT_SANS, fontWeight: 700, fontSize: 20, transform: `scale(${live ? 0.8 + 0.2 * s : 1})` }}>
        {live ? <><ICheck size={18} /> Yayında</> : "Konuya bağlanıyor"}
      </div>
    </div>
  );
};

const MiniCal: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame();
  const t = f - d;
  const on = [1, 3, 6, 8, 11, 13, 16];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6 }}>
      {Array.from({ length: 18 }).map((_, i) => {
        const k = on.indexOf(i);
        const lit = k >= 0 && t > 6 + k * 5;
        const s = lit ? spring({ frame: t - 6 - k * 5, fps: 30, config: { damping: 9, stiffness: 260 } }) : 0;
        return <div key={i} style={{ height: 28, borderRadius: 7, background: lit ? GRAD_FEATHER : "rgba(255,255,255,0.1)", transform: `scale(${lit ? 0.7 + 0.3 * s : 1})`, boxShadow: lit ? `0 0 12px ${C.coral}88` : undefined }} />;
      })}
    </div>
  );
};

const MiniEarn: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame();
  const p = ramp(f, d + 6, d + 40, 0, 1, Easing.out(Easing.exp));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 64, lineHeight: 1, ...gradText(GRAD_AMBER), paddingBottom: 4 }}>%{Math.round(65 * p)}</div>
      <div style={{ fontFamily: FONT_SANS, fontSize: 18, color: C.ice, lineHeight: 1.2, paddingBottom: 8 }}>abonelik<br />havuzundan</div>
    </div>
  );
};

/** Sahne 2: üst yarı öğrenci, alt yarı öğretmen; sonunda tek platformda birleşir */
export const SplitScene: React.FC<{ sAts?: number[]; tAts?: number[]; mergeAt?: number }> = ({ sAts = [10, 44, 77], tAts = [120, 160, 198], mergeAt = 210 }) => {
  const teacherAt = tAts[0];
  const f = useCurrentFrame();
  const inTop = ramp(f, 0, 14, 0, 1, Easing.out(Easing.exp));
  const inBot = ramp(f, 3, 17, 0, 1, Easing.out(Easing.exp));
  const m = spring({ frame: f - mergeAt, fps: 30, config: { damping: 12, stiffness: 140 } });
  const pull = f >= mergeAt ? m : 0;
  const seam = SAFE.eye;
  const studentDim = f > teacherAt ? 0.55 + 0.45 * (f > mergeAt ? m : 0) : 1;
  const xs = [60, 344, 628];
  const pulseX = ((f * 22) % 1500) - 200;
  return (
    <AbsoluteFill>
      <Bg tone="brand" />
      {/* üst yarı */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: seam, transform: `translateX(${(1 - inTop) * -1100}px) translateY(${pull * 36}px)`, background: `linear-gradient(170deg, ${C.blue}55, ${C.night}00 70%)`, clipPath: "polygon(0 0, 100% 0, 100% 92%, 0 100%)" }} />
      {/* alt yarı */}
      <div style={{ position: "absolute", left: 0, top: seam - 60, width: 1080, height: 1920 - seam + 60, transform: `translateX(${(1 - inBot) * 1100}px) translateY(${pull * -36}px)`, background: `linear-gradient(10deg, ${C.magenta}55, ${C.night}00 70%)`, clipPath: "polygon(0 8%, 100% 0, 100% 100%, 0 100%)" }} />
      {/* ayırıcı çizgi */}
      <div style={{ position: "absolute", left: -60, top: seam - 30, width: 1200, height: 6, transform: `rotate(-3.2deg) scaleX(${inBot})`, background: `linear-gradient(90deg, ${C.cyan}, ${C.white}, ${C.coral})`, boxShadow: `0 0 40px ${C.white}, 0 0 80px ${C.sky}` }}>
        <div style={{ position: "absolute", left: pulseX, top: -14, width: 220, height: 34, borderRadius: 20, background: "radial-gradient(closest-side, #fff, transparent)" }} />
      </div>

      <AbsoluteFill style={{ transform: `translateY(${pull * 36}px)`, opacity: studentDim }}>
        <div style={{ position: "absolute", left: 60, top: 250, display: "flex", alignItems: "baseline", gap: 18, transform: `translateX(${(1 - inTop) * -600}px)` }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 112, letterSpacing: -4, lineHeight: 1, ...gradText(GRAD_BRAND), paddingBottom: 8 }}>ÖĞRENCİ</div>
        </div>
        <Tile x={xs[0]} y={400} delay={sAts[0]} tone="brand" icon={<IPlay size={34} />} word="Çalış" label="Video · doküman · ses">
          <MiniVideo d={sAts[0]} />
        </Tile>
        <Tile x={xs[1]} y={400} delay={sAts[1]} tone="brand" icon={<ISpark size={36} />} word="Pratik" label="Yapay zekâ soru seti">
          <MiniOptions d={sAts[1]} />
        </Tile>
        <Tile x={xs[2]} y={400} delay={sAts[2]} tone="brand" icon={<IExam size={36} />} word="Sınav" label="LGS · TYT · AYT">
          <MiniRing d={sAts[2]} label={"Soru soru\nanaliz"} to={86} col={C.cyan} />
        </Tile>
      </AbsoluteFill>

      <AbsoluteFill style={{ transform: `translateY(${pull * -36}px)` }}>
        <div style={{ position: "absolute", left: 60, top: 965, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 112, letterSpacing: -4, lineHeight: 1, ...gradText(GRAD_FEATHER), paddingBottom: 8, transform: `translateX(${(1 - inBot) * 600}px)`, opacity: f > teacherAt - 20 ? 1 : 0.45 }}>ÖĞRETMEN</div>
        <Tile x={xs[0] - 14} y={1110} delay={teacherAt} tone="feather" icon={<IUpload size={34} />} word="Üret" label="İçerik stüdyosu">
          <MiniUpload d={teacherAt} />
        </Tile>
        <Tile x={xs[1] - 24} y={1110} delay={tAts[1]} tone="feather" icon={<ICal size={34} />} word="Koçluk" label="Müsaitlik takvimi">
          <MiniCal d={tAts[1]} />
        </Tile>
        <Tile x={xs[2] - 34} y={1110} delay={tAts[2]} tone="amber" icon={<ICoin size={36} />} word="Kazan" label="Üretici payı">
          <MiniEarn d={tAts[2]} />
        </Tile>
      </AbsoluteFill>

      {/* birleşme rozeti */}
      {f >= mergeAt && (
        <div style={{ position: "absolute", left: 0, right: 0, top: seam - 88, display: "flex", justifyContent: "center", transform: `scale(${m}) rotate(${(1 - m) * -10}deg)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "22px 46px 22px 26px", borderRadius: 999, background: C.night, border: "3px solid rgba(255,255,255,0.8)", boxShadow: `0 0 60px ${C.cyan}aa, 0 0 120px ${C.coral}77` }}>
            <Img src={staticFile("logo-dark.svg")} style={{ width: 92 }} />
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 70, color: C.white, letterSpacing: -2 }}>TEK PLATFORM</div>
          </div>
        </div>
      )}
      <Ring at={mergeAt} x={540} y={seam - 20} col={C.white} size={1500} />
      <Burst at={mergeAt + 2} x={540} y={seam - 20} cols={[C.cyan, C.coral, C.amber, C.white]} n={34} spread={560} seed={5} />
    </AbsoluteFill>
  );
};

/* ───── Sahne 3: manifesto kinetik tipografi ───── */

const ManiRow: React.FC<{ big: string; small: string; at: number; tone: Tone; top: number; idx: string; allAt: number }> = ({ big, small, at, tone, top, idx, allAt }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f - at;
  if (t < 0) return null;
  const s = spring({ frame: t, fps, config: { damping: 14, stiffness: 160, mass: 0.8 } });
  const reveal = ramp(t, 0, 12, 0, 1, Easing.out(Easing.exp));
  const typed = Math.floor(ramp(t, 8, 22, 0, small.length, Easing.linear));
  const line = ramp(t, 6, 24, 0, 1, Easing.out(Easing.cubic));
  const active = f >= allAt || t < 46;
  const dim = active ? 1 : 0.4;
  const flash = f >= allAt ? Math.max(0, 1 - (f - allAt) / 14) : 0;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", flexDirection: "column", alignItems: "center", opacity: dim, transform: `scale(${0.92 + 0.08 * s + flash * 0.05})` }}>
      <div style={{ fontFamily: FONT_SANS, fontWeight: 700, fontSize: 26, color: tcol(tone), letterSpacing: 8, opacity: reveal }}>{idx}</div>
      <div style={{ overflow: "hidden", paddingBottom: 14 }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 150, lineHeight: 1, letterSpacing: -5, ...gradText(grad(tone)), transform: `translateY(${(1 - reveal) * 170}px) skewY(${(1 - s) * 8}deg)`, paddingBottom: 10, filter: `drop-shadow(0 0 ${30 * flash}px ${tcol(tone)})` }}>{big}</div>
      </div>
      <div style={{ width: 640 * line, height: 6, borderRadius: 3, background: grad(tone), boxShadow: `0 0 20px ${tcol(tone)}`, marginTop: -6 }} />
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 76, color: C.white, letterSpacing: 10 - 8 * s, marginTop: 10, minHeight: 80 }}>
        {small.slice(0, typed)}
        <span style={{ color: tcol(tone), opacity: typed < small.length ? 1 : 0 }}>|</span>
      </div>
    </div>
  );
};

export const ManifestoScene: React.FC<{ ats?: [number, number, number]; allAt?: number }> = ({ ats = [5, 50, 92], allAt = 128 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Bg tone="feather" intensity={0.8} />
      <Rays col={C.ice} op={0.35} />
      <ManiRow big="Yapay zekâ" small="destekli" at={ats[0]} tone="brand" top={300} idx="01" allAt={allAt} />
      <ManiRow big="Öğretmen" small="odaklı" at={ats[1]} tone="feather" top={660} idx="02" allAt={allAt} />
      <ManiRow big="Öğrenci" small="merkezli" at={ats[2]} tone="amber" top={1020} idx="03" allAt={allAt} />
      <Ring at={allAt} x={540} y={SAFE.eye} col={C.white} size={1600} dur={30} />
      <AbsoluteFill style={{ background: "white", opacity: f >= allAt ? Math.max(0, 0.35 - (f - allAt) * 0.05) : 0 }} />
    </AbsoluteFill>
  );
};

/* ══════════════════════════════════════════════════════════════
   OGRENCI6 — seviye tespiti
   ══════════════════════════════════════════════════════════════ */

const QS = [
  { s: "Matematik", c: C.blue, q: "2x + 6 = 18 ise x kaçtır?", o: ["4", "5", "6", "7"], a: 2 },
  { s: "Fen", c: C.green, q: "Fotosentez bitkinin hangi organelinde gerçekleşir?", o: ["Mitokondri", "Kloroplast", "Ribozom", "Çekirdek"], a: 1 },
  { s: "Türkçe", c: C.coral, q: "Hangisi bir sıfattır?", o: ["koşmak", "mavi", "hızla", "ve"], a: 1 },
  { s: "İngilizce", c: "#db2777", q: "\"Book\" kelimesinin anlamı nedir?", o: ["kalem", "kitap", "masa", "defter"], a: 1 },
  { s: "Sosyal", c: C.amber, q: "Türkiye'nin başkenti neresidir?", o: ["İstanbul", "Ankara", "İzmir", "Bursa"], a: 1 },
  { s: "Matematik", c: C.blue, q: "15 sayısının %20'si kaçtır?", o: ["2", "3", "4", "5"], a: 1 },
  { s: "Fen", c: C.green, q: "Sesin en hızlı yayıldığı ortam hangisidir?", o: ["Hava", "Su", "Katı", "Boşluk"], a: 2 },
];

const QCard: React.FC<{ q: (typeof QS)[number]; t: number; per: number; n: number }> = ({ q, t, per, n }) => {
  const { fps } = useVideoConfig();
  const sIn = spring({ frame: t, fps, config: { damping: 15, stiffness: 220, mass: 0.6 } });
  const out = ramp(t, per - 6, per + 4, 0, 1, Easing.in(Easing.cubic));
  const picked = t >= per * 0.5;
  const tap = picked ? spring({ frame: t - per * 0.5, fps, config: { damping: 8, stiffness: 300 } }) : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: 30,
        right: 30,
        top: 0,
        ...card,
        padding: 28,
        transform: `translateX(${(1 - sIn) * 620 - out * 700}px) rotate(${(1 - sIn) * 8 - out * 10}deg)`,
        opacity: 1 - out * 0.6,
        filter: `blur(${out * 6}px)`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ padding: "6px 16px", borderRadius: 99, background: `${q.c}1f`, color: q.c, fontSize: 22, fontWeight: 700 }}>{q.s}</span>
        <span style={{ fontSize: 22, color: C.inkMuted, fontWeight: 600 }}>Soru {n}</span>
      </div>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 36, color: C.ink, marginTop: 18, lineHeight: 1.18, minHeight: 86 }}>{q.q}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 18 }}>
        {q.o.map((o, i) => {
          const on = picked && i === q.a;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 18px", borderRadius: 18, border: `2px solid ${on ? C.blue : C.line}`, background: on ? `${C.blue}14` : "#fff", transform: `scale(${on ? 1 + 0.05 * (1 - tap) : 1})` }}>
              <span style={{ width: 42, height: 42, borderRadius: 21, display: "flex", alignItems: "center", justifyContent: "center", background: on ? C.blue : "#f1edf3", color: on ? "#fff" : C.inkMuted, fontWeight: 700, fontSize: 22 }}>{"ABCD"[i]}</span>
              <span style={{ fontSize: 28, fontWeight: 600, color: C.ink }}>{o}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const QuizFlow: React.FC<{ start?: number; per?: number }> = ({ start = 8, per = 22 }) => {
  const f = useCurrentFrame();
  const t = f - start;
  const idx = Math.max(0, Math.min(QS.length - 1, Math.floor(t / per)));
  const n = 7 + idx;
  const prog = ramp(f, start, start + per * QS.length, 6 / 40, 13 / 40, Easing.linear);
  const sec = Math.max(0, 1500 - Math.floor(f * 1.2));
  const ringP = (f % per) / per;
  return (
    <div>
      <AppBar
        title="Seviye Tespit"
        sub="Tüm dersler · karma test"
        right={
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 18px", borderRadius: 99, background: `${C.coral}18`, color: C.coral, fontWeight: 700, fontSize: 24, fontVariantNumeric: "tabular-nums" }}>
            <svg width="30" height="30" viewBox="0 0 30 30"><circle cx="15" cy="15" r="11" stroke={`${C.coral}44`} strokeWidth="4" fill="none" /><circle cx="15" cy="15" r="11" stroke={C.coral} strokeWidth="4" fill="none" strokeDasharray={69} strokeDashoffset={69 * ringP} transform="rotate(-90 15 15)" /></svg>
            {Math.floor(sec / 60)}:{String(sec % 60).padStart(2, "0")}
          </div>
        }
      />
      <div style={{ padding: "0 34px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: C.inkMuted, fontWeight: 600, marginBottom: 10 }}>
          <span>İlerleme</span>
          <span style={{ color: C.blue, fontWeight: 700 }}>{n} / 40</span>
        </div>
        <div style={{ height: 14, borderRadius: 7, background: C.line, overflow: "hidden" }}>
          <div style={{ width: `${prog * 100}%`, height: "100%", borderRadius: 7, background: GRAD_BRAND, boxShadow: `0 0 12px ${C.sky}` }} />
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} style={{ flex: 1, height: 8, borderRadius: 4, background: i < 3 + idx ? C.blue : i === 3 + idx ? C.cyan : C.line }} />
          ))}
        </div>
      </div>
      <div style={{ position: "relative", height: 560, marginTop: 30 }}>
        {/* arkadaki kart: derinlik */}
        <div style={{ position: "absolute", left: 54, right: 54, top: 26, height: 500, ...card, opacity: 0.6, transform: "scale(0.96)" }} />
        {QS.map((q, i) => {
          const lt = t - i * per;
          if (lt < -2 || lt > per + 6) return null;
          return <QCard key={i} q={q} t={lt} per={per} n={7 + i} />;
        })}
      </div>
      <div style={{ margin: "10px 34px 0", height: 80, borderRadius: 24, background: GRAD_BRAND, display: "flex", alignItems: "center", justifyContent: "center", color: C.navy, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 32, transform: `scale(${1 - 0.04 * Math.max(0, 1 - ((t % per) - per * 0.5 - 4) / 5) * ((t % per) > per * 0.5 + 4 ? 1 : 0)})` }}>
        Sonraki soru →
      </div>
    </div>
  );
};

const LEVELS = [
  { n: "Türkçe", v: 84, c: C.coral },
  { n: "Matematik", v: 62, c: C.blue },
  { n: "Fen Bilimleri", v: 47, c: C.green },
  { n: "Sosyal", v: 71, c: C.amber },
  { n: "İngilizce", v: 78, c: "#db2777" },
];
const lvl = (v: number) => (v >= 75 ? { t: "İleri", c: C.green } : v >= 55 ? { t: "Orta", c: C.amber } : { t: "Gelişmeli", c: C.red });

const Tag: React.FC<{ text: string; good: boolean; at: number }> = ({ text, good, at }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < at) return null;
  const s = spring({ frame: f - at, fps, config: { damping: 9, stiffness: 260 } });
  const col = good ? C.green : C.coral;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 99, background: `${col}1c`, border: `2px solid ${col}`, color: good ? "#15803d" : "#c2410c", fontWeight: 700, fontSize: 24, transform: `scale(${s}) rotate(${(1 - s) * -14}deg)`, boxShadow: `0 6px 16px ${col}33` }}>
      {good ? "▲" : "▼"} {text}
    </div>
  );
};

export const LevelReport: React.FC = () => {
  const f = useCurrentFrame();
  const ov = ramp(f, 6, 50, 0, 68, Easing.out(Easing.cubic));
  const r = 52;
  const L = 2 * Math.PI * r;
  return (
    <div>
      <AppBar title="Seviye Raporu" sub="Elif K. · Seviye tespit sonucu" />
      <div style={{ margin: "0 30px", ...card, padding: "16px 24px", display: "flex", alignItems: "center", gap: 24 }}>
        <svg width={110} height={110} viewBox="0 0 130 130">
          <circle cx="65" cy="65" r={r} stroke={C.line} strokeWidth={14} fill="none" />
          <circle cx="65" cy="65" r={r} stroke="url(#g6)" strokeWidth={14} fill="none" strokeDasharray={L} strokeDashoffset={L * (1 - ov / 100)} strokeLinecap="round" transform="rotate(-90 65 65)" />
          <defs><linearGradient id="g6" x1="0" x2="1"><stop offset="0" stopColor={C.cyan} /><stop offset="1" stopColor={C.blue} /></linearGradient></defs>
          <text x="65" y="76" textAnchor="middle" fontFamily={FONT_DISPLAY} fontWeight={800} fontSize={36} fill={C.ink}>{Math.round(ov)}</text>
        </svg>
        <div>
          <div style={{ fontSize: 22, color: C.inkMuted, fontWeight: 600 }}>Genel seviye</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 46, color: C.ink }}>Orta-İleri</div>
          <div style={{ fontSize: 20, color: C.blue, fontWeight: 700 }}>5 ders · soru soru analiz</div>
        </div>
      </div>
      <div style={{ margin: "18px 30px 0", ...card, padding: "20px 26px" }}>
        {LEVELS.map((d, i) => {
          const p = ramp(f, 14 + i * 7, 48 + i * 7, 0, 1, Easing.out(Easing.cubic));
          const l = lvl(d.v);
          const tagS = spring({ frame: f - 48 - i * 7, fps: 30, config: { damping: 10, stiffness: 240 } });
          return (
            <div key={d.n} style={{ marginBottom: i < LEVELS.length - 1 ? 10 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 24, fontWeight: 700, color: C.ink, marginBottom: 5 }}>
                <span>{d.n}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 19, padding: "3px 12px", borderRadius: 99, background: `${l.c}22`, color: l.c, transform: `scale(${tagS})`, display: "inline-block" }}>{l.t}</span>
                  <span style={{ fontVariantNumeric: "tabular-nums", width: 44, textAlign: "right" }}>{Math.round(d.v * p)}</span>
                </span>
              </div>
              <div style={{ height: 13, borderRadius: 7, background: "#f1edf3", overflow: "hidden" }}>
                <div style={{ width: `${d.v * p}%`, height: "100%", borderRadius: 8, background: `linear-gradient(90deg, ${d.c}99, ${d.c})`, boxShadow: `0 0 10px ${d.c}66` }} />
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ margin: "18px 30px 0" }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: C.inkMuted, marginBottom: 10 }}>GÜÇLÜ KONULAR</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <Tag text="Paragraf" good at={78} />
          <Tag text="Kümeler" good at={84} />
          <Tag text="Present Tense" good at={90} />
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: C.inkMuted, margin: "16px 0 10px" }}>ZAYIF KONULAR</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <Tag text="Fonksiyonlar" good={false} at={98} />
          <Tag text="Basınç" good={false} at={104} />
          <Tag text="Asit ve Bazlar" good={false} at={116} />
        </div>
      </div>
    </div>
  );
};

const PLAN = [
  { d: "Pzt", t: "Fonksiyonlar", k: "Video ders", m: "25 dk", c: C.blue, ic: "play" },
  { d: "Sal", t: "Basınç", k: "Yapay zekâ soru seti", m: "20 soru", c: C.green, ic: "spark" },
  { d: "Çar", t: "Asit ve Bazlar", k: "Doküman", m: "15 dk", c: "#7c3aed", ic: "doc" },
  { d: "Per", t: "Fonksiyonlar", k: "Konu testi", m: "15 soru", c: C.blue, ic: "exam" },
  { d: "Cum", t: "Genel tekrar", k: "Deneme", m: "Karma", c: C.coral, ic: "exam" },
];

export const StudyPlan: React.FC<{ buildAt?: number }> = ({ buildAt = 26 }) => {
  const f = useCurrentFrame();
  const gen = ramp(f, 2, buildAt, 0, 1, Easing.inOut(Easing.cubic));
  const built = f >= buildAt;
  const prog = ramp(f, buildAt + 50, buildAt + 80, 0, 20, Easing.out(Easing.cubic));
  const ic = (k: string, col: string) => (k === "play" ? <IPlay size={26} col={col} /> : k === "spark" ? <ISpark size={28} col={col} /> : k === "doc" ? <IDoc size={28} col={col} /> : <IExam size={28} col={col} />);
  return (
    <div>
      <AppBar title="Çalışma Planım" sub="Sana özel · haftalık" right={<span style={{ padding: "8px 16px", borderRadius: 99, background: `${C.blue}18`, color: C.blue, fontWeight: 700, fontSize: 21 }}>Hedef: TYT</span>} />
      <div style={{ display: "flex", gap: 8, padding: "0 30px" }}>
        {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((d, i) => {
          const on = built && Math.floor(ramp(f, buildAt, buildAt + 40, 0, 5, Easing.linear)) === i;
          return (
            <div key={d} style={{ flex: 1, height: 74, borderRadius: 18, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: on ? GRAD_BRAND : C.surface, border: `1.5px solid ${C.line}`, color: on ? C.navy : C.ink, fontWeight: 700, fontSize: 20 }}>
              {d}
              <span style={{ width: 8, height: 8, borderRadius: 4, marginTop: 6, background: i < 5 && built ? (on ? C.navy : C.blue) : C.line }} />
            </div>
          );
        })}
      </div>
      {!built || f < buildAt + 6 ? (
        <div style={{ margin: "26px 30px 0", ...card, padding: 26, opacity: built ? 1 - ramp(f, buildAt, buildAt + 6) : 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontWeight: 700, fontSize: 26, color: C.ink }}>
            <div style={{ transform: `rotate(${f * 12}deg) scale(${1 + Math.sin(f / 3) * 0.1})` }}><ISpark size={36} col={C.blue} /></div>
            Plan oluşturuluyor…
          </div>
          <div style={{ height: 12, borderRadius: 6, background: C.line, marginTop: 18, overflow: "hidden" }}>
            <div style={{ width: `${gen * 100}%`, height: "100%", background: GRAD_BRAND }} />
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
            {["Seviye raporu", "Zayıf konular", "Hedef"].map((x, i) => (
              <span key={x} style={{ padding: "6px 14px", borderRadius: 99, background: f > 4 + i * 6 ? `${C.blue}18` : "#f1edf3", color: f > 4 + i * 6 ? C.blue : C.inkMuted, fontSize: 19, fontWeight: 700 }}>{f > 4 + i * 6 ? "✓ " : ""}{x}</span>
            ))}
          </div>
        </div>
      ) : null}
      <div style={{ position: "relative", marginTop: built ? 20 : 0 }}>
        {built &&
          PLAN.map((p, i) => {
            const s = spring({ frame: f - buildAt - i * 5, fps: 30, config: { damping: 14, stiffness: 200 } });
            const done = i === 0 && f > buildAt + 46;
            const ds = done ? spring({ frame: f - buildAt - 46, fps: 30, config: { damping: 8, stiffness: 280 } }) : 0;
            return (
              <div key={i} style={{ margin: "0 30px 12px", ...card, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, transform: `translateX(${(1 - s) * 500}px)`, opacity: s, borderLeft: `8px solid ${p.c}` }}>
                <div style={{ width: 54, fontWeight: 800, fontSize: 22, color: C.inkMuted }}>{p.d}</div>
                <div style={{ width: 54, height: 54, borderRadius: 16, background: `${p.c}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>{ic(p.ic, p.c)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 26, color: C.ink, textDecoration: done ? "line-through" : undefined }}>{p.t}</div>
                  <div style={{ fontSize: 19, color: C.inkMuted }}>{p.k} · {p.m}</div>
                </div>
                <div style={{ width: 44, height: 44, borderRadius: 14, border: `2.5px solid ${done ? C.green : C.line}`, background: done ? C.green : "#fff", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${done ? 0.7 + 0.3 * ds : 1})` }}>
                  {done && <ICheck size={28} />}
                </div>
              </div>
            );
          })}
        {built && (
          <div style={{ margin: "4px 30px 0", display: "flex", alignItems: "center", gap: 14, fontWeight: 700, fontSize: 22, color: C.ink }}>
            İlerleme
            <div style={{ flex: 1, height: 14, borderRadius: 7, background: C.line, overflow: "hidden" }}>
              <div style={{ width: `${prog}%`, height: "100%", background: `linear-gradient(90deg, ${C.green}, #4ade80)` }} />
            </div>
            <span style={{ color: C.green }}>%{Math.round(prog)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   OGRENCI7 — ilk 3 gün her şey açık
   ══════════════════════════════════════════════════════════════ */

/** HookCounter üstüne "GÜN" etiketi + açılan kilit */
export const DayOverlay: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 9, stiffness: 200 } });
  const open = ramp(f, 10, 20, 0, 1, Easing.out(Easing.back(2)));
  const lockS = spring({ frame: f - 20, fps, config: { damping: 8, stiffness: 260 } });
  const lockCol = f >= 20 ? C.green : C.ice;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 640,
          top: 800,
          padding: "6px 34px 12px",
          borderRadius: 30,
          background: GRAD_BRAND,
          color: C.navy,
          fontFamily: FONT_DISPLAY,
          fontWeight: 800,
          fontSize: 130,
          lineHeight: 1,
          letterSpacing: -4,
          transform: `rotate(${-8 + (1 - s) * -18}deg) scale(${1.25 - 0.25 * s})`,
          boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 60px ${C.cyan}88`,
          transformOrigin: "left center",
        }}
      >
        GÜN
      </div>
      <div style={{ position: "absolute", left: 230, top: 590, transform: `rotate(-14deg) scale(${f >= 20 ? 1 + 0.25 * (1 - lockS) : 1})`, filter: `drop-shadow(0 0 ${f >= 20 ? 30 : 10}px ${lockCol})` }}>
        <ILock size={130} col={lockCol} open={open} />
      </div>
      <Ring at={20} x={295} y={660} col={C.green} size={600} dur={20} />
      <Burst at={20} x={295} y={660} cols={[C.green, C.amber, C.white]} n={20} spread={260} seed={11} />
    </AbsoluteFill>
  );
};

const CONTENT = [
  { t: "Video Dersler", icon: (c: string) => <IPlay size={52} col={c} />, g: `linear-gradient(135deg, ${C.blue}, ${C.plum})` },
  { t: "Dokümanlar", icon: (c: string) => <IDoc size={56} col={c} />, g: `linear-gradient(135deg, #7c3aed, ${C.magenta})` },
  { t: "Yapay Zekâ\nSoru Seti", icon: (c: string) => <ISpark size={56} col={c} />, g: `linear-gradient(135deg, ${C.sky}, ${C.green})` },
  { t: "Denemeler", icon: (c: string) => <IExam size={56} col={c} />, g: `linear-gradient(135deg, ${C.amber}, ${C.coral})` },
];

const LockCard: React.FC<{ i: number; at: number }> = ({ i, at }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = CONTENT[i];
  const t = f - at;
  const wob = t >= -8 && t < 0 ? Math.sin(t * 3) * 8 * (1 + t / 8 + 1) : 0;
  const open = ramp(t, 0, 8, 0, 1, Easing.out(Easing.back(2.5)));
  const fade = ramp(t, 10, 18);
  const u = ramp(t, 4, 16);
  const stamp = t >= 12 ? spring({ frame: t - 12, fps, config: { damping: 8, stiffness: 300 } }) : 0;
  return (
    <div style={{ position: "relative", height: 300, borderRadius: 28, overflow: "hidden", background: c.g, boxShadow: u > 0.5 ? `0 14px 40px rgba(0,0,0,0.2), 0 0 0 4px ${C.green}` : "0 10px 30px rgba(43,36,64,0.15)" }}>
      <div style={{ position: "absolute", inset: 0, filter: `grayscale(${1 - u}) blur(${(1 - u) * 5}px)`, opacity: 0.55 + 0.45 * u, padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ width: 84, height: 84, borderRadius: 24, background: "rgba(255,255,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center" }}>{c.icon("#fff")}</div>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 34, color: "#fff", lineHeight: 1.05, whiteSpace: "pre-line" }}>{c.t}</div>
      </div>
      {/* kilit örtüsü */}
      <div style={{ position: "absolute", inset: 0, background: `rgba(9,2,84,${0.55 * (1 - fade)})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: `rotate(${wob}deg) scale(${1 + 0.3 * fade}) translateY(${-fade * 30}px)`, opacity: 1 - fade }}>
          <ILock size={96} col={open > 0.5 ? C.green : "#fff"} open={open} />
        </div>
      </div>
      <div style={{ position: "absolute", right: 16, top: 16, padding: "6px 14px", borderRadius: 99, fontWeight: 800, fontSize: 20, background: t >= 12 ? C.green : "rgba(0,0,0,0.35)", color: "#fff", transform: `scale(${t >= 12 ? 0.6 + 0.4 * stamp : 1}) rotate(${t >= 12 ? (1 - stamp) * 20 : 0}deg)` }}>
        {t >= 12 ? "AÇIK" : "Ücretli"}
      </div>
      {t > 0 && t < 22 && <div style={{ position: "absolute", top: 0, bottom: 0, left: -200 + t * 50, width: 120, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)", transform: "skewX(-20deg)" }} />}
    </div>
  );
};

export const UnlockGrid: React.FC<{ ats?: number[] }> = ({ ats = [16, 42, 70, 100] }) => {
  const f = useCurrentFrame();
  const opened = ats.filter((a) => f >= a + 12).length;
  const all = ats[3] + 16;
  const s = spring({ frame: f - all, fps: 30, config: { damping: 10, stiffness: 220 } });
  return (
    <div style={{ position: "relative" }}>
      <AppBar title="Kütüphane" sub="Elif K. · yeni öğrenci" accent={C.amber} />
      <div style={{ margin: "0 30px 18px", borderRadius: 24, padding: "18px 22px", background: `linear-gradient(100deg, ${C.amber}, ${C.coral})`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 28 }}>Deneme süren aktif</div>
          <div style={{ fontSize: 20, opacity: 0.9 }}>Tüm ücretli içerikler açık</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[0, 1, 2].map((d) => (
            <div key={d} style={{ width: 46, height: 46, borderRadius: 14, background: "rgba(255,255,255,0.95)", color: C.coral, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${spring({ frame: f - 4 - d * 4, fps: 30, config: { damping: 9 } })})` }}>{d + 1}</div>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, padding: "0 30px" }}>
        {CONTENT.map((_, i) => <LockCard key={i} i={i} at={ats[i]} />)}
      </div>
      <div style={{ margin: "20px 30px 0", ...card, padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", transform: f >= all ? `scale(${0.9 + 0.1 * s})` : undefined, border: f >= all ? `2.5px solid ${C.green}` : card.border }}>
        <span style={{ fontWeight: 700, fontSize: 26, color: C.ink }}>Açılan içerik</span>
        <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 40, color: opened === 4 ? C.green : C.ink }}>{opened} / 4</span>
      </div>
      <Burst at={all} x={304} y={560} cols={[C.green, C.amber, C.coral, C.cyan]} n={36} spread={420} seed={21} />
    </div>
  );
};

/* ───── paketler yelpazesi ───── */

const PKG = [
  { n: "Keşif", tone: "brand" as Tone, icon: <ICompass size={92} col="#fff" /> },
  { n: "Uzman", tone: "amber" as Tone, icon: <IStar size={92} col="#fff" /> },
  { n: "Şampiyon", tone: "feather" as Tone, icon: <ITrophy size={92} col="#fff" /> },
];

export const PackageFan: React.FC<{ fanAt?: number; hl?: number[]; subAt?: number }> = ({ fanAt = 10, hl = [22, 40, 60], subAt = 82 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fan = spring({ frame: f - fanAt, fps, config: { damping: 12, stiffness: 110, mass: 0.9 } });
  const enter = spring({ frame: f, fps, config: { damping: 14, stiffness: 160 } });
  const cx = 525;
  return (
    <AbsoluteFill>
      <Bg tone="amber" />
      <Rays col={C.amber} y={900} op={0.4} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: SAFE.top + 40 }}>
        <Chip tone="amber">PAKETLER</Chip>
        <div style={{ marginTop: 26 }}>
          <Words text="Sonra *paketini* seç" delay={3} size={88} tone="amber" stagger={3} />
        </div>
      </AbsoluteFill>
      {PKG.map((p, i) => {
        const k = i - 1;
        const rot = k * 11 * fan;
        const tx = k * 225 * fan;
        const hs = f >= hl[i] ? spring({ frame: f - hl[i], fps, config: { damping: 10, stiffness: 200 } }) : 0;
        const fadeHl = f >= hl[i] + 18 && i < 2 ? ramp(f, hl[i] + 18, hl[i] + 30, 1, 0.35) : 1;
        const lift = hs * fadeHl;
        const col = tcol(p.tone);
        const shine = ((f - hl[i]) * 28) % 900;
        return (
          <div
            key={p.n}
            style={{
              position: "absolute",
              left: cx - 150,
              top: 640,
              width: 300,
              height: 470,
              transformOrigin: "50% 130%",
              transform: `translateX(${tx}px) translateY(${(1 - enter) * 900 - lift * 60}px) rotate(${rot}deg) scale(${1 + lift * 0.08})`,
              zIndex: i === 1 ? 3 : 2,
            }}
          >
            <div style={{ width: "100%", height: "100%", borderRadius: 40, padding: 30, boxSizing: "border-box", background: `linear-gradient(165deg, ${C.deep}, ${C.night})`, border: `3px solid ${col}`, boxShadow: `0 30px 70px rgba(0,0,0,0.55), 0 0 ${30 + lift * 70}px ${col}${lift > 0.3 ? "aa" : "44"}`, overflow: "hidden", position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ position: "absolute", right: -60, bottom: -60, opacity: 0.12, transform: "scale(3.2)" }}>{p.icon}</div>
              <div style={{ width: 150, height: 150, borderRadius: 44, background: grad(p.tone), display: "flex", alignItems: "center", justifyContent: "center", marginTop: 30, boxShadow: `0 14px 40px ${col}77` }}>{p.icon}</div>
              <div style={{ fontFamily: FONT_SANS, fontWeight: 700, fontSize: 24, letterSpacing: 6, color: col, marginTop: 44 }}>PAKET</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: p.n.length > 6 ? 50 : 66, color: C.white, letterSpacing: -2, marginTop: 4 }}>{p.n}</div>
              <div style={{ display: "flex", gap: 8, marginTop: 22 }}>
                {[0, 1, 2].map((j) => (
                  <div key={j} style={{ width: 14, height: 14, borderRadius: 7, background: j <= i ? col : "rgba(255,255,255,0.18)", boxShadow: j <= i ? `0 0 10px ${col}` : undefined }} />
                ))}
              </div>
              {f >= hl[i] && <div style={{ position: "absolute", top: -100, bottom: -100, left: -200 + shine, width: 110, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)", transform: "rotate(20deg)" }} />}
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1270, display: "flex", justifyContent: "center", paddingRight: 60 }}>
        <Words text="Hedefine *uygun* olanı" delay={subAt} size={60} tone="amber" stagger={3} />
      </div>
    </AbsoluteFill>
  );
};

/* ───── ücretsiz paket önizleme ───── */

const DOCS = ["Türev Özet Föyü", "Paragraf Taktikleri", "Optik Formül Kartı", "Hücre Bölünmesi Notu", "Kronoloji Tablosu"];

export const FreePreview: React.FC<{ vFrom?: number; vTo?: number; docAt?: number }> = ({ vFrom = 8, vTo = 96, docAt = 104 }) => {
  const f = useCurrentFrame();
  const p = ramp(f, vFrom, vTo, 0, 1, Easing.linear);
  const secs = Math.round(p * 60);
  const end = f >= vTo;
  const es = end ? spring({ frame: f - vTo, fps: 30, config: { damping: 9, stiffness: 240 } }) : 0;
  const nOpen = DOCS.filter((_, i) => f >= docAt + i * 10 + 6).length;
  return (
    <div>
      <AppBar title="Ücretsiz Paket" sub="Elif K. · senin paketin" accent={C.green} right={<span style={{ padding: "8px 16px", borderRadius: 99, background: `${C.green}1c`, color: "#15803d", fontWeight: 700, fontSize: 21 }}>Aktif</span>} />
      <div style={{ margin: "0 30px", borderRadius: 26, overflow: "hidden", position: "relative", height: 320, background: `linear-gradient(135deg, ${C.blue}, ${C.plum} 70%, ${C.magenta})`, boxShadow: "0 14px 40px rgba(25,97,230,0.3)" }}>
        <div style={{ position: "absolute", left: 24, top: 22, display: "flex", gap: 10 }}>
          <span style={{ padding: "6px 14px", borderRadius: 99, background: C.amber, color: C.navy, fontWeight: 800, fontSize: 19 }}>ÜCRETLİ VİDEO</span>
          <span style={{ padding: "6px 14px", borderRadius: 99, background: "rgba(255,255,255,0.25)", color: "#fff", fontWeight: 800, fontSize: 19 }}>ÖNİZLEME</span>
        </div>
        <div style={{ position: "absolute", left: 24, top: 80, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 44, color: "#fff", lineHeight: 1.05 }}>Türev<br /><span style={{ fontSize: 28, fontWeight: 600, opacity: 0.85 }}>Ders 3 · Türev kuralları</span></div>
        {/* tahta çizimi */}
        <svg style={{ position: "absolute", right: 24, top: 80 }} width="210" height="150" viewBox="0 0 210 150">
          <path d="M10 140 Q 70 140 105 75 T 200 10" stroke="#fff" strokeWidth="5" fill="none" strokeDasharray="300" strokeDashoffset={300 * (1 - ramp(f, vFrom, vFrom + 50))} strokeLinecap="round" />
          <line x1="10" y1="140" x2="205" y2="140" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
          <line x1="10" y1="140" x2="10" y2="5" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
        </svg>
        <div style={{ position: "absolute", left: 24, right: 24, bottom: 24, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: 26, background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {end ? <div style={{ display: "flex", gap: 6 }}><div style={{ width: 7, height: 22, background: "#fff", borderRadius: 2 }} /><div style={{ width: 7, height: 22, background: "#fff", borderRadius: 2 }} /></div> : <IPlay size={26} />}
          </div>
          <div style={{ flex: 1, height: 12, borderRadius: 6, background: "rgba(255,255,255,0.25)", position: "relative" }}>
            <div style={{ width: `${p * 100}%`, height: "100%", borderRadius: 6, background: C.amber, boxShadow: `0 0 14px ${C.amber}` }} />
            <div style={{ position: "absolute", left: `calc(${p * 100}% - 11px)`, top: -5, width: 22, height: 22, borderRadius: 11, background: "#fff" }} />
          </div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 24, fontVariantNumeric: "tabular-nums" }}>{Math.floor(secs / 60)}:{String(secs % 60).padStart(2, "0")} / 1:00</div>
        </div>
        {end && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(9,2,84,0.55)", display: "flex", alignItems: "center", justifyContent: "center", opacity: es }}>
            <div style={{ padding: "16px 30px", borderRadius: 20, background: "#fff", color: C.navy, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 34, transform: `scale(${es})` }}>1 dk önizleme izlendi ✓</div>
          </div>
        )}
      </div>
      <div style={{ margin: "22px 30px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 30, color: C.ink }}>Ücretli dokümanlar</span>
        <span style={{ padding: "6px 16px", borderRadius: 99, background: nOpen === 5 ? C.green : `${C.green}1c`, color: nOpen === 5 ? "#fff" : "#15803d", fontWeight: 800, fontSize: 24 }}>{nOpen} / 5 açık</span>
      </div>
      {DOCS.map((d, i) => {
        const at = docAt + i * 10;
        const s = spring({ frame: f - at, fps: 30, config: { damping: 14, stiffness: 220 } });
        const ok = f >= at + 6;
        const ks = ok ? spring({ frame: f - at - 6, fps: 30, config: { damping: 8, stiffness: 300 } }) : 0;
        return (
          <div key={d} style={{ margin: "0 30px 10px", ...card, padding: "12px 18px", display: "flex", alignItems: "center", gap: 16, transform: `translateY(${(1 - s) * 80}px)`, opacity: f < at ? 0.25 : s }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "#7c3aed18", display: "flex", alignItems: "center", justifyContent: "center" }}><IDoc size={28} col="#7c3aed" /></div>
            <div style={{ flex: 1, fontWeight: 700, fontSize: 24, color: C.ink }}>{d}</div>
            <div style={{ padding: "5px 14px", borderRadius: 99, fontWeight: 800, fontSize: 18, background: ok ? C.green : "#f1edf3", color: ok ? "#fff" : C.inkMuted, transform: `scale(${ok ? 0.7 + 0.3 * ks : 1})` }}>{ok ? "✓ Açık" : "Ücretli"}</div>
          </div>
        );
      })}
    </div>
  );
};

