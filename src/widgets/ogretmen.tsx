import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT_DISPLAY, FONT_SANS, GRAD_BRAND, GRAD_FEATHER } from "../theme";
import { Bg, Words, clamp, ramp, useSp } from "../kit";

/* ───────────── Öğretmen grubu: telefon içi canlı arayüz maketleri ───────────── */

export type T = "brand" | "feather";
const acc = (t: T) => (t === "brand" ? C.blue : C.coral);
const acc2 = (t: T) => (t === "brand" ? C.cyan : C.amber);
const grad = (t: T) => (t === "brand" ? GRAD_BRAND : GRAD_FEATHER);
const tr = (n: number) => Math.round(n).toLocaleString("tr-TR");

/* ───── temel parçalar ───── */

export const Rise: React.FC<{ d?: number; children: React.ReactNode; style?: React.CSSProperties; from?: number }> = ({ d = 0, children, style, from = 50 }) => {
  const s = useSp(d, { damping: 15, stiffness: 160 });
  return <div style={{ opacity: Math.min(1, s * 1.6), transform: `translateY(${(1 - s) * from}px) scale(${0.94 + 0.06 * s})`, ...style }}>{children}</div>;
};

const card: React.CSSProperties = {
  background: C.surface,
  borderRadius: 28,
  boxShadow: "0 10px 30px rgba(43,36,64,0.10)",
  border: `1.5px solid ${C.line}`,
  padding: 22,
};

export const Card: React.FC<{ d?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ d = 0, children, style }) => (
  <Rise d={d}>
    <div style={{ ...card, ...style }}>{children}</div>
  </Rise>
);

export const AppBar: React.FC<{ title: string; sub: string; tone?: T; right?: React.ReactNode }> = ({ title, sub, tone = "brand", right }) => {
  const s = useSp(0, { damping: 16 });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "6px 28px 18px", opacity: s, transform: `translateY(${(1 - s) * -20}px)` }}>
      <div style={{ width: 60, height: 60, borderRadius: 18, background: grad(tone), display: "flex", alignItems: "center", justifyContent: "center", color: C.navy, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 34, boxShadow: `0 6px 18px ${acc(tone)}55` }}>V</div>
      <div>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 34, lineHeight: 1.05, color: C.ink }}>{title}</div>
        <div style={{ fontSize: 21, color: C.inkMuted, marginTop: 2 }}>{sub}</div>
      </div>
      <div style={{ marginLeft: "auto" }}>{right ?? <Avatar txt="AY" col={C.pastelLilac} />}</div>
    </div>
  );
};

export const Avatar: React.FC<{ txt: string; col?: string; size?: number; ring?: string }> = ({ txt, col = C.pastelBlue, size = 54, ring }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: col, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: size * 0.36, color: C.ink, boxShadow: ring ? `0 0 0 4px ${ring}` : undefined, flexShrink: 0 }}>
    {txt}
  </div>
);

export const Check: React.FC<{ at: number; size?: number; col?: string }> = ({ at, size = 44, col = C.green }) => {
  const f = useCurrentFrame();
  const s = useSp(at, { damping: 9, stiffness: 220 });
  const draw = ramp(f, at + 2, at + 12);
  if (f < at) return <div style={{ width: size, height: size, flexShrink: 0 }} />;
  return (
    <div style={{ width: size, height: size, borderRadius: size / 2, background: col, transform: `scale(${s})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 ${18 * s}px ${col}aa`, flexShrink: 0 }}>
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24">
        <path d="M4 12.5 L10 18 L20 6" fill="none" stroke="white" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={30} strokeDashoffset={30 * (1 - draw)} />
      </svg>
    </div>
  );
};

/** Dokunma halkası (relative kapsayıcı içinde) */
export const Tap: React.FC<{ x: number; y: number; at: number; col?: string }> = ({ x, y, at, col = C.blue }) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < -8 || t > 22) return null;
  const pre = ramp(f, at - 8, at);
  const p = Math.max(0, t) / 22;
  return (
    <>
      <div style={{ position: "absolute", left: x - 34, top: y - 34, width: 68, height: 68, borderRadius: 34, background: "rgba(255,255,255,0.55)", border: "3px solid rgba(43,36,64,0.35)", transform: `scale(${t < 0 ? 1.6 - 0.6 * pre : 1 - 0.25 * Math.min(1, t / 4)})`, opacity: t < 0 ? pre : 1 - p, zIndex: 20 }} />
      {t >= 0 && <div style={{ position: "absolute", left: x - 120 * p - 20, top: y - 120 * p - 20, width: 240 * p + 40, height: 240 * p + 40, borderRadius: "50%", border: `5px solid ${col}`, opacity: 1 - p, zIndex: 19 }} />}
    </>
  );
};

export const Bar: React.FC<{ p: number; col?: string; h?: number; bg?: string; glow?: boolean }> = ({ p, col = C.blue, h = 14, bg = C.line, glow }) => (
  <div style={{ height: h, borderRadius: h / 2, background: bg, overflow: "hidden", position: "relative" }}>
    <div style={{ width: `${Math.max(0, Math.min(1, p)) * 100}%`, height: "100%", borderRadius: h / 2, background: col, boxShadow: glow ? `0 0 16px ${col}` : undefined, position: "relative", overflow: "hidden" }}>
      <Shine />
    </div>
  </div>
);

const Shine: React.FC = () => {
  const f = useCurrentFrame();
  const x = ((f * 9) % 400) - 100;
  return <div style={{ position: "absolute", top: 0, bottom: 0, left: `${x}%`, width: "40%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)" }} />;
};

const Label: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: 2, color: C.inkMuted, ...style }}>{children}</div>
);

const Pill: React.FC<{ children: React.ReactNode; col: string; bg?: string; style?: React.CSSProperties }> = ({ children, col, bg, style }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 999, background: bg ?? `${col}1c`, color: col, fontWeight: 700, fontSize: 20, ...style }}>{children}</span>
);

/** Damga: büyükten çarpar */
export const Stamp: React.FC<{ at: number; children: React.ReactNode; col?: string; rot?: number; style?: React.CSSProperties }> = ({ at, children, col = C.green, rot = -8, style }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < at) return null;
  const s = spring({ frame: f - at, fps, config: { damping: 10, stiffness: 260, mass: 0.6 } });
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 24px", borderRadius: 18, border: `4px solid ${col}`, color: col, background: `${col}14`, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 32, transform: `scale(${2.6 - 1.6 * s}) rotate(${rot}deg)`, opacity: Math.min(1, s * 2), boxShadow: `0 0 ${30 * (1 - s) + 6}px ${col}66`, ...style }}>
      {children}
    </div>
  );
};

/** Parçacık patlaması */
export const Burst: React.FC<{ at: number; x: number; y: number; n?: number; cols?: string[] }> = ({ at, x, y, n = 18, cols = [C.cyan, C.coral, C.amber, C.green, C.blue] }) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < 0 || t > 34) return null;
  const p = t / 34;
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const a = (i / n) * Math.PI * 2 + i;
        const r = (110 + (i % 4) * 40) * Easing.out(Easing.cubic)(p);
        return (
          <div key={i} style={{ position: "absolute", left: x + Math.cos(a) * r, top: y + Math.sin(a) * r + p * p * 60, width: 14, height: i % 2 ? 14 : 8, borderRadius: 3, background: cols[i % cols.length], opacity: 1 - p, transform: `rotate(${t * 20 + i * 30}deg)`, zIndex: 30 }} />
        );
      })}
    </>
  );
};

/** Üstten kayan bildirim */
export const Toast: React.FC<{ at: number; children: React.ReactNode; icon?: React.ReactNode; top?: number; hold?: number }> = ({ at, children, icon, top = 76, hold = 45 }) => {
  const f = useCurrentFrame();
  const s = useSp(at, { damping: 13, stiffness: 180 }) - ramp(f, at + hold, at + hold + 10, 0, 1, Easing.in(Easing.cubic));
  if (f < at || s <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 20, right: 20, top, zIndex: 40, transform: `translateY(${(1 - s) * -160}px)`, opacity: s, ...card, padding: "18px 22px", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 18px 40px rgba(9,2,84,0.25)", fontSize: 24, fontWeight: 600, color: C.ink }}>
      {icon}
      <div>{children}</div>
    </div>
  );
};

/* ───── simgeler ───── */
const IcoPlay: React.FC<{ c?: string }> = ({ c = "white" }) => <svg width={26} height={26} viewBox="0 0 24 24"><path d="M7 4 L20 12 L7 20 Z" fill={c} /></svg>;
const IcoWave: React.FC<{ c?: string }> = ({ c = "white" }) => <svg width={28} height={26} viewBox="0 0 28 24">{[4, 12, 20, 8, 16].map((h, i) => <rect key={i} x={2 + i * 5.2} y={12 - h / 2} width={3} height={h} rx={1.5} fill={c} />)}</svg>;
const IcoDoc: React.FC<{ c?: string }> = ({ c = "white" }) => <svg width={24} height={28} viewBox="0 0 20 24"><path d="M2 1 H13 L18 6 V23 H2 Z" fill="none" stroke={c} strokeWidth={2.2} /><path d="M5 11 H15 M5 15 H15 M5 19 H11" stroke={c} strokeWidth={2} /></svg>;

/* ═════════════ OGRETMEN 1 ═════════════ */

const files = [
  { k: "VİDEO", n: "Türev'e Giriş.mp4", s: "184 MB", col: C.blue, ico: <IcoPlay />, a: 16 },
  { k: "SES", n: "Türev Özeti.mp3", s: "12 MB", col: C.magenta, ico: <IcoWave />, a: 28 },
  { k: "DOKÜMAN", n: "Formül Kartı.pdf", s: "2 MB", col: C.amber, ico: <IcoDoc />, a: 40 },
];

