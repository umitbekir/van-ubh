import React from "react";
import { CTA, HookSlam, withVo } from "../kit";
import type { VideoDef } from "../types";
import sure from "../vo/Ornek.sure.json";

/** REFERANS: yeni video böyle yazılır. Sahne sırası = src/vo/<id>.json metin sırası. */
export const ornek: VideoDef[] = [
  {
    id: "Ornek",
    tone: "brand",
    scenes: withVo("Ornek", sure, [
      {
        dur: 90,
        el: (
          <HookSlam
            kicker="YENİ NESİL EĞİTİM"
            ghost="VANOKSİA"
            lines={[{ text: "EĞİTİMDE", size: 150 }, { text: "MEGA", size: 230, tone: "feather" }, { text: "DÖNÜŞÜM", size: 170, tone: "brand" }]}
          />
        ),
      },
      { dur: 100, el: <CTA title="Öğrenci ve öğretmen için *tek platform*" button="Ücretsiz Kayıt Ol" note="İlk 3 gün tüm ücretli içerikler açık" /> },
    ]),
  },
];
