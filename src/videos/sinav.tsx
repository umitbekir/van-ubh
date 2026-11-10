import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Bg, Callout, CTA, FeatureScene, HookCounter, HookQuestion, HookSlam, HookStrike, Phone, withVo } from "../kit";
import type { VideoDef } from "../types";
import {
  AnalizEkran,
  BiletSahnesi,
  DENEME_GUNLERI,
  HookAyIzgara,
  HookSplit,
  HookStamp,
  Koparmali,
  LgsEkran,
  PaketEkran,
  TAKVIM,
  TakvimEkran,
  TarihKarti,
  TarihListesi,
  ZamanCizelgesi,
  hafta,
  haftaSayfasi,
} from "../widgets/sinav";
import s1 from "../vo/Sinav1.sure.json";
import s2 from "../vo/Sinav2.sure.json";
import s3 from "../vo/Sinav3.sure.json";
import s4 from "../vo/Sinav4.sure.json";
import s6 from "../vo/Sinav6.sure.json";
import s7 from "../vo/Sinav7.sure.json";
import s8 from "../vo/Sinav8.sure.json";
import s9 from "../vo/Sinav9.sure.json";
import s10 from "../vo/Sinav10.sure.json";

const gun = (ay: number, g: number) => DENEME_GUNLERI.find((d) => d.ay === ay && d.gun === g)!;
const ARALIK = TAKVIM.haftalar.filter((h) => h.ay === 12);

const BTN = "Sınav Paketini Al";
const NOT = "Paketi al, tüm denemelere katıl";

