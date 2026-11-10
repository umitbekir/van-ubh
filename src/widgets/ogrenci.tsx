import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, spring, useCurrentFrame } from "remotion";
import { Bg, Chip, clamp, Phone, ramp, SAFE, Tone, Words } from "../kit";
import { C, FONT_DISPLAY, FONT_SANS, GRAD_BRAND, GRAD_FEATHER } from "../theme";

/* ───────────── ortak yardımcılar (öğrenci grubu) ───────────── */

const sp = (f: number, d: number, cfg: Partial<{ damping: number; stiffness: number; mass: number }> = {}) =>
  spring({ frame: f - d, fps: 30, config: { damping: 14, stiffness: 170, mass: 0.7, ...cfg } });

const lerp = (p: number, a: number, b: number) => a + (b - a) * p;
const trNum = (n: number, dec = 0) =>
  n.toLocaleString("tr-TR", { minimumFractionDigits: dec, maximumFractionDigits: dec });

const W = 608; // telefon iç genişliği

const AppBar: React.FC<{ title: string; sub: string; right?: React.ReactNode; tone?: Tone }> = ({ title, sub, right, tone = "brand" }) => {
  const f = useCurrentFrame();
  const s = sp(f, 6);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 30px 16px", opacity: s, transform: `translateY(${(1 - s) * -20}px)` }}>
      <div>
        <div style={{ fontSize: 19, color: tone === "feather" ? C.coral : C.blue, fontWeight: 700, letterSpacing: 1.5 }}>{sub}</div>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 36, fontWeight: 800, color: C.ink, letterSpacing: -0.8 }}>{title}</div>
      </div>
      {right ?? (
        <div style={{ width: 58, height: 58, borderRadius: 29, background: tone === "feather" ? GRAD_FEATHER : GRAD_BRAND, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 26 }}>E</div>
      )}
    </div>
  );
};

/** dokunma halkası: at karesinde parmak basar */
const Tap: React.FC<{ at: number; x: number; y: number; col?: string }> = ({ at, x, y, col = C.blue }) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < -8 || t > 20) return null;
  const pre = t < 0;
  const p = pre ? 0 : t / 20;
  return (
    <>
      <div style={{ position: "absolute", left: x - 34, top: y - 34, width: 68, height: 68, borderRadius: 34, background: `${col}55`, border: `3px solid ${col}`, opacity: pre ? (t + 8) / 8 : 1 - p, transform: `scale(${pre ? 1.2 - (t + 8) / 40 : 0.9})`, zIndex: 20 }} />
      {!pre && <div style={{ position: "absolute", left: x - 60, top: y - 60, width: 120, height: 120, borderRadius: 60, border: `4px solid ${col}`, opacity: 1 - p, transform: `scale(${0.5 + p * 1.6})`, zIndex: 20 }} />}
    </>
  );
};

/** küçük parçacık patlaması */
const Burst: React.FC<{ at: number; x: number; y: number; n?: number; cols?: string[]; spread?: number }> = ({ at, x, y, n = 14, cols = [C.cyan, C.amber, C.coral, C.green], spread = 160 }) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < 0 || t > 30) return null;
  const p = Easing.out(Easing.cubic)(t / 30);
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const a = (i / n) * Math.PI * 2 + i * 0.37;
        const r = spread * (0.6 + ((i * 7) % 5) / 10) * p;
        const sz = 10 + (i % 3) * 5;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + Math.cos(a) * r - sz / 2,
              top: y + Math.sin(a) * r - sz / 2 + p * p * 40,
              width: sz,
              height: sz,
              borderRadius: i % 2 ? sz / 2 : 3,
              background: cols[i % cols.length],
              opacity: 1 - p,
              transform: `rotate(${t * 20 + i * 30}deg)`,
              zIndex: 25,
            }}
          />
        );
      })}
    </>
  );
};