export const UploadScreen: React.FC = () => {
  const f = useCurrentFrame();
  const bounce = Math.abs(Math.sin(f / 7)) * 14;
  const allDone = files[2].a + 44;
  return (
    <div style={{ position: "relative", height: 1048 }}>
      <AppBar title="İçerik Stüdyosu" sub="Yeni ders yükle" />
      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        <Rise d={2}>
          <div style={{ height: 190, borderRadius: 28, border: `4px dashed ${C.blue}88`, background: `linear-gradient(160deg, ${C.pastelBlue}, #eef4ff)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, position: "relative", overflow: "hidden" }}>
            <div style={{ width: 82, height: 82, borderRadius: 41, background: GRAD_BRAND, display: "flex", alignItems: "center", justifyContent: "center", transform: `translateY(${-bounce}px)`, boxShadow: `0 ${10 + bounce}px 26px ${C.blue}66` }}>
              <svg width={40} height={40} viewBox="0 0 24 24"><path d="M12 19 V6 M6 11 L12 5 L18 11" stroke="white" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <div style={{ fontSize: 24, fontWeight: f >= allDone ? 800 : 600, color: f >= allDone ? C.green : C.royal }}>{f >= allDone ? "3 içerik hazır ✓ Konuya bağla →" : "Sürükle, bırak, yükle"}</div>
            {/* düşen dosya kartları */}
            {files.map((fl, i) => {
              const t = ramp(f, fl.a - 14, fl.a, 0, 1, Easing.in(Easing.quad));
              if (f > fl.a + 2 || f < fl.a - 14) return null;
              return <div key={i} style={{ position: "absolute", left: 160 + i * 110, top: -90 + t * 130, width: 70, height: 84, borderRadius: 14, background: fl.col, display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${(1 - t) * (i - 1) * 20}deg)`, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}>{fl.ico}</div>;
            })}
          </div>
        </Rise>
        {files.map((fl, i) => {
          const p = ramp(f, fl.a, fl.a + 40, 0, 1, Easing.inOut(Easing.quad));
          const done = f >= fl.a + 40;
          return (
            <Card key={i} d={fl.a - 4} style={{ padding: "18px 20px", display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{ width: 64, height: 64, borderRadius: 18, background: fl.col, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 6px 16px ${fl.col}55` }}>{fl.ico}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div style={{ fontSize: 25, fontWeight: 700 }}>{fl.n}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: done ? C.green : fl.col, fontVariantNumeric: "tabular-nums" }}>%{Math.round(p * 100)}</div>
                </div>
                <div style={{ fontSize: 18, color: C.inkMuted, margin: "4px 0 10px", letterSpacing: 1.5, fontWeight: 600 }}>{fl.k} · {fl.s}</div>
                <Bar p={p} col={done ? C.green : fl.col} h={12} />
              </div>
              <Check at={fl.a + 40} size={46} />
            </Card>
          );
        })}
      </div>
    </div>
  );
};

const tree = [
  { n: "Limit ve Süreklilik", lvl: 0 },
  { n: "Türev", lvl: 0, open: true },
  { n: "Türevin Tanımı", lvl: 1, target: true },
  { n: "Türev Alma Kuralları", lvl: 1 },
  { n: "Türevin Uygulamaları", lvl: 1 },
  { n: "İntegral", lvl: 0 },
];

export const CurriculumScreen: React.FC = () => {
  const f = useCurrentFrame();
  const q = "türev";
  const typed = q.slice(0, Math.floor(ramp(f, 6, 22, 0, q.length, Easing.linear)));
  // seçim çubuğu: 0 → 1 → 2. satır
  const rowH = 66;
  const sel = interpolate(f, [26, 36, 46, 56], [0, 1, 1, 2], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const locked = f >= 58;
  const crumbs = ["AYT Matematik", "Türev", "Türevin Tanımı"];
  const dock = ramp(f, 70, 86, 0, 1, Easing.out(Easing.back(1.4)));
  return (
    <div style={{ position: "relative", height: 1048 }}>
      <AppBar title="Müfredata Bağla" sub="Türev'e Giriş.mp4" />
      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        <Rise d={2}>
          <div style={{ ...card, padding: "16px 22px", display: "flex", alignItems: "center", gap: 14, fontSize: 26 }}>
            <svg width={28} height={28} viewBox="0 0 24 24"><circle cx={10} cy={10} r={7} stroke={C.inkMuted} strokeWidth={2.6} fill="none" /><path d="M15 15 L21 21" stroke={C.inkMuted} strokeWidth={2.6} strokeLinecap="round" /></svg>
            <span style={{ fontWeight: 600 }}>{typed}</span>
            <span style={{ width: 3, height: 30, background: C.blue, opacity: Math.floor(f / 6) % 2 && f < 26 ? 1 : 0 }} />
            <span style={{ marginLeft: "auto", fontSize: 19, color: C.inkMuted }}>20.000+ konu</span>
          </div>
        </Rise>
        {/* yol çipleri */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, minHeight: 56 }}>
          {crumbs.map((c, i) => {
            const at = 30 + i * 12;
            const s = spring({ frame: f - at, fps: 30, config: { damping: 11, stiffness: 220 } });
            if (f < at) return null;
            const last = i === crumbs.length - 1;
            return (
              <React.Fragment key={i}>
                {i > 0 && <span style={{ fontSize: 30, color: C.blue, fontWeight: 800, opacity: s }}>›</span>}
                <span style={{ transform: `scale(${s})`, display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 999, fontWeight: 700, fontSize: 22, background: last ? GRAD_BRAND : C.pastelBlue, color: last ? C.navy : C.royal, boxShadow: last ? `0 6px 18px ${C.cyan}66` : undefined }}>
                  {c}
                  {last && locked && <span style={{ fontSize: 22 }}>✓</span>}
                </span>
              </React.Fragment>
            );
          })}
        </div>
        {/* konu ağacı */}
        <Card d={8} style={{ padding: "12px 14px", position: "relative" }}>
          <div style={{ position: "absolute", left: 14, right: 14, top: 12 + sel * rowH, height: rowH - 6, borderRadius: 18, background: locked ? `${C.green}22` : `${C.blue}18`, border: `2.5px solid ${locked ? C.green : C.blue}`, opacity: ramp(f, 24, 28) }} />
          {tree.map((r, i) => (
            <div key={i} style={{ position: "relative", height: rowH, display: "flex", alignItems: "center", gap: 14, paddingLeft: 16 + r.lvl * 40, fontSize: 25, fontWeight: r.lvl === 0 ? 700 : 500, color: r.lvl ? C.ink : C.ink }}>
              {r.lvl === 0 ? <span style={{ color: C.blue, fontSize: 22, transform: `rotate(${r.open && f > 38 ? 90 : 0}deg)`, display: "inline-block" }}>▶</span> : <span style={{ width: 10, height: 10, borderRadius: 5, background: C.sky }} />}
              {r.n}
              {r.target && <div style={{ marginLeft: "auto", marginRight: 12 }}><Check at={58} size={40} /></div>}
            </div>
          ))}
        </Card>
        {/* içerik kartı yerine oturur */}
        <div style={{ position: "relative", height: 112 }}>
          <div style={{ position: "absolute", inset: 0, ...card, padding: "16px 20px", display: "flex", alignItems: "center", gap: 18, transform: `translateY(${(1 - dock) * 260}px) rotate(${(1 - dock) * 6}deg)`, opacity: Math.min(1, dock * 2), border: `2.5px solid ${C.green}` }}>
            <div style={{ width: 104, height: 70, borderRadius: 14, background: `linear-gradient(135deg, ${C.royal}, ${C.cyan})`, display: "flex", alignItems: "center", justifyContent: "center" }}><IcoPlay /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 24, fontWeight: 700 }}>Türev'e Giriş</div>
              <div style={{ fontSize: 19, color: C.inkMuted }}>AYT Matematik › Türev</div>
            </div>
            <Pill col={C.green}>Bağlandı</Pill>
          </div>
        </div>
      </div>
      <Burst at={86} x={300} y={830} />
    </div>
  );
};

export const StudioLineScreen: React.FC = () => {
  const f = useCurrentFrame();
  const p = ramp(f, 10, 70, 0, 1, Easing.inOut(Easing.cubic));
  const pts = [0.12, 0.2, 0.18, 0.32, 0.3, 0.45, 0.42, 0.58, 0.62, 0.76, 0.8, 0.95];
  const W = 520, Hh = 230;
  const xy = pts.map((v, i) => [(i / (pts.length - 1)) * W, Hh - v * Hh] as const);
  const d = xy.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${d} L${W},${Hh} L0,${Hh} Z`;
  const headI = p * (pts.length - 1);
  const i0 = Math.floor(headI), i1 = Math.min(pts.length - 1, i0 + 1);
  const hx = xy[i0][0] + (xy[i1][0] - xy[i0][0]) * (headI - i0);
  const hy = xy[i0][1] + (xy[i1][1] - xy[i0][1]) * (headI - i0);
  const heart = 1 + Math.max(0, Math.sin(f / 4)) * 0.18 * (f > 30 ? 1 : 0);
  const kpi = (lbl: string, v: string, col: string, delta: string, ico: React.ReactNode, d0: number) => (
    <Card d={d0} style={{ flex: 1, padding: "18px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>{ico}<Label>{lbl}</Label></div>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 52, color: col, fontVariantNumeric: "tabular-nums", lineHeight: 1.1, marginTop: 6 }}>{v}</div>
      <Pill col={C.green} style={{ fontSize: 18, marginTop: 4 }}>▲ {delta}</Pill>
    </Card>
  );
  return (
    <div style={{ position: "relative", height: 1048 }}>
      <AppBar title="Stüdyo Analitiği" sub="Son 30 gün" />
      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", gap: 16 }}>
          {kpi("İZLENME", tr(ramp(f, 6, 70, 0, 12480)), C.royal, "%38", <IcoPlay c={C.blue} />, 2)}
          {kpi("BEĞENİ", tr(ramp(f, 10, 74, 0, 1936)), C.magenta, "%24", <span style={{ fontSize: 26, color: C.magenta, transform: `scale(${heart})`, display: "inline-block" }}>♥</span>, 6)}
        </div>
        <Card d={10} style={{ padding: "20px 22px 16px", position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ fontSize: 24, fontWeight: 700 }}>Günlük izlenme</div>
            <Pill col={C.blue}>30 gün</Pill>
          </div>
          <svg width={W + 20} height={Hh + 10} style={{ overflow: "visible" }}>
            <defs>
              <linearGradient id="ogA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.sky} stopOpacity={0.45} /><stop offset="1" stopColor={C.sky} stopOpacity={0} /></linearGradient>
              <clipPath id="ogC"><rect x={0} y={-20} width={hx + 1} height={Hh + 40} /></clipPath>
            </defs>
            {[0, 1, 2, 3].map((g) => <line key={g} x1={0} x2={W} y1={(g / 3) * Hh} y2={(g / 3) * Hh} stroke={C.line} strokeWidth={2} />)}
            <g clipPath="url(#ogC)">
              <path d={area} fill="url(#ogA)" />
              <path d={d} fill="none" stroke={C.blue} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" />
            </g>
            <circle cx={hx} cy={hy} r={13 + Math.sin(f / 3) * 3} fill={C.cyan} opacity={0.4} />
            <circle cx={hx} cy={hy} r={8} fill={C.blue} stroke="white" strokeWidth={3} />
          </svg>
          {f > 72 && (
            <div style={{ position: "absolute", right: 30, top: 70, padding: "10px 16px", borderRadius: 14, background: C.navy, color: "white", fontSize: 20, fontWeight: 600, transform: `scale(${spring({ frame: f - 72, fps: 30, config: { damping: 10 } })})` }}>
              Bugün <b style={{ color: C.cyan }}>1.240</b> izlenme
            </div>
          )}
        </Card>
        <Card d={20} style={{ padding: "16px 22px" }}>
          {[
            { n: "Türev'e Giriş", v: 4210, p: 1 },
            { n: "Türev Özeti", v: 2875, p: 0.68 },
            { n: "Formül Kartı", v: 1630, p: 0.39 },
          ].map((r, i) => (
            <div key={i} style={{ padding: "8px 0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, fontWeight: 600, marginBottom: 6 }}>
                <span>{r.n}</span>
                <span style={{ color: C.inkMuted, fontVariantNumeric: "tabular-nums" }}>{tr(ramp(f, 26 + i * 6, 76, 0, r.v))}</span>
              </div>
              <Bar p={ramp(f, 26 + i * 6, 76) * r.p} col={i ? C.sky : C.blue} h={12} />
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

/* ═════════════ OGRETMEN 2 ═════════════ */

export const EditorScreen: React.FC<{ l1?: string; l2?: string; opts?: string[]; correct?: number; meta?: [string, string, string]; stamp?: boolean; sub?: string }> = ({
  l1 = "f(x) = x³ − 3x² + 2 ise",
  l2 = "f′(1) değeri kaçtır?",
  opts = ["−3", "−1", "0", "1", "3"],
  correct = 0,
  meta = ["Matematik", "Türev", "Orta"],
  stamp = true,
  sub = "Yeni soru · Matematik",
}) => {
  const f = useCurrentFrame();
  const n1 = Math.floor(ramp(f, 8, 34, 0, l1.length, Easing.linear));
  const n2 = Math.floor(ramp(f, 36, 54, 0, l2.length, Easing.linear));
  const tools = ["B", "I", "U", "x²", "Σ", "▣", "≡"];
  const hot = (i: number) => (i === 0 && f > 6 && f < 34) || (i === 3 && f > 14 && f < 24) || (i === 4 && f > 36 && f < 54);
  const caret = Math.floor(f / 6) % 2 === 0;
  const approved = f >= 96;
  return (
    <div style={{ position: "relative", height: 1048 }}>
      <AppBar title="Soru Havuzu" sub={sub} />
      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 14 }}>
        <Card d={2} style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ display: "flex", gap: 6, padding: "12px 14px", borderBottom: `1.5px solid ${C.line}`, background: "#fbfaf7" }}>
            {tools.map((t, i) => (
              <div key={i} style={{ width: 62, height: 50, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 24, fontStyle: i === 1 ? "italic" : undefined, textDecoration: i === 2 ? "underline" : undefined, background: hot(i) ? C.blue : "transparent", color: hot(i) ? "white" : C.ink, transform: `scale(${hot(i) ? 1.08 : 1})` }}>{t}</div>
            ))}
          </div>
          <div style={{ padding: "22px 24px", minHeight: 150, fontSize: 31, lineHeight: 1.45 }}>
            <div style={{ fontWeight: 700, color: C.royal, fontFamily: "Georgia, serif", fontStyle: "italic" }}>
              {l1.slice(0, n1)}
              {f < 35 && caret && <span style={{ borderLeft: `3px solid ${C.blue}`, marginLeft: 2 }} />}
            </div>
            <div style={{ fontWeight: 600 }}>
              {l2.slice(0, n2)}
              {f >= 35 && f < 60 && caret && <span style={{ borderLeft: `3px solid ${C.blue}`, marginLeft: 2 }} />}
            </div>
          </div>
        </Card>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {opts.map((o, i) => {
            const at = 54 + i * 4;
            const right = i === correct && f >= 80;
            return (
              <Rise key={i} d={at} from={30}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 18px", borderRadius: 20, background: right ? `${C.green}1f` : C.surface, border: `2.5px solid ${right ? C.green : C.line}`, fontSize: 26, fontWeight: 600 }}>
                  <span style={{ width: 44, height: 44, borderRadius: 22, background: right ? C.green : C.pastelBlue, color: right ? "white" : C.royal, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 22 }}>{"ABCDE"[i]}</span>
                  {o}
                  {right && <span style={{ marginLeft: "auto", color: C.green, fontWeight: 800, fontSize: 22 }}>Doğru cevap</span>}
                </div>
              </Rise>
            );
          })}
        </div>
        <Rise d={70}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Pill col={C.royal}>{meta[0]}</Pill>
            <Pill col={C.royal}>{meta[1]}</Pill>
            <Pill col={C.amber}>{meta[2]}</Pill>
            <span style={{ marginLeft: "auto", fontSize: 20, fontWeight: 700, color: approved && stamp ? C.green : C.amber }}>{approved && stamp ? "● Onaylandı" : f > 84 ? "● Onaya gönderildi" : "● Taslak"}</span>
          </div>
        </Rise>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 500, display: "flex", justifyContent: "flex-end", paddingRight: 40, zIndex: 25 }}>
        {stamp && <Stamp at={96}>Branş onayı ✓</Stamp>}
      </div>
    </div>
  );
};

const qrows = [
  "Türevin tanımı · limit ile",
  "f′(x) hesaplama · polinom",
  "Teğet doğrusu eğimi",
  "Artan / azalan aralık",
  "Ekstremum noktası",
  "Zincir kuralı",
  "Çarpım kuralı",
  "Bölüm kuralı",
  "Maksimum–minimum problemi",
  "İkinci türev · büküm",
  "Türev grafiği yorumu",
  "Hız–ivme problemi",
];

export const PoolScreen: React.FC = () => {
  const f = useCurrentFrame();
  const filters = [
    { k: "DERS", v: "Matematik", at: 6 },
    { k: "KONU", v: "Türev", at: 14 },
    { k: "ZORLUK", v: "Orta", at: 22 },
  ];
  const tickStart = 36, gap = 5;
  const ticked = Math.max(0, Math.min(qrows.length, Math.floor((f - tickStart) / gap) + 1));
  const count = Math.min(40, Math.round(ramp(f, tickStart, tickStart + qrows.length * gap + 10, 0, 40, Easing.linear)));
  const scroll = interpolate(f, [tickStart + 20, tickStart + qrows.length * gap + 10], [0, 6 * 68], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const ringP = count / 40;
  return (
    <div style={{ position: "relative", height: 1048 }}>
      <AppBar title="Sınav Oluşturucu" sub="Havuzdan soru seç" />
      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", gap: 10 }}>
          {filters.map((fl, i) => {
            const on = f >= fl.at;
            const s = spring({ frame: f - fl.at, fps: 30, config: { damping: 9, stiffness: 240 } });
            return (
              <div key={i} style={{ flex: 1, padding: "12px 14px", borderRadius: 20, background: on ? GRAD_BRAND : C.surface, border: `2px solid ${on ? "transparent" : C.line}`, transform: `scale(${on ? 0.92 + 0.08 * s : 1})`, boxShadow: on ? `0 8px 18px ${C.cyan}55` : undefined }}>
                <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 2, color: on ? C.navy : C.inkMuted }}>{fl.k} ▾</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: on ? C.navy : C.ink }}>{on ? fl.v : "Seç"}</div>
              </div>
            );
          })}
        </div>
        <Card d={26} style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 20 }}>
          <svg width={96} height={96} viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
            <circle cx={50} cy={50} r={40} stroke={C.line} strokeWidth={12} fill="none" />
            <circle cx={50} cy={50} r={40} stroke={ringP >= 1 ? C.green : C.blue} strokeWidth={12} fill="none" strokeLinecap="round" strokeDasharray={251.3} strokeDashoffset={251.3 * (1 - ringP)} />
          </svg>
          <div>
            <Label>SEÇİLEN SORU</Label>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 60, lineHeight: 1, color: ringP >= 1 ? C.green : C.royal, fontVariantNumeric: "tabular-nums" }}>{count}<span style={{ fontSize: 32, color: C.inkMuted }}> / 40</span></div>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <Label>BULUNAN</Label>
            <div style={{ fontSize: 30, fontWeight: 800 }}>{tr(ramp(f, 22, 40, 0, 1284))}</div>
          </div>
        </Card>
        <div style={{ height: 560, overflow: "hidden", borderRadius: 24, position: "relative" }}>
          <div style={{ transform: `translateY(${-scroll}px)`, display: "flex", flexDirection: "column", gap: 8 }}>
            {qrows.map((r, i) => {
              const on = i < ticked;
              const at = tickStart + i * gap;
              const s = spring({ frame: f - at, fps: 30, config: { damping: 9, stiffness: 300 } });
              return (
                <Rise key={i} d={28 + Math.min(i, 7) * 2} from={30}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 18px", height: 60, borderRadius: 18, background: on ? `${C.blue}12` : C.surface, border: `2px solid ${on ? C.blue : C.line}` }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, border: `3px solid ${on ? C.blue : C.line}`, background: on ? C.blue : "white", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 900, fontSize: 24, transform: `scale(${on ? 0.8 + 0.2 * s : 1})` }}>{on ? "✓" : ""}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 22, fontWeight: 700 }}>{r}</div>
                      <div style={{ fontSize: 17, color: C.inkMuted }}>Soru #{1040 + i * 7} · Türev · Orta</div>
                    </div>
                  </div>
                </Rise>
              );
            })}
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 80, background: `linear-gradient(transparent, ${C.canvas})` }} />
        </div>
      </div>
    </div>
  );
};

