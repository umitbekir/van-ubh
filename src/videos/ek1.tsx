import React from "react";
import { Callout, CTA, FeatureScene, HookCounter, HookQuestion, HookSlam, Phone, withVo } from "../kit";
import type { VideoDef } from "../types";
import { DayOverlay, FreePreview, LevelReport, ManifestoScene, PackageFan, QuizFlow, SplitScene, StatsScene, StudyPlan, UnlockGrid } from "../widgets/ek1";
import m1 from "../vo/Marka1.sure.json";
import o6 from "../vo/Ogrenci6.sure.json";
import o7 from "../vo/Ogrenci7.sure.json";

const OGR_CTA = { button: "Ücretsiz Kayıt Ol", note: "İlk 3 gün tüm ücretli içerikler açık" };

export const ek1: VideoDef[] = [
  /* ───── Marka1: Eğitimde mega dönüşüm (manifesto) ───── */
  {
    id: "Marka1",
    tone: "brand",
    scenes: withVo("Marka1", m1, [
      {
        dur: 88,
        el: (
          <HookSlam
            kicker="YENİ NESİL EĞİTİM"
            ghost="VANOKSİA"
            tone="feather"
            lines={[{ text: "EĞİTİMDE", size: 150 }, { text: "MEGA", size: 250, tone: "feather" }, { text: "DÖNÜŞÜM", size: 170, tone: "brand" }]}
            sub="Öğrenci ve öğretmen için *tek platform*"
            subAt={44}
          />
        ),
      },
      { dur: 120, el: <StatsScene /> },
      { dur: 240, el: <SplitScene sAts={[10, 44, 77]} tAts={[120, 160, 198]} mergeAt={210} /> },
      { dur: 120, el: <ManifestoScene ats={[5, 59, 109]} allAt={146} /> },
      { dur: 90, el: <CTA title="Eğitimde *mega dönüşüm* başladı" button="Ücretsiz Kayıt Ol" note="İlk 3 gün tüm ücretli içerikler açık" /> },
    ]),
  },

  /* ───── Ogrenci6: Seviye tespiti ───── */
  {
    id: "Ogrenci6",
    tone: "brand",
    scenes: withVo("Ogrenci6", o6, [
      { dur: 84, el: <HookQuestion kicker="SEVİYE TESPİTİ" text={"Nereden başlayacağını\n*biliyor musun?*"} after="Önce *seviyeni* keşfet." /> },
      {
        dur: 150,
        el: (
          <FeatureScene
            kicker="SEVİYE TESPİT SINAVI"
            title="Sorular *akar,* sen çöz"
            callouts={
              <>
                <Callout delay={30} x={40} y={470} rot={-6}>Seviyeni ölç</Callout>
                <Callout delay={95} x={500} y={1395} tone="feather" rot={5}>Tüm dersler</Callout>
              </>
            }
          >
            <Phone>
              <QuizFlow start={8} per={22} />
            </Phone>
          </FeatureScene>
        ),
      },
      {
        dur: 150,
        el: (
          <FeatureScene
            kicker="SONUÇ EKRANI"
            title="Seviyen *ders ders* ortada"
            callouts={
              <>
                <Callout delay={80} x={30} y={470} rot={-5}>Güçlü konular ✓</Callout>
                <Callout delay={100} x={530} y={560} tone="feather" rot={4}>Zayıf konular</Callout>
              </>
            }
          >
            <Phone>
              <LevelReport />
            </Phone>
          </FeatureScene>
        ),
      },
      {
        dur: 120,
        el: (
          <FeatureScene
            kicker="KİŞİYE ÖZEL PLAN"
            title="Planın *hazır*"
            tone="feather"
            callouts={
              <>
                <Callout delay={34} x={40} y={470} tone="feather" rot={-6}>Sana özel</Callout>
                <Callout delay={80} x={460} y={1400} rot={5}>İlerleme takibi</Callout>
              </>
            }
          >
            <Phone>
              <StudyPlan buildAt={26} />
            </Phone>
          </FeatureScene>
        ),
      },
      { dur: 90, el: <CTA title="Seviyeni öğren, *planını* al" {...OGR_CTA} /> },
    ]),
  },

  /* ───── Ogrenci7: İlk 3 gün her şey açık ───── */
  {
    id: "Ogrenci7",
    tone: "amber",
    scenes: withVo("Ogrenci7", o7, [
      {
        dur: 84,
        el: (
          <>
            <HookCounter kicker="YENİ ÖĞRENCİLERE" value={3} from={3} label="Tüm ücretli içerikler *açık*" tone="amber" />
            <DayOverlay />
          </>
        ),
      },
      {
        dur: 200,
        el: (
          <FeatureScene
            kicker="İLK 3 GÜN"
            title="Kilitler *açılıyor*"
            tone="amber"
            callouts={
              <>
                <Callout delay={40} x={40} y={470} tone="amber" rot={-6}>Ücretli içerik</Callout>
                <Callout delay={150} x={500} y={1400} rot={5}>Hepsi senin!</Callout>
              </>
            }
          >
            <Phone>
              <UnlockGrid ats={[8, 36, 66, 117]} />
            </Phone>
          </FeatureScene>
        ),
      },
      { dur: 140, el: <PackageFan fanAt={8} hl={[20, 42, 68]} subAt={98} /> },
      {
        dur: 190,
        el: (
          <FeatureScene
            kicker="ÜCRETSİZ PAKET"
            title="Ücretsizde *bile*"
            tone="feather"
            callouts={
              <>
                <Callout delay={60} x={40} y={470} tone="amber" rot={-6}>1 dk önizleme</Callout>
                <Callout delay={140} x={380} y={1405} tone="feather" rot={4}>5 ücretli doküman</Callout>
              </>
            }
          >
            <Phone>
              <FreePreview vFrom={45} vTo={118} docAt={126} />
            </Phone>
          </FeatureScene>
        ),
      },
      { dur: 90, el: <CTA title="İlk 3 gün *her şey açık*" tone="amber" {...OGR_CTA} /> },
    ]),
  },
];
