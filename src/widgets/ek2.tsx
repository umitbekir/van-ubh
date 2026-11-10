import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Bg, Chip, ramp, SAFE, Words } from "../kit";
import type { Tone } from "../kit";
import { C, FONT_DISPLAY, FONT_SANS, GRAD_BRAND, GRAD_FEATHER } from "../theme";

/* ───────────── ek2 ortak yardımcılar ───────────── */

const useSpr = (delay: number, cfg: Partial<{ damping: number; stiffness: number; mass: number }> = {}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: { damping: 14, stiffness: 170, mass: 0.7, ...cfg } });
};

/** Telefon içi üst başlık çubuğu */
const AppBar: React.FC<{ title: string; sub?: string; accent?: string }> = ({ title, sub, accent = C.blue }) => {
  const s = useSpr(6);
  return (
    <div style={{ padding: "10px 32px 18px", display: "flex", alignItems: "center", gap: 18, opacity: s, transform: `translateY(${(1 - s) * -30}px)` }}>
      <div style={{ width: 58, height: 58, borderRadius: 18, background: `linear-gradient(135deg, ${accent}, ${C.navy})`, display: "flex", alignItems: "center", justifyContent: "center", color: C.white, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 30 }}>V</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 34, color: C.ink, lineHeight: 1.05 }}>{title}</div>
        {sub && <div style={{ fontSize: 22, color: C.inkMuted, marginTop: 4 }}>{sub}</div>}
      </div>
    </div>
  );
};

/** Üzerinden geçen parlama şeridi */
const Sheen: React.FC<{ at: number; dur?: number; op?: number; width?: number }> = ({ at, dur = 22, op = 0.85, width = 120 }) => {
  const f = useCurrentFrame();
  const p = ramp(f, at, at + dur, 0, 1, Easing.inOut(Easing.cubic));
  if (f < at || f > at + dur) return null;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: "inherit", pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: -60,
          bottom: -60,
          left: `${-30 + p * 160}%`,
          width,
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.95), transparent)",
          transform: "rotate(20deg)",
          opacity: op,
        }}
      />
    </div>
  );
};

const Tag: React.FC<{ children: React.ReactNode; col?: string; style?: React.CSSProperties }> = ({ children, col = C.inkMuted, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999, border: `2px dashed ${col}88`, color: col, fontSize: 20, fontWeight: 600, ...style }}>
    {children}
  </div>
);

const fmt = (n: number, dec = 0) => n.toLocaleString("tr-TR", { minimumFractionDigits: dec, maximumFractionDigits: dec });

/* ═════════════ Ogretmen6 — Vitrin ═════════════ */

const TEACHERS = [
  { n: "Deniz A.", b: "Fizik", c: "#7c9cf5" },
  { n: "Mert Y.", b: "Kimya", c: "#8bd3b8" },
  { n: "Selin T.", b: "Türkçe", c: "#f2a0c4" },
  { n: "Burak E.", b: "Tarih", c: "#c6b28a" },
];

/** Öğretmen listesi: senin kartın arka sıradan en öne kayar, VİTRİN rozeti parlar */
export const VitrinList: React.FC = () => {
  const f = useCurrentFrame();
  const move = useSpr(34, { damping: 16, stiffness: 90, mass: 1 });
  const badge = useSpr(78, { damping: 9, stiffness: 220 });
  const ROW = 150;
  const heroY = interpolate(move, [0, 1], [4 * ROW, 0]);
  const glow = f > 78 ? 0.55 + 0.45 * Math.sin((f - 78) / 7) : 0;
  const views = Math.round(ramp(f, 90, 160, 0, 1, Easing.out(Easing.quad)) * 1240);
  return (
    <div>
      <AppBar title="Öğretmenler" sub="Matematik · LGS / TYT" />
      <div style={{ margin: "0 32px 18px", display: "flex", gap: 10 }}>
        {["Tümü", "Matematik", "Koçluk"].map((t, i) => (
          <div key={t} style={{ padding: "10px 22px", borderRadius: 999, fontSize: 22, fontWeight: 600, background: i === 1 ? C.navy : C.surface, color: i === 1 ? C.white : C.inkMuted, border: `2px solid ${C.line}` }}>{t}</div>
        ))}
      </div>
      <div style={{ position: "relative", margin: "0 24px", height: ROW * 5 }}>
        {TEACHERS.map((t, i) => {
          const y = interpolate(move, [0, 1], [i * ROW, (i + 1) * ROW]);
          return (
            <div key={t.n} style={{ position: "absolute", left: 0, right: 0, top: y, height: ROW - 18, borderRadius: 26, background: C.surface, border: `2px solid ${C.line}`, display: "flex", alignItems: "center", gap: 20, padding: "0 22px", opacity: 1 - move * 0.25 }}>
              <div style={{ width: 84, height: 84, borderRadius: 42, background: t.c, display: "flex", alignItems: "center", justifyContent: "center", color: C.white, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 34 }}>{t.n[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 30 }}>{t.n}</div>
                <div style={{ fontSize: 22, color: C.inkMuted }}>{t.b} öğretmeni</div>
              </div>
              <div style={{ fontSize: 24, color: C.inkMuted, fontWeight: 600 }}>{i + 1 + (move > 0.5 ? 1 : 0)}.</div>
            </div>
          );
        })}
        {/* senin kartın */}
        <div
          style={{
            position: "absolute",
            left: -8 * move,
            right: -8 * move,
            top: heroY,
            height: ROW - 18,
            borderRadius: 28,
            background: move > 0.5 ? `linear-gradient(120deg, #fff6df, #ffffff 60%)` : C.surface,
            border: `3px solid ${move > 0.5 ? C.amber : C.line}`,
            display: "flex",
            alignItems: "center",
            gap: 20,
            padding: "0 22px",
            boxShadow: `0 ${20 * move}px ${50 * move}px rgba(245,165,36,${0.35 * move}), 0 0 ${60 * glow}px rgba(245,165,36,${0.6 * glow})`,
            transform: `scale(${1 + 0.05 * Math.sin(Math.PI * move)})`,
            opacity: 0.55 + 0.45 * move,
            zIndex: 5,
          }}
        >
          <div style={{ position: "relative", width: 88, height: 88, borderRadius: 44, background: `linear-gradient(135deg, ${C.amber}, ${C.coral})`, display: "flex", alignItems: "center", justifyContent: "center", color: C.white, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 36 }}>
            S
            <div style={{ position: "absolute", inset: -8, borderRadius: 52, border: `3px solid ${C.amber}`, opacity: glow }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 30 }}>Sen</div>
            <div style={{ fontSize: 22, color: C.inkMuted }}>{fmt(views)} görüntülenme</div>
          </div>
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              padding: "10px 18px",
              borderRadius: 14,
              background: "linear-gradient(135deg,#fff3c4,#e2b04a 45%,#fff0b8 60%,#b07a1c)",
              color: "#5a3a00",
              fontFamily: FONT_DISPLAY,
              fontWeight: 800,
              fontSize: 24,
              transform: `scale(${badge}) rotate(${(1 - badge) * -30}deg)`,
              boxShadow: `0 0 ${30 * glow}px ${C.amber}`,
            }}
          >
            ★ VİTRİN
            <Sheen at={92} dur={18} />
            <Sheen at={130} dur={18} />
          </div>
        </div>
      </div>
      <div style={{ margin: "6px 32px 0", display: "flex", alignItems: "center", gap: 12, opacity: ramp(f, 100, 112), fontSize: 22, color: C.inkMuted }}>
        <div style={{ width: 12, height: 12, borderRadius: 6, background: C.green, boxShadow: `0 0 12px ${C.green}` }} /> Profilin listenin ilk sırasında
      </div>
    </div>
  );
};