export const PublishScreen: React.FC = () => {
  const f = useCurrentFrame();
  const sliderP = ramp(f, 12, 40, 0, 1, Easing.inOut(Easing.cubic));
  const mins = Math.round(sliderP * 135 / 5) * 5;
  const segs = ["Herkese açık", "Öğrencilerim", "Davet kodu"];
  const segX = interpolate(f, [44, 54], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const tapAt = 72;
  const press = f >= tapAt && f < tapAt + 6 ? 0.93 : 1;
  const live = f >= tapAt + 4;
  const ls = useSp(tapAt + 4, { damping: 10, stiffness: 220 });
  const segW = (516 - 12) / 3;
  return (
    <div style={{ position: "relative", height: 1048 }}>
      <AppBar title="Sınav Ayarları" sub="AYT Matematik Deneme 3" />
      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        <Card d={2} style={{ display: "flex", gap: 14, alignItems: "center", padding: "16px 20px" }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, background: C.pastelBlue, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: C.royal, fontSize: 26 }}>40</div>
          <div>
            <div style={{ fontSize: 25, fontWeight: 700 }}>40 soru seçildi</div>
            <div style={{ fontSize: 19, color: C.inkMuted }}>Matematik · Türev · Orta</div>
          </div>
          <Check at={6} size={44} />
        </Card>
        <Card d={6} style={{ padding: "20px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <Label>SINAV SÜRESİ</Label>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 46, color: C.royal, fontVariantNumeric: "tabular-nums" }}>{mins} dk</div>
          </div>
          <div style={{ position: "relative", height: 40, marginTop: 10 }}>
            <div style={{ position: "absolute", top: 14, left: 0, right: 0 }}><Bar p={sliderP} col={C.blue} h={12} /></div>
            <div style={{ position: "absolute", top: 0, left: `calc(${sliderP * 100}% - 20px)`, width: 40, height: 40, borderRadius: 20, background: "white", border: `5px solid ${C.blue}`, boxShadow: `0 4px 14px ${C.blue}66` }} />
          </div>
        </Card>
        <Card d={10} style={{ padding: "20px 22px" }}>
          <Label style={{ marginBottom: 12 }}>ERİŞİM</Label>
          <div style={{ position: "relative", display: "flex", background: "#f1ede6", borderRadius: 18, padding: 6 }}>
            <div style={{ position: "absolute", top: 6, left: 6 + segX * segW, width: segW, height: 56, borderRadius: 14, background: GRAD_BRAND, boxShadow: `0 6px 14px ${C.cyan}66` }} />
            {segs.map((s, i) => (
              <div key={i} style={{ position: "relative", flex: 1, height: 56, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 21, fontWeight: 700, color: Math.round(segX) === i ? C.navy : C.inkMuted }}>{s}</div>
            ))}
          </div>
        </Card>
        <div style={{ position: "relative" }}>
          <Rise d={18}>
            <div style={{ height: 104, borderRadius: 28, background: live ? `linear-gradient(100deg, ${C.green}, #16a34a)` : GRAD_BRAND, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 40, color: live ? "white" : C.navy, transform: `scale(${press * (live ? 0.9 + 0.1 * ls : 1)})`, boxShadow: `0 14px ${30 + Math.sin(f / 5) * 10}px ${live ? C.green : C.cyan}88`, position: "relative", overflow: "hidden" }}>
              {live ? "Yayında ✓" : "Yayınla"}
              {!live && <Shine />}
            </div>
          </Rise>
          <Tap x={300} y={52} at={tapAt} col={C.cyan} />
        </div>
        {live && (
          <Rise d={tapAt + 12}>
            <div style={{ textAlign: "center", fontSize: 22, color: C.inkMuted, fontWeight: 600 }}>Öğrencilerin denemeyi görebilir</div>
          </Rise>
        )}
      </div>
      <Burst at={tapAt + 4} x={300} y={600} n={24} />
    </div>
  );
};

/* ═════════════ OGRETMEN 3 ═════════════ */

const days = ["Pzt", "Sal", "Çar", "Per", "Cum"];
const hours = ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];
const avail = [
  [1, 0, 1, 1, 0],
  [1, 1, 0, 1, 1],
  [0, 1, 1, 0, 1],
  [1, 1, 1, 1, 0],
  [1, 0, 1, 1, 1],
  [0, 1, 0, 1, 1],
];
const RES = { r: 3, c: 2 };

export const CalendarScreen: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const resAt = 62;
  const flip = ramp(f, resAt, resAt + 10, 0, 1, Easing.inOut(Easing.cubic));
  const fee = ramp(f, 76, 104, 0, 0.62, Easing.inOut(Easing.cubic));
  const cnt = avail.flat().filter(Boolean).length;
  const lit = avail.flat().filter((v, i) => v && f >= 8 + (Math.floor(i / 5) + (i % 5)) * 3).length;
  return (
    <div style={{ position: "relative", height: 1048 }}>
      <AppBar title="Müsaitlik Takvimi" sub="Bu hafta" tone="feather" right={<Pill col={C.green}>{lit} saat açık</Pill>} />
      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        <Card d={2} style={{ padding: "16px 14px" }}>
          <div style={{ display: "grid", gridTemplateColumns: `76px repeat(5, 1fr)`, gap: 8 }}>
            <div />
            {days.map((d) => <div key={d} style={{ textAlign: "center", fontSize: 20, fontWeight: 800, color: C.inkMuted }}>{d}</div>)}
            {hours.map((h, r) => (
              <React.Fragment key={h}>
                <div style={{ fontSize: 18, fontWeight: 600, color: C.inkMuted, display: "flex", alignItems: "center" }}>{h}</div>
                {days.map((_, c) => {
                  const on = avail[r][c] === 1;
                  const at = 8 + (r + c) * 3;
                  const s = spring({ frame: f - at, fps, config: { damping: 10, stiffness: 240 } });
                  const isRes = r === RES.r && c === RES.c;
                  const showRes = isRes && flip > 0.5;
                  const bg = showRes ? GRAD_FEATHER : on && f >= at ? `linear-gradient(140deg, #4ade80, ${C.green})` : "#f1ede6";
                  return (
                    <div key={c} style={{ height: 62, borderRadius: 14, background: bg, transform: `${isRes ? `rotateY(${flip * 180}deg) ` : ""}scale(${on ? 0.85 + 0.15 * Math.min(1, s) : 1})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: showRes ? `0 0 22px ${C.coral}aa` : on && f >= at ? `0 4px 12px ${C.green}44` : undefined, position: "relative" }}>
                      {showRes ? (
                        <div style={{ transform: "rotateY(180deg)", color: "white", fontSize: 15, fontWeight: 800, textAlign: "center", lineHeight: 1.1 }}>REZERVE<br />Elif K.</div>
                      ) : on && f >= at ? (
                        <span style={{ color: "white", fontSize: 22, fontWeight: 900, opacity: Math.min(1, s) }}>✓</span>
                      ) : null}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </Card>
        <Card d={70} style={{ padding: "20px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Label>DERS ÜCRETİ</Label>
            <Pill col={C.coral}>Komisyon %10</Pill>
          </div>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 36, margin: "10px 0 14px", color: C.ink }}>Ücretini sen belirle</div>
          <div style={{ position: "relative", height: 40 }}>
            <div style={{ position: "absolute", top: 14, left: 0, right: 0 }}><Bar p={fee} col={GRAD_FEATHER} h={12} /></div>
            <div style={{ position: "absolute", top: 0, left: `calc(${fee * 100}% - 20px)`, width: 40, height: 40, borderRadius: 20, background: "white", border: `5px solid ${C.coral}`, boxShadow: `0 4px 14px ${C.coral}66`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: C.coral }}>₺</div>
          </div>
        </Card>
      </div>
      <Toast at={resAt + 6} icon={<Avatar txt="EK" col={C.pastelButter} size={52} ring={C.coral} />}>
        <b>Elif K.</b> Çarşamba 16:00 dersini rezerve etti
      </Toast>
      <div style={{ display: "none" }}>{cnt}</div>
    </div>
  );
};

export const AssignScreen: React.FC = () => {
  const f = useCurrentFrame();
  const items = [
    { k: "ÖDEV", n: "Türev Problemleri · 20 soru", col: C.amber, at: 22 },
    { k: "SINAV", n: "AYT Matematik Deneme 3", col: C.coral, at: 48 },
  ];
  const ring = ramp(f, 10, 90, 0.35, 0.72);
  return (
    <div style={{ position: "relative", height: 1048 }}>
      <AppBar title="Koçluk Paneli" sub="Öğrencilerim" tone="feather" />
      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        <Card d={2} style={{ display: "flex", alignItems: "center", gap: 18, padding: "18px 20px" }}>
          <div style={{ position: "relative", width: 96, height: 96 }}>
            <svg width={96} height={96} viewBox="0 0 100 100" style={{ position: "absolute", transform: "rotate(-90deg)" }}>
              <circle cx={50} cy={50} r={44} stroke={C.line} strokeWidth={8} fill="none" />
              <circle cx={50} cy={50} r={44} stroke={C.coral} strokeWidth={8} fill="none" strokeLinecap="round" strokeDasharray={276.5} strokeDashoffset={276.5 * (1 - ring)} />
            </svg>
            <div style={{ position: "absolute", inset: 12 }}><Avatar txt="EK" col={C.pastelButter} size={72} /></div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 30, fontWeight: 800 }}>Elif K.</div>
            <div style={{ fontSize: 20, color: C.inkMuted }}>AYT · Sayısal · Koçluk</div>
          </div>
          <Pill col={C.green}>Aktif</Pill>
        </Card>
        <Label style={{ marginTop: 4 }}>ATANANLAR</Label>
        {items.map((it, i) => {
          const fly = ramp(f, it.at - 12, it.at, 0, 1, Easing.out(Easing.back(1.3)));
          return (
            <div key={i} style={{ position: "relative" }}>
              <div style={{ ...card, display: "flex", alignItems: "center", gap: 16, padding: "18px 20px", transform: `translateY(${(1 - fly) * 420}px) scale(${0.85 + 0.15 * fly})`, opacity: Math.min(1, fly * 2), borderLeft: `8px solid ${it.col}` }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: 2, color: it.col }}>{it.k}</div>
                  <div style={{ fontSize: 25, fontWeight: 700 }}>{it.n}</div>
                  <div style={{ fontSize: 18, color: C.inkMuted, marginTop: 2 }}>Teslim: Cuma 20:00</div>
                </div>
                <Check at={it.at + 6} col={C.green} size={48} />
              </div>
              {f >= it.at + 8 && f < it.at + 40 && (
                <div style={{ position: "absolute", right: 90, top: 18 }}><Stamp at={it.at + 8} rot={-6} style={{ fontSize: 24, padding: "6px 14px" }}>Atandı</Stamp></div>
              )}
            </div>
          );
        })}
        <div style={{ display: "flex", gap: 12 }}>
          {[
            { n: "+ Ödev ata", at: 16 },
            { n: "+ Sınav ata", at: 42 },
          ].map((b, i) => (
            <Rise key={i} d={6 + i * 4} style={{ flex: 1 }}>
              <div style={{ position: "relative", padding: "20px", borderRadius: 22, textAlign: "center", fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 28, background: GRAD_FEATHER, color: "white", boxShadow: `0 10px 22px ${C.coral}55`, transform: `scale(${f >= b.at && f < b.at + 5 ? 0.94 : 1})` }}>
                {b.n}
                <Tap x={130} y={36} at={b.at} col={C.coral} />
              </div>
            </Rise>
          ))}
        </div>
        <Rise d={80}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
            <Avatar txt="EK" col={C.pastelButter} size={48} />
            <div style={{ padding: "14px 20px", borderRadius: "22px 22px 22px 6px", background: C.pastelLilac, fontSize: 23, fontWeight: 500 }}>Hocam ödevi başlattım, teşekkürler!</div>
          </div>
        </Rise>
      </div>
    </div>
  );
};

/* ═════════════ OGRETMEN 4 ═════════════ */

/** Kanca üstüne: dinleyen / kaçıran öğrenci ızgarası */
export const AttendGrid: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = 12;
  const miss = [2, 7, 10];
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 80, top: 1185, width: 780, display: "grid", gridTemplateColumns: "repeat(6, 1fr)", rowGap: 26, columnGap: 18 }}>
        {Array.from({ length: n }).map((_, i) => {
          const at = 6 + i * 3;
          const m = miss.includes(i);
          const s = spring({ frame: f - at, fps, config: { damping: 9, stiffness: 220 } });
          const col = f >= at ? (m ? C.red : C.green) : "rgba(225,239,255,0.35)";
          return (
            <div key={i} style={{ position: "relative", width: 100, height: 100, borderRadius: 50, background: "rgba(225,239,255,0.1)", border: `5px solid ${col}`, boxShadow: f >= at ? `0 0 ${24 * s}px ${col}` : undefined, display: "flex", alignItems: "flex-end", justifyContent: "center", overflow: "hidden", opacity: m && f >= at ? 0.55 : 1 }}>
              <div style={{ position: "absolute", top: 18, width: 34, height: 34, borderRadius: 17, background: "rgba(225,239,255,0.75)" }} />
              <div style={{ width: 66, height: 36, borderRadius: "33px 33px 0 0", background: "rgba(225,239,255,0.75)" }} />
              {f >= at && (
                <div style={{ position: "absolute", right: -2, top: -2, width: 36, height: 36, borderRadius: 18, background: col, color: "white", fontSize: 22, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${s})` }}>{m ? "✕" : "✓"}</div>
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const students = [
  { n: "Elif K.", c: C.pastelButter, ok: true, t: "19:00" },
  { n: "Mert A.", c: C.pastelBlue, ok: true, t: "19:01" },
  { n: "Zeynep T.", c: C.pastelSage, ok: false, t: "—" },
  { n: "Can D.", c: C.pastelLilac, ok: true, t: "19:02" },
  { n: "Ayşe Y.", c: C.pastelBlue, ok: true, t: "19:04" },
];

export const LiveScreen: React.FC = () => {
  const f = useCurrentFrame();
  const viewers = Math.round(ramp(f, 4, 60, 0, 48));
  const blink = 0.55 + 0.45 * Math.abs(Math.sin(f / 6));
  const draw = ramp(f, 10, 50, 0, 1, Easing.inOut(Easing.quad));
  const joined = Math.round(ramp(f, 40, 90, 0, 42));
  return (
    <div style={{ position: "relative", height: 1048 }}>
      <div style={{ padding: "0 20px" }}>
        <Rise d={0}>
          <div style={{ height: 340, borderRadius: 30, background: `radial-gradient(90% 90% at 30% 20%, ${C.royal}, ${C.navy} 70%)`, position: "relative", overflow: "hidden", boxShadow: `0 18px 40px ${C.navy}66` }}>
            {/* tahta */}
            <div style={{ position: "absolute", right: 26, top: 50, width: 300, height: 200, borderRadius: 16, background: "#0f2c2a", border: "6px solid #5b4630" }}>
              <svg width={288} height={188} viewBox="0 0 288 188">
                <path d="M24 60 Q40 30 56 60 T88 60 M100 40 L100 80 M116 52 L140 52 M116 66 L140 66 M156 40 Q176 20 186 50 Q196 80 216 60" fill="none" stroke="#e9fff4" strokeWidth={4} strokeLinecap="round" strokeDasharray={520} strokeDashoffset={520 * (1 - draw)} />
                <path d="M24 130 Q90 70 150 140 T270 110" fill="none" stroke={C.amber} strokeWidth={4} strokeDasharray={300} strokeDashoffset={300 * (1 - ramp(f, 40, 70))} />
              </svg>
            </div>
            {/* öğretmen silueti */}
            <div style={{ position: "absolute", left: 60, bottom: 0, width: 190, height: 250, transform: `translateY(${Math.sin(f / 10) * 4}px)` }}>
              <div style={{ position: "absolute", left: 55, top: 10, width: 80, height: 80, borderRadius: 40, background: "#f2c9a5" }} />
              <div style={{ position: "absolute", left: 50, top: 0, width: 90, height: 42, borderRadius: "45px 45px 10px 10px", background: "#3b2a22" }} />
              <div style={{ position: "absolute", left: 0, top: 100, width: 190, height: 160, borderRadius: "90px 90px 0 0", background: GRAD_BRAND }} />
            </div>
            <div style={{ position: "absolute", left: 20, top: 20, display: "flex", alignItems: "center", gap: 10, padding: "8px 18px", borderRadius: 12, background: C.red, color: "white", fontWeight: 800, fontSize: 22, letterSpacing: 2, boxShadow: `0 0 ${20 * blink}px ${C.red}` }}>
              <span style={{ width: 14, height: 14, borderRadius: 7, background: "white", opacity: blink }} /> CANLI
            </div>
            <div style={{ position: "absolute", left: 160, top: 20, padding: "8px 16px", borderRadius: 12, background: "rgba(0,0,0,0.45)", color: "white", fontWeight: 700, fontSize: 22, fontVariantNumeric: "tabular-nums" }}>👁 {viewers}</div>
            <div style={{ position: "absolute", left: 20, bottom: 18, right: 20, display: "flex", justifyContent: "flex-end" }}>
              <div style={{ padding: "6px 14px", borderRadius: 10, background: "rgba(0,0,0,0.45)", color: C.ice, fontSize: 18, fontWeight: 600 }}>AYT Matematik · Türev</div>
            </div>
          </div>
        </Rise>
      </div>
      <div style={{ padding: "16px 24px 0", display: "flex", flexDirection: "column", gap: 12 }}>
        <Card d={30} style={{ padding: "18px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
            <div style={{ fontSize: 26, fontWeight: 800 }}>Katılım takibi</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 34, color: C.green, fontVariantNumeric: "tabular-nums" }}>{joined}<span style={{ color: C.inkMuted, fontSize: 24 }}> / 48</span></div>
          </div>
          <Bar p={joined / 48} col={C.green} h={12} />
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
            {students.map((s, i) => {
              const at = 40 + i * 9;
              return (
                <Rise key={i} d={at - 4} from={24}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "8px 4px" }}>
                    <Avatar txt={s.n.split(" ").map((x) => x[0]).join("")} col={s.c} size={46} />
                    <div style={{ flex: 1, fontSize: 23, fontWeight: 600 }}>{s.n}</div>
                    <div style={{ fontSize: 18, color: C.inkMuted, width: 70 }}>{s.t}</div>
                    {f >= at ? <Pill col={s.ok ? C.green : C.red} style={{ transform: `scale(${spring({ frame: f - at, fps: 30, config: { damping: 9 } })})` }}>{s.ok ? "Katıldı" : "Kaçırdı"}</Pill> : <Pill col={C.inkMuted}>…</Pill>}
                  </div>
                </Rise>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

const groups = [
  { n: "Türev", v: 4210, l: 812 },
  { n: "Limit", v: 2960, l: 540 },
  { n: "İntegral", v: 3480, l: 655 },
  { n: "Olasılık", v: 1920, l: 388 },
  { n: "Fonksiyon", v: 2550, l: 470 },
];

export const BarsScreen: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const maxV = 4400;
  const H0 = 300;
  return (
    <div style={{ position: "relative", height: 1048 }}>
      <AppBar title="Stüdyo Analitiği" sub="Ders bazında · bu ay" />
      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", gap: 14 }}>
          {[
            { k: "İZLENME", v: 15120, col: C.royal },
            { k: "BEĞENİ", v: 2865, col: C.sky },
            { k: "KATILIM", v: 88, col: C.green, pre: "%" },
          ].map((k, i) => (
            <Card key={i} d={2 + i * 3} style={{ flex: 1, padding: "14px 16px" }}>
              <Label style={{ fontSize: 16 }}>{k.k}</Label>
              <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 40, color: k.col, fontVariantNumeric: "tabular-nums" }}>{k.pre ?? ""}{tr(ramp(f, 6, 60, 0, k.v))}</div>
            </Card>
          ))}
        </div>
        <Card d={8} style={{ padding: "20px 18px 14px", position: "relative" }}>
          <div style={{ display: "flex", gap: 18, marginBottom: 14, fontSize: 20, fontWeight: 700 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 18, height: 18, borderRadius: 5, background: C.royal }} />İzlenme</span>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 18, height: 18, borderRadius: 5, background: C.cyan }} />Beğeni ×5</span>
          </div>
          <div style={{ height: H0, display: "flex", alignItems: "flex-end", justifyContent: "space-around", borderBottom: `3px solid ${C.line}`, position: "relative" }}>
            {[0.25, 0.5, 0.75].map((g) => <div key={g} style={{ position: "absolute", left: 0, right: 0, bottom: g * H0, height: 2, background: C.line }} />)}
            {groups.map((g, i) => {
              const s1 = spring({ frame: f - (14 + i * 6), fps, config: { damping: 12, stiffness: 110 } });
              const s2 = spring({ frame: f - (22 + i * 6), fps, config: { damping: 12, stiffness: 110 } });
              const top = i === 0 && f > 70;
              return (
                <div key={i} style={{ display: "flex", alignItems: "flex-end", gap: 6, position: "relative" }}>
                  <div style={{ width: 34, height: (g.v / maxV) * H0 * s1, borderRadius: "10px 10px 4px 4px", background: `linear-gradient(${C.blue}, ${C.royal})`, boxShadow: top ? `0 0 20px ${C.blue}` : undefined }} />
                  <div style={{ width: 34, height: ((g.l * 5) / maxV) * H0 * s2, borderRadius: "10px 10px 4px 4px", background: `linear-gradient(${C.cyan}, ${C.sky})` }} />
                </div>
              );
            })}
            {f > 70 && (
              <div style={{ position: "absolute", left: 20, top: -6, padding: "10px 16px", borderRadius: 14, background: C.navy, color: "white", fontSize: 19, fontWeight: 600, transform: `scale(${spring({ frame: f - 70, fps, config: { damping: 10 } })})`, transformOrigin: "left bottom" }}>
                Türev · <b style={{ color: C.cyan }}>4.210</b> izlenme · <b style={{ color: C.cyan }}>812</b> ♥
              </div>
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "space-around", marginTop: 10, fontSize: 18, fontWeight: 700, color: C.inkMuted }}>
            {groups.map((g) => <span key={g.n} style={{ width: 90, textAlign: "center" }}>{g.n}</span>)}
          </div>
        </Card>
        <Card d={30} style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 54, height: 54, borderRadius: 16, background: `${C.amber}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>💡</div>
          <div style={{ flex: 1, fontSize: 22, fontWeight: 600 }}>En çok izlenen dersin: <b style={{ color: C.royal }}>Türev</b></div>
        </Card>
      </div>
    </div>
  );
};

/* ═════════════ OGRETMEN 5 ═════════════ */

export const DonutScreen: React.FC = () => {
  const f = useCurrentFrame();
  const R = 170, SW = 56, L = 2 * Math.PI * R;
  const p = ramp(f, 14, 56, 0, 0.65, Easing.out(Easing.cubic));
  const p2 = ramp(f, 54, 74, 0, 0.35, Easing.out(Easing.cubic));
  const glow = 0.6 + 0.4 * Math.sin(f / 8);
  return (
    <div style={{ position: "relative", height: 1048 }}>
      <AppBar title="Kazanç" sub="Havuz modeli" tone="feather" />
      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 14, alignItems: "stretch" }}>
        <Rise d={2}>
          <div style={{ ...card, padding: "14px 20px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, background: C.pastelButter, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 800, color: C.amber }}>₺</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>Abonelik tahsilatı</div>
            <Pill col={C.amber} style={{ marginLeft: "auto" }}>%100</Pill>
          </div>
        </Rise>
        <div style={{ position: "relative", height: 440, display: "flex", justifyContent: "center", alignItems: "center" }}>
          {/* akan jetonlar */}
          {Array.from({ length: 10 }).map((_, i) => {
            const at = 4 + i * 5;
            const t = ramp(f, at, at + 18, 0, 1, Easing.in(Easing.quad));
            if (f < at || f > at + 18) return null;
            return <div key={i} style={{ position: "absolute", left: 280 + Math.sin(i * 2.3) * 120 * (1 - t), top: -10 + t * 200, width: 30, height: 30, borderRadius: 15, background: `radial-gradient(circle at 35% 35%, #ffe7a8, ${C.amber})`, border: "2px solid #d38b10", opacity: 1 - t * 0.6 }} />;
          })}
          <svg width={440} height={440} viewBox="-220 -220 440 440" style={{ transform: "rotate(-90deg)", filter: `drop-shadow(0 0 ${14 * glow}px ${C.coral}88)` }}>
            <defs>
              <linearGradient id="ogF" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={C.amber} /><stop offset="0.5" stopColor={C.coral} /><stop offset="1" stopColor={C.magenta} /></linearGradient>
            </defs>
            <circle r={R} fill="none" stroke="#efe9df" strokeWidth={SW} />
            <circle r={R} fill="none" stroke="url(#ogF)" strokeWidth={SW} strokeDasharray={`${L * p} ${L}`} strokeLinecap="butt" />
            <circle r={R} fill="none" stroke="#8a84a0" strokeWidth={SW - 10} strokeDasharray={`${L * p2} ${L}`} strokeDashoffset={-L * 0.65 - 4} />
          </svg>
          <div style={{ position: "absolute", textAlign: "center" }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 110, lineHeight: 1, backgroundImage: GRAD_FEATHER, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", fontVariantNumeric: "tabular-nums", paddingBottom: 6 }}>%{Math.round(p * 100)}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.inkMuted }}>öğretmen havuzu</div>
          </div>
        </div>
        <Card d={50} style={{ padding: "14px 20px" }}>
          {[
            { c: GRAD_FEATHER, k: "İçerik üreticileri (öğretmenler)", v: "%65", at: 50 },
            { c: "#8a84a0", k: "Platform", v: "%35", at: 62 },
          ].map((r, i) => (
            <Rise key={i} d={r.at} from={20}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "8px 0", fontSize: 24, fontWeight: 600 }}>
                <span style={{ width: 22, height: 22, borderRadius: 6, background: r.c }} />
                {r.k}
                <b style={{ marginLeft: "auto", fontFamily: FONT_DISPLAY, fontSize: 30 }}>{r.v}</b>
              </div>
            </Rise>
          ))}
        </Card>
      </div>
    </div>
  );
};

export const LadderScreen: React.FC = () => {
  const f = useCurrentFrame();
  const steps = [
    { n: "Yeni", stars: 1, at: 14 },
    { n: "Kıdemli", stars: 2, at: 44 },
    { n: "Süper Hoca", stars: 3, at: 74 },
  ];
  const lvl = f >= 74 ? 2 : f >= 44 ? 1 : 0;
  // avatar zıplaması
  const pos = (i: number) => ({ x: 40 + i * 182 + 84, y: 420 - ((i + 1) * 100 + 20) - 72 });
  let ax = pos(0).x, ay = pos(0).y;
  for (let i = 1; i < 3; i++) {
    const a = steps[i].at - 12;
    const t = ramp(f, a, a + 12, 0, 1, Easing.inOut(Easing.quad));
    if (f >= a) {
      const p0 = pos(i - 1), p1 = pos(i);
      ax = p0.x + (p1.x - p0.x) * t;
      ay = p0.y + (p1.y - p0.y) * t - Math.sin(t * Math.PI) * 90;
    }
  }
  const mult = ramp(f, 10, 20, 0, 1 / 3) + ramp(f, 40, 52, 0, 1 / 3) + ramp(f, 70, 82, 0, 1 / 3);
  return (
    <div style={{ position: "relative", height: 1048 }}>
      <AppBar title="Öğretmen Seviyesi" sub="İzlenme payını etkiler" tone="feather" />
      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        <Card d={2} style={{ padding: 0, height: 420, position: "relative", overflow: "hidden", background: `linear-gradient(180deg, #fff7ec, ${C.surface})` }}>
          {steps.map((s, i) => {
            const on = lvl >= i;
            const cur = lvl === i;
            const sp = useSpLocal(f, s.at);
            return (
              <div key={i} style={{ position: "absolute", left: 40 + i * 182, bottom: 0, width: 168, height: (i + 1) * 100 + 20, borderRadius: "22px 22px 0 0", background: on ? GRAD_FEATHER : "#efe9df", boxShadow: cur ? `0 0 ${30 + 10 * Math.sin(f / 5)}px ${C.coral}aa` : undefined, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 16, transform: `scaleY(${cur ? 0.96 + 0.04 * sp : 1})`, transformOrigin: "bottom" }}>
                <div style={{ fontSize: 24, letterSpacing: 2, color: on ? "white" : "#b9b0a2" }}>{"★".repeat(s.stars)}</div>
                <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 25, color: on ? "white" : C.inkMuted, marginTop: 4, textAlign: "center", lineHeight: 1.05, whiteSpace: "pre-line" }}>{s.n.replace(" ", "\n")}</div>
              </div>
            );
          })}
          <div style={{ position: "absolute", left: ax - 34, top: ay, width: 68, height: 68, zIndex: 5 }}>
            <Avatar txt="AY" col={C.pastelLilac} size={68} ring="white" />
          </div>
          <Burst at={74} x={ax} y={ay + 30} />
        </Card>
        <Card d={10} style={{ padding: "18px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Label>SEVİYE ÇARPANI</Label>
            <Pill col={C.coral}>{steps[lvl].n} ↑</Pill>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ flex: 1 }}><Bar p={Math.max(0, Math.min(1, (mult - i / 3) * 3))} col={GRAD_FEATHER} h={22} glow /></div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 18, fontWeight: 700, color: C.inkMuted }}>
            <span>Yeni</span><span>Kıdemli</span><span>Süper Hoca</span>
          </div>
        </Card>
        <Rise d={78}>
          <div style={{ ...card, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, border: `2.5px solid ${C.coral}` }}>
            <div style={{ fontSize: 34 }}>🏆</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>Süper Hoca seviyesine ulaştın!</div>
          </div>
        </Rise>
      </div>
    </div>
  );
};
const useSpLocal = (f: number, at: number) => spring({ frame: f - at, fps: 30, config: { damping: 8, stiffness: 200 } });

export const BalanceScreen: React.FC = () => {
  const f = useCurrentFrame();
  const p = ramp(f, 8, 66, 0, 1, Easing.inOut(Easing.cubic));
  const full = f >= 66;
  const act = useSp(68, { damping: 9, stiffness: 220 });
  const tapAt = 88;
  const sent = f >= tapAt + 4;
  return (
    <div style={{ position: "relative", height: 1048 }}>
      <AppBar title="Cüzdan" sub="Kazanç bakiyesi" tone="feather" />
      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        <Rise d={2}>
          <div style={{ borderRadius: 30, padding: "26px 26px", background: `linear-gradient(140deg, ${C.navy}, ${C.plum})`, color: "white", position: "relative", overflow: "hidden", boxShadow: `0 18px 40px ${C.plum}66` }}>
            <div style={{ position: "absolute", right: -60, top: -60, width: 240, height: 240, borderRadius: 120, background: `radial-gradient(circle, ${C.coral}88, transparent 70%)` }} />
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: 2, color: C.ice, opacity: 0.8 }}>BAKİYE</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 96, lineHeight: 1.1, fontVariantNumeric: "tabular-nums" }}>{tr(p * 500)} ₺</div>
            <div style={{ position: "relative", marginTop: 20 }}>
              <Bar p={p} col={full ? `linear-gradient(90deg, ${C.green}, #4ade80)` : GRAD_FEATHER} h={24} bg="rgba(255,255,255,0.15)" glow />
              <div style={{ position: "absolute", right: -2, top: -12, width: 6, height: 48, borderRadius: 3, background: C.amberSoft, boxShadow: `0 0 12px ${C.amber}` }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 20, fontWeight: 600, color: C.ice }}>
              <span>0 ₺</span>
              <span style={{ color: C.amberSoft }}>Çekim eşiği 500 ₺</span>
            </div>
          </div>
        </Rise>
        <div style={{ position: "relative" }}>
          <Rise d={10}>
            <div style={{ height: 106, borderRadius: 28, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 40, position: "relative", overflow: "hidden", background: sent ? `linear-gradient(100deg, ${C.green}, #16a34a)` : full ? GRAD_FEATHER : "#e4ded4", color: full ? "white" : "#a39b8e", transform: `scale(${full ? (f >= tapAt && f < tapAt + 5 ? 0.93 : 0.92 + 0.08 * act) : 1})`, boxShadow: full ? `0 14px ${30 + 10 * Math.sin(f / 5)}px ${sent ? C.green : C.coral}88` : undefined }}>
              {!full && <span style={{ fontSize: 32 }}>🔒</span>}
              {sent ? "Talep oluşturuldu ✓" : "Çekim talebi"}
              {full && !sent && <Shine />}
            </div>
          </Rise>
          <Tap x={300} y={53} at={tapAt} col={C.coral} />
        </div>
        <Card d={20} style={{ padding: "16px 22px" }}>
          <Label style={{ marginBottom: 10 }}>KAZANÇ KAYNAKLARI</Label>
          {[
            { n: "İzlenme payı (havuz)", c: C.coral, w: 0.7 },
            { n: "Özel ders", c: C.amber, w: 0.45 },
          ].map((r, i) => (
            <div key={i} style={{ padding: "8px 0" }}>
              <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 6 }}>{r.n}</div>
              <Bar p={ramp(f, 24 + i * 8, 70) * r.w} col={r.c} h={12} />
            </div>
          ))}
        </Card>
      </div>
      <Burst at={tapAt + 4} x={300} y={420} n={22} />
    </div>
  );
};

