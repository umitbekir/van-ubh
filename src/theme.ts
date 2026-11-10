import { loadFont as loadDisplay } from "@remotion/google-fonts/BricolageGrotesque";
import { loadFont as loadSans } from "@remotion/google-fonts/Lexend";

const display = loadDisplay("normal", { weights: ["600", "700", "800"], subsets: ["latin", "latin-ext"] });
const sans = loadSans("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin", "latin-ext"] });

export const FONT_DISPLAY = display.fontFamily;
export const FONT_SANS = sans.fontFamily;

// Vanoksia logosundan ve sitedeki tema değişkenlerinden alınan palet
export const C = {
  navy: "#090254",
  night: "#05012e",
  deep: "#0b0f4a",
  blue: "#1961e6",
  royal: "#0344c9",
  cyan: "#34edef",
  sky: "#11a9f1",
  coral: "#fd5131",
  magenta: "#d6005b",
  plum: "#4f0064",
  amber: "#f5a524",
  amberSoft: "#fdb94e",
  green: "#22c55e",
  red: "#ef4444",
  ink: "#2b2440",
  inkMuted: "#625a70",
  canvas: "#faf7f2",
  surface: "#ffffff",
  line: "#e9e2d6",
  pastelBlue: "#dbeafe",
  pastelLilac: "#e9e1f5",
  pastelSage: "#dcebe3",
  pastelButter: "#f7edd0",
  white: "#ffffff",
  ice: "#e1efff",
};

export const GRAD_BRAND = `linear-gradient(100deg, ${C.cyan} 0%, ${C.sky} 40%, ${C.blue} 100%)`;
export const GRAD_FEATHER = `linear-gradient(100deg, ${C.amber} 0%, ${C.coral} 45%, ${C.magenta} 100%)`;

export const SITE = "agora.vanoksia.com";
export const FPS = 30;
export const W = 1080;
export const H = 1920;
