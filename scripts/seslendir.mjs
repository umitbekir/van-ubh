#!/usr/bin/env node
// Kullanım: node scripts/seslendir.mjs Ogretmen1 Ogretmen2 ...   (argümansız: src/vo/*.json hepsi)
// Girdi : src/vo/<id>.json      → { "metinler": ["sahne 0 metni", "sahne 1 metni", ...] }  (boş "" = o sahnede ses yok)
// Çıktı : public/vo/<id>/<i>.mp3 + src/vo/<id>.sure.json → [saniye, ...]
// Aynı metin tekrar üretilmez (public/vo/<id>/<i>.txt ile karşılaştırılır).
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const VOICE = "KediIz7pebzt5TaDHiiZ"; // Kullanıcı onaylı: "Ses 3 – Derin" (epik, karanlık, güçlü)
const MODEL = "eleven_multilingual_v2";
const SETTINGS = { stability: 0.4, similarity_boost: 0.85, style: 0.45, use_speaker_boost: true };

import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const key = execFileSync("security", ["find-generic-password", "-s", "elevenlabs-api-key", "-w"]).toString().trim();

let ids = process.argv.slice(2);
if (!ids.length) ids = fs.readdirSync(path.join(root, "src/vo")).filter((f) => f.endsWith(".json") && !f.endsWith(".sure.json")).map((f) => f.slice(0, -5));

const dur = (f) => parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString());

for (const id of ids) {
  const { metinler } = JSON.parse(fs.readFileSync(path.join(root, "src/vo", `${id}.json`), "utf8"));
  const dir = path.join(root, "public/vo", id);
  fs.mkdirSync(dir, { recursive: true });
  const sure = [];
  for (let i = 0; i < metinler.length; i++) {
    const text = metinler[i].trim();
    const mp3 = path.join(dir, `${i}.mp3`);
    const txt = path.join(dir, `${i}.txt`);
    if (!text) { sure.push(0); continue; }
    if (!(fs.existsSync(mp3) && fs.existsSync(txt) && fs.readFileSync(txt, "utf8") === text)) {
      const body = {
        text,
        model_id: MODEL,
        voice_settings: SETTINGS,
        previous_text: metinler.slice(0, i).join(" ") || undefined,
        next_text: metinler.slice(i + 1).join(" ") || undefined,
      };
      const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}?output_format=mp3_44100_192`, {
        method: "POST",
        headers: { "xi-api-key": key, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error(`${id}/${i}: ${r.status} ${await r.text()}`);
      const raw = mp3 + ".raw.mp3";
      fs.writeFileSync(raw, Buffer.from(await r.arrayBuffer()));
      // baştaki/sondaki sessizliği kırp, hafif sıkıştırma + seviye
      execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", raw, "-af",
        "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,acompressor=threshold=-18dB:ratio=3:attack=5:release=80,loudnorm=I=-14:TP=-1.5:LRA=7",
        "-ar", "44100", "-b:a", "192k", mp3]);
      fs.unlinkSync(raw);
      fs.writeFileSync(txt, text);
      console.log(`üretildi ${id}/${i}`);
    }
    sure.push(Math.round(dur(mp3) * 100) / 100);
  }
  fs.writeFileSync(path.join(root, "src/vo", `${id}.sure.json`), JSON.stringify(sure));
  console.log(id, sure.join(" + "), "=", sure.reduce((a, b) => a + b, 0).toFixed(1), "sn");
}