/* ═════════════ OGRETMEN 7 ═════════════ */

const roster = [
  { n: "Elif K.", c: C.pastelButter, tr: "AYT · Sayısal" },
  { n: "Mert A.", c: C.pastelBlue, tr: "AYT · Sayısal" },
  { n: "Zeynep T.", c: C.pastelSage, tr: "TYT" },
  { n: "Can D.", c: C.pastelLilac, tr: "AYT · Eşit Ağırlık" },
  { n: "Ayşe Y.", c: C.pastelBlue, tr: "TYT" },
  { n: "Emre B.", c: C.pastelButter, tr: "LGS" },
];
const ini = (n: string) => n.split(" ").map((x) => x[0]).join("");

export const RosterScreen: React.FC = () => {
  const f = useCurrentFrame();
  const taps = [24, 38, 52, 66];
  const done = taps.filter((t) => f >= t + 3).length;
  const rowY = (i: number) => 330 + i * 92;
  return (
    <div style={{ position: "relative", height: 1048 }}>
      <AppBar title="Koçluk Paneli" sub="12 öğrenci" right={<Pill col={C.green}>Atanan {done}</Pill>} />
      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        <Card d={2} style={{ padding: "16px 20px", background: `linear-gradient(140deg, ${C.pastelBlue}, #f3f7ff)` }}>
          <Label>ATANACAK</Label>
          <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
            <Rise d={8} from={20}><Pill col={C.amber} bg="white" style={{ fontSize: 21, padding: "10px 16px", border: `2px solid ${C.amber}` }}>Ödev · Türev Problemleri</Pill></Rise>
            <Rise d={13} from={20}><Pill col={C.coral} bg="white" style={{ fontSize: 21, padding: "10px 16px", border: `2px solid ${C.coral}` }}>Sınav · AYT Deneme 3</Pill></Rise>
          </div>
        </Card>
        {roster.map((r, i) => {
          const t = taps[i];
          const on = t !== undefined && f >= t + 3;
          const s = t !== undefined ? spring({ frame: f - t - 3, fps: 30, config: { damping: 9, stiffness: 240 } }) : 0;
          return (
            <Rise key={i} d={6 + i * 3} from={30}>
              <div style={{ ...card, padding: "12px 16px", display: "flex", alignItems: "center", gap: 14, position: "relative", border: `2px solid ${on ? C.green : C.line}` }}>
                <Avatar txt={ini(r.n)} col={r.c} size={52} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 24, fontWeight: 700 }}>{r.n}</div>
                  <div style={{ fontSize: 18, color: C.inkMuted }}>{r.tr}</div>
                </div>
                <div style={{ position: "relative", padding: "10px 20px", borderRadius: 16, fontWeight: 800, fontSize: 21, background: on ? C.green : GRAD_BRAND, color: on ? "white" : C.navy, transform: `scale(${on ? 0.9 + 0.1 * s : f >= (t ?? 999) && f < (t ?? 0) + 4 ? 0.92 : 1})`, minWidth: 116, textAlign: "center" }}>
                  {on ? "Atandı ✓" : "Ata"}
                  {t !== undefined && <Tap x={58} y={22} at={t} col={C.cyan} />}
                </div>
              </div>
            </Rise>
          );
        })}
      </div>
      {/* atama uçuşu: şablondan satıra */}
      {taps.map((t, i) => {
        const p = ramp(f, t + 2, t + 14, 0, 1, Easing.inOut(Easing.cubic));
        if (f < t + 2 || f > t + 14) return null;
        const x = 140 + (460 - 140) * p, y = 150 + (rowY(i) - 150) * p - Math.sin(p * Math.PI) * 80;
        return <div key={i} style={{ position: "absolute", left: x - 16, top: y - 16, width: 32, height: 32, borderRadius: 10, background: GRAD_BRAND, boxShadow: `0 0 20px ${C.cyan}`, transform: `rotate(${p * 360}deg) scale(${1 - p * 0.4})`, zIndex: 30 }} />;
      })}
    </div>
  );
};

