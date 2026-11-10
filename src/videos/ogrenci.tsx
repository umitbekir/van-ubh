import React from "react";
import { Callout, CTA, FeatureScene, HookCounter, HookQuestion, HookSlam, HookStrike, Phone, withVo } from "../kit";
import type { VideoDef } from "../types";
import {
  AnalysisGrid,
  CampInvite,
  CampLeader,
  CoachChat,
  DayScene,
  LiveAsk,
  LiveRegister,
  LiveStream,
  SlotRequest,
  TeacherPick,
  ExamNet,
  GoalPick,
  HookStrikeApps,
  NotesTranscript,
  OnePlayer,
  QuizSet,
  RankRise,
  ScanSolve,
  TopicTest,
  WeekPlan,
} from "../widgets/ogrenci";
import s1 from "../vo/Ogrenci1.sure.json";
import s2 from "../vo/Ogrenci2.sure.json";
import s3 from "../vo/Ogrenci3.sure.json";
import s4 from "../vo/Ogrenci4.sure.json";
import s5 from "../vo/Ogrenci5.sure.json";
import s8 from "../vo/Ogrenci8.sure.json";
import s9 from "../vo/Ogrenci9.sure.json";
import s10 from "../vo/Ogrenci10.sure.json";

const CTA_NOTE = "İlk 3 gün tüm ücretli içerikler açık";
const BTN = "Ücretsiz Kayıt Ol";

