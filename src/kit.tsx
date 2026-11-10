import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, FONT_DISPLAY, FONT_SANS, GRAD_BRAND, GRAD_FEATHER, SITE } from "./theme";

/* ───────────── Instagram Reels güvenli alanları (1080x1920) ─────────────
   Üst 0-220: kullanıcı adı / "Reels" başlığı → metin koyma
   Alt 1500-1920: açıklama, ses satırı, butonlar → önemli içerik koyma
   Sağ 930-1080 (y>1000): beğeni/yorum/paylaş ikonları → içerik koyma
   Göz önce merkezin biraz üstüne (y≈700-1000) düşer; ana mesaj burada.
   Profil ızgarası 3:4 kırpar (y 240-1680), kapak karesi = 0. kare. */
export const SAFE = { top: 220, bottom: 1500, right: 930, eye: 860 } as const;

export const SafeGuides: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", zIndex: 999 }}>
    <div style={{ position: "absolute", left: 0, top: 0, right: 0, height: SAFE.top, background: "rgba(255,0,0,0.28)" }} />
    <div style={{ position: "absolute", left: 0, top: SAFE.bottom, right: 0, bottom: 0, background: "rgba(255,0,0,0.28)" }} />
    <div style={{ position: "absolute", left: SAFE.right, top: 1000, width: 150, height: SAFE.bottom - 1000, background: "rgba(255,0,0,0.28)" }} />
    <div style={{ position: "absolute", left: 0, top: 240, right: 0, height: 1440, border: "4px dashed rgba(255,255,0,0.7)" }} />
    <div style={{ position: "absolute", left: 0, top: SAFE.eye, right: 0, height: 4, background: "rgba(0,255,0,0.6)" }} />
  </AbsoluteFill>
);

/* ───────────── yardımcılar ───────────── */

export const useSp = (delay = 0, cfg: Partial<{ damping: number; stiffness: number; mass: number }> = {}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 170, mass: 0.7, ...cfg } });
};

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const ramp = (f: number, a: number, b: number, from = 0, to = 1, ease = Easing.out(Easing.cubic)) =>
  interpolate(f, [a, b], [from, to], { ...clamp, easing: ease });

export type Tone = "brand" | "feather" | "amber";
const toneGrad = (t: Tone) => (t === "brand" ? GRAD_BRAND : t === "feather" ? GRAD_FEATHER : `linear-gradient(100deg, ${C.amberSoft}, ${C.amber} 50%, ${C.coral})`);

/* ───────────── arka plan ───────────── */