const results = [
  { n: "Elif K.", c: C.pastelButter, v: 85 },
  { n: "Mert A.", c: C.pastelBlue, v: 72 },
  { n: "Zeynep T.", c: C.pastelSage, v: 48 },
  { n: "Can D.", c: C.pastelLilac, v: 91 },
  { n: "Ayşe Y.", c: C.pastelBlue, v: 66 },
];

export const ResultsScreen: React.FC = () => {
  const f = useCurrentFrame();
  const order = [...results].map((r, i) => ({ ...r, i })).sort((a, b) => b.v - a.v);
  const sortP = ramp(f, 66, 84, 0, 1, Easing.inOut(Easing.cubic));
  const RH = 96;
  const avg = Math.round(results.reduce((a, r) => a + r.v, 0) / results.length);
  const col = (v: number) => (v >= 80 ? C.green : v >= 60 ? C.blue : C.coral);
  return (
    <div style={{ position: "relative", height: 1048 }}>
      <AppBar title="Sonuçlar" sub="AYT Matematik Deneme 3" />
      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", gap: 14 }}>
          <Card d={2} style={{ flex: 1, padding: "14px 18px" }}>
            <Label style={{ fontSize: 16 }}>ORTALAMA</Label>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 48, color: C.royal, fontVariantNumeric: "tabular-nums" }}>%{Math.round(ramp(f, 10, 60, 0, avg))}</div>
          </Card>
          <Card d={6} style={{ flex: 1, padding: "14px 18px" }}>
            <Label style={{ fontSize: 16 }}>TESLİM</Label>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 48, color: C.green, fontVariantNumeric: "tabular-nums" }}>{Math.round(ramp(f, 4, 40, 0, 12))}<span style={{ fontSize: 28, color: C.inkMuted }}> / 12</span></div>
          </Card>
        </div>
        <Card d={8} style={{ padding: "12px 18px", position: "relative", height: RH * results.length + 24 }}>
          {results.map((r, i) => {
            const rank = order.findIndex((o) => o.i === i);
            const y = 12 + (i + (rank - i) * sortP) * RH;
            const at = 14 + i * 6;
            const p = ramp(f, at, at + 34, 0, 1, Easing.out(Easing.cubic));
            const flag = r.v < 60 && f >= 90;
            return (
              <div key={i} style={{ position: "absolute", left: 18, right: 18, top: y, height: RH - 10, display: "flex", alignItems: "center", gap: 14, opacity: ramp(f, at - 6, at) }}>
                <Avatar txt={ini(r.n)} col={r.c} size={50} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
                    <span>{r.n}</span>
                    <span style={{ color: col(r.v), fontVariantNumeric: "tabular-nums" }}>%{Math.round(p * r.v)}</span>
                  </div>
                  <Bar p={(p * r.v) / 100} col={col(r.v)} h={16} />
                </div>
                {flag && <div style={{ position: "absolute", right: 70, top: -6 }}><Stamp at={90} col={C.coral} rot={-4} style={{ fontSize: 18, padding: "4px 12px", borderWidth: 3 }}>Destek gerek</Stamp></div>}
              </div>
            );
          })}
        </Card>
        <Rise d={96}>
          <div style={{ ...card, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, border: `2.5px solid ${C.coral}` }}>
            <Avatar txt="ZT" col={C.pastelSage} size={46} />
            <div style={{ fontSize: 21, fontWeight: 600, flex: 1 }}>Zeynep T. · zorlandığı konu: <b style={{ color: C.coral }}>Zincir kuralı</b></div>
          </div>
        </Rise>
      </div>
    </div>
  );
};

