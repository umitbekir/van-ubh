import type { SceneDef, Tone } from "./kit";
/** Her grup dosyası (src/videos/<grup>.tsx) bunu dizi olarak export eder. */
export type VideoDef = { id: string; tone: Tone; scenes: SceneDef[] };