const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; delay?: number }> = ({ children, style, delay = 0 }) => {
  const f = useCurrentFrame();
  const s = sp(f, delay, { damping: 15 });
  return (
    <div
      style={{
        margin: "0 24px",
        background: C.surface,
        borderRadius: 30,
        border: `2px solid ${C.line}`,
        boxShadow: "0 14px 34px rgba(43,36,64,0.10)",
        opacity: Math.min(1, s * 1.6),
        transform: `translateY(${(1 - s) * 60}px) scale(${0.94 + 0.06 * s})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Caret: React.FC<{ col?: string }> = ({ col = C.blue }) => {
  const f = useCurrentFrame();
  return <span style={{ display: "inline-block", width: 3, height: "1em", marginLeft: 2, background: col, opacity: Math.floor(f / 7) % 2 ? 0 : 1, verticalAlign: "-0.12em" }} />;
};

const Check: React.FC<{ size?: number; s: number; col?: string }> = ({ size = 40, s, col = C.green }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: col, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.6, fontWeight: 800, transform: `scale(${s}) rotate(${(1 - s) * -90}deg)`, flexShrink: 0 }}>✓</div>
);

/* ───────────── Ogrenci1 · fotoğrafla çözüm ───────────── */

export const ScanSolve: React.FC = () => {
  const f = useCurrentFrame();
  const vfH = interpolate(sp(f, 58, { damping: 18 }), [0, 1], [430, 250]);
  const corners = sp(f, 8, { damping: 12 });
  const scanP = ramp(f, 18, 52, 0, 1, Easing.inOut(Easing.cubic));
  const detect = sp(f, 50, { damping: 11 });
  const flash = f >= 52 && f < 62 ? 1 - (f - 52) / 10 : 0;
  const steps = [
    { n: "1", t: "2x + 6 = 18", at: 66 },
    { n: "2", t: "2x = 18 − 6 = 12", at: 80 },
    { n: "3", t: "x = 12 ÷ 2", at: 94 },
  ];
  const res = sp(f, 108, { damping: 9, stiffness: 200 });
  const glow = f > 108 ? 0.5 + 0.5 * Math.sin((f - 108) / 5) : 0;
  return (
    <div style={{ position: "relative", height: 1048 }}>
      <AppBar title="Fotoğrafla Çöz" sub="PRATİK" />
      {/* vizör */}
      <div style={{ position: "relative", margin: "0 24px", height: vfH, borderRadius: 30, overflow: "hidden", background: "radial-gradient(120% 90% at 50% 30%, #2b3150, #0c0d1c)" }}>
        {/* kâğıttaki soru */}
        <div
          style={{
            position: "absolute",
            left: 50,
            right: 50,
            top: interpolate(vfH, [250, 430], [36, 70]),
            padding: "24px 28px",
            background: "#f4efe4",
            borderRadius: 14,
            transform: `rotate(${-3 + corners * 1.5}deg) scale(${interpolate(vfH, [250, 430], [0.82, 1])})`,
            boxShadow: "0 18px 40px rgba(0,0,0,0.5)",
            color: "#2b2440",
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 700, color: "#8a7f6a" }}>SORU 12 · DENKLEMLER</div>
          <div style={{ position: "relative", display: "inline-block", fontFamily: FONT_DISPLAY, fontSize: 44, fontWeight: 800, marginTop: 8 }}>
            2x + 6 = 18 ise
            <div style={{ position: "absolute", inset: -10, border: `4px solid ${C.cyan}`, borderRadius: 12, opacity: detect, transform: `scale(${1.3 - 0.3 * detect})`, boxShadow: `0 0 24px ${C.cyan}` }} />
          </div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 44, fontWeight: 800 }}>x kaçtır?</div>
          <div style={{ display: "flex", gap: 22, marginTop: 14, fontSize: 24, color: "#625a70", fontWeight: 600 }}>
            <span>A) 4</span><span>B) 6</span><span>C) 8</span><span>D) 12</span>
          </div>
        </div>
        {/* köşe çerçeveleri */}
        {[0, 1, 2, 3].map((i) => {
          const L = i % 2 === 0;
          const T = i < 2;
          const off = (1 - corners) * 60 + 22;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                [L ? "left" : "right"]: off,
                [T ? "top" : "bottom"]: off,
                width: 64,
                height: 64,
                borderColor: C.cyan,
                borderStyle: "solid",
                borderWidth: 0,
                [T ? "borderTopWidth" : "borderBottomWidth"]: 7,
                [L ? "borderLeftWidth" : "borderRightWidth"]: 7,
                [`border${T ? "Top" : "Bottom"}${L ? "Left" : "Right"}Radius`]: 22,
                filter: `drop-shadow(0 0 10px ${C.cyan})`,
              } as React.CSSProperties}
            />
          );
        })}
        {/* tarama çizgisi */}
        {f >= 18 && f < 56 && (
          <>
            <div style={{ position: "absolute", left: 0, right: 0, top: scanP * vfH - 120, height: 120, background: `linear-gradient(180deg, transparent, ${C.cyan}55)` }} />
            <div style={{ position: "absolute", left: 10, right: 10, top: scanP * vfH - 3, height: 6, borderRadius: 3, background: C.cyan, boxShadow: `0 0 30px 8px ${C.cyan}` }} />
          </>
        )}
        <div style={{ position: "absolute", left: 24, top: 18, padding: "6px 14px", borderRadius: 12, background: "rgba(0,0,0,0.45)", color: C.cyan, fontSize: 20, fontWeight: 700, letterSpacing: 1 }}>
          {f < 52 ? "TARANIYOR…" : "SORU ALGILANDI ✓"}
        </div>
        <div style={{ position: "absolute", inset: 0, background: "white", opacity: flash * 0.9 }} />
      </div>
      {/* deklanşör */}
      <div style={{ position: "absolute", left: W / 2 - 40, top: 104 + vfH - 100, width: 80, height: 80, borderRadius: 40, border: "6px solid white", background: f > 12 && f < 20 ? C.cyan : "rgba(255,255,255,0.3)", transform: `scale(${f > 12 && f < 20 ? 0.85 : 1})`, opacity: 1 - ramp(f, 54, 62) }} />
      <Tap at={14} x={W / 2} y={104 + vfH - 60} col={C.cyan} />
      {/* adım adım çözüm */}
      <div style={{ padding: "24px 30px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 22, fontWeight: 700, color: C.blue, letterSpacing: 1.2, opacity: ramp(f, 60, 68) }}>
          <span style={{ width: 12, height: 12, borderRadius: 6, background: C.blue }} /> ADIM ADIM ÇÖZÜM
        </div>
        {steps.map((st, i) => {
          const s = sp(f, st.at, { damping: 13 });
          const typed = Math.floor(ramp(f, st.at, st.at + 12, 0, st.t.length, Easing.linear));
          if (f < st.at) return <div key={i} style={{ height: 76 }} />;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, height: 76, opacity: s, transform: `translateX(${(1 - s) * 80}px)` }}>
              <div style={{ width: 46, height: 46, borderRadius: 14, background: C.pastelBlue, color: C.blue, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 24 }}>{st.n}</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 38, fontWeight: 700, color: C.ink }}>
                {st.t.slice(0, typed)}
                {typed < st.t.length && <Caret />}
              </div>
            </div>
          );
        })}
        <div
          style={{
            marginTop: 12,
            padding: "22px 28px",
            borderRadius: 26,
            background: GRAD_BRAND,
            color: C.navy,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transform: `scale(${res})`,
            opacity: res,
            boxShadow: `0 0 ${30 + glow * 40}px ${C.cyan}${glow > 0.5 ? "cc" : "88"}`,
          }}
        >
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 54, fontWeight: 800 }}>x = 6</span>
          <span style={{ fontSize: 26, fontWeight: 700 }}>Doğru cevap: B ✓</span>
        </div>
      </div>
      <Burst at={110} x={W / 2} y={104 + 250 + 24 + 30 + 76 * 3 + 60} />
    </div>
  );
};

export const QuizSet: React.FC = () => {
  const f = useCurrentFrame();
  const prog = interpolate(sp(f, 62, { damping: 16 }), [0, 1], [3, 4]);
  const chosen = f >= 44;
  const okS = sp(f, 44, { damping: 9, stiffness: 220 });
  const slide = ramp(f, 100, 116, 0, 1, Easing.inOut(Easing.cubic));
  const opts = ["A) 3", "B) 5", "C) 7", "D) 15"];
  const sparkle = Math.sin(f / 6) * 0.5 + 0.5;
  return (
    <div style={{ position: "relative", height: 1048 }}>
      <AppBar
        title="Denklemler"
        sub="YAPAY ZEKÂ SORU SETİ"
        right={
          <div style={{ padding: "10px 18px", borderRadius: 999, background: GRAD_BRAND, color: C.navy, fontWeight: 800, fontSize: 22, boxShadow: `0 0 ${10 + sparkle * 20}px ${C.cyan}` }}>✦ Sana özel</div>
        }
      />
      {/* ilerleme */}
      <div style={{ padding: "0 30px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, fontWeight: 700, color: C.inkMuted, marginBottom: 10 }}>
          <span>İlerleme</span>
          <span style={{ color: C.blue, fontFamily: FONT_DISPLAY, fontSize: 32, fontWeight: 800, transform: `scale(${1 + 0.25 * Math.max(0, 1 - Math.abs(f - 66) / 10)})`, display: "inline-block" }}>
            {Math.round(prog)}/10
          </span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {Array.from({ length: 10 }).map((_, i) => {
            const fill = Math.max(0, Math.min(1, prog - i));
            return (
              <div key={i} style={{ flex: 1, height: 16, borderRadius: 8, background: C.line, overflow: "hidden" }}>
                <div style={{ width: `${fill * 100}%`, height: "100%", background: i < 3 ? C.green : GRAD_BRAND, boxShadow: fill > 0 && i === 3 ? `0 0 12px ${C.cyan}` : undefined }} />
              </div>
            );
          })}
        </div>
      </div>
      {/* soru kartları */}
      <div style={{ position: "relative", height: 700, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, transform: `translateX(${-slide * 640}px) rotate(${-slide * 6}deg)`, opacity: 1 - slide * 0.6 }}>
          <Card delay={8} style={{ padding: "28px 28px 24px" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.inkMuted }}>SORU 4 · ORTA SEVİYE</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 46, fontWeight: 800, color: C.ink, lineHeight: 1.1, margin: "10px 0 24px" }}>3x − 4 = 11 ise x kaçtır?</div>
            {opts.map((o, i) => {
              const isOk = i === 1;
              const s = sp(f, 14 + i * 4, { damping: 14 });
              const on = chosen && isOk;
              return (
                <div
                  key={i}
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: 82,
                    marginTop: 14,
                    padding: "0 26px",
                    borderRadius: 22,
                    border: `3px solid ${on ? C.green : C.line}`,
                    background: on ? `rgba(34,197,94,${0.14 + 0.1 * okS})` : C.canvas,
                    fontSize: 34,
                    fontWeight: 700,
                    color: on ? "#15803d" : C.ink,
                    opacity: s * (chosen && !isOk ? 0.45 : 1),
                    transform: `translateX(${(1 - s) * 60}px) scale(${on ? 1 + 0.05 * Math.max(0, 1 - (f - 44) / 12) : 1})`,
                    boxShadow: on ? `0 0 ${24 * okS}px rgba(34,197,94,0.55)` : undefined,
                  }}
                >
                  {o}
                  {on && <Check s={okS} size={48} />}
                </div>
              );
            })}
            <div style={{ height: 70, marginTop: 18, display: "flex", alignItems: "center", gap: 14, opacity: okS, transform: `translateY(${(1 - okS) * 20}px)` }}>
              <div style={{ padding: "10px 22px", borderRadius: 999, background: C.green, color: C.white, fontWeight: 800, fontSize: 28 }}>Doğru!</div>
              <span style={{ fontSize: 24, color: C.inkMuted, fontWeight: 600 }}>3x = 15 → x = 5</span>
            </div>
          </Card>
          <Tap at={40} x={300} y={274} col={C.green} />
          <Burst at={44} x={300} y={274} spread={200} />
        </div>
        {/* sıradaki soru */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, transform: `translateX(${(1 - slide) * 640}px)`, opacity: slide }}>
          <Card style={{ padding: "28px 28px 24px" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.inkMuted }}>SORU 5 · ZOR</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 46, fontWeight: 800, color: C.ink, lineHeight: 1.1, margin: "10px 0 24px" }}>2(x + 3) = x + 10 ise x?</div>
            {["A) 2", "B) 4", "C) 6", "D) 8"].map((o, i) => (
              <div key={i} style={{ height: 82, marginTop: 14, padding: "0 26px", display: "flex", alignItems: "center", borderRadius: 22, border: `3px solid ${C.line}`, background: C.canvas, fontSize: 34, fontWeight: 700, color: C.ink }}>{o}</div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
};

/* ───────────── Ogrenci2 · deneme analizi ───────────── */

const Stamp: React.FC<{ at: number; text: string; col?: string }> = ({ at, text, col = C.green }) => {
  const f = useCurrentFrame();
  const s = sp(f, at, { damping: 8, stiffness: 260 });
  return (
    <div style={{ padding: "10px 18px", borderRadius: 14, border: `3px solid ${col}`, color: col, fontWeight: 800, fontSize: 22, letterSpacing: 1, transform: `scale(${f < at ? 0 : 2 - s}) rotate(-8deg)`, opacity: f < at ? 0 : Math.min(1, s * 2) }}>{text}</div>
  );
};

export const ExamNet: React.FC = () => {
  const f = useCurrentFrame();
  const total = ramp(f, 22, 70, 0, 84.75, Easing.out(Easing.cubic));
  const dersler = [
    { n: "Türkçe", v: 31.25, m: 40, c: C.blue },
    { n: "Sosyal", v: 14.5, m: 20, c: C.sky },
    { n: "Matematik", v: 26, m: 40, c: C.coral },
    { n: "Fen", v: 13, m: 20, c: C.green },
  ];
  return (
    <div style={{ position: "relative", height: 1048 }}>
      <AppBar title="Deneme 3 Sonucu" sub="DENEME ANALİZİ" right={<Stamp at={10} text="BİTTİ ✓" />} />
      <div style={{ display: "flex", gap: 12, padding: "0 24px 20px" }}>
        {["LGS", "TYT", "AYT"].map((x, i) => {
          const on = x === "TYT";
          const s = sp(f, 4 + i * 3);
          return (
            <div key={x} style={{ flex: 1, height: 58, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 26, background: on ? C.navy : C.surface, color: on ? C.cyan : C.inkMuted, border: `2px solid ${on ? C.navy : C.line}`, transform: `scale(${s})` }}>{x}</div>
          );
        })}
      </div>
      <Card delay={12} style={{ padding: "26px 30px", background: `linear-gradient(135deg, ${C.navy}, ${C.royal})`, border: "none", color: C.white, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -60, top: -60, width: 240, height: 240, borderRadius: 120, background: `radial-gradient(circle, ${C.cyan}66, transparent 70%)` }} />
        <div style={{ fontSize: 22, fontWeight: 700, color: C.ice, letterSpacing: 1.2 }}>TOPLAM NET</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 120, fontWeight: 800, lineHeight: 1, letterSpacing: -4, fontVariantNumeric: "tabular-nums" }}>{trNum(total, 2)}</span>
          <span style={{ fontSize: 30, color: C.ice, fontWeight: 600 }}>/ 120</span>
        </div>
        <div style={{ marginTop: 12, display: "inline-block", padding: "8px 16px", borderRadius: 12, background: "rgba(34,197,94,0.25)", color: "#86efac", fontWeight: 700, fontSize: 24, opacity: ramp(f, 66, 74) }}>▲ önceki denemeden +6,50</div>
      </Card>
      <div style={{ padding: "22px 30px 0" }}>
        {dersler.map((d, i) => {
          const at = 34 + i * 8;
          const p = ramp(f, at, at + 30, 0, 1, Easing.out(Easing.cubic));
          return (
            <div key={d.n} style={{ marginBottom: 20, opacity: ramp(f, at - 4, at + 4) }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 27, fontWeight: 700, color: C.ink, marginBottom: 8 }}>
                <span>{d.n}</span>
                <span style={{ fontVariantNumeric: "tabular-nums" }}>
                  {trNum(d.v * p, 2)} <span style={{ color: C.inkMuted, fontWeight: 500 }}>/ {d.m}</span>
                </span>
              </div>
              <div style={{ height: 22, borderRadius: 11, background: C.line, overflow: "hidden" }}>
                <div style={{ width: `${(d.v / d.m) * p * 100}%`, height: "100%", borderRadius: 11, background: `linear-gradient(90deg, ${d.c}aa, ${d.c})`, boxShadow: `0 0 14px ${d.c}88` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 40 soruluk sonuç dizisi: d=doğru y=yanlış b=boş
const PATTERN = "ddddyddddbddddddydddddbdddyddddddbddydbd";

export const AnalysisGrid: React.FC = () => {
  const f = useCurrentFrame();
  const col = (c: string) => (c === "d" ? C.green : c === "y" ? C.red : "#b9b2c4");
  const reveal = (i: number) => 10 + (Math.floor(i / 8) + (i % 8)) * 2.2;
  const counts = { d: 0, y: 0, b: 0 } as Record<string, number>;
  PATTERN.split("").forEach((c, i) => {
    if (f >= reveal(i) + 4) counts[c]++;
  });
  const focusI = 16; // 17. soru
  const tip = sp(f, 66, { damping: 12 });
  const cell = 58, gap = 10;
  const gx = (W - 48 - (8 * cell + 7 * gap)) / 2;
  return (
    <div style={{ position: "relative", height: 1048 }}>
      <AppBar title="Soru Soru Analiz" sub="TYT · TÜRKÇE" />
      <Card delay={4} style={{ padding: "26px 0 22px", position: "relative" }}>
        <div style={{ position: "relative", marginLeft: gx, width: 8 * cell + 7 * gap, display: "flex", flexWrap: "wrap", gap }}>
          {PATTERN.split("").map((c, i) => {
            const s = sp(f, reveal(i), { damping: 11, stiffness: 220 });
            const focus = i === focusI && f >= 60;
            const pulse = focus ? 1 + 0.12 * Math.sin((f - 60) / 3) : 1;
            return (
              <div
                key={i}
                style={{
                  width: cell,
                  height: cell,
                  borderRadius: 14,
                  background: s > 0.05 ? col(c) : C.line,
                  color: C.white,
                  fontWeight: 800,
                  fontSize: 22,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${(0.6 + 0.4 * s) * pulse}) rotateY(${(1 - s) * 180}deg)`,
                  boxShadow: focus ? `0 0 0 5px ${C.white}, 0 0 0 9px ${C.red}, 0 0 30px ${C.red}` : undefined,
                  zIndex: focus ? 5 : 1,
                  opacity: f >= 60 && !focus ? 0.55 + 0.45 * (1 - tip) : 1,
                }}
              >
                {i + 1}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "space-around", marginTop: 22, padding: "0 20px" }}>
          {[
            ["d", "Doğru"],
            ["y", "Yanlış"],
            ["b", "Boş"],
          ].map(([k, n]) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 26, fontWeight: 700, color: C.ink }}>
              <span style={{ width: 22, height: 22, borderRadius: 6, background: col(k) }} />
              {n}
              <span style={{ fontFamily: FONT_DISPLAY, fontSize: 34, fontWeight: 800, color: col(k), minWidth: 42, fontVariantNumeric: "tabular-nums" }}>{counts[k]}</span>
            </div>
          ))}
        </div>
      </Card>
      {/* odak sorusu */}
      <div style={{ margin: "22px 24px 0", padding: "22px 26px", borderRadius: 26, background: C.navy, color: C.white, opacity: tip, transform: `translateY(${(1 - tip) * 60}px) scale(${0.9 + 0.1 * tip})`, boxShadow: `0 20px 40px rgba(9,2,84,0.35)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ padding: "6px 14px", borderRadius: 10, background: C.red, fontWeight: 800, fontSize: 22 }}>17. SORU · YANLIŞ</span>
          <span style={{ fontSize: 22, color: C.ice }}>süre: 2 dk 14 sn</span>
        </div>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 36, fontWeight: 800, marginTop: 12 }}>Konu: Paragrafta Ana Fikir</div>
        <div style={{ marginTop: 10, fontSize: 24, color: C.cyan, fontWeight: 600, opacity: ramp(f, 84, 92) }}>Senin cevabın: C · Doğru cevap: A</div>
      </div>
    </div>
  );
};

export const RankRise: React.FC = () => {
  const f = useCurrentFrame();
  const ranks = [48210, 39650, 31480, 22940, 12480];
  const draw = ramp(f, 16, 70, 0, 1, Easing.inOut(Easing.cubic));
  const val = interpolate(draw, [0, 1], [ranks[0], ranks[4]]);
  const cw = 520, ch = 260;
  const pts = ranks.map((r, i) => [20 + (i * (cw - 40)) / 4, 20 + ((r - 10000) / 40000) * (ch - 40)] as const);
  const path = pts.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(" ");
  const len = 620;
  const badge = sp(f, 74, { damping: 8, stiffness: 220 });
  return (
    <div style={{ position: "relative", height: 1048 }}>
      <AppBar title="Sıralaman" sub="DENEME GEÇMİŞİ" />
      <Card delay={4} style={{ padding: "24px 30px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: C.inkMuted, letterSpacing: 1.2 }}>SON DENEME SIRALAMAN</div>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 118, fontWeight: 800, letterSpacing: -4, lineHeight: 1.05, backgroundImage: GRAD_BRAND, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", fontVariantNumeric: "tabular-nums" }}>
          {trNum(Math.round(val / 10) * 10)}.
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 22px", borderRadius: 999, background: "rgba(34,197,94,0.14)", color: "#15803d", fontWeight: 800, fontSize: 28, transform: `scale(${badge})` }}>
          ▲ {trNum(ranks[0] - ranks[4])} basamak yükseldin
        </div>
        <Burst at={76} x={(W - 48) / 2} y={240} spread={220} />
      </Card>
      <Card delay={10} style={{ marginTop: 22, padding: "22px 20px 16px" }}>
        <svg width={cw} height={ch} style={{ display: "block", margin: "0 auto", overflow: "visible" }}>
          <defs>
            <linearGradient id="rg" x1="0" x2="1">
              <stop offset="0" stopColor={C.sky} />
              <stop offset="1" stopColor={C.green} />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1={0} x2={cw} y1={20 + i * 73} y2={20 + i * 73} stroke={C.line} strokeWidth={2} />
          ))}
          <path d={path} fill="none" stroke="url(#rg)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - draw)} style={{ filter: `drop-shadow(0 6px 10px ${C.green}66)` }} />
          {pts.map((p, i) => {
            const s = sp(f, 16 + i * 13.5, { damping: 9, stiffness: 240 });
            return <circle key={i} cx={p[0]} cy={p[1]} r={14 * s} fill={i === 4 ? C.green : C.white} stroke={i === 4 ? C.white : C.sky} strokeWidth={6} />;
          })}
        </svg>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 6px 0", fontSize: 21, fontWeight: 700, color: C.inkMuted }}>
          {["D1", "D2", "D3", "D4", "D5"].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
      </Card>
    </div>
  );
};

/* ───────────── Ogrenci3 · Soru Kampı ───────────── */

const Avatar: React.FC<{ ch: string; bg: string; size?: number; s?: number }> = ({ ch, bg, size = 58, s = 1 }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: bg, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: size * 0.42, transform: `scale(${s})`, flexShrink: 0, border: "3px solid white", boxShadow: "0 6px 14px rgba(0,0,0,0.15)" }}>{ch}</div>
);

const FRIENDS = [
  { n: "Elif K.", c: "#8b5cf6" },
  { n: "Mert A.", c: C.sky },
  { n: "Zeynep T.", c: C.magenta },
  { n: "Can D.", c: C.amber },
];

export const CampInvite: React.FC = () => {
  const f = useCurrentFrame();
  const code = "KAMP-7X2";
  const press = f >= 46 && f < 52;
  const joined = FRIENDS.filter((_, i) => f >= 58 + i * 12).length;
  return (
    <div style={{ position: "relative", height: 1048 }}>
      <AppBar title="Matematik Maratonu" sub="SORU KAMPI" tone="feather" />
      <Card delay={6} style={{ padding: "24px 24px 26px", textAlign: "center", background: `linear-gradient(140deg, ${C.plum}, ${C.navy})`, border: "none", color: C.white, overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", left: -80, top: -80, width: 260, height: 260, borderRadius: 130, background: `radial-gradient(circle, ${C.coral}77, transparent 70%)` }} />
        <div style={{ fontSize: 22, fontWeight: 700, color: C.ice, letterSpacing: 1.5 }}>DAVET KODU</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
          {code.split("").map((ch, i) => {
            const at = 12 + i * 3;
            const s = sp(f, at, { damping: 9, stiffness: 260 });
            const dash = ch === "-";
            return (
              <div
                key={i}
                style={{
                  width: dash ? 26 : 58,
                  height: 80,
                  borderRadius: 14,
                  background: dash ? "transparent" : "rgba(255,255,255,0.1)",
                  border: dash ? "none" : `2px solid ${f >= at ? C.coral : "rgba(255,255,255,0.25)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 800,
                  fontSize: 46,
                  color: C.white,
                }}
              >
                <span style={{ transform: `translateY(${(1 - s) * -30}px) scale(${s})`, opacity: f >= at ? 1 : 0, display: "inline-block" }}>{ch}</span>
              </div>
            );
          })}
        </div>
        <div
          style={{
            margin: "24px auto 0",
            width: 360,
            height: 76,
            borderRadius: 999,
            background: GRAD_FEATHER,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 30,
            color: C.white,
            transform: `scale(${press ? 0.92 : 1})`,
            boxShadow: `0 0 ${f >= 46 ? 30 : 0}px ${C.coral}`,
          }}
        >
          {f >= 50 ? "Kod paylaşıldı ✓" : "Kodu paylaş ↗"}
        </div>
        <Tap at={46} x={(W - 48) / 2} y={262} col={C.coral} />
      </Card>
      <div style={{ padding: "26px 30px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 24, fontWeight: 700, color: C.inkMuted, marginBottom: 12 }}>
          <span>KAMPA KATILANLAR</span>
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 32, fontWeight: 800, color: C.coral }}>{joined + 1}/6</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, height: 76, borderBottom: `2px solid ${C.line}` }}>
          <Avatar ch="S" bg={C.navy} />
          <span style={{ fontSize: 30, fontWeight: 700, color: C.ink }}>Sen</span>
          <span style={{ marginLeft: "auto", fontSize: 22, color: C.inkMuted, fontWeight: 600 }}>kurucu</span>
        </div>
        {FRIENDS.map((fr, i) => {
          const at = 58 + i * 12;
          const s = sp(f, at, { damping: 11, stiffness: 200 });
          if (f < at) return <div key={i} style={{ height: 76 }} />;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, height: 76, borderBottom: `2px solid ${C.line}`, opacity: s, transform: `translateX(${(1 - s) * 120}px)` }}>
              <Avatar ch={fr.n[0]} bg={fr.c} s={s} />
              <span style={{ fontSize: 30, fontWeight: 700, color: C.ink }}>{fr.n}</span>
              <span style={{ marginLeft: "auto", padding: "6px 14px", borderRadius: 999, background: "rgba(34,197,94,0.14)", color: "#15803d", fontSize: 22, fontWeight: 700 }}>katıldı</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const CampLeader: React.FC = () => {
  const f = useCurrentFrame();
  const steps = [30, 54, 78, 102]; // Sen sırasıyla Can, Zeynep, Mert, Elif'i geçer
  const others = [
    { n: "Elif K.", c: "#8b5cf6", sc: 980 },
    { n: "Mert A.", c: C.sky, sc: 950 },
    { n: "Zeynep T.", c: C.magenta, sc: 920 },
    { n: "Can D.", c: C.amber, sc: 890 },
  ];
  const cfg = { damping: 13, stiffness: 140 };
  const senPos = 4 - steps.reduce((a, t) => a + sp(f, t, cfg), 0);
  const senScore = Math.round(860 + steps.reduce((a, t, i) => a + ramp(f, t - 8, t + 2) * [40, 40, 40, 50][i], 0));
  const rowH = 88;
  const timer = 1 - ((f % 60) / 60);
  const live = 0.5 + 0.5 * Math.sin(f / 4);
  const top = f >= 106;
  const crown = sp(f, 106, { damping: 8, stiffness: 240 });
  return (
    <div style={{ position: "relative", height: 1048 }}>
      <AppBar
        title="Canlı Kamp"
        sub="SORU 7 / 10"
        tone="feather"
        right={
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 18px", borderRadius: 999, background: C.red, color: C.white, fontWeight: 800, fontSize: 22 }}>
            <span style={{ width: 14, height: 14, borderRadius: 7, background: C.white, opacity: live }} />CANLI
          </div>
        }
      />
      {/* canlı soru */}
      <Card delay={4} style={{ padding: "18px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 34, fontWeight: 800, color: C.ink }}>%20'si 30 olan sayı?</span>
          <span style={{ fontSize: 24, fontWeight: 800, color: C.coral }}>{Math.ceil(timer * 15)} sn</span>
        </div>
        <div style={{ height: 10, borderRadius: 5, background: C.line, marginTop: 12, overflow: "hidden" }}>
          <div style={{ width: `${timer * 100}%`, height: "100%", background: GRAD_FEATHER }} />
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          {["120", "150", "180", "200"].map((o, i) => {
            const on = i === 1 && f >= 22;
            return (
              <div key={o} style={{ flex: 1, height: 56, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 26, background: on ? C.green : C.canvas, color: on ? C.white : C.ink, border: `2px solid ${on ? C.green : C.line}`, transform: `scale(${on ? 1 + 0.08 * Math.max(0, 1 - (f - 22) / 10) : 1})` }}>{o}</div>
            );
          })}
        </div>
        <Tap at={20} x={204} y={160} col={C.green} />
      </Card>
      {/* liderlik tablosu */}
      <div style={{ padding: "22px 30px 10px", fontSize: 22, fontWeight: 700, color: C.inkMuted, letterSpacing: 1.3, opacity: ramp(f, 6, 14) }}>LİDERLİK TABLOSU</div>
      <div style={{ position: "relative", height: rowH * 5, margin: "0 24px" }}>
        {others.map((o, j) => {
          const t = steps[3 - j];
          const pos = j + sp(f, t, cfg);
          const s = sp(f, 8 + j * 3);
          return (
            <div key={o.n} style={{ position: "absolute", left: 0, right: 0, top: pos * rowH, height: rowH - 12, borderRadius: 22, background: C.surface, border: `2px solid ${C.line}`, display: "flex", alignItems: "center", gap: 14, padding: "0 20px", opacity: s, transform: `translateX(${(1 - s) * 80}px)` }}>
              <span style={{ width: 40, fontFamily: FONT_DISPLAY, fontSize: 32, fontWeight: 800, color: C.inkMuted }}>{Math.round(pos) + 1}</span>
              <Avatar ch={o.n[0]} bg={o.c} size={50} />
              <span style={{ fontSize: 28, fontWeight: 700, color: C.ink }}>{o.n}</span>
              <span style={{ marginLeft: "auto", fontSize: 28, fontWeight: 800, color: C.ink, fontVariantNumeric: "tabular-nums" }}>{o.sc}</span>
            </div>
          );
        })}
        {/* Sen satırı */}
        <div
          style={{
            position: "absolute",
            left: -8,
            right: -8,
            top: senPos * rowH - 4,
            height: rowH - 4,
            borderRadius: 24,
            background: GRAD_FEATHER,
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "0 26px",
            color: C.white,
            zIndex: 10,
            boxShadow: `0 16px 40px ${C.coral}88, 0 0 ${top ? 40 : 0}px ${C.amber}`,
            transform: `scale(${1.03 + 0.03 * Math.abs(Math.sin(senPos * Math.PI))})`,
          }}
        >
          <span style={{ width: 40, fontFamily: FONT_DISPLAY, fontSize: 36, fontWeight: 800 }}>{Math.round(senPos) + 1}</span>
          <div style={{ position: "relative" }}>
            <Avatar ch="S" bg={C.navy} size={54} />
            {top && <div style={{ position: "absolute", left: 6, top: -34, fontSize: 36, transform: `scale(${crown}) rotate(${(1 - crown) * -40}deg)` }}>👑</div>}
          </div>
          <span style={{ fontSize: 32, fontWeight: 800 }}>Sen</span>
          <span style={{ marginLeft: "auto", fontSize: 32, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{senScore}</span>
        </div>
        <Burst at={106} x={(W - 48) / 2} y={rowH / 2} n={22} spread={260} cols={[C.amber, C.coral, C.cyan, C.white, C.magenta]} />
      </div>
    </div>
  );
};

/* ───────────── Ogrenci4 · tek oynatıcı ───────────── */

/** Kitteki HookStrike'ın bu metinlere sığan çeşidi: dağınık 5 uygulama kartı "TEK OYNATICI"da birleşir */
export const HookStrikeApps: React.FC<{ tone?: Tone }> = ({ tone = "brand" }) => {
  const f = useCurrentFrame();
  const strike = ramp(f, 8, 20);
  const shrink = ramp(f, 22, 32);
  const s2 = spring({ frame: f - 30, fps: 30, config: { damping: 10, stiffness: 240, mass: 0.6 } });
  const merge = ramp(f, 22, 32, 0, 1, Easing.in(Easing.cubic));
  let sx = 0, sy = 0;
  for (const h of [0, 30]) {
    const t = f - h;
    if (t >= 0 && t < 14) {
      const d = Math.pow(1 - t / 14, 2);
      sx += Math.sin(t * 2.7) * 22 * d;
      sy += Math.cos(t * 3.1) * 16 * d;
    }
  }
  const apps = [
    { l: "▶", n: "Video", x: 150, y: 380, c: C.coral, r: -12 },
    { l: "≣", n: "PDF", x: 800, y: 420, c: C.sky, r: 10 },
    { l: "♫", n: "Ses", x: 120, y: 1240, c: C.magenta, r: 8 },
    { l: "✎", n: "Not", x: 820, y: 1220, c: C.amber, r: -9 },
    { l: "?", n: "Test", x: 480, y: 330, c: C.green, r: 4 },
  ];
  const sw = f - 30;
  return (
    <AbsoluteFill>
      <Bg tone={tone} intensity={1.2} />
      {sw >= 0 && sw <= 26 && (
        <div style={{ position: "absolute", left: 540 - 900 * (sw / 26), top: SAFE.eye - 900 * (sw / 26), width: 1800 * (sw / 26), height: 1800 * (sw / 26), borderRadius: "50%", border: `${18 * (1 - sw / 26) + 2}px solid ${C.cyan}`, opacity: (1 - sw / 26) * 0.8, boxShadow: `0 0 60px ${C.cyan}` }} />
      )}
      {apps.map((a, i) => {
        const fl = Math.sin(f / 9 + i) * 12;
        const x = lerp(merge, a.x, 540);
        const y = lerp(merge, a.y, 900);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - 80,
              top: y - 80 + fl,
              width: 160,
              height: 160,
              borderRadius: 40,
              background: `linear-gradient(145deg, ${a.c}, ${a.c}aa)`,
              boxShadow: `0 20px 50px ${a.c}66, inset 0 2px 0 rgba(255,255,255,0.4)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: C.white,
              transform: `rotate(${a.r * (1 - merge) + f * 0.3 * (i % 2 ? 1 : -1) * (1 - merge)}deg) scale(${1 - merge * 0.9})`,
              opacity: 1 - merge,
              filter: `blur(${merge * 8}px)`,
            }}
          >
            <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1 }}>{a.l}</div>
            <div style={{ fontFamily: FONT_SANS, fontSize: 26, fontWeight: 700, marginTop: 6 }}>{a.n}</div>
          </div>
        );
      })}
      <AbsoluteFill style={{ transform: `translate(${sx}px, ${sy}px)`, justifyContent: "center", alignItems: "center", flexDirection: "column", paddingBottom: 200 }}>
        <Chip tone={tone} delay={-20} style={{ marginBottom: 36 }}>ÇALIŞ</Chip>
        <div style={{ position: "relative", fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 150 - 60 * shrink, color: shrink > 0.1 ? "rgba(255,255,255,0.55)" : C.white, letterSpacing: -5, lineHeight: 1, transform: `translateY(${-30 * shrink}px)`, textShadow: "0 10px 50px rgba(0,0,0,0.45)" }}>
          5 UYGULAMA
          <div style={{ position: "absolute", left: -20, top: "50%", height: 22 - 10 * shrink, width: `calc(${strike} * (100% + 40px))`, background: C.red, borderRadius: 12, transform: "rotate(-6deg)", boxShadow: `0 0 30px ${C.red}` }} />
        </div>
        <div style={{ textAlign: "center", fontFamily: FONT_DISPLAY, fontWeight: 800, lineHeight: 0.95, letterSpacing: -7, marginTop: 14, opacity: f >= 30 ? Math.min(1, s2 * 3) : 0, transform: `scale(${2.2 - 1.2 * s2})`, backgroundImage: GRAD_BRAND, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", paddingBottom: 14 }}>
          <div style={{ fontSize: 210 }}>TEK</div>
          <div style={{ fontSize: 178 }}>OYNATICI</div>
        </div>
        <div style={{ marginTop: 30, padding: "0 80px" }}>
          <Words text={"Video, doküman, ses,\n*hepsi bir arada*"} delay={46} size={54} weight={600} font="sans" color={C.ice} stagger={3} tone={tone} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** hücre bölünmesi (mitoz) animasyonlu video karesi */
const MitosisVideo: React.FC<{ t: number }> = ({ t }) => {
  const split = (Math.sin(t / 20 - Math.PI / 2) + 1) / 2; // 0..1..0
  const dx = split * 70;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(90% 90% at 50% 40%, #12306b, #070b2b)", alignItems: "center", justifyContent: "center" }}>
      {[-1, 1].map((d) => (
        <div key={d} style={{ position: "absolute", left: 280 - 90 + d * dx, top: 70, width: 180, height: 180, borderRadius: 90, background: `radial-gradient(circle at 40% 35%, ${C.cyan}55, ${C.sky}33 60%, transparent 72%)`, border: `4px solid ${C.cyan}aa` }}>
          <div style={{ position: "absolute", left: 66, top: 66, width: 48, height: 48, borderRadius: 24, background: C.magenta, opacity: 0.85, boxShadow: `0 0 20px ${C.magenta}` }} />
        </div>
      ))}
      <div style={{ position: "absolute", left: 22, bottom: 18, color: C.white, fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 800 }}>Mitoz bölünme</div>
    </AbsoluteFill>
  );
};

const TABS = ["Video", "Doküman", "Ses", "Etkileşimli"];

export const OnePlayer: React.FC = () => {
  const f = useCurrentFrame();
  const switches = [0, 40, 70, 100];
  const tab = switches.filter((t) => f >= t).length - 1;
  const tabP = switches.reduce((a, t, i) => (i === 0 ? a : a + sp(f, t, { damping: 16, stiffness: 200 })), 0);
  const tabW = (W - 48 - 8) / 4;
  const prog = ramp(f, 0, 140, 0.34, 0.52, Easing.linear);
  const mediaH = 360;
  const secs = Math.floor(prog * 750);
  const mmss = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const panels = [
    <MitosisVideo key="v" t={f} />,
    <AbsoluteFill key="d" style={{ background: C.pastelButter, padding: 30 }}>
      <div style={{ background: C.surface, borderRadius: 16, padding: 24, height: "100%", boxShadow: "0 10px 24px rgba(0,0,0,0.1)" }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 30, color: C.ink }}>Hücre Bölünmesi · Özet</div>
        {[0.92, 0.8, 0.95, 0.6, 0.85, 0.7].map((w, i) => (
          <div key={i} style={{ height: 14, width: `${w * ramp(f, 40 + i * 3, 52 + i * 3) * 100}%`, borderRadius: 7, background: i === 2 ? C.amber : C.line, marginTop: 18 }} />
        ))}
      </div>
    </AbsoluteFill>,
    <AbsoluteFill key="s" style={{ background: `linear-gradient(135deg, ${C.plum}, ${C.navy})`, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 }}>
      {Array.from({ length: 26 }).map((_, i) => (
        <div key={i} style={{ width: 10, borderRadius: 5, height: 30 + Math.abs(Math.sin(f / 3 + i * 0.7)) * 140 * (0.5 + 0.5 * Math.sin(i * 1.3)), background: i % 3 ? C.magenta : C.coral }} />
      ))}
    </AbsoluteFill>,
    <AbsoluteFill key="e" style={{ background: C.pastelLilac, padding: 26, flexDirection: "column", gap: 14 }}>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 30, color: C.ink }}>Eşleştir: Evreler</div>
      {[
        ["Profaz", "Kromozom belirginleşir"],
        ["Metafaz", "Ekvatorda dizilir"],
      ].map(([a, b], i) => {
        const s = sp(f, 106 + i * 10, { damping: 12 });
        return (
          <div key={a} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ padding: "12px 18px", borderRadius: 14, background: C.blue, color: C.white, fontWeight: 700, fontSize: 24 }}>{a}</div>
            <div style={{ flex: 1, height: 4, background: C.green, transform: `scaleX(${s})`, transformOrigin: "left" }} />
            <div style={{ padding: "12px 16px", borderRadius: 14, background: C.surface, color: C.ink, fontWeight: 600, fontSize: 21, border: `2px solid ${s > 0.5 ? C.green : C.line}` }}>{b}</div>
          </div>
        );
      })}
    </AbsoluteFill>,
  ];
  return (
    <div style={{ position: "relative", height: 1048 }}>
      <AppBar title="Hücre Bölünmesi" sub="ÇALIŞ · BİYOLOJİ" />
      {/* sekmeler */}
      <div style={{ position: "relative", margin: "0 24px 18px", height: 66, borderRadius: 20, background: "#efe9df", display: "flex", padding: 4 }}>
        <div style={{ position: "absolute", left: 4 + tabP * tabW, top: 4, width: tabW, height: 58, borderRadius: 16, background: C.navy, boxShadow: `0 6px 18px ${C.navy}55` }} />
        {TABS.map((t, i) => (
          <div key={t} style={{ position: "relative", flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: tab === i ? C.cyan : C.inkMuted }}>{t}</div>
        ))}
      </div>
      {/* medya alanı */}
      <div style={{ position: "relative", margin: "0 24px", height: mediaH, borderRadius: 28, overflow: "hidden", boxShadow: "0 20px 40px rgba(9,2,84,0.25)" }}>
        {panels.map((p, i) => {
          const inP = i === 0 ? 1 : sp(f, switches[i], { damping: 16 });
          const outP = i < 3 ? sp(f, switches[i + 1], { damping: 16 }) : 0;
          if (inP < 0.01 || outP > 0.99) return null;
          return (
            <div key={i} style={{ position: "absolute", inset: 0, transform: `translateX(${(1 - inP) * 100 - outP * 100}%)` }}>
              {p}
            </div>
          );
        })}
      </div>
      {/* ilerleme çubuğu */}
      <div style={{ padding: "18px 30px 0" }}>
        <div style={{ position: "relative", height: 12, borderRadius: 6, background: C.line }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${prog * 100 + 14}%`, borderRadius: 6, background: "#d8d0c2" }} />
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${prog * 100}%`, borderRadius: 6, background: GRAD_BRAND }} />
          <div style={{ position: "absolute", left: `calc(${prog * 100}% - 13px)`, top: -7, width: 26, height: 26, borderRadius: 13, background: C.white, border: `5px solid ${C.blue}` }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 22, color: C.inkMuted, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
          <span>{mmss(secs)}</span>
          <span>12:30</span>
        </div>
      </div>
      <div style={{ padding: "10px 30px 0" }}>
        {["1. Hücre döngüsü", "2. Mitoz evreleri", "3. Mayoz farkı"].map((c, i) => {
          const on = i === 1;
          return (
            <div key={c} style={{ display: "flex", alignItems: "center", gap: 14, height: 62, fontSize: 26, fontWeight: on ? 800 : 600, color: on ? C.blue : C.ink, opacity: ramp(f, 10 + i * 5, 18 + i * 5) }}>
              <span style={{ width: 16, height: 16, borderRadius: 8, background: i === 0 ? C.green : on ? C.blue : C.line }} />
              {c}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const NotesTranscript: React.FC = () => {
  const f = useCurrentFrame();
  const lines = [
    "Hücre döngüsü üç ana evreden oluşur.",
    "Mitozda bir hücreden iki özdeş hücre oluşur.",
    "Kromozom sayısı değişmeden korunur.",
    "Metafazda kromozomlar ekvatorda dizilir.",
  ];
  const active = Math.min(3, Math.floor(ramp(f, 8, 100, 0, 3.99, Easing.linear)));
  const hlY = interpolate(f, [8, 100], [0, 3.99], clamp);
  const lineH = 78;
  const mark = ramp(f, 30, 46, 0, 1, Easing.inOut(Easing.cubic));
  const note = "Mitoz: 1 hücre → 2 özdeş hücre";
  const typed = Math.floor(ramp(f, 52, 92, 0, note.length, Easing.linear));
  const saved = sp(f, 100, { damping: 10, stiffness: 220 });
  const fly = ramp(f, 44, 56, 0, 1, Easing.inOut(Easing.cubic));
  return (
    <div style={{ position: "relative", height: 1048 }}>
      <AppBar title="Mitoz Evreleri" sub="ÇALIŞ · TRANSKRİPT" />
      <div style={{ position: "relative", margin: "0 24px", height: 150, borderRadius: 24, overflow: "hidden" }}>
        <MitosisVideo t={f + 40} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 8, background: "rgba(255,255,255,0.2)" }}>
          <div style={{ width: `${ramp(f, 0, 140, 40, 55, Easing.linear)}%`, height: "100%", background: C.cyan }} />
        </div>
      </div>
      <Card delay={4} style={{ marginTop: 18, padding: "18px 22px" }}>
        <div style={{ fontSize: 21, fontWeight: 700, color: C.blue, letterSpacing: 1.2, marginBottom: 6 }}>TRANSKRİPT</div>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: -8, right: -8, top: Math.floor(hlY) * lineH + (hlY % 1 > 0.85 ? (hlY % 1 - 0.85) / 0.15 * lineH : 0), height: lineH - 6, borderRadius: 14, background: C.pastelBlue }} />
          {lines.map((l, i) => (
            <div key={i} style={{ position: "relative", height: lineH, display: "flex", alignItems: "center", gap: 12, fontSize: 25, lineHeight: 1.2, fontWeight: i === active ? 700 : 500, color: i === active ? C.ink : C.inkMuted }}>
              <span style={{ fontSize: 19, color: C.blue, fontWeight: 700, width: 56, flexShrink: 0 }}>04:{String(12 + i * 9).padStart(2, "0")}</span>
              <span style={{ position: "relative" }}>
                {i === 1 && <span style={{ position: "absolute", left: -4, top: 2, bottom: 2, width: `calc(${mark * 100}% + 8px)`, background: `${C.amber}88`, borderRadius: 6 }} />}
                <span style={{ position: "relative" }}>{l}</span>
              </span>
            </div>
          ))}
        </div>
      </Card>
      {/* uçan alıntı */}
      {f >= 44 && f < 58 && (
        <div style={{ position: "absolute", left: 120, top: lerp(fly, 330, 640), padding: "8px 16px", borderRadius: 12, background: C.amber, color: C.navy, fontWeight: 800, fontSize: 22, opacity: 1 - fly * 0.6, transform: `scale(${1 - fly * 0.3})`, zIndex: 20 }}>+ nota ekle</div>
      )}
      <Card delay={20} style={{ marginTop: 18, padding: "18px 24px", border: `2px solid ${f >= 52 ? C.amber : C.line}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 21, fontWeight: 700, color: "#b7791f", letterSpacing: 1.2 }}>NOTLARIM</span>
          <span style={{ padding: "6px 14px", borderRadius: 999, background: C.green, color: C.white, fontWeight: 700, fontSize: 20, transform: `scale(${saved})`, opacity: saved }}>Kaydedildi ✓</span>
        </div>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 34, fontWeight: 700, color: C.ink, minHeight: 50, marginTop: 8 }}>
          {note.slice(0, typed)}
          {f < 100 && <Caret col="#b7791f" />}
        </div>
      </Card>
    </div>
  );
};

export const TopicTest: React.FC = () => {
  const f = useCurrentFrame();
  const res = "ddydddyddd";
  const pct = ramp(f, 14, 68, 0, 80, Easing.out(Easing.cubic));
  const R = 150, SW = 30, circ = 2 * Math.PI * R;
  const done = sp(f, 76, { damping: 8, stiffness: 200 });
  const ringGlow = f > 70 ? 0.5 + 0.5 * Math.sin((f - 70) / 5) : 0;
  return (
    <div style={{ position: "relative", height: 1048 }}>
      <AppBar title="Konu Testi" sub="HÜCRE BÖLÜNMESİ" />
      <div style={{ display: "flex", gap: 10, padding: "0 30px 10px", justifyContent: "center" }}>
        {res.split("").map((c, i) => {
          const at = 10 + i * 5;
          const s = sp(f, at, { damping: 10, stiffness: 240 });
          return (
            <div key={i} style={{ width: 44, height: 44, borderRadius: 12, background: f >= at ? (c === "d" ? C.green : C.red) : C.line, color: C.white, fontWeight: 800, fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${f >= at ? 0.7 + 0.3 * s : 0.8})` }}>
              {f >= at ? (c === "d" ? "✓" : "✕") : i + 1}
            </div>
          );
        })}
      </div>
      <div style={{ position: "relative", height: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={(R + SW) * 2} height={(R + SW) * 2} style={{ transform: "rotate(-90deg)", filter: `drop-shadow(0 0 ${10 + ringGlow * 24}px ${C.green}99)` }}>
          <defs>
            <linearGradient id="tg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={C.cyan} />
              <stop offset="1" stopColor={C.green} />
            </linearGradient>
          </defs>
          <circle cx={R + SW} cy={R + SW} r={R} fill="none" stroke={C.line} strokeWidth={SW} />
          <circle cx={R + SW} cy={R + SW} r={R} fill="none" stroke="url(#tg)" strokeWidth={SW} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)} />
        </svg>
        {/* %80 eşiği */}
        <div style={{ position: "absolute", left: W / 2 + Math.cos(-Math.PI / 2 + 0.8 * 2 * Math.PI) * (R + 54) - 10, top: 200 + Math.sin(-Math.PI / 2 + 0.8 * 2 * Math.PI) * (R + 54) - 10, width: 20, height: 20, borderRadius: 10, background: C.amber, boxShadow: `0 0 12px ${C.amber}` }} />
        <div style={{ position: "absolute", textAlign: "center" }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 88, fontWeight: 800, color: C.ink, lineHeight: 1, letterSpacing: -3 }}>%{Math.round(pct)}</div>
          <div style={{ fontSize: 26, fontWeight: 600, color: C.inkMuted, marginTop: 6 }}>10 soruda {res.split("").filter((c, i) => c === "d" && f >= 10 + i * 5).length} doğru</div>
        </div>
      </div>
      <div style={{ margin: "0 24px", height: 108, borderRadius: 28, background: C.green, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", gap: 16, fontFamily: FONT_DISPLAY, fontSize: 44, fontWeight: 800, transform: `scale(${f < 76 ? 0 : 1.6 - 0.6 * done}) rotate(${(1 - done) * -6}deg)`, opacity: f < 76 ? 0 : Math.min(1, done * 2), boxShadow: `0 20px 50px rgba(34,197,94,0.5)` }}>
        Konu tamamlandı ✓
      </div>
      <Burst at={78} x={W / 2} y={560} n={22} spread={280} />
      <div style={{ padding: "22px 30px 0", opacity: ramp(f, 84, 94) }}>
        {[
          ["Hücre Bölünmesi", true],
          ["Kalıtım", false],
        ].map(([n, ok]) => (
          <div key={String(n)} style={{ display: "flex", alignItems: "center", gap: 14, height: 62, fontSize: 27, fontWeight: 700, color: C.ink, borderBottom: `2px solid ${C.line}` }}>
            {ok ? <Check s={sp(f, 88)} size={36} /> : <span style={{ width: 36, height: 36, borderRadius: 18, border: `3px solid ${C.line}` }} />}
            {n as string}
            <span style={{ marginLeft: "auto", fontSize: 22, color: ok ? "#15803d" : C.inkMuted }}>{ok ? "tamamlandı" : "sıradaki"}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ───────────── Ogrenci5 · Planla + Koç ───────────── */

export const GoalPick: React.FC = () => {
  const f = useCurrentFrame();
  const opts = ["Tıp Fakültesi", "Bilgisayar Mühendisliği", "Hukuk Fakültesi", "Psikoloji"];
  const hover = interpolate(f, [14, 26, 34, 46], [2, 1, 1, 0], clamp);
  const picked = f >= 48;
  const pk = sp(f, 48, { damping: 9, stiffness: 220 });
  const load = ramp(f, 66, 100, 0, 1, Easing.inOut(Easing.cubic));
  const ready = sp(f, 102, { damping: 10, stiffness: 200 });
  const rowH = 92;
  return (
    <div style={{ position: "relative", height: 1048 }}>
      <AppBar title="Hedefini Seç" sub="PLANLA" tone="feather" />
      <div style={{ position: "relative", margin: "0 24px 18px", height: 62, borderRadius: 20, background: "#efe9df", display: "flex", padding: 4 }}>
        <div style={{ position: "absolute", left: 4, top: 4, width: "calc(50% - 4px)", height: 54, borderRadius: 16, background: C.navy }} />
        {["Üniversite", "Lise"].map((t, i) => (
          <div key={t} style={{ position: "relative", flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, color: i === 0 ? C.amberSoft : C.inkMuted }}>{t}</div>
        ))}
      </div>
      <div style={{ position: "relative", margin: "0 24px" }}>
        {!picked && <div style={{ position: "absolute", left: 0, right: 0, top: hover * rowH, height: rowH - 14, borderRadius: 22, border: `3px solid ${C.coral}`, opacity: ramp(f, 10, 16) }} />}
        {opts.map((o, i) => {
          const s = sp(f, 6 + i * 4);
          const on = picked && i === 0;
          return (
            <div
              key={o}
              style={{
                position: "relative",
                height: rowH - 14,
                marginBottom: 14,
                borderRadius: 22,
                padding: "0 26px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: on ? GRAD_FEATHER : C.surface,
                border: `2px solid ${on ? "transparent" : C.line}`,
                color: on ? C.white : C.ink,
                fontSize: 30,
                fontWeight: 700,
                opacity: s * (picked && !on ? 0.4 : 1),
                transform: `translateX(${(1 - s) * 80}px) scale(${on ? 1 + 0.04 * pk : 1})`,
                boxShadow: on ? `0 16px 40px ${C.coral}77` : undefined,
              }}
            >
              {o}
              {on && <Check s={pk} size={46} col={C.navy} />}
            </div>
          );
        })}
        <Tap at={46} x={280} y={(rowH - 14) / 2} col={C.coral} />
      </div>
      <Card delay={60} style={{ marginTop: 8, padding: "22px 26px" }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: C.inkMuted }}>
          Hedef: <span style={{ color: C.coral }}>Tıp Fakültesi</span>
        </div>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 34, fontWeight: 800, color: C.ink, marginTop: 6 }}>{f < 102 ? "Planın hazırlanıyor…" : "Çalışma planın hazır ✓"}</div>
        <div style={{ height: 14, borderRadius: 7, background: C.line, marginTop: 14, overflow: "hidden" }}>
          <div style={{ width: `${load * 100}%`, height: "100%", background: f < 102 ? GRAD_FEATHER : C.green }} />
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 14, opacity: ready, transform: `translateY(${(1 - ready) * 16}px)` }}>
          {["TYT", "AYT", "Haftalık hedef"].map((t) => (
            <span key={t} style={{ padding: "8px 16px", borderRadius: 999, background: C.pastelButter, color: "#92400e", fontWeight: 700, fontSize: 22 }}>{t}</span>
          ))}
        </div>
      </Card>
    </div>
  );
};

export const WeekPlan: React.FC = () => {
  const f = useCurrentFrame();
  const days = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
  const items = [
    { t: "Matematik · Türev", m: "45 dk", c: C.blue },
    { t: "Biyoloji · Hücre", m: "30 dk", c: C.green },
    { t: "Paragraf · 40 soru", m: "35 dk", c: C.coral },
    { t: "Kimya · Mol", m: "30 dk", c: C.magenta },
    { t: "TYT Denemesi", m: "165 dk", c: C.amber },
  ];
  const ticks = [22, 38, 54, 70];
  const doneN = ticks.filter((t) => f >= t + 2).length;
  const pp = ticks.reduce((a, t) => a + sp(f, t + 2, { damping: 16 }), 0) / items.length;
  return (
    <div style={{ position: "relative", height: 1048 }}>
      <AppBar title="Bu Haftan" sub="ÇALIŞMA PLANI · HEDEF: TIP" tone="feather" />
      <div style={{ display: "flex", gap: 8, padding: "0 24px 18px" }}>
        {days.map((d, i) => {
          const on = i === 2;
          const s = sp(f, 4 + i * 2);
          return (
            <div key={d} style={{ flex: 1, height: 80, borderRadius: 18, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: on ? GRAD_FEATHER : C.surface, color: on ? C.white : C.inkMuted, border: `2px solid ${on ? "transparent" : C.line}`, fontWeight: 700, fontSize: 20, transform: `translateY(${(1 - s) * 30}px)`, opacity: s }}>
              {d}
              <span style={{ fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 800, color: on ? C.white : C.ink }}>{11 + i}</span>
            </div>
          );
        })}
      </div>
      <Card delay={6} style={{ padding: "20px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: C.inkMuted, letterSpacing: 1.2 }}>HAFTALIK İLERLEME</span>
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 44, fontWeight: 800, color: C.coral, fontVariantNumeric: "tabular-nums" }}>%{Math.round(pp * 100)}</span>
        </div>
        <div style={{ position: "relative", height: 22, borderRadius: 11, background: C.line, marginTop: 10, overflow: "hidden" }}>
          <div style={{ width: `${pp * 100}%`, height: "100%", borderRadius: 11, background: GRAD_FEATHER, boxShadow: `0 0 16px ${C.coral}` }} />
        </div>
        <div style={{ fontSize: 22, color: C.inkMuted, marginTop: 10, fontWeight: 600 }}>{doneN}/5 görev tamamlandı</div>
      </Card>
      <div style={{ padding: "16px 24px 0" }}>
        {items.map((it, i) => {
          const s = sp(f, 8 + i * 4);
          const at = ticks[i];
          const done = at !== undefined && f >= at;
          const ck = at !== undefined ? sp(f, at, { damping: 9, stiffness: 260 }) : 0;
          const strike = at !== undefined ? ramp(f, at + 2, at + 10) : 0;
          return (
            <div key={it.t} style={{ position: "relative", display: "flex", alignItems: "center", gap: 18, height: 84, padding: "0 20px", marginBottom: 10, borderRadius: 22, background: C.surface, border: `2px solid ${done ? `${it.c}55` : C.line}`, opacity: s, transform: `translateX(${(1 - s) * 80}px)` }}>
              <div style={{ position: "absolute", left: 0, top: 14, bottom: 14, width: 7, borderRadius: 4, background: it.c }} />
              <div style={{ width: 44, height: 44, borderRadius: 13, border: `3px solid ${done ? C.green : C.line}`, background: done ? C.green : "transparent", display: "flex", alignItems: "center", justifyContent: "center", color: C.white, fontSize: 28, fontWeight: 800 }}>
                <span style={{ transform: `scale(${ck})`, display: "inline-block" }}>{done ? "✓" : ""}</span>
              </div>
              <span style={{ position: "relative", fontSize: 28, fontWeight: 700, color: done ? C.inkMuted : C.ink }}>
                {it.t}
                <span style={{ position: "absolute", left: 0, top: "52%", height: 3, width: `${strike * 100}%`, background: C.inkMuted }} />
              </span>
              <span style={{ marginLeft: "auto", fontSize: 22, fontWeight: 700, color: C.inkMuted }}>{it.m}</span>
              {at !== undefined && <Burst at={at} x={42} y={42} n={8} spread={70} cols={[C.green, C.amber, it.c]} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const CoachChat: React.FC = () => {
  const f = useCurrentFrame();
  const msg = (at: number, me: boolean, text: React.ReactNode, key: string) => {
    const s = sp(f, at, { damping: 12, stiffness: 200 });
    if (f < at) return null;
    return (
      <div key={key} style={{ display: "flex", justifyContent: me ? "flex-end" : "flex-start", marginBottom: 14 }}>
        <div
          style={{
            maxWidth: 440,
            padding: "18px 24px",
            borderRadius: 28,
            borderBottomRightRadius: me ? 8 : 28,
            borderBottomLeftRadius: me ? 28 : 8,
            background: me ? GRAD_FEATHER : C.surface,
            color: me ? C.white : C.ink,
            border: me ? "none" : `2px solid ${C.line}`,
            fontSize: 27,
            fontWeight: 600,
            lineHeight: 1.3,
            transform: `scale(${s}) translateY(${(1 - s) * 30}px)`,
            transformOrigin: me ? "right bottom" : "left bottom",
            opacity: Math.min(1, s * 2),
          }}
        >
          {text}
        </div>
      </div>
    );
  };
  const typing = f >= 50 && f < 66;
  const reg = f >= 106;
  const card = sp(f, 80, { damping: 12 });
  const rs = sp(f, 106, { damping: 9, stiffness: 240 });
  return (
    <div style={{ position: "relative", height: 1048 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "6px 26px 16px", borderBottom: `2px solid ${C.line}`, opacity: sp(f, 4) }}>
        <div style={{ position: "relative" }}>
          <div style={{ width: 64, height: 64, borderRadius: 32, background: `linear-gradient(135deg, ${C.blue}, ${C.cyan})`, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 28 }}>AH</div>
          <div style={{ position: "absolute", right: 0, bottom: 0, width: 18, height: 18, borderRadius: 9, background: C.green, border: "3px solid white" }} />
        </div>
        <div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 32, fontWeight: 800, color: C.ink }}>Ayşe Hoca</div>
          <div style={{ fontSize: 21, color: C.coral, fontWeight: 700 }}>KOÇ ÖĞRETMENİN · çevrimiçi</div>
        </div>
      </div>
      <div style={{ padding: "22px 24px 0" }}>
        {msg(8, false, <>Selam Elif! Bu haftaki planın <b>%80</b> tamam, harika gidiyorsun.</>, "a")}
        {msg(30, true, "Limitte biraz zorlanıyorum.", "b")}
        {typing && (
          <div style={{ display: "inline-flex", gap: 8, padding: "20px 26px", borderRadius: 28, borderBottomLeftRadius: 8, background: C.surface, border: `2px solid ${C.line}`, marginBottom: 14 }}>
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ width: 14, height: 14, borderRadius: 7, background: C.inkMuted, transform: `translateY(${Math.sin(f / 3 - i) * -6}px)` }} />
            ))}
          </div>
        )}
        {msg(66, false, "Perşembe canlı derse katıl, birlikte çözelim.", "c")}
      </div>
      <div style={{ margin: "6px 24px 0", padding: "22px 24px", borderRadius: 28, background: `linear-gradient(135deg, ${C.navy}, ${C.plum})`, color: C.white, opacity: card, transform: `translateY(${(1 - card) * 80}px) scale(${0.9 + 0.1 * card})`, boxShadow: "0 20px 40px rgba(9,2,84,0.35)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 21, fontWeight: 800, letterSpacing: 1.2, color: C.amberSoft }}>
          <span style={{ width: 12, height: 12, borderRadius: 6, background: C.red, opacity: 0.5 + 0.5 * Math.sin(f / 4) }} /> CANLI DERS
        </div>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 36, fontWeight: 800, marginTop: 6 }}>Limit ve Süreklilik</div>
        <div style={{ fontSize: 23, color: C.ice, marginTop: 4 }}>Perşembe · 20:00 · Ayşe Hoca</div>
        <div style={{ position: "relative", marginTop: 18, height: 78, borderRadius: 999, background: reg ? C.green : GRAD_FEATHER, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 30, transform: `scale(${f >= 102 && f < 108 ? 0.93 : reg ? 1 + 0.06 * (1 - rs) : 1})`, boxShadow: `0 0 ${reg ? 30 : 16}px ${reg ? C.green : C.coral}` }}>
          {reg ? "Kaydın alındı ✓" : "Canlı derse kayıt ol"}
        </div>
      </div>
      <Tap at={104} x={W / 2} y={655} col={C.amber} />
      <Burst at={107} x={W / 2} y={655} n={18} spread={220} />
    </div>
  );
};

/* ───────────── Ogrenci8 · özel ders talebi ───────────── */

const TEACHERS = [
  { n: "Ayşe Hoca", b: "Matematik", c: C.blue, i: "AH" },
  { n: "Mehmet Hoca", b: "Matematik · Geometri", c: C.green, i: "MH" },
  { n: "Zeynep Hoca", b: "Fizik", c: C.magenta, i: "ZH" },
];

export const TeacherPick: React.FC = () => {
  const f = useCurrentFrame();
  const topic = "Limit ve Süreklilik";
  const typed = Math.floor(ramp(f, 8, 34, 0, topic.length, Easing.linear));
  const pick = sp(f, 60, { damping: 11, stiffness: 200 });
  const picked = f >= 60;
  const scan = interpolate(f, [36, 44, 50, 58], [2, 1, 1, 0], clamp);
  return (
    <div style={{ position: "relative", height: 1048 }}>
      <AppBar title="Özel Ders İste" sub="KOÇLUK" tone="feather" />
      <Card delay={4} style={{ padding: "18px 24px", border: `2px solid ${f >= 8 && f < 36 ? C.coral : C.line}` }}>
        <div style={{ fontSize: 21, fontWeight: 700, color: C.coral, letterSpacing: 1.2 }}>ZORLANDIĞIN KONU</div>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 38, fontWeight: 800, color: C.ink, marginTop: 6, minHeight: 46 }}>
          {topic.slice(0, typed)}
          {f < 40 && <Caret col={C.coral} />}
        </div>
      </Card>
      <div style={{ padding: "22px 30px 10px", fontSize: 22, fontWeight: 700, color: C.inkMuted, letterSpacing: 1.2, opacity: ramp(f, 16, 24) }}>KOÇ ÖĞRETMENLER</div>
      <div style={{ position: "relative", margin: "0 24px" }}>
        {!picked && f >= 36 && <div style={{ position: "absolute", left: -4, right: -4, top: scan * 138 - 4, height: 128, borderRadius: 28, border: `3px solid ${C.coral}`, zIndex: 3 }} />}
        {TEACHERS.map((t, i) => {
          const s = sp(f, 20 + i * 5);
          const on = picked && i === 0;
          return (
            <div
              key={t.n}
              style={{
                position: "relative",
                height: on ? 200 : 120,
                marginBottom: 18,
                borderRadius: 26,
                background: C.surface,
                border: `3px solid ${on ? C.coral : C.line}`,
                padding: "0 22px",
                overflow: "hidden",
                opacity: s * (picked && !on ? 0.45 : 1),
                transform: `translateX(${(1 - s) * 90}px)`,
                boxShadow: on ? `0 18px 40px ${C.coral}55` : "0 8px 20px rgba(43,36,64,0.06)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 18, height: 114 }}>
                <div style={{ width: 74, height: 74, borderRadius: 37, background: `linear-gradient(135deg, ${t.c}, ${t.c}99)`, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 28 }}>{t.i}</div>
                <div>
                  <div style={{ fontFamily: FONT_DISPLAY, fontSize: 32, fontWeight: 800, color: C.ink }}>{t.n}</div>
                  <div style={{ fontSize: 22, color: C.inkMuted, fontWeight: 600 }}>{t.b}</div>
                </div>
                <div style={{ marginLeft: "auto", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                  {i === 0 && <span style={{ padding: "4px 12px", borderRadius: 999, background: C.pastelButter, color: "#92400e", fontWeight: 700, fontSize: 19 }}>Koçun</span>}
                  <span style={{ padding: "4px 12px", borderRadius: 999, background: "rgba(34,197,94,0.14)", color: "#15803d", fontWeight: 700, fontSize: 19 }}>Müsait</span>
                </div>
              </div>
              {on && (
                <div style={{ height: 70, borderRadius: 999, background: GRAD_FEATHER, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 28, transform: `scale(${pick})`, opacity: pick }}>
                  Özel ders iste →
                </div>
              )}
            </div>
          );
        })}
        <Tap at={58} x={260} y={60} col={C.coral} />
      </div>
    </div>
  );
};

export const SlotRequest: React.FC = () => {
  const f = useCurrentFrame();
  const days = ["Pzt 11", "Sal 12", "Çar 13", "Per 14", "Cum 15"];
  const dayP = interpolate(sp(f, 12, { damping: 15 }), [0, 1], [0, 2]);
  const slots = ["15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];
  const busy = [1, 3];
  const pickAt = 34;
  const note = "Sağdan ve soldan limitte zorlanıyorum.";
  const typed = Math.floor(ramp(f, 46, 76, 0, note.length, Easing.linear));
  const sent = f >= 90;
  const ss = sp(f, 90, { damping: 9, stiffness: 240 });
  const plane = ramp(f, 90, 112, 0, 1, Easing.in(Easing.cubic));
  const dw = (W - 48 - 4 * 10) / 5;
  return (
    <div style={{ position: "relative", height: 1048 }}>
      <AppBar title="Saat Seç" sub="AYŞE HOCA · MATEMATİK" tone="feather" />
      <div style={{ position: "relative", display: "flex", gap: 10, margin: "0 24px 18px" }}>
        <div style={{ position: "absolute", left: dayP * (dw + 10), top: 0, width: dw, height: 78, borderRadius: 18, background: GRAD_FEATHER }} />
        {days.map((d, i) => {
          const on = Math.round(dayP) === i;
          return (
            <div key={d} style={{ position: "relative", width: dw, height: 78, borderRadius: 18, border: `2px solid ${on ? "transparent" : C.line}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: on ? C.white : C.inkMuted, fontWeight: 700, fontSize: 20 }}>
              {d.split(" ")[0]}
              <span style={{ fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 800, color: on ? C.white : C.ink }}>{d.split(" ")[1]}</span>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, margin: "0 24px" }}>
        {slots.map((t, i) => {
          const s = sp(f, 14 + i * 3, { damping: 11, stiffness: 220 });
          const isBusy = busy.includes(i);
          const on = i === 4 && f >= pickAt;
          return (
            <div
              key={t}
              style={{
                width: (W - 48 - 24) / 3,
                height: 76,
                borderRadius: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                fontWeight: 800,
                background: on ? C.navy : isBusy ? "repeating-linear-gradient(45deg, #efe9df, #efe9df 8px, #e4dccf 8px, #e4dccf 16px)" : C.surface,
                color: on ? C.amberSoft : isBusy ? "#b9b2c4" : C.ink,
                border: `2px solid ${on ? C.navy : C.line}`,
                textDecoration: isBusy ? "line-through" : undefined,
                transform: `scale(${s * (on ? 1 + 0.08 * Math.max(0, 1 - (f - pickAt) / 10) : 1)})`,
                boxShadow: on ? `0 12px 30px ${C.navy}55` : undefined,
              }}
            >
              {t}
            </div>
          );
        })}
      </div>
      <Tap at={32} x={24 + ((W - 48 - 24) / 3) * 1.5 + 12} y={70 + 96 + 78 + 18 + 76 + 12 + 38} col={C.coral} />
      <Card delay={40} style={{ marginTop: 20, padding: "16px 22px" }}>
        <div style={{ fontSize: 21, fontWeight: 700, color: C.inkMuted, letterSpacing: 1.2 }}>KOÇUNA NOT</div>
        <div style={{ fontSize: 27, fontWeight: 600, color: C.ink, marginTop: 6, minHeight: 72, lineHeight: 1.3 }}>
          {note.slice(0, typed)}
          {f >= 46 && f < 84 && <Caret col={C.coral} />}
        </div>
      </Card>
      <div style={{ position: "relative", margin: "20px 24px 0", height: 84, borderRadius: 999, background: sent ? C.green : GRAD_FEATHER, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 34, transform: `scale(${f >= 86 && f < 92 ? 0.93 : sent ? 1 + 0.06 * (1 - ss) : 1})`, boxShadow: `0 16px 40px ${sent ? "rgba(34,197,94,0.5)" : `${C.coral}66`}`, opacity: ramp(f, 78, 84) }}>
        {sent ? "Talep gönderildi ✓" : "Talep gönder"}
        {f >= 90 && f < 112 && (
          <span style={{ position: "absolute", right: 60 - plane * 40, top: 18 - plane * 260, fontSize: 40, transform: `rotate(${-20 - plane * 20}deg) scale(${1 - plane * 0.5})`, opacity: 1 - plane }}>✈</span>
        )}
      </div>
      <Tap at={88} x={W / 2} y={830} col={C.white} />
      <Burst at={92} x={W / 2} y={830} n={18} spread={240} />
      <div style={{ margin: "18px 30px 0", display: "flex", alignItems: "center", gap: 14, fontSize: 24, fontWeight: 600, color: C.inkMuted, opacity: ramp(f, 100, 108) }}>
        <span style={{ width: 14, height: 14, borderRadius: 7, background: C.amber, opacity: 0.5 + 0.5 * Math.sin(f / 4) }} />
        Çarşamba 19:00 · koç onayı bekleniyor
      </div>
    </div>
  );
};

/* ───────────── Ogrenci9 · canlı ders ───────────── */

export const LiveRegister: React.FC = () => {
  const f = useCurrentFrame();
  const lessons = [
    { t: "Limit ve Süreklilik", w: "Ayşe Hoca · Bugün 20:00", c: C.blue },
    { t: "Paragraf Taktikleri", w: "Mehmet Hoca · Yarın 19:00", c: C.coral },
    { t: "Organik Kimya", w: "Zeynep Hoca · Cuma 18:00", c: C.green },
  ];
  const reg = f >= 30;
  const rs = sp(f, 30, { damping: 9, stiffness: 240 });
  const cd = Math.max(0, Math.ceil(ramp(f, 56, 100, 10, 0, Easing.linear)));
  const live = f >= 100;
  const ls = sp(f, 100, { damping: 9, stiffness: 220 });
  return (
    <div style={{ position: "relative", height: 1048 }}>
      <AppBar title="Canlı Dersler" sub="BU HAFTA" />
      {lessons.map((l, i) => {
        const s = sp(f, 6 + i * 5);
        const first = i === 0;
        return (
          <div key={l.t} style={{ margin: "0 24px 16px", padding: "18px 22px", borderRadius: 26, background: C.surface, border: `3px solid ${first && reg ? C.green : C.line}`, display: "flex", alignItems: "center", gap: 16, opacity: s, transform: `translateY(${(1 - s) * 60}px)`, boxShadow: first && reg ? `0 0 ${24 * rs}px rgba(34,197,94,0.45)` : undefined }}>
            <div style={{ width: 10, alignSelf: "stretch", borderRadius: 5, background: l.c }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 31, fontWeight: 800, color: C.ink }}>{l.t}</div>
              <div style={{ fontSize: 21, color: C.inkMuted, fontWeight: 600, marginTop: 2 }}>{l.w}</div>
            </div>
            <div style={{ padding: "12px 20px", borderRadius: 999, fontWeight: 800, fontSize: 22, background: first && reg ? C.green : first ? GRAD_BRAND : C.canvas, color: first ? (reg ? C.white : C.navy) : C.inkMuted, border: first ? "none" : `2px solid ${C.line}`, transform: `scale(${first && f >= 26 && f < 32 ? 0.9 : first && reg ? 1 + 0.1 * (1 - rs) : 1})` }}>
              {first && reg ? "Kayıtlısın ✓" : "Kayıt ol"}
            </div>
          </div>
        );
      })}
      <Tap at={28} x={510} y={150} col={C.green} />
      <Card delay={50} style={{ marginTop: 6, padding: "24px 26px", background: `linear-gradient(135deg, ${C.navy}, ${C.royal})`, border: "none", color: C.white, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: "50%", top: "50%", width: 400, height: 400, marginLeft: -200, marginTop: -200, borderRadius: 200, background: `radial-gradient(circle, ${live ? C.red : C.cyan}55, transparent 65%)`, transform: `scale(${1 + 0.15 * Math.sin(f / 5)})` }} />
        <div style={{ position: "relative", fontSize: 22, fontWeight: 700, color: C.ice, letterSpacing: 1.3 }}>{live ? "DERS BAŞLADI" : "DERSİN BAŞLAMASINA"}</div>
        <div style={{ position: "relative", fontFamily: FONT_DISPLAY, fontSize: 96, fontWeight: 800, letterSpacing: -2, lineHeight: 1.1, fontVariantNumeric: "tabular-nums", transform: `scale(${1 + 0.06 * (f >= 56 && !live ? Math.max(0, 1 - ((f - 56) % 4.4) / 4.4) : 0)})` }}>
          {live ? "CANLI" : `00:${String(cd).padStart(2, "0")}`}
        </div>
        <div style={{ position: "relative", margin: "12px auto 0", width: 340, height: 70, borderRadius: 999, background: live ? C.red : "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, fontWeight: 800, fontSize: 28, transform: `scale(${live ? 0.9 + 0.1 * ls + 0.03 * Math.sin(f / 4) : 1})`, boxShadow: live ? `0 0 30px ${C.red}` : undefined }}>
          {live && <span style={{ width: 14, height: 14, borderRadius: 7, background: C.white }} />}
          Derse katıl
        </div>
      </Card>
    </div>
  );
};

const Board: React.FC<{ h: number; t: number }> = ({ h, t }) => {
  const draw = ramp(t, 10, 60, 0, 1, Easing.linear);
  const draw2 = ramp(t, 60, 100, 0, 1, Easing.linear);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(160deg, #123c34, #0b2621)", padding: "60px 30px 0" }}>
      <div style={{ fontFamily: FONT_DISPLAY, color: "#eafff5", fontSize: 46, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", width: `${draw * 100}%` }}>lim (x→0) sin x / x = 1</div>
      <div style={{ fontFamily: FONT_DISPLAY, color: C.amberSoft, fontSize: 36, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", width: `${draw2 * 100}%`, marginTop: 16 }}>sağdan = soldan → limit var</div>
      <div style={{ position: "absolute", right: 22, bottom: 22, width: 130, height: 130, borderRadius: 24, background: `linear-gradient(135deg, ${C.blue}, ${C.cyan})`, border: "4px solid white", display: "flex", alignItems: "center", justifyContent: "center", color: C.white, fontWeight: 800, fontSize: 40, boxShadow: "0 10px 24px rgba(0,0,0,0.4)" }}>
        AH
        <div style={{ position: "absolute", bottom: 8, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 3 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} style={{ width: 5, height: 6 + Math.abs(Math.sin(t / 3 + i)) * 14, borderRadius: 3, background: C.white }} />
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", left: 20, top: 18, display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 10, background: C.red, color: C.white, fontWeight: 800, fontSize: 21 }}>
          <span style={{ width: 10, height: 10, borderRadius: 5, background: C.white, opacity: 0.5 + 0.5 * Math.sin(t / 4) }} />
          CANLI
        </span>
      </div>
      <div style={{ height: h }} />
    </AbsoluteFill>
  );
};

const REACT = ["👏", "❤️", "✋", "🔥", "👏", "❤️"];

export const LiveStream: React.FC = () => {
  const f = useCurrentFrame();
  const viewers = Math.round(ramp(f, 8, 90, 86, 142, Easing.out(Easing.cubic)));
  const avatars = [
    { c: "#8b5cf6", n: "E" },
    { c: C.sky, n: "M" },
    { c: C.magenta, n: "Z" },
    { c: C.amber, n: "C" },
    { c: C.green, n: "D" },
    { c: C.coral, n: "B" },
  ];
  return (
    <div style={{ position: "relative", height: 1048 }}>
      <AppBar title="Limit ve Süreklilik" sub="CANLI DERS · AYŞE HOCA" />
      <div style={{ position: "relative", margin: "0 24px", height: 400, borderRadius: 28, overflow: "hidden", boxShadow: "0 20px 40px rgba(9,2,84,0.3)" }}>
        <Board h={400} t={f} />
        <div style={{ position: "absolute", right: 18, top: 18, padding: "6px 14px", borderRadius: 10, background: "rgba(0,0,0,0.5)", color: C.white, fontWeight: 700, fontSize: 21, fontVariantNumeric: "tabular-nums" }}>👁 {viewers}</div>
        {REACT.map((r, i) => {
          const at = 20 + i * 14;
          const t = f - at;
          if (t < 0 || t > 50) return null;
          const p = t / 50;
          return (
            <span key={i} style={{ position: "absolute", left: 40 + ((i * 83) % 260), bottom: 20 + p * 300, fontSize: 44, opacity: 1 - p, transform: `translateX(${Math.sin(t / 6 + i) * 20}px) scale(${0.6 + 0.6 * sp(f, at)})` }}>{r}</span>
          );
        })}
      </div>
      <div style={{ padding: "22px 30px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, fontWeight: 700, color: C.inkMuted, letterSpacing: 1.2 }}>
          <span>DERSTE OLANLAR</span>
          <span style={{ color: C.blue, fontFamily: FONT_DISPLAY, fontSize: 30, fontWeight: 800 }}>{viewers} kişi</span>
        </div>
        <div style={{ display: "flex", marginTop: 14 }}>
          {avatars.map((a, i) => {
            const s = sp(f, 12 + i * 8, { damping: 10, stiffness: 220 });
            return (
              <div key={i} style={{ marginLeft: i ? -14 : 0 }}>
                <Avatar ch={a.n} bg={a.c} size={70} s={s} />
              </div>
            );
          })}
          <div style={{ marginLeft: -14, width: 70, height: 70, borderRadius: 35, background: C.navy, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 22, border: "3px solid white", transform: `scale(${sp(f, 64)})` }}>+{viewers - 6}</div>
        </div>
      </div>
      <Card delay={30} style={{ marginTop: 22, padding: "18px 22px", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 54, height: 54, borderRadius: 27, background: GRAD_BRAND, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>✋</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 800, color: C.ink }}>Elif K. söz istedi</div>
          <div style={{ fontSize: 21, color: C.inkMuted, fontWeight: 600 }}>az önce</div>
        </div>
      </Card>
    </div>
  );
};

export const LiveAsk: React.FC = () => {
  const f = useCurrentFrame();
  const q = "x→2 için bir örnek çözebilir miyiz?";
  const typed = Math.floor(ramp(f, 34, 64, 0, q.length, Easing.linear));
  const sent = f >= 70;
  const bubble = (at: number, who: string, text: string, opts: { me?: boolean; teacher?: boolean; c?: string } = {}) => {
    const s = sp(f, at, { damping: 12, stiffness: 210 });
    if (f < at) return null;
    const { me, teacher } = opts;
    return (
      <div style={{ display: "flex", justifyContent: me ? "flex-end" : "flex-start", marginBottom: 12 }}>
        <div style={{ maxWidth: 470, padding: "14px 20px", borderRadius: 24, borderBottomRightRadius: me ? 6 : 24, borderBottomLeftRadius: me ? 24 : 6, background: me ? GRAD_BRAND : teacher ? C.navy : C.surface, color: me ? C.navy : teacher ? C.white : C.ink, border: me || teacher ? "none" : `2px solid ${C.line}`, transform: `scale(${s})`, transformOrigin: me ? "right bottom" : "left bottom", opacity: Math.min(1, s * 2), boxShadow: teacher ? `0 12px 30px ${C.navy}55` : undefined }}>
          <div style={{ fontSize: 19, fontWeight: 800, color: me ? C.navy : teacher ? C.cyan : opts.c ?? C.blue, marginBottom: 2 }}>
            {who}
            {teacher && <span style={{ marginLeft: 8, padding: "2px 8px", borderRadius: 6, background: C.cyan, color: C.navy, fontSize: 16 }}>ÖĞRETMEN</span>}
          </div>
          <div style={{ fontSize: 25, fontWeight: 600, lineHeight: 1.25 }}>{text}</div>
        </div>
      </div>
    );
  };
  return (
    <div style={{ position: "relative", height: 1048 }}>
      <div style={{ position: "relative", margin: "4px 24px 0", height: 200, borderRadius: 24, overflow: "hidden" }}>
        <Board h={200} t={f + 70} />
      </div>
      <div style={{ padding: "16px 24px 0", height: 470, display: "flex", flexDirection: "column", justifyContent: "flex-end", overflow: "hidden" }}>
        {bubble(4, "Mert A.", "Sağdan limit neden farklı çıktı?", { c: C.sky })}
        {bubble(16, "Zeynep T.", "Grafikte gösterebilir misiniz?", { c: C.magenta })}
        {sent && bubble(70, "Sen", q, { me: true })}
        {bubble(92, "Ayşe Hoca", "Güzel soru! Hemen tahtada çözüyoruz.", { teacher: true })}
      </div>
      <div style={{ margin: "16px 24px 0", display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ flex: 1, height: 72, borderRadius: 999, background: C.surface, border: `2px solid ${f >= 34 && !sent ? C.blue : C.line}`, display: "flex", alignItems: "center", padding: "0 24px", fontSize: 23, fontWeight: 600, color: typed && !sent ? C.ink : "#b9b2c4", whiteSpace: "nowrap", overflow: "hidden" }}>
          {sent || !typed ? "Sorunu yaz…" : q.slice(0, typed)}
          {f >= 34 && !sent && <Caret />}
        </div>
        <div style={{ width: 72, height: 72, borderRadius: 36, background: GRAD_BRAND, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, color: C.navy, fontWeight: 800, transform: `scale(${f >= 66 && f < 72 ? 0.85 : 1})` }}>➤</div>
      </div>
      <Tap at={67} x={W - 60} y={4 + 200 + 16 + 470 + 16 + 36} col={C.blue} />
      <div style={{ margin: "16px 24px 0", height: 70, borderRadius: 22, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, fontWeight: 800, fontSize: 26, color: C.navy, background: C.pastelButter, opacity: ramp(f, 6, 14) }}>
        ✋ Söz iste
      </div>
    </div>
  );
};

/* ───────────── Ogrenci10 · bir öğrencinin haftası ───────────── */

const GUNLER = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

/** Hızlı montaj sahnesi: dev gün adı + haftalık şerit + telefon. `skip` ile widget animasyonunun ortasından girer. */
export const DayScene: React.FC<{ day: string; dayIdx: number; title: string; skip?: number; tone?: Tone; children: React.ReactNode }> = ({ day, dayIdx, title, skip = 0, tone = "brand", children }) => {
  const f = useCurrentFrame();
  const col = tone === "feather" ? C.coral : C.cyan;
  const ds = sp(f, 0, { damping: 12, stiffness: 160 });
  const ph = sp(f, 0, { damping: 15, stiffness: 140 });
  return (
    <AbsoluteFill>
      <Bg tone={tone} />
      {/* dev gün adı (arka plan) */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 250, letterSpacing: -10, color: "transparent", WebkitTextStroke: `3px ${col}`, opacity: 0.22, whiteSpace: "nowrap", transform: `translateX(${(1 - ds) * 500 - f * 2}px)` }}>
        {day}
      </div>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: SAFE.top + 34 }}>
        {/* hafta şeridi */}
        <div style={{ display: "flex", gap: 10 }}>
          {GUNLER.map((g, i) => {
            const on = i === dayIdx;
            const past = i < dayIdx;
            return (
              <div key={g} style={{ width: 96, height: 62, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_SANS, fontWeight: 700, fontSize: 24, background: on ? (tone === "feather" ? GRAD_FEATHER : GRAD_BRAND) : past ? `${col}33` : "rgba(225,239,255,0.06)", color: on ? C.navy : past ? col : "rgba(225,239,255,0.5)", border: `2px solid ${on ? "transparent" : `${col}44`}`, transform: `scale(${on ? 0.8 + 0.25 * ds : 1})`, boxShadow: on ? `0 0 30px ${col}aa` : undefined }}>
                {past ? "✓" : g}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 26, padding: "0 60px" }}>
          <Words text={title} delay={2} size={82} tone={tone} stagger={2} />
        </div>
        <div style={{ marginTop: 30, transform: `translateX(${(1 - ph) * 700}px) rotate(${(1 - ph) * 10}deg)` }}>
          <Phone delay={-30} scale={0.96}>
            <Sequence from={-skip} layout="none">
              {children}
            </Sequence>
          </Phone>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