/* ═════════════ OGRETMEN 8 ═════════════ */

export const QueueScreen: React.FC = () => {
  const f = useCurrentFrame();
  const others = [
    { n: "Soru #2196 · Permütasyon", by: "M. Demir" },
    { n: "Soru #2198 · Kombinasyon", by: "S. Kaya" },
    { n: "Soru #2201 · Binom", by: "E. Aydın" },
  ];
  const outAt = [14, 28, 42];
  const RH = 104;
  const gone = outAt.map((t) => ramp(f, t, t + 10, 0, 1, Easing.inOut(Easing.cubic)));
  const ahead = outAt.filter((t) => f < t + 5).length;
  const reviewing = f >= 46 && f < 72;
  const approved = f >= 72;
  const spin = f * 12;
  return (
    <div style={{ position: "relative", height: 1048 }}>
      <AppBar title="Branş Onayı" sub="Matematik · onay kuyruğu" tone="feather" />
      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 14 }}>
        <Card d={2} style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ position: "relative", width: 60, height: 60 }}>
            <svg width={60} height={60} viewBox="0 0 60 60" style={{ position: "absolute", transform: `rotate(${reviewing ? spin : 0}deg)` }}>
              <circle cx={30} cy={30} r={27} stroke={approved ? C.green : C.coral} strokeWidth={4} fill="none" strokeDasharray={reviewing ? "40 130" : "200 0"} strokeLinecap="round" />
            </svg>
            <div style={{ position: "absolute", inset: 6 }}><Avatar txt="BE" col={C.pastelLilac} size={48} /></div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 24, fontWeight: 700 }}>Branş editörü</div>
            <div style={{ fontSize: 18, color: C.inkMuted }}>Matematik</div>
          </div>
          <Pill col={approved ? C.green : C.coral}>{approved ? "Onayladı" : reviewing ? "İnceliyor…" : "Sırayla"}</Pill>
        </Card>
        <Label>KUYRUK</Label>
        <div style={{ position: "relative", height: RH * 4 }}>
          {others.map((o, i) => {
            const y = (i - gone.slice(0, i).reduce((a, b) => a + b, 0)) * RH;
            return (
              <div key={i} style={{ position: "absolute", left: 0, right: 0, top: y, height: RH - 12, ...card, padding: "12px 18px", display: "flex", alignItems: "center", gap: 14, opacity: 1 - gone[i], transform: `translateX(${gone[i] * 260}px) scale(${1 - gone[i] * 0.1})` }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>{o.n}</div>
                  <div style={{ fontSize: 17, color: C.inkMuted }}>{o.by}</div>
                </div>
                {f >= outAt[i] - 6 && <Check at={outAt[i] - 6} size={40} />}
              </div>
            );
          })}
          {(() => {
            const y = (3 - gone.reduce((a, b) => a + b, 0)) * RH;
            return (
              <div style={{ position: "absolute", left: 0, right: 0, top: y, height: RH - 12, ...card, padding: "12px 18px", display: "flex", alignItems: "center", gap: 14, border: `3px solid ${approved ? C.green : C.coral}`, boxShadow: `0 10px ${26 + 8 * Math.sin(f / 5)}px ${approved ? C.green : C.coral}55` }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 22, fontWeight: 800 }}>Senin sorun · Olasılık</div>
                  <div style={{ fontSize: 17, color: C.inkMuted }}>Kız öğrenci seçme olasılığı</div>
                </div>
                <Pill col={approved ? C.green : C.coral} style={{ fontVariantNumeric: "tabular-nums" }}>{approved ? "Onaylandı ✓" : reviewing ? "İnceleniyor" : `Sırada ${ahead + 1}`}</Pill>
              </div>
            );
          })()}
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", justifyContent: "center", zIndex: 25 }}>
        <Stamp at={80} col={C.green} rot={-6} style={{ fontSize: 54, padding: "16px 40px", borderWidth: 6 }}>YAYINDA</Stamp>
      </div>
      <Burst at={80} x={304} y={690} n={24} />
    </div>
  );
};

