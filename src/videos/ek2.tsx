import React from "react";
import { CTA, Callout, FeatureScene, HookSlam, Phone, withVo } from "../kit";
import type { VideoDef } from "../types";
import { HookQuestionFull, HookStrikeFit, CycleDiagram, ExamCalendar, MetalTiers, NetChart, ScoreCalc, TargetPlan, ToolChips, ViewStats, VitrinList } from "../widgets/ek2";
import sOgr6 from "../vo/Ogretmen6.sure.json";
import sArac1 from "../vo/Arac1.sure.json";
import sSin5 from "../vo/Sinav5.sure.json";

export const ek2: VideoDef[] = [
  {
    id: "Ogretmen6",
    tone: "amber",
    scenes: withVo("Ogretmen6", sOgr6, [
      {
        dur: 90,
        el: <HookStrikeFit kicker="ÖĞRETMEN PREMIUM" from="GÖRÜNMEZ" to="VİTRİNDE" after="Öğrenciler seni *ilk sırada* görsün" tone="amber" />,
      },
      {
        dur: 150,
        el: (
          <FeatureScene
            kicker="ÖNE ÇIKARMA"
            title="Arka sıradan *en öne*"
            tone="amber"
            callouts={
              <>
                <Callout delay={60} x={40} y={1370} tone="amber" rot={-5}>↑ 1. sıra</Callout>
                <Callout delay={100} x={610} y={1370} tone="feather" rot={4}>★ Rozet</Callout>
              </>
            }
          >
            <Phone>
              <VitrinList />
            </Phone>
          </FeatureScene>
        ),
      },
      {
        dur: 150,
        el: (
          <FeatureScene
            kicker="VİTRİN PAKETLERİ"
            title="Gümüş · Gold · *Platinum*"
            tone="amber"
            callouts={<Callout delay={118} x={40} y={1370} tone="amber" rot={-4}>Yerini sen seç</Callout>}
          >
            <Phone>
              <MetalTiers />
            </Phone>
          </FeatureScene>
        ),
      },
      {
        dur: 120,
        el: (
          <FeatureScene
            kicker="STÜDYO ANALİTİĞİ"
            title="Görüntülenmeni *izle*"
            tone="amber"
            callouts={
              <>
                <Callout delay={40} x={40} y={1380} tone="amber" rot={-5}>Profil ▲</Callout>
                <Callout delay={70} x={560} y={1380} tone="feather" rot={4}>İzlenme ▲</Callout>
              </>
            }
          >
            <Phone>
              <ViewStats />
            </Phone>
          </FeatureScene>
        ),
      },
      { dur: 100, el: <CTA title="Vitrine *sen* çık" button="Öğretmen Olarak Katıl" note="Öğretmen Premium ile öne çıkarma paketleri" tone="amber" /> },
    ]),
  },
  {
    id: "Arac1",
    tone: "brand",
    scenes: withVo("Arac1", sArac1, [
      {
        dur: 80,
        el: <HookQuestionFull kicker="ÜCRETSİZ ARAÇ" text={"Netin kaç\n*puan*\nediyor?"} after="Saniyeler içinde hesapla" tone="brand" />,
      },
      {
        dur: 150,
        el: (
          <FeatureScene
            kicker="PUAN HESAPLAMA"
            title="Netini gir, *puanını gör*"
            callouts={
              <>
                <Callout delay={30} x={40} y={1390} rot={-5}>Ders ders net</Callout>
                <Callout delay={118} x={570} y={1390} tone="feather" rot={4}>Anında puan</Callout>
              </>
            }
          >
            <Phone>
              <ScoreCalc />
            </Phone>
          </FeatureScene>
        ),
      },
      {
        dur: 220,
        el: (
          <FeatureScene
            kicker="5 ÜCRETSİZ ARAÇ"
            title="Her sınav için *bir araç*"
            callouts={<Callout delay={196} x={40} y={1390} tone="feather" rot={-5}>Hepsi ücretsiz</Callout>}
          >
            <Phone>
              <ToolChips />
            </Phone>
          </FeatureScene>
        ),
      },
      {
        dur: 120,
        el: (
          <FeatureScene
            kicker="PLANLA"
            title="Hedefine *kaç net* kaldı?"
            callouts={<Callout delay={60} x={40} y={1390} tone="brand" rot={-5}>Hedef 450</Callout>}
          >
            <Phone>
              <TargetPlan />
            </Phone>
          </FeatureScene>
        ),
      },
      { dur: 100, el: <CTA title="Puanını *bugün* hesapla" button="Ücretsiz Kayıt Ol" note="İlk 3 gün tüm ücretli içerikler açık" /> },
    ]),
  },
  {
    id: "Sinav5",
    tone: "amber",
    scenes: withVo("Sinav5", sSin5, [
      {
        dur: 90,
        el: (
          <HookSlam
            tone="amber"
            kicker="HAFTALIK BAŞARI DÖNGÜSÜ"
            ghost="DÖNGÜ"
            lines={[
              { text: "DENE.", size: 190, at: 0 },
              { text: "ANALİZ ET.", size: 150, tone: "amber", at: 14 },
              { text: "KAPAT.", size: 210, tone: "feather", at: 30 },
            ]}
            sub="Her hafta bir deneme"
            subAt={48}
          />
        ),
      },
      {
        dur: 260,
        el: (
          <FeatureScene
            kicker="BAŞARI DÖNGÜSÜ"
            title="Dene, analiz et, *kapat*"
            tone="amber"
            callouts={
              <>
                <Callout delay={100} x={40} y={1390} tone="feather" rot={-5}>YZ soru seti</Callout>
                <Callout delay={160} x={480} y={1400} tone="amber" rot={4}>%80 = tamam</Callout>
              </>
            }
          >
            <Phone>
              <CycleDiagram stepDur={46} />
            </Phone>
          </FeatureScene>
        ),
      },
      {
        dur: 190,
        el: (
          <FeatureScene
            kicker="DENEME TAKVİMİ"
            title="Her hafta *bir deneme*"
            tone="amber"
            callouts={<Callout delay={50} x={40} y={1390} tone="amber" rot={-5}>Dönüşümlü</Callout>}
          >
            <Phone>
              <ExamCalendar />
            </Phone>
          </FeatureScene>
        ),
      },
      {
        dur: 120,
        el: (
          <FeatureScene
            kicker="HAFTA HAFTA"
            title="Netin *yükselsin*"
            tone="amber"
            callouts={<Callout delay={60} x={40} y={1390} tone="feather" rot={-4}>Net ▲</Callout>}
          >
            <Phone>
              <NetChart />
            </Phone>
          </FeatureScene>
        ),
      },
      { dur: 100, el: <CTA title="Döngüye *bu hafta* katıl" button="Sınav Paketini Al" note="Her hafta bir deneme" tone="amber" /> },
    ]),
  },
];