const TIERS = [
  { n: "Gümüş", g: "linear-gradient(135deg,#f6f8fb,#b9c0cc 38%,#f1f4f8 55%,#8a93a3 85%)", ink: "#2f3542", lvl: 1, ring: "#a7b0bf" },
  { n: "Gold", g: "linear-gradient(135deg,#fff3c4,#e2b04a 38%,#fff0b8 55%,#b07a1c 85%)", ink: "#4d3200", lvl: 2, ring: C.amber },
  { n: "Platinum", g: "linear-gradient(135deg,#eef6ff,#9fb4d6 35%,#fbfdff 52%,#6f7fa8 80%,#c9d8f2)", ink: "#1d2a4a", lvl: 3, ring: "#8fb0ff" },
];

/** Gümüş / Gold / Platinum kartları metalik parlamayla açılır, seçim halkası ilerler */
export const MetalTiers: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sel = f < 70 ? -1 : f < 92 ? 0 : f < 114 ? 1 : 2;
  return (
    <div>
      <AppBar title="Öne Çıkarma" sub="Öğretmen Premium · Vitrin paketleri" accent={C.amber} />
      <div style={{ display: "flex", flexDirection: "column", gap: 20, margin: "6px 30px 0", perspective: 1200 }}>
        {TIERS.map((t, i) => {
          const d = 8 + i * 14;
          const s = spring({ frame: f - d, fps, config: { damping: 13, stiffness: 120, mass: 0.8 } });
          const on = sel === i;
          return (
            <div
              key={t.n}
              style={{
                position: "relative",
                height: 200,
                borderRadius: 30,
                background: t.g,
                overflow: "hidden",
                padding: "26px 30px",
                color: t.ink,
                transform: `rotateX(${(1 - s) * -85}deg) scale(${on ? 1.04 : 1})`,
                transformOrigin: "top center",
                opacity: Math.min(1, s * 1.6),
                boxShadow: on ? `0 0 0 5px ${t.ring}, 0 20px 50px ${t.ring}99` : "0 12px 30px rgba(43,36,64,0.18)",
              }}
            >
              {/* fırçalanmış metal dokusu */}
              <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.10) 0 2px, transparent 2px 6px)", mixBlendMode: "overlay" }} />
              <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 56, letterSpacing: -1.5, lineHeight: 1 }}>{t.n}</div>
                  <div style={{ fontSize: 22, fontWeight: 600, marginTop: 10, opacity: 0.75 }}>Öne çıkarma paketi</div>
                </div>
                <div style={{ fontSize: 46, letterSpacing: 2 }}>{"★".repeat(t.lvl)}<span style={{ opacity: 0.25 }}>{"★".repeat(3 - t.lvl)}</span></div>
              </div>
              <div style={{ position: "relative", marginTop: 26, display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ fontSize: 20, fontWeight: 700, opacity: 0.7 }}>Görünürlük</div>
                {[0, 1, 2].map((k) => {
                  const fill = ramp(f, d + 18 + k * 6, d + 30 + k * 6);
                  return (
                    <div key={k} style={{ flex: 1, height: 14, borderRadius: 7, background: "rgba(0,0,0,0.12)", overflow: "hidden" }}>
                      <div style={{ width: `${(k < t.lvl ? fill : 0) * 100}%`, height: "100%", background: t.ink, borderRadius: 7 }} />
                    </div>
                  );
                })}
              </div>
              <Sheen at={d + 10} dur={24} width={160} />
              <Sheen at={70 + i * 22} dur={20} width={110} op={0.7} />
              {on && (
                <div style={{ position: "absolute", right: 24, bottom: 22, width: 46, height: 46, borderRadius: 23, background: t.ink, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800 }}>✓</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Profil görüntülenme + izlenme sayaçları ve çizilen eğri */
export const ViewStats: React.FC = () => {
  const f = useCurrentFrame();
  const p = ramp(f, 12, 80, 0, 1, Easing.out(Easing.cubic));
  const views = Math.round(p * 3480);
  const watch = Math.round(ramp(f, 22, 92, 0, 1, Easing.out(Easing.cubic)) * 12650);
  const pts = [10, 18, 16, 30, 38, 46, 62, 70, 88];
  const W = 500, H = 220;
  const path = pts.map((v, i) => `${i === 0 ? "M" : "L"}${(i / (pts.length - 1)) * W},${H - (v / 100) * H}`).join(" ");
  const draw = ramp(f, 20, 95, 0, 1, Easing.inOut(Easing.cubic));
  const last = Math.min(pts.length - 1, Math.floor(draw * (pts.length - 1)));
  const tile = (label: string, val: number, col: string, d: number, icon: string) => {
    const s = useSpr(d, { damping: 12 });
    return (
      <div style={{ flex: 1, borderRadius: 26, background: C.surface, border: `2px solid ${C.line}`, padding: "22px 22px", transform: `scale(${0.8 + 0.2 * s})`, opacity: s }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 22, color: C.inkMuted, fontWeight: 600 }}>
          <span style={{ width: 36, height: 36, borderRadius: 10, background: `${col}22`, color: col, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{icon}</span>
          {label}
        </div>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 60, color: C.ink, marginTop: 10, fontVariantNumeric: "tabular-nums" }}>{fmt(val)}</div>
      </div>
    );
  };
  return (
    <div>
      <AppBar title="Stüdyo Analitiği" sub="Son 30 gün" accent={C.sky} />
      <div style={{ display: "flex", gap: 16, margin: "0 28px" }}>
        {tile("Profil görüntülenme", views, C.amber, 6, "◉")}
        {tile("İzlenme", watch, C.blue, 14, "▶")}
      </div>
      <div style={{ margin: "22px 28px 0", borderRadius: 26, background: C.surface, border: `2px solid ${C.line}`, padding: "22px 24px 26px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 26 }}>Görüntülenme eğrisi</div>
          <div style={{ padding: "6px 14px", borderRadius: 999, background: `${C.amber}22`, color: "#a86a00", fontSize: 20, fontWeight: 700, opacity: ramp(f, 40, 50) }}>★ Vitrinde</div>
        </div>
        <svg width={W} height={H + 10} viewBox={`0 -5 ${W} ${H + 10}`} style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="ek2vs" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.amber} stopOpacity={0.45} />
              <stop offset="100%" stopColor={C.amber} stopOpacity={0} />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3].map((k) => <line key={k} x1={0} x2={W} y1={(k / 3) * H} y2={(k / 3) * H} stroke={C.line} strokeWidth={2} />)}
          <path d={`${path} L${W},${H} L0,${H} Z`} fill="url(#ek2vs)" opacity={draw} />
          <path d={path} fill="none" stroke={C.amber} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
          <circle cx={(last / (pts.length - 1)) * W} cy={H - (pts[last] / 100) * H} r={12 + Math.sin(f / 4) * 3} fill={C.coral} stroke={C.white} strokeWidth={4} opacity={ramp(f, 20, 26)} />
        </svg>
      </div>
      <div style={{ margin: "18px 28px 0", display: "flex", gap: 12 }}>
        {["Beğeni", "Takipçi", "Mesaj"].map((t, i) => {
          const s = useSpr(60 + i * 8, { damping: 11 });
          return (
            <div key={t} style={{ flex: 1, padding: "16px 0", borderRadius: 20, background: C.pastelButter, textAlign: "center", fontSize: 22, fontWeight: 700, color: C.ink, transform: `scale(${s})` }}>
              {t} <span style={{ color: C.coral }}>▲</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ═════════════ Arac1 — Puan hesaplama ═════════════ */

const SUBJ = [
  { n: "Türkçe", q: 40, v: "32,5" },
  { n: "Sosyal Bilimler", q: 20, v: "14,25" },
  { n: "Temel Matematik", q: 40, v: "27,5" },
  { n: "Fen Bilimleri", q: 20, v: "12,75" },
];

/** TYT hesaplayıcı maketi: netler yazılır, puan sayacı döner ve oturur */
export const ScoreCalc: React.FC = () => {
  const f = useCurrentFrame();
  const T0 = 10, STEP = 16;
  const press = f >= 78 && f < 86 ? 0.94 : 1;
  const roll = ramp(f, 84, 116, 0, 1, Easing.out(Easing.exp));
  const settled = f >= 116;
  const target = 386.42;
  const shown = settled ? target : 100 + (target - 100) * roll + (f >= 84 ? ((f * 37) % 23) * (1 - roll) : 0);
  const pop = settled ? 1 + 0.1 * Math.max(0, 1 - (f - 116) / 8) : 1;
  let typedNet = 0;
  return (
    <div>
      <AppBar title="TYT Puan Hesaplama" sub="Ücretsiz araç" />
      <div style={{ margin: "0 28px", display: "flex", flexDirection: "column", gap: 8 }}>
        {SUBJ.map((s, i) => {
          const a = T0 + i * STEP;
          const n = Math.max(0, Math.min(s.v.length, Math.floor((f - a) / 2.5)));
          const focus = f >= a && f < a + STEP;
          if (n === s.v.length) typedNet += parseFloat(s.v.replace(",", "."));
          return (
            <div key={s.n} style={{ display: "flex", alignItems: "center", gap: 14, padding: "8px 18px", borderRadius: 22, background: C.surface, border: `3px solid ${focus ? C.blue : C.line}`, boxShadow: focus ? `0 0 0 6px ${C.blue}22` : undefined }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 26 }}>{s.n}</div>
                <div style={{ fontSize: 20, color: C.inkMuted }}>{s.q} soru</div>
              </div>
              <div style={{ fontSize: 20, color: C.inkMuted, fontWeight: 600 }}>Net</div>
              <div style={{ width: 140, height: 64, borderRadius: 16, background: C.canvas, border: `2px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 16px", fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 34, color: C.ink, fontVariantNumeric: "tabular-nums" }}>
                {s.v.slice(0, n)}
                {focus && <span style={{ color: C.blue, opacity: Math.floor(f / 5) % 2 ? 1 : 0.2 }}>|</span>}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ margin: "10px 32px 0", display: "flex", justifyContent: "space-between", fontSize: 24, fontWeight: 600, color: C.inkMuted }}>
        <span>Toplam net</span>
        <span style={{ color: C.ink, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{fmt(typedNet, 2)}</span>
      </div>
      <div style={{ margin: "10px 28px 0", height: 70, borderRadius: 22, background: `linear-gradient(100deg, ${C.blue}, ${C.royal})`, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 34, transform: `scale(${press})`, boxShadow: `0 14px 30px ${C.blue}55` }}>
        Hesapla
      </div>
      <div style={{ position: "relative", margin: "14px 28px 0", borderRadius: 28, background: C.navy, padding: "18px 26px", overflow: "hidden", opacity: ramp(f, 80, 88), transform: `translateY(${(1 - ramp(f, 80, 92)) * 40}px)` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ color: C.ice, fontSize: 24, fontWeight: 600 }}>TYT puanın</div>
          <Tag col={C.amberSoft}>Örnek hesaplama</Tag>
        </div>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 96, lineHeight: 1.05, color: settled ? C.cyan : C.white, transform: `scale(${pop})`, transformOrigin: "left center", fontVariantNumeric: "tabular-nums", textShadow: settled ? `0 0 30px ${C.cyan}88` : undefined }}>
          {fmt(shown, 2)}
        </div>
        <Sheen at={118} dur={20} op={0.35} />
      </div>
    </div>
  );
};

const TOOLS = [
  { n: "TYT", d: "Puan hesaplama", c: C.blue },
  { n: "LGS", d: "Puan hesaplama", c: C.amber },
  { n: "KPSS P3", d: "Puan hesaplama", c: C.magenta },
  { n: "OBP", d: "Ortaöğretim başarı puanı", c: C.green },
  { n: "GANO", d: "Genel not ortalaması", c: C.sky },
];

/** Araç çipleri sırayla belirir, vurgu halkası en son geleni izler */
export const ToolChips: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ats = [8, 38, 72, 118, 152];
  const active = ats.reduce((a, t, i) => (f >= t ? i : a), -1);
  const allOk = f >= 190;
  return (
    <div>
      <AppBar title="Hesaplama Araçları" sub="5 araç · ücretsiz" />
      <div style={{ margin: "4px 28px 0", display: "flex", flexDirection: "column", gap: 14 }}>
        {TOOLS.map((t, i) => {
          const s = spring({ frame: f - ats[i], fps, config: { damping: 11, stiffness: 200, mass: 0.6 } });
          const on = active === i && !allOk;
          const okS = spring({ frame: f - 190 - i * 4, fps, config: { damping: 10, stiffness: 220 } });
          return (
            <div
              key={t.n}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 18,
                padding: "16px 20px",
                borderRadius: 26,
                background: C.surface,
                border: `3px solid ${on ? t.c : C.line}`,
                overflow: "hidden",
                transform: `translateX(${(1 - s) * 260}px) scale(${on ? 1.03 : 1})`,
                opacity: f >= ats[i] ? Math.min(1, s * 2) : 0,
                boxShadow: on ? `0 16px 40px ${t.c}44` : "0 6px 16px rgba(43,36,64,0.06)",
              }}
            >
              <div style={{ minWidth: 118, height: 78, borderRadius: 20, background: t.c, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: t.n.length > 4 ? 28 : 34, padding: "0 10px" }}>{t.n}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 28 }}>{t.n} {t.n === "OBP" || t.n === "GANO" ? "Hesaplama" : "Puanı"}</div>
                <div style={{ fontSize: 20, color: C.inkMuted }}>{t.d}</div>
              </div>
              <div style={{ width: 50, height: 50, borderRadius: 25, background: allOk ? C.green : `${t.c}1f`, color: allOk ? C.white : t.c, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 800, transform: `scale(${allOk ? 0.6 + 0.4 * okS : 1})` }}>
                {allOk ? "✓" : "›"}
              </div>
              <Sheen at={ats[i] + 6} dur={18} op={0.5} />
            </div>
          );
        })}
      </div>
      <div style={{ margin: "18px 28px 0", padding: "16px 20px", borderRadius: 22, background: C.pastelBlue, display: "flex", alignItems: "center", gap: 14, fontSize: 24, fontWeight: 700, color: C.ink, opacity: ramp(f, 190, 200), transform: `translateY(${(1 - ramp(f, 190, 204)) * 30}px)` }}>
        <span style={{ fontSize: 30 }}>✦</span> Hepsi ücretsiz, kayıt bile gerekmez
      </div>
    </div>
  );
};

/** Hedef puan planlama: mevcut vs hedef, kalan net kalemleri işaretlenir */
export const TargetPlan: React.FC = () => {
  const f = useCurrentFrame();
  const cur = 386, goal = 450;
  const fill = ramp(f, 8, 40, 0, cur / 500);
  const gap = Math.round(ramp(f, 30, 56, 0, goal - cur));
  const items = [
    { n: "Temel Matematik", v: "+6 net", c: C.blue },
    { n: "Fen Bilimleri", v: "+4 net", c: C.green },
    { n: "Türkçe", v: "+3 net", c: C.magenta },
  ];
  const planS = useSpr(92, { damping: 10 });
  return (
    <div>
      <AppBar title="Hedef Planı" sub="Hedef puanına göre" accent={C.green} />
      <div style={{ margin: "0 28px", borderRadius: 28, background: C.surface, border: `2px solid ${C.line}`, padding: "24px 26px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, fontWeight: 600, color: C.inkMuted }}>
          <span>Şu an <b style={{ color: C.ink }}>{cur}</b></span>
          <span>Hedef <b style={{ color: C.green }}>{goal}</b></span>
        </div>
        <div style={{ position: "relative", height: 36, borderRadius: 18, background: C.canvas, border: `2px solid ${C.line}`, marginTop: 14 }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${fill * 100}%`, borderRadius: 18, background: `linear-gradient(90deg, ${C.sky}, ${C.blue})` }} />
          <div style={{ position: "absolute", left: `${(goal / 500) * 100}%`, top: -12, bottom: -12, width: 6, borderRadius: 3, background: C.green, boxShadow: `0 0 14px ${C.green}`, opacity: ramp(f, 20, 28) }} />
          <div style={{ position: "absolute", left: `${(cur / 500) * 100}%`, right: `${100 - (goal / 500) * 100}%`, top: 6, bottom: 6, borderRadius: 12, backgroundImage: `repeating-linear-gradient(45deg, ${C.green}55 0 8px, transparent 8px 16px)`, opacity: ramp(f, 34, 44) }} />
        </div>
        <div style={{ marginTop: 18, display: "flex", alignItems: "baseline", gap: 14 }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 72, color: C.green, fontVariantNumeric: "tabular-nums" }}>+{gap}</div>
          <div style={{ fontSize: 26, fontWeight: 700 }}>puan kaldı</div>
        </div>
        <Tag style={{ marginTop: 6 }}>Örnek hesaplama</Tag>
      </div>
      <div style={{ margin: "18px 28px 0", display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((it, i) => {
          const s = useSpr(46 + i * 12, { damping: 12 });
          const chk = useSpr(70 + i * 8, { damping: 9, stiffness: 240 });
          return (
            <div key={it.n} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", borderRadius: 22, background: C.surface, border: `2px solid ${C.line}`, transform: `translateY(${(1 - s) * 50}px)`, opacity: s }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, border: `3px solid ${it.c}`, background: chk > 0.5 ? it.c : "transparent", color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 24, transform: `scale(${0.8 + 0.2 * chk})` }}>{chk > 0.5 ? "✓" : ""}</div>
              <div style={{ flex: 1, fontWeight: 700, fontSize: 26 }}>{it.n}</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 30, color: it.c }}>{it.v}</div>
            </div>
          );
        })}
      </div>
      <div style={{ margin: "18px 28px 0", height: 72, borderRadius: 22, background: planS > 0.5 ? C.green : C.navy, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 30, transform: `scale(${f >= 88 && f < 94 ? 0.94 : 1})` }}>
        {planS > 0.5 ? "✓ Planına eklendi" : "Planına ekle"}
      </div>
    </div>
  );
};

/* ═════════════ Sinav5 — Haftalık döngü ═════════════ */

const STEPS = [
  { n: "Deneme", s: "Haftanın denemesine gir", i: "✎", c: C.amber },
  { n: "Analiz", s: "Soru soru analiz", i: "◎", c: C.sky },
  { n: "YZ seti", s: "Eksik konuya yapay zekâ soru seti", i: "✦", c: C.magenta },
  { n: "%80", s: "Konu testi %80 → konu tamamlandı", i: "✓", c: C.green },
  { n: "Yeni", s: "Yeni deneme", i: "↻", c: C.coral },
];

/** Dönen döngü diyagramı: ışık turlar, geçtiği adım yanar */
export const CycleDiagram: React.FC<{ stepDur?: number }> = ({ stepDur = 46 }) => {
  const f = useCurrentFrame();
  const t0 = 12;
  const prog = Math.max(0, (f - t0) / stepDur); // adım sayısı cinsinden
  const active = Math.min(STEPS.length - 1, Math.floor(prog));
  const R = 172, CX = 304, CY = 222;
  const spin = f * 0.15;
  const ang = (k: number) => ((-90 + (k * 360) / STEPS.length + spin) * Math.PI) / 180;
  const cometA = (-90 + Math.min(prog, STEPS.length) * (360 / STEPS.length) + spin) * (Math.PI / 180);
  const arc = Math.min(1, prog / STEPS.length);
  const cs = useSpr(0, { damping: 12 });
  const st = STEPS[active];
  return (
    <div>
      <AppBar title="Haftalık Döngü" sub="Deneme → analiz → kapat" accent={C.amber} />
      <div style={{ position: "relative", height: 446, transform: `scale(${0.7 + 0.3 * cs})`, opacity: cs }}>
        <svg width={608} height={446} style={{ position: "absolute", left: 0, top: 0 }}>
          <circle cx={CX} cy={CY} r={R} fill="none" stroke={C.line} strokeWidth={14} />
          <circle
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke={C.amber}
            strokeWidth={14}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={`${arc} 1`}
            transform={`rotate(${-90 + spin} ${CX} ${CY})`}
            style={{ filter: `drop-shadow(0 0 8px ${C.amber})` }}
          />
          <circle cx={CX + R * Math.cos(cometA)} cy={CY + R * Math.sin(cometA)} r={18} fill={C.white} stroke={C.amber} strokeWidth={6} style={{ filter: `drop-shadow(0 0 14px ${C.amber})` }} opacity={f > t0 ? 1 : 0} />
        </svg>
        {STEPS.map((s, k) => {
          const lit = prog >= k;
          const flash = lit ? Math.max(0, 1 - (prog - k) * 2.5) : 0;
          const x = CX + R * Math.cos(ang(k));
          const y = CY + R * Math.sin(ang(k));
          return (
            <div
              key={k}
              style={{
                position: "absolute",
                left: x - 56,
                top: y - 56,
                width: 112,
                height: 112,
                borderRadius: 56,
                background: lit ? s.c : C.surface,
                border: `4px solid ${lit ? C.white : C.line}`,
                color: lit ? C.white : C.inkMuted,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: FONT_DISPLAY,
                fontWeight: 800,
                fontSize: s.n.length > 4 ? 19 : 23,
                lineHeight: 1,
                boxShadow: lit ? `0 0 ${20 + 40 * flash}px ${s.c}` : "0 6px 14px rgba(43,36,64,0.12)",
                transform: `scale(${1 + 0.25 * flash})`,
              }}
            >
              <div style={{ fontSize: 30, marginBottom: 2 }}>{s.i}</div>
              {s.n}
            </div>
          );
        })}
        {/* merkez */}
        <div style={{ position: "absolute", left: CX - 130, top: CY - 90, width: 260, height: 180, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.inkMuted }}>ADIM {active + 1}/5</div>
          <div key={active} style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 32, lineHeight: 1.1, color: st.c, marginTop: 8, transform: `scale(${1 + 0.15 * Math.max(0, 1 - (prog - active) * 3)})` }}>{st.s}</div>
        </div>
      </div>
      <div style={{ margin: "0 28px", display: "flex", flexDirection: "column", gap: 10 }}>
        {STEPS.slice(0, 4).map((s, k) => {
          const done = prog >= k + 1;
          return (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 16px", borderRadius: 18, background: done ? `${s.c}18` : C.surface, border: `2px solid ${done ? s.c : C.line}` }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: done ? s.c : "transparent", border: `3px solid ${s.c}`, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800 }}>{done ? "✓" : ""}</div>
              <div style={{ fontSize: 22, fontWeight: 600, color: C.ink }}>{s.s}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const WEEKS = [
  { d: "21-22", m: "Kasım", t: "TYT-AYT", c: C.blue },
  { d: "28", m: "Kasım", t: "LGS", c: C.amber },
  { d: "5-6", m: "Aralık", t: "TYT-AYT", c: C.blue },
  { d: "12", m: "Aralık", t: "LGS", c: C.amber },
];

/** Deneme takvimi: haftalar sırayla düşer, "bu hafta" vurgusu aşağı kayar */
export const ExamCalendar: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hi = ramp(f, 70, 160, 0, 3, Easing.inOut(Easing.cubic));
  const ROW = 150;
  return (
    <div>
      <AppBar title="Deneme Takvimi" sub="Her hafta bir deneme" accent={C.amber} />
      <div style={{ margin: "0 28px 16px", display: "flex", gap: 10 }}>
        {[{ t: "TYT-AYT", c: C.blue }, { t: "LGS", c: C.amber }].map((x, i) => (
          <div key={x.t} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 18px", borderRadius: 999, background: `${x.c}1c`, color: x.c, fontWeight: 700, fontSize: 22, opacity: ramp(f, 4 + i * 6, 12 + i * 6) }}>
            <span style={{ width: 12, height: 12, borderRadius: 6, background: x.c }} />
            {x.t}
          </div>
        ))}
        <div style={{ padding: "8px 16px", borderRadius: 999, background: C.pastelButter, color: C.ink, fontWeight: 700, fontSize: 22, opacity: ramp(f, 16, 24) }}>⇄ 2 haftada bir</div>
      </div>
      <div style={{ position: "relative", margin: "0 28px", height: ROW * 4 }}>
        {/* zaman çizgisi */}
        <div style={{ position: "absolute", left: 58, top: 40, width: 6, height: `${ramp(f, 8, 70) * (ROW * 3)}px`, borderRadius: 3, background: `linear-gradient(${C.blue}, ${C.amber})` }} />
        {/* bu hafta vurgusu */}
        <div style={{ position: "absolute", left: -6, right: -6, top: hi * ROW - 6, height: ROW - 6, borderRadius: 30, border: `4px solid ${C.amber}`, boxShadow: `0 0 30px ${C.amber}88`, opacity: ramp(f, 66, 74) }} />
        {WEEKS.map((w, i) => {
          const s = spring({ frame: f - (10 + i * 12), fps, config: { damping: 12, stiffness: 160 } });
          const past = hi > i + 0.6;
          return (
            <div key={i} style={{ position: "absolute", left: 0, right: 0, top: i * ROW, height: ROW - 18, display: "flex", alignItems: "center", gap: 20, padding: "0 20px 0 0", transform: `translateY(${(1 - s) * -80}px)`, opacity: s }}>
              <div style={{ width: 122, height: 122, borderRadius: 26, background: w.c, color: C.white, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: `0 10px 24px ${w.c}55`, zIndex: 2 }}>
                <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: w.d.length > 3 ? 38 : 50, lineHeight: 1 }}>{w.d}</div>
                <div style={{ fontSize: 20, fontWeight: 600, marginTop: 4 }}>{w.m}</div>
              </div>
              <div style={{ flex: 1, height: ROW - 30, borderRadius: 24, background: C.surface, border: `2px solid ${C.line}`, display: "flex", alignItems: "center", padding: "0 22px", gap: 14 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 36, color: C.ink }}>{w.t}</div>
                  <div style={{ fontSize: 20, color: C.inkMuted }}>{i + 1}. hafta denemesi</div>
                </div>
                <div style={{ width: 46, height: 46, borderRadius: 23, background: past ? C.green : C.canvas, border: `2px solid ${past ? C.green : C.line}`, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800 }}>{past ? "✓" : ""}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Hafta hafta net grafiği (temsilî) */
export const NetChart: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nets = [54, 59, 63, 68, 74, 81];
  const MAX = 100, H = 360;
  const lineP = ramp(f, 50, 90, 0, 1, Easing.inOut(Easing.cubic));
  const bw = 66, gap = 22;
  const x = (i: number) => 24 + i * (bw + gap) + bw / 2;
  const y = (v: number) => H - (v / MAX) * H;
  const path = nets.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v) - 30}`).join(" ");
  return (
    <div>
      <AppBar title="Net Gelişimi" sub="TYT · deneme deneme" accent={C.amber} />
      <div style={{ margin: "0 28px", borderRadius: 28, background: C.surface, border: `2px solid ${C.line}`, padding: "20px 0 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 24px 10px" }}>
          <div style={{ fontWeight: 700, fontSize: 26 }}>Toplam net</div>
          <Tag>Temsilî</Tag>
        </div>
        <svg width={552} height={H + 50} style={{ overflow: "visible" }}>
          {[0, 1, 2, 3].map((k) => <line key={k} x1={10} x2={542} y1={(k / 3) * H} y2={(k / 3) * H} stroke={C.line} strokeWidth={2} />)}
          {nets.map((v, i) => {
            const s = spring({ frame: f - (8 + i * 7), fps, config: { damping: 12, stiffness: 120 } });
            const h = (v / MAX) * H * s;
            const last = i === nets.length - 1;
            return (
              <g key={i}>
                <rect x={x(i) - bw / 2} y={H - h} width={bw} height={h} rx={14} fill={last ? C.amber : `${C.blue}`} opacity={last ? 1 : 0.35 + i * 0.1} />
                <text x={x(i)} y={H - h - 10} textAnchor="middle" fontFamily={FONT_DISPLAY} fontWeight={800} fontSize={26} fill={last ? C.coral : C.ink} opacity={s}>{Math.round(v * s)}</text>
                <text x={x(i)} y={H + 34} textAnchor="middle" fontFamily={FONT_SANS} fontWeight={600} fontSize={20} fill={C.inkMuted}>{i + 1}. hf</text>
              </g>
            );
          })}
          <path d={path} fill="none" stroke={C.coral} strokeWidth={5} strokeDasharray="1" pathLength={1} strokeDashoffset={1 - lineP} strokeLinecap="round" opacity={0.9} />
        </svg>
      </div>
      <div style={{ margin: "18px 28px 0", display: "flex", gap: 12 }}>
        {[{ l: "Kapanan konu", v: Math.round(ramp(f, 40, 90) * 12), c: C.green }, { l: "Çözülen soru", v: Math.round(ramp(f, 40, 95) * 640), c: C.blue }].map((t, i) => (
          <div key={t.l} style={{ flex: 1, borderRadius: 22, background: C.surface, border: `2px solid ${C.line}`, padding: "16px 20px", opacity: ramp(f, 36 + i * 6, 46 + i * 6) }}>
            <div style={{ fontSize: 20, color: C.inkMuted, fontWeight: 600 }}>{t.l}</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 48, color: t.c, fontVariantNumeric: "tabular-nums" }}>{fmt(t.v)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};


/* ═════════════ ek2 kanca varyantları (kit kancalarının ölçü ayarlı kopyaları) ═════════════ */

const toneCol = (t: Tone) => (t === "brand" ? C.cyan : t === "feather" ? C.coral : C.amber);
const toneGradL = (t: Tone) => (t === "brand" ? GRAD_BRAND : t === "feather" ? GRAD_FEATHER : `linear-gradient(100deg, ${C.amberSoft}, ${C.amber} 50%, ${C.coral})`);

const ShakeL: React.FC<{ hits: number[]; children: React.ReactNode }> = ({ hits, children }) => {
  const f = useCurrentFrame();
  let x = 0, y = 0, r = 0;
  for (const h of hits) {
    const t = f - h;
    if (t >= 0 && t < 14) {
      const d = Math.pow(1 - t / 14, 2);
      x += Math.sin(t * 2.7) * 22 * d;
      y += Math.cos(t * 3.1) * 16 * d;
      r += Math.sin(t * 2.2) * 1.2 * d;
    }
  }
  return <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px) rotate(${r}deg)` }}>{children}</AbsoluteFill>;
};

const WaveL: React.FC<{ at: number; tone: Tone; y?: number }> = ({ at, tone, y = SAFE.eye }) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < 0 || t > 26) return null;
  const p = t / 26;
  const col = toneCol(tone);
  return <div style={{ position: "absolute", left: 540 - 900 * p, top: y - 900 * p, width: 1800 * p, height: 1800 * p, borderRadius: "50%", border: `${18 * (1 - p) + 2}px solid ${col}`, opacity: (1 - p) * 0.8, boxShadow: `0 0 60px ${col}` }} />;
};

/** HookStrike'ın genişliğe sığan sürümü (uzun kelimeler için) */
export const HookStrikeFit: React.FC<{ kicker?: string; from: string; to: string; after?: string; tone?: Tone; fromSize?: number; toSize?: number }> = ({ kicker, from, to, after, tone = "brand", fromSize = 150, toSize = 170 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const strike = ramp(f, 8, 20);
  const shrink = ramp(f, 22, 32);
  const s2 = spring({ frame: f - 28, fps, config: { damping: 10, stiffness: 240, mass: 0.6 } });
  const glow = f >= 28 ? 0.5 + 0.5 * Math.sin((f - 28) / 6) : 0;
  return (
    <AbsoluteFill>
      <Bg tone={tone} intensity={1.2} />
      <WaveL at={28} tone={tone} />
      <ShakeL hits={[0, 28]}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", paddingBottom: 200 }}>
          {kicker && <Chip tone={tone} delay={-20} style={{ marginBottom: 40 }}>{kicker}</Chip>}
          <div style={{ position: "relative", fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: fromSize - fromSize * 0.4 * shrink, color: shrink > 0.2 ? "rgba(255,255,255,0.55)" : C.white, letterSpacing: -5, lineHeight: 1, transform: `translateY(${-30 * shrink}px) scale(${1 + 0.06 * (1 - ramp(f, 0, 8))})`, textShadow: "0 10px 50px rgba(0,0,0,0.45)" }}>
            {from}
            <div style={{ position: "absolute", left: -20, top: "50%", height: 20 - 8 * shrink, width: `calc((100% + 40px) * ${strike})`, opacity: strike > 0 ? 1 : 0, background: C.red, borderRadius: 12, transform: "rotate(-6deg)", boxShadow: `0 0 30px ${C.red}` }} />
          </div>
          <div style={{ position: "relative", marginTop: 20 }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: toSize, lineHeight: 1, letterSpacing: -6, opacity: f >= 28 ? Math.min(1, s2 * 3) : 0, transform: `scale(${2.2 - 1.2 * s2})`, backgroundImage: toneGradL(tone), WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", paddingBottom: 14, filter: `drop-shadow(0 0 ${24 * glow}px ${toneCol(tone)}aa)` }}>
              {to}
            </div>
            <Sheen at={44} dur={20} op={0.5} width={140} />
          </div>
          {after && (
            <div style={{ marginTop: 40, padding: "0 80px" }}>
              <Words text={after} delay={42} size={56} weight={600} font="sans" color={C.ice} stagger={3} tone={tone} />
            </div>
          )}
        </AbsoluteFill>
      </ShakeL>
    </AbsoluteFill>
  );
};

/** HookQuestion'ın 0. karede tamamı okunan sürümü */
export const HookQuestionFull: React.FC<{ kicker?: string; text: string; tone?: Tone; after?: string }> = ({ kicker, text, tone = "brand", after }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const q = spring({ frame: f, fps, config: { damping: 9, stiffness: 120 } });
  return (
    <AbsoluteFill>
      <Bg tone={tone} intensity={1.2} />
      <div style={{ position: "absolute", right: -120, top: 220, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 1100, lineHeight: 1, color: "transparent", WebkitTextStroke: `6px ${toneCol(tone)}`, opacity: 0.22, transform: `rotate(${12 + (1 - q) * 40 + Math.sin(f / 15) * 3}deg) scale(${0.6 + 0.4 * q})` }}>?</div>
      <WaveL at={0} tone={tone} />
      <WaveL at={14} tone={tone} />
      <ShakeL hits={[0, 14]}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "flex-start", flexDirection: "column", padding: "0 80px 220px" }}>
          {kicker && <Chip tone={tone} delay={-20} style={{ marginBottom: 40 }}>{kicker}</Chip>}
          <Words text={text} delay={-40} stagger={3} size={150} align="left" tone={tone} lineHeight={0.98} />
          {after && (
            <div style={{ marginTop: 50 }}>
              <Words text={after} delay={26} size={54} weight={500} font="sans" color={C.ice} align="left" stagger={3} />
            </div>
          )}
        </AbsoluteFill>
      </ShakeL>
    </AbsoluteFill>
  );
};