const solvers = ["Elif K.", "Mert A.", "Can D.", "Ayşe Y.", "Emre B.", "Deniz Ö.", "Selin A.", "Kerem T.", "Ece Y.", "Burak S."];

export const SolvedScreen: React.FC = () => {
  const f = useCurrentFrame();
  const n = Math.round(ramp(f, 6, 90, 0, 1248, Easing.inOut(Easing.quad)));
  const rate = ramp(f, 20, 70, 0, 0.62);
  const vis = solvers.map((s, i) => ({ s, at: 14 + i * 9, ok: i % 4 !== 2 })).filter((x) => f >= x.at);
  const pulse = 0.6 + 0.4 * Math.abs(Math.sin(f / 7));
  return (
    <div style={{ position: "relative", height: 1048 }}>
      <AppBar title="Sorularım" sub="Olasılık · yayında" tone="feather" />
      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 14 }}>
        <Card d={2} style={{ padding: "16px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <Pill col={C.green} style={{ fontSize: 18 }}><span style={{ width: 10, height: 10, borderRadius: 5, background: C.green, opacity: pulse }} />YAYINDA</Pill>
            <Pill col={C.royal} style={{ fontSize: 18 }}>Branş onaylı</Pill>
          </div>
          <div style={{ fontSize: 23, fontWeight: 600, lineHeight: 1.35 }}>Bir sınıfta 12 kız, 18 erkek öğrenci var. Rastgele seçilen öğrencinin kız olma olasılığı?</div>
        </Card>
        <div style={{ display: "flex", gap: 14 }}>
          <Card d={6} style={{ flex: 1.3, padding: "16px 20px" }}>
            <Label style={{ fontSize: 16 }}>ÇÖZEN ÖĞRENCİ</Label>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 64, lineHeight: 1.1, backgroundImage: GRAD_FEATHER, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", fontVariantNumeric: "tabular-nums" }}>{tr(n)}</div>
          </Card>
          <Card d={10} style={{ flex: 1, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
            <svg width={84} height={84} viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
              <circle cx={50} cy={50} r={40} stroke={C.line} strokeWidth={14} fill="none" />
              <circle cx={50} cy={50} r={40} stroke={C.green} strokeWidth={14} fill="none" strokeDasharray={251.3} strokeDashoffset={251.3 * (1 - rate)} />
            </svg>
            <div>
              <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 36, color: C.green }}>%{Math.round(rate * 100)}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.inkMuted }}>doğru</div>
            </div>
          </Card>
        </div>
        <Card d={12} style={{ padding: "12px 18px", height: 330, overflow: "hidden", position: "relative" }}>
          <Label style={{ marginBottom: 6 }}>CANLI AKIŞ</Label>
          {vis.map((x, k) => {
            const pos = vis.length - 1 - k;
            const s = spring({ frame: f - x.at, fps: 30, config: { damping: 13, stiffness: 200 } });
            return (
              <div key={x.s} style={{ position: "absolute", left: 18, right: 18, top: 44 + pos * 58 - (1 - s) * 40, opacity: Math.min(1, s * 2), display: "flex", alignItems: "center", gap: 12, fontSize: 21, fontWeight: 600 }}>
                <Avatar txt={ini(x.s)} col={[C.pastelBlue, C.pastelButter, C.pastelLilac, C.pastelSage][k % 4]} size={42} />
                <span style={{ flex: 1 }}>{x.s} çözdü</span>
                <span style={{ width: 34, height: 34, borderRadius: 17, background: x.ok ? C.green : C.red, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>{x.ok ? "✓" : "✕"}</span>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
};

/* ═════════════ OGRETMEN 9 ═════════════ */

/** Kanca altı: hızla dönen saat */
export const ClockOverlay: React.FC = () => {
  const f = useCurrentFrame();
  const s = useSp(-12, { damping: 12 });
  const cx = 540, cy = 1300, r = 150;
  const minA = f * 24, hrA = f * 2;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: cx - r, top: cy - r, width: r * 2, height: r * 2, transform: `scale(${0.6 + 0.4 * s})`, opacity: s }}>
        <svg width={r * 2} height={r * 2} viewBox="-150 -150 300 300">
          <circle r={140} fill="rgba(5,1,46,0.55)" stroke={C.cyan} strokeWidth={6} style={{ filter: `drop-shadow(0 0 18px ${C.cyan})` }} />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return <line key={i} x1={Math.sin(a) * 112} y1={-Math.cos(a) * 112} x2={Math.sin(a) * 128} y2={-Math.cos(a) * 128} stroke={C.ice} strokeWidth={i % 3 ? 4 : 8} strokeLinecap="round" />;
          })}
          <line x1={0} y1={0} x2={Math.sin((hrA * Math.PI) / 180) * 64} y2={-Math.cos((hrA * Math.PI) / 180) * 64} stroke={C.white} strokeWidth={12} strokeLinecap="round" />
          <line x1={0} y1={0} x2={Math.sin((minA * Math.PI) / 180) * 104} y2={-Math.cos((minA * Math.PI) / 180) * 104} stroke={C.cyan} strokeWidth={7} strokeLinecap="round" />
          <circle r={12} fill={C.coral} />
        </svg>
      </div>
      {["SABAH", "ÖĞLE", "AKŞAM", "GECE"].map((w, i) => {
        const a = (i / 4) * Math.PI * 2 - Math.PI / 4;
        const at = -12 + i * 6;
        const ss = spring({ frame: f - at, fps: 30, config: { damping: 10 } });
        return (
          <div key={w} style={{ position: "absolute", left: cx + Math.cos(a) * 250 - 80, top: cy + Math.sin(a) * 170 - 22, width: 160, textAlign: "center", fontFamily: FONT_SANS, fontWeight: 700, fontSize: 30, letterSpacing: 3, color: [C.amber, C.cyan, C.coral, C.sky][i], opacity: ss, transform: `scale(${ss})` }}>{w}</div>
        );
      })}
    </AbsoluteFill>
  );
};

const hourPos = (h: number) => {
  const t = (h - 6) / 18;
  return { x: 70 + t * 940, y: 330 - Math.sin(t * Math.PI) * 90 };
};