export const sinav: VideoDef[] = [
  /* ───── Sinav1: Her hafta bir deneme (genel takvim) ───── */
  {
    id: "Sinav1",
    tone: "amber",
    scenes: withVo("Sinav1", s1, [
      {
        dur: 80,
        el: (
          <HookSlam
            tone="amber"
            kicker="KASIM – ARALIK DENEMELERİ"
            ghost="DENEME"
            lines={[{ text: "HER HAFTA", size: 150 }, { text: "BİR", size: 230, tone: "amber", at: -30 }, { text: "DENEME.", size: 200, tone: "feather", at: 6 }]}
            sub="TYT • AYT • LGS"
            subAt={36}
          />
        ),
      },
      {
        dur: 160,
        el: (
          <FeatureScene
            kicker="SINAV TAKVİMİ"
            title="Deneme günlerin *hazır*"
            tone="amber"
            callouts={
              <>
                <Callout delay={30} x={540} y={560} tone="amber" rot={5}>21 Kasım başlıyor</Callout>
                <Callout delay={128} x={40} y={1340} tone="feather" rot={-4}>9 deneme günü</Callout>
              </>
            }
          >
            <Phone>
              <TakvimEkran start={28} step={9} slideAt={76} />
            </Phone>
          </FeatureScene>
        ),
      },
      { dur: 210, el: <ZamanCizelgesi tone="amber" finalAt={168} /> },
      { dur: 100, el: <CTA title="Her hafta *bir deneme*" button={BTN} note={NOT} tone="amber" /> },
    ]),
  },

  /* ───── Sinav2: TYT-AYT 21-22 Kasım ───── */
  {
    id: "Sinav2",
    tone: "amber",
    scenes: withVo("Sinav2", s2, [
      {
        dur: 80,
        el: (
          // Sayaç kancası 34 kare ileriden başlar: 0. karede "21-22" tam okunur, çarpma/şok dalgası ilk yarım saniyede.
          <AbsoluteFill>
            <Bg tone="amber" intensity={1.3} />
            <AbsoluteFill style={{ transform: "scale(0.8)", maskImage: "radial-gradient(60% 50% at 50% 45%, black 55%, transparent 100%)", WebkitMaskImage: "radial-gradient(60% 50% at 50% 45%, black 55%, transparent 100%)" }}>
              <Sequence from={-34} layout="none">
                <HookCounter tone="amber" kicker="TYT • AYT DENEMESİ" prefix="21-" value={22} from={1} label="*KASIM*" />
              </Sequence>
            </AbsoluteFill>
          </AbsoluteFill>
        ),
      },
      { dur: 190, el: <BiletSahnesi ay={11} ilkGun={21} tone="amber" /> },
      {
        dur: 150,
        el: (
          <FeatureScene
            kicker="SINAV SONRASI"
            title="Soru soru *analiz*"
            tone="amber"
            callouts={
              <>
                <Callout delay={30} x={530} y={540} tone="brand" rot={5}>Her soru tek tek</Callout>
                <Callout delay={96} x={40} y={1390} tone="amber" rot={-4}>Sıralamanı gör</Callout>
              </>
            }
          >
            <Phone>
              <AnalizEkran baslik="Deneme Sonucu" alt="TYT • 21 Kasım Cumartesi" />
            </Phone>
          </FeatureScene>
        ),
      },
      {
        dur: 120,
        el: (
          <Koparmali
            tone="amber"
            title="Sonraki: *5-6 Aralık*"
            pages={[haftaSayfasi(hafta(11, 21)), haftaSayfasi(hafta(12, 5))]}
            chips={[{ t: "Ardından 19-20 Aralık", tur: "TYT-AYT" }]}
            firstAt={16}
            chipsAt={60}
          />
        ),
      },
      { dur: 100, el: <CTA title={"21-22 Kasım'da\n*yerini al*"} button={BTN} note={NOT} tone="amber" /> },
    ]),
  },

  /* ───── Sinav3: LGS 28 Kasım ───── */
  {
    id: "Sinav3",
    tone: "feather",
    scenes: withVo("Sinav3", s3, [
      {
        dur: 85,
        el: <AbsoluteFill><Sequence from={-12} layout="none"><HookQuestion tone="feather" kicker="28 KASIM CUMARTESİ" text={"LGS'ye\n*prova*\nyaptın mı?"} after="LGS denemesi seni bekliyor" /></Sequence></AbsoluteFill>,
      },
      { dur: 110, el: <TarihKarti g={gun(11, 28)} tone="feather" /> },
      {
        dur: 185,
        el: (
          <FeatureScene
            kicker="LGS FORMATI"
            title="Ders ders *netin*"
            tone="feather"
            callouts={
              <>
                <Callout delay={22} x={40} y={1390} tone="feather" rot={-4}>90 soru • 6 ders</Callout>
                <Callout delay={112} x={510} y={540} tone="amber" rot={5}>Soru soru analiz</Callout>
              </>
            }
          >
            <Phone>
              <LgsEkran g={gun(11, 28)} />
            </Phone>
          </FeatureScene>
        ),
      },
      {
        dur: 130,
        el: (
          <Koparmali
            tone="feather"
            title="Sonraki *LGS* denemeleri"
            pages={[haftaSayfasi(hafta(11, 28)), haftaSayfasi(hafta(12, 12)), haftaSayfasi(hafta(12, 26))]}
            chips={[
              { t: "12 Aralık Cumartesi", tur: "LGS" },
              { t: "26 Aralık Cumartesi", tur: "LGS" },
            ]}
            firstAt={14}
            every={52}
            chipsAt={92}
          />
        ),
      },
      { dur: 100, el: <CTA title={"28 Kasım'da\n*provaya gel*"} button={BTN} note={NOT} tone="feather" /> },
    ]),
  },

  /* ───── Sinav4: Sınav paketi ───── */
  {
    id: "Sinav4",
    tone: "feather",
    scenes: withVo("Sinav4", s4, [
      { dur: 90, el: <HookStrike tone="feather" kicker="SINAV PAKETİ" from="TEK TEK" to="TEK PAKET" after="Tüm dönem denemeleri" /> },
      {
        dur: 270,
        el: (
          <FeatureScene
            kicker="SINAV PAKETİ"
            title="Paketin *içinde*"
            tone="feather"
            callouts={
              <>
                <Callout delay={30} x={40} y={1390} tone="feather" rot={-4}>Tüm dönem denemeleri</Callout>
                <Callout delay={250} x={600} y={560} tone="amber" rot={5}>Hepsi dahil</Callout>
              </>
            }
          >
            <Phone>
              <PaketEkran />
            </Phone>
          </FeatureScene>
        ),
      },
      { dur: 190, el: <TarihListesi tone="feather" hits={[60, 74, 88, 102, 116, 130]} /> },
      { dur: 100, el: <CTA title={"Tek paket,\n*tüm denemeler*"} button={BTN} note={NOT} tone="feather" /> },
    ]),
  },

  /* ───── Sinav6: TYT-AYT 5-6 Aralık ───── */
  {
    id: "Sinav6",
    tone: "amber",
    scenes: withVo("Sinav6", s6, [
      { dur: 75, el: <HookSplit ay={12} ilkGun={5} kicker="HAFTA SONU DENEMESİ" /> },
      { dur: 180, el: <BiletSahnesi ay={12} ilkGun={5} tone="amber" kicker="TYT • AYT" title="*5-6 Aralık* hafta sonu" footer="Hafta sonu yine deneme" /> },
      {
        dur: 140,
        el: (
          <FeatureScene
            kicker="SONUÇ EKRANI"
            title="Soru soru *analiz*"
            tone="amber"
            callouts={
              <>
                <Callout delay={28} x={520} y={540} tone="brand" rot={5}>Doğru • Yanlış</Callout>
                <Callout delay={96} x={40} y={1390} tone="amber" rot={-4}>Sıralamanı gör</Callout>
              </>
            }
          >
            <Phone>
              <AnalizEkran baslik="Deneme Sonucu" alt="AYT • 6 Aralık Pazar" />
            </Phone>
          </FeatureScene>
        ),
      },
      {
        dur: 110,
        el: (
          <Koparmali
            tone="amber"
            title="Ardından *19-20 Aralık*"
            pages={[haftaSayfasi(hafta(12, 5)), haftaSayfasi(hafta(12, 19))]}
            chips={[{ t: "Arada 12 Aralık LGS", tur: "LGS" }]}
            firstAt={14}
            chipsAt={56}
          />
        ),
      },
      { dur: 100, el: <CTA title={"5-6 Aralık'ta\n*yerini al*"} button={BTN} note={NOT} tone="amber" /> },
    ]),
  },

  /* ───── Sinav7: LGS 12 Aralık ───── */
  {
    id: "Sinav7",
    tone: "feather",
    scenes: withVo("Sinav7", s7, [
      { dur: 80, el: <HookStamp g={gun(12, 12)} stamp="LGS GÜNÜ" kicker="CUMARTESİ" sub="LGS denemesi" /> },
      {
        dur: 190,
        el: (
          <FeatureScene
            kicker="LGS FORMATI"
            title="90 soru, *6 ders*"
            tone="feather"
            callouts={
              <>
                <Callout delay={24} x={40} y={1390} tone="feather" rot={-4}>Ders ders net</Callout>
                <Callout delay={112} x={510} y={540} tone="amber" rot={5}>Soru soru analiz</Callout>
              </>
            }
          >
            <Phone>
              <LgsEkran g={gun(12, 12)} />
            </Phone>
          </FeatureScene>
        ),
      },
      {
        dur: 115,
        el: (
          <Koparmali
            tone="feather"
            title="Sonraki LGS: *26 Aralık*"
            pages={[haftaSayfasi(hafta(12, 12)), haftaSayfasi(hafta(12, 26))]}
            chips={[{ t: "26 Aralık Cumartesi", tur: "LGS" }]}
            firstAt={14}
            chipsAt={56}
          />
        ),
      },
      { dur: 100, el: <CTA title={"12 Aralık'ta\n*LGS provası*"} button={BTN} note={NOT} tone="feather" /> },
    ]),
  },

  /* ───── Sinav8: TYT-AYT 19-20 Aralık ───── */
  {
    id: "Sinav8",
    tone: "amber",
    scenes: withVo("Sinav8", s8, [
      { dur: 95, el: <HookStrike tone="amber" kicker="YIL BİTMEDEN" from="MOLA" to="19-20" after="ARALIK • TYT ve AYT denemesi" /> },
      { dur: 120, el: <BiletSahnesi ay={12} ilkGun={19} tone="amber" kicker="19-20 ARALIK" title="Cumartesi + *Pazar*" footer="Aralık'ın 3. deneme haftası" /> },
      {
        dur: 210,
        el: (
          <FeatureScene
            kicker="ARALIK TAKVİMİ"
            title="Her hafta *bir deneme*"
            tone="amber"
            callouts={
              <>
                <Callout delay={64} x={40} y={1390} tone="brand" rot={-4}>19-20 Aralık</Callout>
                <Callout delay={130} x={510} y={540} tone="amber" rot={5}>Soru soru analiz</Callout>
              </>
            }
          >
            <Phone>
              <TakvimEkran aylar={[12]} start={24} step={13} />
            </Phone>
          </FeatureScene>
        ),
      },
      { dur: 100, el: <CTA title={"19-20 Aralık'ta\n*yerini al*"} button={BTN} note={NOT} tone="amber" /> },
    ]),
  },

  /* ───── Sinav9: LGS 26 Aralık ───── */
  {
    id: "Sinav9",
    tone: "feather",
    scenes: withVo("Sinav9", s9, [
      { dur: 80, el: <AbsoluteFill><Sequence from={-12} layout="none"><HookQuestion tone="amber" kicker="26 ARALIK CUMARTESİ" text={"Yılı *LGS*\nprovasıyla\nkapatır mısın?"} after="LGS denemesi" /></Sequence></AbsoluteFill> },
      { dur: 110, el: <TarihKarti g={gun(12, 26)} tone="feather" /> },
      { dur: 150, el: <ZamanCizelgesi tone="feather" haftalar={ARALIK} title="Aralık: *her hafta*" kicker="ARALIK TAKVİMİ" finalAt={92} /> },
      { dur: 100, el: <CTA title={"26 Aralık'ta\n*yılı kapat*"} button={BTN} note={NOT} tone="feather" /> },
    ]),
  },

  /* ───── Sinav10: Aralık deneme takvimi ───── */
  {
    id: "Sinav10",
    tone: "amber",
    scenes: withVo("Sinav10", s10, [
      { dur: 75, el: <HookAyIzgara ay={12} baslik="ARALIK" sub="Her hafta bir deneme" /> },
      { dur: 400, el: <TarihListesi tone="amber" haftalar={ARALIK} title="Aralık *deneme takvimi*" kicker="HER HAFTA BİR DENEME" hits={[16, 127, 199, 347]} spot /> },
      {
        dur: 140,
        el: (
          <FeatureScene
            kicker="SINAV PAKETİ"
            title="Hepsi *pakette*"
            tone="amber"
            callouts={<Callout delay={50} x={40} y={1390} tone="amber" rot={-4}>Soru soru analiz</Callout>}
          >
            <Phone>
              <PaketEkran
                maddeler={[
                  { t: "LGS / TYT / AYT formatında deneme", at: 22 },
                  { t: "Soru soru analiz", at: 44 },
                  { t: "Sıralama", at: 64 },
                  { t: "Her hafta düzenli deneme", at: 84 },
                ]}
              />
            </Phone>
          </FeatureScene>
        ),
      },
      { dur: 100, el: <CTA title={"Aralık'ta\n*her hafta* deneme"} button={BTN} note={NOT} tone="amber" /> },
    ]),
  },
];