export const Bg: React.FC<{ tone?: Tone; intensity?: number }> = ({ tone = "brand", intensity = 1 }) => {
  const f = useCurrentFrame();
  const a = tone === "brand" ? C.cyan : tone === "feather" ? C.coral : C.amber;
  const b = tone === "brand" ? C.blue : tone === "feather" ? C.magenta : C.coral;
  const orb = (x: number, y: number, r: number, col: string, op: number) => (
    <div
      style={{
        position: "absolute",
        left: x - r,
        top: y - r,
        width: r * 2,
        height: r * 2,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${col} 0%, transparent 65%)`,
        opacity: op * intensity,
        filter: "blur(30px)",
      }}
    />
  );
  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 80% at 50% 0%, ${C.deep} 0%, ${C.navy} 45%, ${C.night} 100%)`, overflow: "hidden" }}>
      {orb(200 + Math.sin(f / 40) * 120, 380 + Math.cos(f / 50) * 80, 520, a, 0.45)}
      {orb(880 + Math.cos(f / 45) * 100, 1250 + Math.sin(f / 35) * 120, 600, b, 0.5)}
      {orb(540 + Math.sin(f / 60) * 200, 1750, 420, C.plum, 0.6)}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(rgba(225,239,255,0.05) 2px, transparent 2px), linear-gradient(90deg, rgba(225,239,255,0.05) 2px, transparent 2px)`,
          backgroundSize: "90px 90px",
          backgroundPosition: `0px ${(f * 1.5) % 90}px`,
          maskImage: "radial-gradient(80% 60% at 50% 45%, black 20%, transparent 80%)",
        }}
      />
    </AbsoluteFill>
  );
};

/* ───────────── metin ───────────── */

type WordsProps = {
  text: string; // satır sonu: \n, vurgulu: *kelime grubu*
  delay?: number;
  stagger?: number;
  size?: number;
  weight?: number;
  color?: string;
  tone?: Tone;
  align?: "center" | "left";
  lineHeight?: number;
  font?: "display" | "sans";
  style?: React.CSSProperties;
};

export const Words: React.FC<WordsProps> = ({
  text,
  delay = 0,
  stagger = 4,
  size = 96,
  weight = 800,
  color = C.white,
  tone = "brand",
  align = "center",
  lineHeight = 1.04,
  font = "display",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  let hl = false;
  let i = 0;
  const lines = text.split("\n");
  return (
    <div style={{ textAlign: align, fontFamily: font === "display" ? FONT_DISPLAY : FONT_SANS, fontSize: size, fontWeight: weight, color, lineHeight, letterSpacing: font === "display" ? -size * 0.025 : 0, ...style }}>
      {lines.map((line, li) => (
        <div key={li} style={{ display: "flex", flexWrap: "wrap", justifyContent: align === "center" ? "center" : "flex-start", columnGap: size * 0.26 }}>
          {line.split(" ").filter(Boolean).map((raw, wi) => {
            let w = raw;
            const starts = w.startsWith("*");
            if (starts) { hl = true; w = w.slice(1); }
            const ends = w.endsWith("*");
            if (ends) w = w.slice(0, -1);
            const isHl = hl;
            if (ends) hl = false;
            const s = spring({ frame: frame - delay - i * stagger, fps, config: { damping: 13, stiffness: 190, mass: 0.6 } });
            i++;
            return (
              <span
                key={wi}
                style={{
                  display: "inline-block",
                  transform: `translateY(${(1 - s) * size * 0.7}px) scale(${0.7 + 0.3 * s})`,
                  opacity: Math.min(1, s * 2.5),
                  filter: `blur(${Math.max(0, (1 - s) * 12)}px)`,
                  ...(isHl
                    ? { backgroundImage: toneGrad(tone), WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", paddingBottom: size * 0.08 }
                    : {}),
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export const Chip: React.FC<{ children: React.ReactNode; delay?: number; tone?: Tone; style?: React.CSSProperties; dark?: boolean }> = ({ children, delay = 0, tone = "brand", style, dark }) => {
  const s = useSp(delay, { damping: 12 });
  const col = tone === "brand" ? C.cyan : tone === "feather" ? C.coral : C.amber;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 30px",
        borderRadius: 999,
        border: `2px solid ${col}66`,
        background: dark ? "rgba(5,1,46,0.75)" : `${col}1f`,
        color: col,
        fontFamily: FONT_SANS,
        fontWeight: 600,
        fontSize: 34,
        letterSpacing: 1,
        transform: `scale(${s})`,
        opacity: s,
        backdropFilter: "blur(8px)",
        ...style,
      }}
    >
      <span style={{ width: 14, height: 14, borderRadius: 7, background: col, boxShadow: `0 0 18px ${col}` }} />
      {children}
    </div>
  );
};

export const Logo: React.FC<{ width?: number; dark?: boolean; delay?: number; style?: React.CSSProperties }> = ({ width = 420, dark = true, delay = 0, style }) => {
  const s = useSp(delay, { damping: 11 });
  return <Img src={staticFile(dark ? "logo-dark.svg" : "logo.svg")} style={{ width, transform: `scale(${0.6 + 0.4 * s}) rotate(${(1 - s) * -8}deg)`, opacity: s, ...style }} />;
};

/* ───────────── çapa kancaları (ilk 3 sn) ─────────────
   Kural: 0. karede metin tam okunur durumda (kapak karesi + kaydırmayı durdurma),
   ilk 0.5 sn içinde güçlü hareket (slam, sarsıntı, şok dalgası), 3. sn'de vaat netleşir. */

const Shake: React.FC<{ hits: number[]; children: React.ReactNode }> = ({ hits, children }) => {
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

const Shockwave: React.FC<{ at: number; tone: Tone; y?: number }> = ({ at, tone, y = SAFE.eye }) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < 0 || t > 26) return null;
  const p = t / 26;
  const col = tone === "brand" ? C.cyan : tone === "feather" ? C.coral : C.amber;
  return (
    <div
      style={{
        position: "absolute",
        left: 540 - 900 * p,
        top: y - 900 * p,
        width: 1800 * p,
        height: 1800 * p,
        borderRadius: "50%",
        border: `${18 * (1 - p) + 2}px solid ${col}`,
        opacity: (1 - p) * 0.8,
        boxShadow: `0 0 60px ${col}`,
      }}
    />
  );
};

const GhostMarquee: React.FC<{ word: string; tone: Tone }> = ({ word, tone }) => {
  const f = useCurrentFrame();
  const col = tone === "brand" ? C.cyan : tone === "feather" ? C.coral : C.amber;
  const row = (y: number, dir: number, op: number) => (
    <div
      style={{
        position: "absolute",
        top: y,
        left: -400 + ((f * 6 * dir) % 800),
        whiteSpace: "nowrap",
        fontFamily: FONT_DISPLAY,
        fontWeight: 800,
        fontSize: 260,
        color: "transparent",
        WebkitTextStroke: `3px ${col}`,
        opacity: op,
        letterSpacing: -6,
      }}
    >
      {(word + " • ").repeat(6)}
    </div>
  );
  return (
    <>
      {row(120, -1, 0.14)}
      {row(1500, 1, 0.12)}
    </>
  );
};

export type SlamLine = { text: string; size?: number; tone?: Tone | "white"; at?: number };

/** Satır satır "çarpan" büyük başlıklar. İlk satır 0. karede görünür. */
export const HookSlam: React.FC<{ lines: SlamLine[]; kicker?: string; ghost?: string; tone?: Tone; sub?: string; subAt?: number }> = ({
  lines,
  kicker,
  ghost,
  tone = "brand",
  sub,
  subAt = 50,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ats = lines.map((l, i) => l.at ?? i * 11);
  return (
    <AbsoluteFill>
      <Bg tone={tone} intensity={1.2} />
      {ghost && <GhostMarquee word={ghost} tone={tone} />}
      {ats.map((a, i) => <Shockwave key={i} at={a} tone={tone} />)}
      <Shake hits={ats}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 70px 200px", flexDirection: "column", gap: 10 }}>
          {kicker && (
            <div style={{ marginBottom: 30 }}>
              <Chip tone={tone} delay={-20}>{kicker}</Chip>
            </div>
          )}
          {lines.map((l, i) => {
            const t = f - ats[i];
            const s = spring({ frame: t, fps, config: { damping: 11, stiffness: 260, mass: 0.6 } });
            const first = i === 0;
            const visible = first || t >= 0;
            const scale = first ? 1 + (1 - s) * 0.12 : 2.4 - 1.4 * s;
            const size = l.size ?? 150;
            const grad = l.tone && l.tone !== "white" ? toneGrad(l.tone) : null;
            return (
              <div
                key={i}
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 800,
                  fontSize: size,
                  lineHeight: 0.98,
                  letterSpacing: -size * 0.035,
                  textAlign: "center",
                  opacity: visible ? (first ? 1 : Math.min(1, s * 3)) : 0,
                  transform: `scale(${scale})`,
                  filter: first ? undefined : `blur(${Math.max(0, (1 - s) * 14)}px)`,
                  color: grad ? "transparent" : C.white,
                  backgroundImage: grad ?? undefined,
                  WebkitBackgroundClip: grad ? "text" : undefined,
                  backgroundClip: grad ? "text" : undefined,
                  textShadow: grad ? undefined : "0 10px 50px rgba(0,0,0,0.45)",
                  paddingBottom: size * 0.06,
                }}
              >
                {l.text}
              </div>
            );
          })}
          {sub && (
            <div style={{ marginTop: 40 }}>
              <Words text={sub} delay={subAt} size={50} weight={500} font="sans" color={C.ice} stagger={3} />
            </div>
          )}
        </AbsoluteFill>
      </Shake>
    </AbsoluteFill>
  );
};

/** Eskiyi üstünü çizip yenisini çarpan kanca: "3 SAAT" → "3 DAKİKA" */
export const HookStrike: React.FC<{ kicker?: string; from: string; to: string; after?: string; tone?: Tone }> = ({ kicker, from, to, after, tone = "brand" }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const strike = ramp(f, 10, 22);
  const shrink = ramp(f, 24, 34);
  const s2 = spring({ frame: f - 30, fps, config: { damping: 10, stiffness: 240, mass: 0.6 } });
  return (
    <AbsoluteFill>
      <Bg tone={tone} intensity={1.2} />
      <Shockwave at={30} tone={tone} />
      <Shake hits={[0, 30]}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", paddingBottom: 200 }}>
          {kicker && <Chip tone={tone} delay={-20} style={{ marginBottom: 40 }}>{kicker}</Chip>}
          <div
            style={{
              position: "relative",
              fontFamily: FONT_DISPLAY,
              fontWeight: 800,
              fontSize: 190 - 80 * shrink,
              color: interpolate(shrink, [0, 1], [1, 0.5]) > 0.9 ? C.white : "rgba(255,255,255,0.55)",
              letterSpacing: -6,
              lineHeight: 1,
              transform: `translateY(${-40 * shrink}px)`,
            }}
          >
            {from}
            <div
              style={{
                position: "absolute",
                left: -20,
                top: "52%",
                height: 22 - 10 * shrink,
                width: `calc(${strike * 100}% + 40px)`,
                background: C.red,
                borderRadius: 12,
                transform: "rotate(-6deg)",
                boxShadow: `0 0 30px ${C.red}`,
              }}
            />
          </div>
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 800,
              fontSize: 200,
              lineHeight: 1,
              letterSpacing: -7,
              marginTop: 20,
              opacity: f >= 30 ? Math.min(1, s2 * 3) : 0,
              transform: `scale(${2.2 - 1.2 * s2})`,
              backgroundImage: toneGrad(tone),
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              paddingBottom: 14,
            }}
          >
            {to}
          </div>
          {after && (
            <div style={{ marginTop: 40, padding: "0 80px" }}>
              <Words text={after} delay={46} size={56} weight={600} font="sans" color={C.ice} stagger={3} />
            </div>
          )}
        </AbsoluteFill>
      </Shake>
    </AbsoluteFill>
  );
};

/** Hızla dönen sayaç kancası: "%65" */
export const HookCounter: React.FC<{ kicker?: string; value: number; prefix?: string; suffix?: string; label: string; tone?: Tone; from?: number }> = ({
  kicker,
  value,
  prefix = "",
  suffix = "",
  label,
  tone = "brand",
  from,
}) => {
  const f = useCurrentFrame();
  const p = ramp(f, 0, 32, 0, 1, Easing.out(Easing.exp));
  const start = from ?? Math.round(value * 0.35);
  const v = Math.round(start + (value - start) * p);
  const pop = f >= 32 ? 1 + 0.12 * Math.max(0, 1 - (f - 32) / 8) : 1;
  return (
    <AbsoluteFill>
      <Bg tone={tone} intensity={1.3} />
      <Shockwave at={32} tone={tone} />
      <Shake hits={[32]}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", paddingBottom: 200 }}>
          {kicker && <Chip tone={tone} delay={-20} style={{ marginBottom: 20 }}>{kicker}</Chip>}
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 800,
              fontSize: 380,
              lineHeight: 1,
              letterSpacing: -14,
              transform: `scale(${pop})`,
              backgroundImage: toneGrad(tone),
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              paddingBottom: 20,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {prefix}
            {v}
            {suffix}
          </div>
          <div style={{ padding: "0 80px" }}>
            <Words text={label} delay={30} size={76} stagger={3} />
          </div>
        </AbsoluteFill>
      </Shake>
    </AbsoluteFill>
  );
};

/** Dev soru işaretli soru kancası; ilk kelimeler 0. karede görünür */
export const HookQuestion: React.FC<{ kicker?: string; text: string; tone?: Tone; after?: string }> = ({ kicker, text, tone = "brand", after }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const q = spring({ frame: f, fps, config: { damping: 9, stiffness: 120 } });
  return (
    <AbsoluteFill>
      <Bg tone={tone} intensity={1.2} />
      <div
        style={{
          position: "absolute",
          right: -120,
          top: 220,
          fontFamily: FONT_DISPLAY,
          fontWeight: 800,
          fontSize: 1100,
          lineHeight: 1,
          color: "transparent",
          WebkitTextStroke: `6px ${tone === "feather" ? C.coral : tone === "amber" ? C.amber : C.cyan}`,
          opacity: 0.22,
          transform: `rotate(${12 + (1 - q) * 40 + Math.sin(f / 15) * 3}deg) scale(${0.6 + 0.4 * q})`,
        }}
      >
        ?
      </div>
      <Shockwave at={0} tone={tone} />
      <Shake hits={[0]}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "flex-start", flexDirection: "column", padding: "0 80px 220px" }}>
          {kicker && <Chip tone={tone} delay={-20} style={{ marginBottom: 40 }}>{kicker}</Chip>}
          <Words text={text} delay={-(text.split(/\s+/).length * 4 + 10)} stagger={4} size={124} align="left" tone={tone} lineHeight={1.0} />
          {after && (
            <div style={{ marginTop: 50 }}>
              <Words text={after} delay={52} size={52} weight={500} font="sans" color={C.ice} align="left" stagger={3} />
            </div>
          )}
        </AbsoluteFill>
      </Shake>
    </AbsoluteFill>
  );
};

/* ───────────── telefon & özellik sahnesi ───────────── */

export const Phone: React.FC<{ children: React.ReactNode; delay?: number; tilt?: number; scale?: number }> = ({ children, delay = 4, tilt = 1, scale = 1 }) => {
  const f = useCurrentFrame();
  const s = useSp(delay, { damping: 15, stiffness: 120 });
  const ry = (Math.sin(f / 40) * 6 - (1 - s) * 25) * tilt;
  const rx = (6 + Math.cos(f / 50) * 2) * tilt;
  return (
    <div style={{ perspective: 2200 }}>
      <div
        style={{
          width: 640,
          height: 1150,
          borderRadius: 78,
          background: "linear-gradient(145deg,#2a2d4a,#0c0d1c)",
          padding: 16,
          boxShadow: `0 60px 120px rgba(0,0,0,0.55), 0 0 0 2px rgba(255,255,255,0.12), 0 0 120px ${C.blue}55`,
          transform: `translateY(${(1 - s) * 700 + Math.sin(f / 30) * 8}px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`,
          transformStyle: "preserve-3d",
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 62, overflow: "hidden", background: C.canvas, fontFamily: FONT_SANS, color: C.ink }}>
          <div style={{ height: 70, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 44px", fontSize: 24, fontWeight: 600 }}>
            <span>9:41</span>
            <div style={{ width: 160, height: 42, borderRadius: 24, background: "#0c0d1c", marginTop: 6 }} />
            <span>●●● ▮</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

/** Telefonun yanında beliren baloncuk */
export const Callout: React.FC<{ children: React.ReactNode; delay: number; x: number; y: number; tone?: Tone; rot?: number }> = ({ children, delay, x, y, tone = "brand", rot = -4 }) => {
  const f = useCurrentFrame();
  const s = useSp(delay, { damping: 9, stiffness: 200 });
  if (f < delay) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        maxWidth: SAFE.right - x,
        padding: "20px 30px",
        borderRadius: 28,
        background: toneGrad(tone),
        color: C.navy,
        fontFamily: FONT_DISPLAY,
        fontWeight: 800,
        fontSize: 44,
        boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
        transform: `scale(${s}) rotate(${rot + Math.sin((f - delay) / 12) * 2}deg) translateY(${Math.sin((f - delay) / 18) * 8}px)`,
        transformOrigin: "center",
        whiteSpace: "nowrap",
        zIndex: 10,
      }}
    >
      {children}
    </div>
  );
};

/** Başlık + telefon düzeni */
export const FeatureScene: React.FC<{
  kicker?: string;
  title: string;
  tone?: Tone;
  children: React.ReactNode;
  callouts?: React.ReactNode;
}> = ({ kicker, title, tone = "brand", children, callouts }) => (
  <AbsoluteFill>
    <Bg tone={tone} />
    <AbsoluteFill style={{ alignItems: "center", paddingTop: SAFE.top + 40 }}>
      {kicker && <Chip tone={tone} style={{ marginBottom: 26 }}>{kicker}</Chip>}
      <div style={{ padding: "0 60px" }}>
        <Words text={title} delay={3} size={84} tone={tone} stagger={3} />
      </div>
      <div style={{ marginTop: 44 }}>{children}</div>
    </AbsoluteFill>
    {callouts}
  </AbsoluteFill>
);

/* ───────────── kapanış ───────────── */

export const CTA: React.FC<{ title: string; button: string; note?: string; tone?: Tone }> = ({ title, button, note, tone = "brand" }) => {
  const f = useCurrentFrame();
  const typed = Math.floor(ramp(f, 26, 50, 0, SITE.length, Easing.linear));
  const bs = useSp(40, { damping: 10 });
  const pulse = 1 + Math.max(0, Math.sin((f - 50) / 6)) * 0.04 * (f > 50 ? 1 : 0);
  return (
    <AbsoluteFill>
      <Bg tone={tone} intensity={1.3} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: SAFE.top + 40, flexDirection: "column" }}>
        <Logo width={400} />
        <div style={{ marginTop: 50, padding: "0 70px" }}>
          <Words text={title} delay={8} size={90} tone={tone} stagger={3} />
        </div>
        <div
          style={{
            marginTop: 60,
            padding: "24px 44px",
            borderRadius: 26,
            background: "rgba(225,239,255,0.08)",
            border: "2px solid rgba(225,239,255,0.25)",
            fontFamily: FONT_SANS,
            fontWeight: 600,
            fontSize: 50,
            color: C.white,
            minWidth: 600,
            textAlign: "center",
            opacity: ramp(f, 20, 28),
          }}
        >
          {SITE.slice(0, typed)}
          <span style={{ opacity: Math.floor(f / 8) % 2 ? 1 : 0, color: C.cyan }}>|</span>
        </div>
        <div
          style={{
            marginTop: 44,
            padding: "34px 80px",
            borderRadius: 999,
            background: toneGrad(tone),
            color: C.navy,
            fontFamily: FONT_DISPLAY,
            fontWeight: 800,
            fontSize: 58,
            transform: `scale(${bs * pulse})`,
            boxShadow: `0 20px 60px ${tone === "brand" ? C.cyan : tone === "feather" ? C.coral : C.amber}66`,
          }}
        >
          {button} →
        </div>
        {note && (
          <div style={{ marginTop: 40, padding: "0 90px" }}>
            <Words text={note} delay={56} size={38} weight={500} font="sans" color={C.ice} stagger={2} />
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ───────────── kurgu: sahneler + geçişler ───────────── */

const Whip: React.FC<{ tone: Tone }> = ({ tone }) => {
  const f = useCurrentFrame();
  if (f > 9) return null;
  const p = f / 9;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: -400,
          left: -1400 + 3200 * p,
          width: 700,
          height: 2800,
          background: `linear-gradient(90deg, transparent, ${tone === "brand" ? C.cyan : tone === "feather" ? C.coral : C.amber}cc, white, transparent)`,
          transform: "rotate(18deg)",
          filter: "blur(20px)",
          opacity: 0.85,
        }}
      />
    </AbsoluteFill>
  );
};

const SceneIn: React.FC<{ children: React.ReactNode; first: boolean }> = ({ children, first }) => {
  const f = useCurrentFrame();
  if (first) return <>{children}</>;
  const p = ramp(f, 0, 9, 0, 1, Easing.out(Easing.exp));
  return <AbsoluteFill style={{ transform: `translateY(${(1 - p) * 140}px) scale(${1.06 - 0.06 * p})`, filter: `blur(${(1 - p) * 10}px)` }}>{children}</AbsoluteFill>;
};

/** dur: en az süre (kare). audio: seslendirme dosyası (public/ altında). */
export type SceneDef = { dur: number; el: React.ReactNode; audio?: string };

/** Sahne süresini seslendirmeye göre uzatır. sure = src/vo/<id>.sure.json (saniye dizisi, sahne sırasıyla). */
export const withVo = (id: string, sure: number[], scenes: SceneDef[]): SceneDef[] =>
  scenes.map((s, i) => {
    const sec = sure[i];
    if (!sec) return s;
    const lead = i === 0 ? 0 : 5;
    return { ...s, dur: Math.max(s.dur, lead + Math.ceil(sec * 30) + 8), audio: `vo/${id}/${i}.mp3` };
  });

export const Reel: React.FC<{ scenes: SceneDef[]; tone?: Tone; guides?: boolean }> = ({ scenes, tone = "brand", guides }) => {
  let at = 0;
  return (
    <AbsoluteFill style={{ background: C.night }}>
      {scenes.map((s, i) => {
        const from = at;
        at += s.dur;
        return (
          <Sequence key={i} from={from} durationInFrames={s.dur}>
            <SceneIn first={i === 0}>{s.el}</SceneIn>
            {i > 0 && <Whip tone={tone} />}
            {s.audio && (
              <Sequence from={i === 0 ? 0 : 5}>
                <Audio src={staticFile(s.audio)} volume={1} />
              </Sequence>
            )}
          </Sequence>
        );
      })}
      {guides && <SafeGuides />}
    </AbsoluteFill>
  );
};

export const total = (scenes: SceneDef[]) => scenes.reduce((a, s) => a + s.dur, 0);