/** Saat geçişli gün sahnesi */
export const DayScene: React.FC<{ time: string; prev: string; label: string; title: string; tint: string; children: React.ReactNode; callouts?: React.ReactNode; night?: boolean }> = ({ time, prev, label, title, tint, children, callouts, night }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const h = (t: string) => parseInt(t.slice(0, 2), 10) + parseInt(t.slice(3), 10) / 60;
  const p = ramp(f, 0, 18, 0, 1, Easing.inOut(Easing.cubic));
  const cur = h(prev) + (h(time) - h(prev)) * p;
  const sp = hourPos(cur);
  const roll = spring({ frame: f - 2, fps, config: { damping: 13, stiffness: 160 } });
  const hh = Math.floor(cur), mm = Math.floor((cur - hh) * 60);
  const shown = f < 18 ? `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}` : time;
  return (
    <AbsoluteFill>
      <Bg tone="brand" />
      <AbsoluteFill style={{ background: `radial-gradient(90% 45% at 50% 0%, ${tint}66, transparent 70%)` }} />
      {/* gök yayı + güneş/ay */}
      <svg width={1080} height={600} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d={Array.from({ length: 41 }).map((_, i) => { const q = hourPos(6 + (i / 40) * 18); return `${i ? "L" : "M"}${q.x},${q.y}`; }).join(" ")} fill="none" stroke="rgba(225,239,255,0.18)" strokeWidth={4} strokeDasharray="10 14" />
      </svg>
      <div style={{ position: "absolute", left: sp.x - 24, top: sp.y - 24, width: 48, height: 48, borderRadius: 24, opacity: 0.85, background: night ? "radial-gradient(circle at 35% 35%, #ffffff, #c9d6ff)" : `radial-gradient(circle, #fff6c9, ${C.amber})`, boxShadow: `0 0 60px ${night ? "#b9c8ff" : C.amber}` }} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: SAFE_TOP + 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 132, lineHeight: 1, color: C.white, letterSpacing: -4, fontVariantNumeric: "tabular-nums", transform: `scale(${1.25 - 0.25 * roll})`, filter: `blur(${(1 - roll) * 6}px)`, textShadow: `0 0 40px ${tint}` }}>{shown}</div>
          <div style={{ padding: "10px 22px", borderRadius: 999, border: `3px solid ${tint}`, color: tint, fontFamily: FONT_SANS, fontWeight: 700, fontSize: 34, letterSpacing: 3, transform: `scale(${spring({ frame: f - 8, fps, config: { damping: 10 } })})` }}>{label}</div>
        </div>
        <div style={{ marginTop: 18, padding: "0 60px" }}>
          <Words text={title} delay={6} size={70} stagger={3} />
        </div>
        <div style={{ marginTop: 30 }}>{children}</div>
      </AbsoluteFill>
      {callouts}
    </AbsoluteFill>
  );
};
const SAFE_TOP = 220;

/* ═════════════ OGRETMEN 10 ═════════════ */

export const TreeScreen: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const W = 560;
  const root = { x: 280, y: 40, n: "AYT Matematik", at: 4 };
  const l2 = [
    { x: 92, y: 160, n: "Limit", at: 14 },
    { x: 280, y: 160, n: "Türev", at: 18 },
    { x: 468, y: 160, n: "İntegral", at: 22 },
  ];
  const l3 = [
    { x: 100, y: 290, n: "Tanım", at: 32 },
    { x: 280, y: 290, n: "Kurallar", at: 36, target: true },
    { x: 460, y: 290, n: "Uygulama", at: 40 },
  ];
  const ghosts = [
    { x: 40, y: 250, from: 0 },
    { x: 150, y: 250, from: 0 },
    { x: 420, y: 250, from: 2 },
    { x: 520, y: 250, from: 2 },
  ];
  const dock = ramp(f, 60, 76, 0, 1, Easing.out(Easing.back(1.3)));
  const linked = f >= 76;
  const edge = (a: { x: number; y: number }, b: { x: number; y: number }, at: number, col = C.sky, w = 4) => {
    const p = ramp(f, at, at + 10);
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    return <path d={`M${a.x},${a.y + 22} C${a.x},${(a.y + b.y) / 2} ${b.x},${(a.y + b.y) / 2} ${b.x},${b.y - 22}`} fill="none" stroke={col} strokeWidth={w} strokeDasharray={len * 1.3} strokeDashoffset={len * 1.3 * (1 - p)} strokeLinecap="round" />;
  };
  const node = (n: { x: number; y: number; n: string; at: number; target?: boolean }, big = false, key?: string) => {
    const s = spring({ frame: f - n.at, fps, config: { damping: 10, stiffness: 220 } });
    const hot = n.target && linked;
    const path = n.n === "Türev" || n.n === "AYT Matematik";
    return (
      <div key={key ?? n.n} style={{ position: "absolute", left: n.x, top: n.y, transform: `translate(-50%, -50%) scale(${s})`, padding: big ? "12px 22px" : "9px 16px", borderRadius: 999, whiteSpace: "nowrap", fontWeight: 800, fontSize: big ? 24 : 21, background: hot ? `linear-gradient(140deg, #4ade80, ${C.green})` : path || n.target ? GRAD_BRAND : C.pastelBlue, color: hot ? "white" : path || n.target ? C.navy : C.royal, boxShadow: hot ? `0 0 ${24 + 8 * Math.sin(f / 4)}px ${C.green}` : path ? `0 6px 16px ${C.cyan}55` : undefined }}>
        {n.n}{hot ? " ✓" : ""}
      </div>
    );
  };
  return (
    <div style={{ position: "relative", height: 1048 }}>
      <AppBar title="Müfredat Ağacı" sub="Konuya bağla" />
      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 14 }}>
        <Card d={2} style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 50, color: C.royal, fontVariantNumeric: "tabular-nums" }}>{tr(Math.round(ramp(f, 4, 44, 0, 20000, Easing.out(Easing.cubic)) / 100) * 100)}+</div>
          <div style={{ fontSize: 22, fontWeight: 600, color: C.inkMuted, lineHeight: 1.2 }}>müfredat<br />konusu</div>
          <Pill col={C.royal} style={{ marginLeft: "auto" }}>LGS · TYT · AYT</Pill>
        </Card>
        <Card d={4} style={{ padding: 0, height: 520, position: "relative", overflow: "hidden", background: `radial-gradient(80% 70% at 50% 30%, #eef5ff, ${C.surface})` }}>
          <svg width={W} height={520} style={{ position: "absolute", left: 0, top: 0 }}>
            {l2.map((n, i) => <g key={i}>{edge(root, n, n.at - 4)}</g>)}
            {l3.map((n, i) => <g key={i}>{edge(l2[1], n, n.at - 4)}</g>)}
            {ghosts.map((g, i) => <g key={i} opacity={0.45}>{edge(l2[g.from], g, 30 + i * 2, C.line, 3)}</g>)}
            {linked && <path d={`M280,312 L280,${380}`} stroke={C.green} strokeWidth={5} strokeDasharray="8 8" strokeDashoffset={-f} />}
          </svg>
          {ghosts.map((g, i) => {
            const s = spring({ frame: f - (34 + i * 2), fps, config: { damping: 12 } });
            return <div key={i} style={{ position: "absolute", left: g.x - 16, top: g.y - 12, width: 32, height: 24, borderRadius: 12, background: C.line, transform: `scale(${s})`, opacity: 0.8 }} />;
          })}
          {node(root, true)}
          {l2.map((n) => node(n))}
          {l3.map((n) => node(n))}
          <div style={{ position: "absolute", left: 60, right: 60, top: 390, height: 100, ...card, padding: "12px 16px", display: "flex", alignItems: "center", gap: 14, border: `2.5px solid ${linked ? C.green : C.line}`, transform: `translateY(${(1 - dock) * 360}px) rotate(${(1 - dock) * -8}deg)`, opacity: Math.min(1, dock * 2) }}>
            <div style={{ width: 92, height: 64, borderRadius: 12, background: `linear-gradient(135deg, ${C.royal}, ${C.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><IcoPlay /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 22, fontWeight: 800 }}>Türev Kuralları</div>
              <div style={{ fontSize: 17, color: C.inkMuted }}>senin dersin · video</div>
            </div>
            {linked && <Pill col={C.green} style={{ fontSize: 18 }}>Bağlandı</Pill>}
          </div>
          <Burst at={76} x={280} y={300} />
        </Card>
      </div>
    </div>
  );
};

export const StudentFeedScreen: React.FC = () => {
  const f = useCurrentFrame();
  const slide = ramp(f, 28, 44, 0, 1, Easing.out(Easing.back(1.2)));
  const tapAt = 66;
  const playing = f >= tapAt + 3;
  const play = ramp(f, tapAt + 3, tapAt + 80, 0, 0.42, Easing.linear);
  return (
    <div style={{ position: "relative", height: 1048 }}>
      <AppBar title="Merhaba Elif" sub="Öğrenci · AYT Sayısal" right={<Avatar txt="EK" col={C.pastelButter} />} />
      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 14 }}>
        <Card d={2} style={{ padding: "18px 20px", background: `linear-gradient(140deg, ${C.navy}, ${C.royal})`, color: "white", border: "none" }}>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: 2, color: C.cyan }}>BUGÜN ÇALIŞTIĞIN KONU</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 36, margin: "6px 0 12px" }}>Türev Alma Kuralları</div>
          <Bar p={ramp(f, 6, 30, 0, 0.45)} col={GRAD_BRAND} h={12} bg="rgba(255,255,255,0.18)" />
          <div style={{ fontSize: 18, marginTop: 8, color: C.ice }}>AYT Matematik › Türev › Kurallar</div>
        </Card>
        <Label>BU KONU İÇİN İÇERİKLER</Label>
        <div style={{ position: "relative" }}>
          <div style={{ ...card, padding: 0, overflow: "hidden", border: `3px solid ${C.cyan}`, boxShadow: `0 14px ${30 + 10 * Math.sin(f / 5)}px ${C.cyan}55`, transform: `translateX(${(1 - slide) * 620}px) rotate(${(1 - slide) * 6}deg)` }}>
            <div style={{ height: playing ? 250 : 200, background: `linear-gradient(135deg, ${C.royal}, ${C.sky})`, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ position: "absolute", left: 24, top: 20, fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 34, color: "white", opacity: 0.9 }}>(f·g)′ = f′g + fg′</div>
              {!playing && <div style={{ width: 90, height: 90, borderRadius: 45, background: "rgba(255,255,255,0.92)", display: "flex", alignItems: "center", justifyContent: "center" }}><IcoPlay c={C.royal} /></div>}
              {playing && (
                <div style={{ position: "absolute", left: 20, right: 20, bottom: 16 }}>
                  <Bar p={play} col={C.cyan} h={10} bg="rgba(255,255,255,0.3)" />
                </div>
              )}
              <Tap x={274} y={100} at={tapAt} col={C.cyan} />
            </div>
            <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
              <Avatar txt="AY" col={C.pastelLilac} size={50} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 24, fontWeight: 800 }}>Türev Kuralları</div>
                <div style={{ fontSize: 18, color: C.inkMuted }}>A. Yılmaz · video</div>
              </div>
              <Pill col={C.green}>Konuna bağlı</Pill>
            </div>
          </div>
        </div>
        {[
          { n: "Türev Özeti", k: "ses" },
          { n: "Formül Kartı", k: "doküman" },
        ].map((r, i) => (
          <Rise key={i} d={46 + i * 6} from={30}>
            <div style={{ ...card, padding: "12px 18px", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 54, height: 54, borderRadius: 14, background: i ? C.amber : C.magenta, display: "flex", alignItems: "center", justifyContent: "center" }}>{i ? <IcoDoc /> : <IcoWave />}</div>
              <div style={{ fontSize: 22, fontWeight: 700, flex: 1 }}>{r.n}</div>
              <span style={{ fontSize: 18, color: C.inkMuted }}>{r.k}</span>
            </div>
          </Rise>
        ))}
      </div>
    </div>
  );
};