export const ogrenci: VideoDef[] = [
  {
    id: "Ogrenci1",
    tone: "brand",
    scenes: withVo("Ogrenci1", s1, [
      {
        dur: 84,
        el: (
          <HookSlam
            kicker="PRATİK · YAPAY ZEKÂ"
            ghost="ÇÖZ"
            lines={[
              { text: "ÇÖZEMEDİN", size: 160 },
              { text: "Mİ?", size: 200, tone: "feather", at: 10 },
              { text: "FOTOĞRAFINI", size: 132, tone: "brand", at: 30 },
              { text: "ÇEK.", size: 220, tone: "brand", at: 40 },
            ]}
          />
        ),
      },
      {
        dur: 150,
        el: (
          <FeatureScene
            kicker="FOTOĞRAFLA ÇÖZÜM"
            title="Tara, *adım adım* gör"
            callouts={
              <>
                <Callout delay={56} x={600} y={560} rot={5}>
                  Algılandı ✓
                </Callout>
                <Callout delay={112} x={600} y={880} rot={5}>
                  Adım adım
                </Callout>
              </>
            }
          >
            <Phone>
              <ScanSolve />
            </Phone>
          </FeatureScene>
        ),
      },
      {
        dur: 150,
        el: (
          <FeatureScene
            kicker="KONUYA ÖZEL SORU SETİ"
            title="Her doğru *bir adım*"
            callouts={
              <>
                <Callout delay={48} x={600} y={470} rot={6} tone="feather">
                  Doğru! ✓
                </Callout>
                <Callout delay={70} x={40} y={1340} rot={-4}>
                  3/10 → 4/10
                </Callout>
              </>
            }
          >
            <Phone>
              <QuizSet />
            </Phone>
          </FeatureScene>
        ),
      },
      { dur: 100, el: <CTA title="Hedefine *bugün* başla" button={BTN} note={CTA_NOTE} /> },
    ]),
  },
  {
    id: "Ogrenci2",
    tone: "brand",
    scenes: withVo("Ogrenci2", s2, [
      {
        dur: 84,
        el: <HookQuestion kicker="DENEME ANALİZİ" text={"Netin neden\n*artmıyor?*"} after={"Cevap soru soru\nanalizde saklı."} />,
      },
      {
        dur: 140,
        el: (
          <FeatureScene
            kicker="LGS · TYT · AYT FORMATINDA"
            title="Netin *ders ders*"
            callouts={
              <Callout delay={70} x={610} y={600} rot={6}>
                +6,50 net
              </Callout>
            }
          >
            <Phone>
              <ExamNet />
            </Phone>
          </FeatureScene>
        ),
      },
      {
        dur: 140,
        el: (
          <FeatureScene
            kicker="SORU SORU ANALİZ"
            title="Eksiğin *nerede?*"
            callouts={
              <>
                <Callout delay={40} x={600} y={570} rot={5}>
                  40 soru
                </Callout>
                <Callout delay={70} x={40} y={1350} rot={-5} tone="feather">
                  Eksik bulundu
                </Callout>
              </>
            }
          >
            <Phone>
              <AnalysisGrid />
            </Phone>
          </FeatureScene>
        ),
      },
      {
        dur: 120,
        el: (
          <FeatureScene
            kicker="SIRALAMA"
            title="Her denemede *yüksel*"
            callouts={
              <Callout delay={76} x={40} y={1350} rot={-5}>
                Sıralaman ▲
              </Callout>
            }
          >
            <Phone>
              <RankRise />
            </Phone>
          </FeatureScene>
        ),
      },
      { dur: 100, el: <CTA title="Netini *bugün* analiz et" button={BTN} note={CTA_NOTE} /> },
    ]),
  },
  {
    id: "Ogrenci3",
    tone: "feather",
    scenes: withVo("Ogrenci3", s3, [
      {
        dur: 90,
        el: <HookCounter kicker="SORU KAMPINDA SIRAN" value={1} from={50} suffix="." label={"Arkadaşlarınla *yarış,*\nzirveyi kap"} tone="feather" />,
      },
      {
        dur: 140,
        el: (
          <FeatureScene
            kicker="DAVET KODU"
            title="*Paylaş,* kampı kur"
            tone="feather"
            callouts={
              <>
                <Callout delay={40} x={590} y={560} rot={6} tone="feather">
                  KAMP-7X2
                </Callout>
                <Callout delay={96} x={40} y={1390} rot={-5} tone="brand">
                  5 kişi hazır
                </Callout>
              </>
            }
          >
            <Phone>
              <CampInvite />
            </Phone>
          </FeatureScene>
        ),
      },
      {
        dur: 150,
        el: (
          <FeatureScene
            kicker="CANLI SORU ÇÖZME"
            title="5.'likten *zirveye*"
            tone="feather"
            callouts={
              <>
                <Callout delay={30} x={620} y={580} rot={6} tone="brand">
                  Canlı
                </Callout>
                <Callout delay={108} x={40} y={1360} rot={-5} tone="feather">
                  1. sıra senin!
                </Callout>
              </>
            }
          >
            <Phone>
              <CampLeader />
            </Phone>
          </FeatureScene>
        ),
      },
      { dur: 100, el: <CTA title="Kampını *bugün* kur" button={BTN} note={CTA_NOTE} tone="feather" /> },
    ]),
  },
  {
    id: "Ogrenci4",
    tone: "brand",
    scenes: withVo("Ogrenci4", s4, [
      { dur: 90, el: <HookStrikeApps /> },
      {
        dur: 140,
        el: (
          <FeatureScene
            kicker="ÇALIŞ"
            title="Hepsi *tek oynatıcıda*"
            callouts={
              <Callout delay={72} x={40} y={1360} rot={-5}>
                4 içerik türü
              </Callout>
            }
          >
            <Phone>
              <OnePlayer />
            </Phone>
          </FeatureScene>
        ),
      },
      {
        dur: 130,
        el: (
          <FeatureScene
            kicker="NOT + TRANSKRİPT"
            title="Her cümleyi *yakala*"
            callouts={
              <Callout delay={100} x={40} y={1400} rot={-5} tone="feather">
                Not alındı ✓
              </Callout>
            }
          >
            <Phone>
              <NotesTranscript />
            </Phone>
          </FeatureScene>
        ),
      },
      {
        dur: 130,
        el: (
          <FeatureScene
            kicker="KONU TESTİ"
            title="%80 yap, *konu biter*"
            callouts={
              <Callout delay={70} x={40} y={1370} rot={-5}>
                %80 ✓
              </Callout>
            }
          >
            <Phone>
              <TopicTest />
            </Phone>
          </FeatureScene>
        ),
      },
      { dur: 100, el: <CTA title="Tek oynatıcıyla *bugün* başla" button={BTN} note={CTA_NOTE} /> },
    ]),
  },
  {
    id: "Ogrenci5",
    tone: "feather",
    scenes: withVo("Ogrenci5", s5, [
      {
        dur: 84,
        el: (
          <HookSlam
            kicker="PLANLA + KOÇ"
            ghost="HEDEF"
            tone="feather"
            lines={[
              { text: "HEDEFİN BELLİ.", size: 118 },
              { text: "YOLUN", size: 250, tone: "feather", at: 8 },
              { text: "BELLİ Mİ?", size: 150, tone: "white", at: 20 },
            ]}
          />
        ),
      },
      {
        dur: 130,
        el: (
          <FeatureScene
            kicker="PLANLA"
            title="Önce *hedefini* seç"
            tone="feather"
            callouts={
              <Callout delay={52} x={600} y={570} rot={6} tone="feather">
                Hedef ✓
              </Callout>
            }
          >
            <Phone>
              <GoalPick />
            </Phone>
          </FeatureScene>
        ),
      },
      {
        dur: 120,
        el: (
          <FeatureScene
            kicker="İLERLEME TAKİBİ"
            title="Plan *hedefine göre*"
            tone="feather"
            callouts={
              <Callout delay={72} x={40} y={1380} rot={-5} tone="brand">
                %80 tamam
              </Callout>
            }
          >
            <Phone>
              <WeekPlan />
            </Phone>
          </FeatureScene>
        ),
      },
      {
        dur: 135,
        el: (
          <FeatureScene
            kicker="KOÇ ÖĞRETMEN"
            title="Yanında bir *koç* var"
            tone="feather"
            callouts={
              <Callout delay={108} x={40} y={1390} rot={-5} tone="brand">
                Canlı ders ✓
              </Callout>
            }
          >
            <Phone>
              <CoachChat />
            </Phone>
          </FeatureScene>
        ),
      },
      { dur: 100, el: <CTA title="Hedefine *bugün* başla" button={BTN} note={CTA_NOTE} tone="feather" /> },
    ]),
  },
  {
    id: "Ogrenci8",
    tone: "feather",
    scenes: withVo("Ogrenci8", s8, [
      {
        dur: 84,
        el: <HookQuestion kicker="ÖZEL DERS" tone="feather" text={"Bir konuda mı\n*takıldın?*"} after={"Koçundan özel ders iste."} />,
      },
      {
        dur: 130,
        el: (
          <FeatureScene
            kicker="KOÇ ÖĞRETMEN"
            title="Konunu yaz, *koçunu* seç"
            tone="feather"
            callouts={
              <Callout delay={62} x={40} y={1380} rot={-5} tone="brand">
                Müsait ✓
              </Callout>
            }
          >
            <Phone>
              <TeacherPick />
            </Phone>
          </FeatureScene>
        ),
      },
      {
        dur: 150,
        el: (
          <FeatureScene
            kicker="ÖZEL DERS TALEBİ"
            title="Saatini seç, *gönder*"
            tone="feather"
            callouts={
              <>
                <Callout delay={36} x={600} y={560} rot={6} tone="feather">
                  19:00
                </Callout>
                <Callout delay={94} x={40} y={1390} rot={-5} tone="brand">
                  Talep gönderildi ✓
                </Callout>
              </>
            }
          >
            <Phone>
              <SlotRequest />
            </Phone>
          </FeatureScene>
        ),
      },
      { dur: 100, el: <CTA title="Takıldığın yerde *koçun* yanında" button={BTN} note={CTA_NOTE} tone="feather" /> },
    ]),
  },
  {
    id: "Ogrenci9",
    tone: "brand",
    scenes: withVo("Ogrenci9", s9, [
      {
        dur: 96,
        el: <HookCounter kicker="CANLI DERSE KALAN SANİYE" value={0} from={10} label={"Canlı ders\n*başlıyor*"} />,
      },
      {
        dur: 120,
        el: (
          <FeatureScene
            kicker="CANLI DERSE KAYIT"
            title="Tek dokunuşla *kayıt*"
            callouts={
              <Callout delay={34} x={600} y={560} rot={6}>
                Kayıtlısın ✓
              </Callout>
            }
          >
            <Phone>
              <LiveRegister />
            </Phone>
          </FeatureScene>
        ),
      },
      {
        dur: 110,
        el: (
          <FeatureScene
            kicker="CANLI YAYIN"
            title="Öğretmeninle *aynı anda*"
            callouts={
              <Callout delay={40} x={40} y={1390} rot={-5} tone="feather">
                Katılım canlı
              </Callout>
            }
          >
            <Phone>
              <LiveStream />
            </Phone>
          </FeatureScene>
        ),
      },
      {
        dur: 120,
        el: (
          <FeatureScene
            kicker="SORU SOR"
            title="Takıldığın an *sor*"
            callouts={
              <Callout delay={72} x={600} y={560} rot={6} tone="feather">
                Soru iletildi
              </Callout>
            }
          >
            <Phone>
              <LiveAsk />
            </Phone>
          </FeatureScene>
        ),
      },
      { dur: 100, el: <CTA title="Canlı derse *bugün* katıl" button={BTN} note={CTA_NOTE} /> },
    ]),
  },
  {
    id: "Ogrenci10",
    tone: "brand",
    scenes: withVo("Ogrenci10", s10, [
      { dur: 84, el: <HookStrike kicker="BİR ÖĞRENCİNİN HAFTASI" from="DAĞINIK" to="PLANLI" after={"7 gün, *tek platform*"} /> },
      { dur: 70, el: <DayScene day="PAZARTESİ" dayIdx={0} title="Dersi izle, *not al*" skip={30}><NotesTranscript /></DayScene> },
      { dur: 64, el: <DayScene day="SALI" dayIdx={1} title="Sana özel *soru seti*" skip={20}><QuizSet /></DayScene> },
      { dur: 70, el: <DayScene day="ÇARŞAMBA" dayIdx={2} title="Fotoğrafla *çöz*" skip={56}><ScanSolve /></DayScene> },
      { dur: 70, el: <DayScene day="PERŞEMBE" dayIdx={3} title="Konu testi *%80 ✓*" skip={16}><TopicTest /></DayScene> },
      { dur: 64, el: <DayScene day="CUMARTESİ" dayIdx={5} title="Deneme + *analiz*" skip={14}><ExamNet /></DayScene> },
      { dur: 70, el: <DayScene day="PAZAR" dayIdx={6} title="Soru Kampı'nda *zirve*" skip={34} tone="feather"><CampLeader /></DayScene> },
      { dur: 110, el: <CTA title="Senin haftan *bugün* başlasın" button={BTN} note={CTA_NOTE} /> },
    ]),
  },
];
