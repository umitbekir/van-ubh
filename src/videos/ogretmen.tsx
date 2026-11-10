import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { CTA, Callout, FeatureScene, HookCounter, HookQuestion, HookSlam, HookStrike, Phone, withVo } from "../kit";
import type { VideoDef } from "../types";
import { C } from "../theme";
import {
  AssignScreen,
  AttendGrid,
  BalanceScreen,
  BarsScreen,
  CalendarScreen,
  CurriculumScreen,
  DonutScreen,
  EditorScreen,
  LadderScreen,
  LiveScreen,
  PoolScreen,
  PublishScreen,
  StudioLineScreen,
  UploadScreen,
  RosterScreen,
  ResultsScreen,
  QueueScreen,
  SolvedScreen,
  ClockOverlay,
  DayScene,
  TreeScreen,
  StudentFeedScreen,
} from "../widgets/ogretmen";
import s1 from "../vo/Ogretmen1.sure.json";
import s2 from "../vo/Ogretmen2.sure.json";
import s3 from "../vo/Ogretmen3.sure.json";
import s4 from "../vo/Ogretmen4.sure.json";
import s5 from "../vo/Ogretmen5.sure.json";
import s7 from "../vo/Ogretmen7.sure.json";
import s8 from "../vo/Ogretmen8.sure.json";
import s9 from "../vo/Ogretmen9.sure.json";
import s10 from "../vo/Ogretmen10.sure.json";

const BTN = "Öğretmen Olarak Katıl";
const L = 40; // sol callout x
const LOW = 1395; // alt callout: telefonun alt (önemsiz) kısmı, yasak bölgenin hemen üstü
const T1 = 468; // tek satır başlıkta telefonun durum çubuğu hizası
const T2 = 560; // iki satır başlıkta

export const ogretmen: VideoDef[] = [
  /* ───── 1 · İçerik Stüdyosu ───── */
  {
    id: "Ogretmen1",
    tone: "brand",
    scenes: withVo("Ogretmen1", s1, [
      {
        dur: 84,
        // Kapak: soru 0. karede tam okunsun diye kelime girişinin ilk 16 karesi atlanır.
        el: (
          <Sequence from={-16}>
            <HookQuestion kicker="ÖĞRETMENLER İÇİN" text={"Anlattığın ders\n*bir kez* mi\ndinleniyor?"} after="Bir kez anlat, defalarca izlensin." />
          </Sequence>
        ),
      },
      {
        dur: 130,
        el: (
          <FeatureScene
            kicker="İÇERİK STÜDYOSU"
            title="Video, ses, doküman: *yükle*"
            callouts={
              <>
                <Callout delay={14} x={L} y={T2}>Video • Ses • Doküman</Callout>
                <Callout delay={88} x={L + 20} y={LOW} rot={3}>Hepsi tek stüdyoda</Callout>
              </>
            }
          >
            <Phone>
              <UploadScreen />
            </Phone>
          </FeatureScene>
        ),
      },
      {
        dur: 130,
        el: (
          <FeatureScene
            kicker="MÜFREDATA BAĞLA"
            title="Doğru konuya *bağla*"
            callouts={
              <>
                <Callout delay={22} x={560} y={T1} rot={4}>20.000+ konu</Callout>
                <Callout delay={64} x={L} y={LOW} rot={-3}>AYT Matematik › Türev ✓</Callout>
              </>
            }
          >
            <Phone tilt={-1}>
              <CurriculumScreen />
            </Phone>
          </FeatureScene>
        ),
      },
      {
        dur: 130,
        el: (
          <FeatureScene
            kicker="STÜDYO ANALİTİĞİ"
            title="Emeğin *görünür* olsun"
            callouts={
              <>
                <Callout delay={30} x={600} y={T1} rot={4}>İzlenme ↑</Callout>
                <Callout delay={54} x={L + 20} y={LOW} tone="feather">Beğeni ♥</Callout>
              </>
            }
          >
            <Phone>
              <StudioLineScreen />
            </Phone>
          </FeatureScene>
        ),
      },
      { dur: 100, el: <CTA title="Bilgin, *emeğinin karşılığını* bulsun" button={BTN} /> },
    ]),
  },

  /* ───── 2 · Soru Havuzu + Sınav Oluşturucu ───── */
  {
    id: "Ogretmen2",
    tone: "brand",
    scenes: withVo("Ogretmen2", s2, [
      {
        dur: 88,
        el: <HookStrike kicker="ÖĞRETMENLER İÇİN" from="3 SAAT" to="3 DAKİKA" after="Deneme hazırlamak artık *bu kadar kolay*" />,
      },
      {
        dur: 130,
        el: (
          <FeatureScene
            kicker="SORU HAVUZU"
            title="Sorunu yaz, *onaya gönder*"
            callouts={
              <>
                <Callout delay={10} x={L} y={T2}>Zengin metin editörü</Callout>
                <Callout delay={100} x={L + 20} y={LOW} rot={3}>Branş onayıyla yayında</Callout>
              </>
            }
          >
            <Phone>
              <EditorScreen />
            </Phone>
          </FeatureScene>
        ),
      },
      {
        dur: 130,
        el: (
          <FeatureScene
            kicker="SINAV OLUŞTURUCU"
            title="Filtrele, *işaretle*"
            callouts={
              <>
                <Callout delay={30} x={L} y={LOW} rot={-3}>200.000+ onaylı soru</Callout>
                <Callout delay={100} x={620} y={T1} rot={5}>40 / 40 ✓</Callout>
              </>
            }
          >
            <Phone tilt={-1}>
              <PoolScreen />
            </Phone>
          </FeatureScene>
        ),
      },
      {
        dur: 120,
        el: (
          <FeatureScene
            kicker="YAYINLA"
            title="Süre, erişim, *yayında*"
            callouts={
              <>
                <Callout delay={16} x={L} y={T1}>Süre + erişim ayarı</Callout>
                <Callout delay={80} x={L + 20} y={LOW} rot={3} tone="feather">Deneme yayında!</Callout>
              </>
            }
          >
            <Phone>
              <PublishScreen />
            </Phone>
          </FeatureScene>
        ),
      },
      { dur: 100, el: <CTA title="Denemeni *dakikalar içinde* hazırla" button={BTN} /> },
    ]),
  },

  /* ───── 3 · Koçluk ve Özel Ders ───── */
  {
    id: "Ogretmen3",
    tone: "feather",
    scenes: withVo("Ogretmen3", s3, [
      {
        dur: 84,
        el: (
          <HookSlam
            tone="feather"
            kicker="KOÇLUK & ÖZEL DERS"
            ghost="ÖZEL DERS"
            lines={[
              { text: "İLAN PEŞİNDE", size: 118 },
              { text: "KOŞMA.", size: 210, tone: "feather", at: -14 },
              { text: "ÖĞRENCİ", size: 150, at: 8 },
              { text: "SENİ BULSUN.", size: 122, tone: "feather", at: 18 },
            ]}
          />
        ),
      },
      {
        dur: 140,
        el: (
          <FeatureScene
            tone="feather"
            kicker="MÜSAİTLİK TAKVİMİ"
            title="Takvimini *sen yönet*"
            callouts={
              <>
                <Callout delay={68} x={620} y={T1} rot={5} tone="feather">Rezerve ✓</Callout>
                <Callout delay={84} x={L} y={LOW} rot={-3} tone="amber">Platform komisyonu sadece %10</Callout>
              </>
            }
          >
            <Phone>
              <CalendarScreen />
            </Phone>
          </FeatureScene>
        ),
      },
      {
        dur: 130,
        el: (
          <FeatureScene
            tone="feather"
            kicker="KOÇLUK PANELİ"
            title="Ödev ve sınav *ata*"
            callouts={
              <>
                <Callout delay={30} x={L} y={T1} tone="feather">Ödev + sınav ata</Callout>
                <Callout delay={86} x={L + 20} y={LOW} rot={3} tone="amber">Öğrencinle mesajlaş</Callout>
              </>
            }
          >
            <Phone tilt={-1}>
              <AssignScreen />
            </Phone>
          </FeatureScene>
        ),
      },
      { dur: 100, el: <CTA tone="feather" title="Bilgin, *emeğinin karşılığını* bulsun" button={BTN} /> },
    ]),
  },

  /* ───── 4 · Canlı Ders + Analitik ───── */
  {
    id: "Ogretmen4",
    tone: "brand",
    scenes: withVo("Ogretmen4", s4, [
      {
        dur: 84,
        el: (
          <AbsoluteFill>
            <Sequence from={-16}>
              <HookQuestion kicker="CANLI DERS" text={"Sınıfında\n*kim dinliyor,*\nkim kaçırdı?"} />
            </Sequence>
            <AttendGrid />
          </AbsoluteFill>
        ),
      },
      {
        dur: 130,
        el: (
          <FeatureScene
            kicker="CANLI DERS"
            title="Kim katıldı, *anında gör*"
            callouts={
              <>
                <Callout delay={10} x={600} y={T2} rot={5} tone="feather">● CANLI</Callout>
                <Callout delay={46} x={L} y={LOW} rot={-3}>Katılım takibi</Callout>
              </>
            }
          >
            <Phone>
              <LiveScreen />
            </Phone>
          </FeatureScene>
        ),
      },
      {
        dur: 130,
        el: (
          <FeatureScene
            kicker="STÜDYO ANALİTİĞİ"
            title="İzlenme ve beğeni *tek ekranda*"
            callouts={
              <>
                <Callout delay={74} x={L + 20} y={LOW} rot={3}>Dersini veriyle güçlendir</Callout>
              </>
            }
          >
            <Phone tilt={-1}>
              <BarsScreen />
            </Phone>
          </FeatureScene>
        ),
      },
      { dur: 100, el: <CTA title="Sınıfını *veriyle* yönet" button={BTN} /> },
    ]),
  },

  /* ───── 5 · Kazanç Modeli ───── */
  {
    id: "Ogretmen5",
    tone: "feather",
    scenes: withVo("Ogretmen5", s5, [
      {
        dur: 84,
        el: (
          // Sayaç kapağı: 0. karede %65 okunsun diye sayacın ilk 18 karesi atlanır.
          <Sequence from={-18}>
            <HookCounter tone="feather" kicker="ÖĞRETMEN KAZANCI" value={65} from={50} prefix="%" label="Abonelik gelirinin *%65'i* öğretmenlere" />
          </Sequence>
        ),
      },
      {
        dur: 130,
        el: (
          <FeatureScene
            tone="feather"
            kicker="HAVUZ MODELİ"
            title="Tahsilatın *%65'i* havuza"
            callouts={
              <>
                <Callout delay={58} x={L} y={LOW} rot={-3} tone="feather">%65 öğretmen havuzu</Callout>
                <Callout delay={74} x={580} y={T2} rot={5} tone="amber">%35 platform</Callout>
              </>
            }
          >
            <Phone>
              <DonutScreen />
            </Phone>
          </FeatureScene>
        ),
      },
      {
        dur: 130,
        el: (
          <FeatureScene
            tone="feather"
            kicker="SEVİYE ÇARPANI"
            title={"Yeni → Kıdemli →\n*Süper Hoca*"}
            callouts={
              <>
                <Callout delay={50} x={L} y={T2} rot={-3} tone="amber">Seviye yükseldikçe çarpan ↑</Callout>
              </>
            }
          >
            <Phone tilt={-1}>
              <LadderScreen />
            </Phone>
          </FeatureScene>
        ),
      },
      {
        dur: 130,
        el: (
          <FeatureScene
            tone="feather"
            kicker="ÇEKİM TALEBİ"
            title="500 ₺ olunca *çek*"
            callouts={
              <>
                <Callout delay={66} x={580} y={T1} rot={5} tone="amber">Eşik: 500 ₺</Callout>
                <Callout delay={92} x={L} y={LOW} rot={-3} tone="feather">Çekim talebi ✓</Callout>
              </>
            }
          >
            <Phone>
              <BalanceScreen />
            </Phone>
          </FeatureScene>
        ),
      },
      { dur: 100, el: <CTA tone="feather" title="Bilgin, *emeğinin karşılığını* bulsun" button={BTN} /> },
    ]),
  },

  /* ───── 7 · Ödev/sınav ata, sonuçları gör ───── */
  {
    id: "Ogretmen7",
    tone: "brand",
    scenes: withVo("Ogretmen7", s7, [
      {
        dur: 84,
        el: (
          <Sequence from={-18}>
            <HookCounter kicker="KOÇLUK PANELİ" value={12} from={4} label={"öğrenci, *tek ekranda*\ntüm sonuçlar"} />
          </Sequence>
        ),
      },
      {
        dur: 130,
        el: (
          <FeatureScene
            kicker="ÖDEV VE SINAV ATA"
            title="Her öğrencine *ata*"
            callouts={
              <>
                <Callout delay={20} x={600} y={T1} rot={4}>Ödev + sınav</Callout>
                <Callout delay={70} x={L} y={LOW} rot={-3}>Koçluk paneli</Callout>
              </>
            }
          >
            <Phone>
              <RosterScreen />
            </Phone>
          </FeatureScene>
        ),
      },
      {
        dur: 160,
        el: (
          <FeatureScene
            kicker="SONUÇLAR"
            title="Kim nerede, *tek bakışta*"
            callouts={
              <>
                <Callout delay={40} x={480} y={T1} rot={4}>Öğrenci bazında</Callout>
                <Callout delay={96} x={L + 20} y={LOW} rot={3} tone="feather">Kim zorlanıyor?</Callout>
              </>
            }
          >
            <Phone tilt={-1}>
              <ResultsScreen />
            </Phone>
          </FeatureScene>
        ),
      },
      { dur: 100, el: <CTA title="Öğrencini *veriyle* yönlendir" button={BTN} /> },
    ]),
  },

  /* ───── 8 · Soru yazarı ol ───── */
  {
    id: "Ogretmen8",
    tone: "feather",
    scenes: withVo("Ogretmen8", s8, [
      {
        dur: 90,
        el: (
          <HookSlam
            tone="feather"
            kicker="SORU YAZARI OL"
            ghost="SORU"
            lines={[
              { text: "SORU YAZ.", size: 150 },
              { text: "ONAYLANSIN.", size: 118, at: -14 },
              { text: "ÇÖZÜLSÜN.", size: 165, tone: "feather", at: 10 },
            ]}
            sub="Sen yaz, *öğrenci çözsün*"
            subAt={30}
          />
        ),
      },
      {
        dur: 120,
        el: (
          <FeatureScene
            tone="feather"
            kicker="ZENGİN METİN EDİTÖRÜ"
            title="Sorunu *formülüyle* yaz"
            callouts={<Callout delay={90} x={L} y={LOW} rot={-3} tone="feather">Onaya gönderildi</Callout>}
          >
            <Phone>
              <EditorScreen
                sub="Yeni soru · Olasılık"
                l1="Bir sınıfta 12 kız, 18 erkek var."
                l2="Rastgele seçilen kız olma olasılığı?"
                opts={["1/5", "2/5", "1/2", "3/5", "2/3"]}
                correct={1}
                meta={["Matematik", "Olasılık", "Kolay"]}
                stamp={false}
              />
            </Phone>
          </FeatureScene>
        ),
      },
      {
        dur: 110,
        el: (
          <FeatureScene
            tone="feather"
            kicker="BRANŞ ONAYI"
            title="Onaydan geç, *yayında ol*"
            callouts={<Callout delay={84} x={L + 20} y={LOW} rot={3} tone="amber">Branş onaylı ✓</Callout>}
          >
            <Phone tilt={-1}>
              <QueueScreen />
            </Phone>
          </FeatureScene>
        ),
      },
      {
        dur: 110,
        el: (
          <FeatureScene
            tone="feather"
            kicker="YAYINDA"
            title="Öğrenciler *çözüyor*"
            callouts={<Callout delay={40} x={L} y={LOW} rot={-3} tone="feather">Çözülme sayacı</Callout>}
          >
            <Phone>
              <SolvedScreen />
            </Phone>
          </FeatureScene>
        ),
      },
      { dur: 100, el: <CTA tone="feather" title="Bilgini *soruya* dönüştür" button={BTN} /> },
    ]),
  },

  /* ───── 9 · Bir öğretmenin günü ───── */
  {
    id: "Ogretmen9",
    tone: "brand",
    scenes: withVo("Ogretmen9", s9, [
      {
        dur: 84,
        el: (
          <AbsoluteFill>
            <Sequence from={-16}>
              <HookQuestion kicker="BİR GÜN, TEK PLATFORM" text={"Bir öğretmenin\ngünü *nasıl\ngeçer?*"} />
            </Sequence>
            <ClockOverlay />
          </AbsoluteFill>
        ),
      },
      {
        dur: 84,
        el: (
          <DayScene time="08:00" prev="06:00" label="SABAH" tint={C.amber} title="Dersini *stüdyoya* yükle" callouts={<Callout delay={30} x={L} y={LOW} rot={-3}>İçerik stüdyosu</Callout>}>
            <Phone delay={0}>
              <UploadScreen />
            </Phone>
          </DayScene>
        ),
      },
      {
        dur: 110,
        el: (
          <DayScene time="12:30" prev="08:00" label="ÖĞLE" tint={C.cyan} title="Koçluk ve *özel ders*" callouts={<Callout delay={60} x={L} y={LOW} rot={3} tone="amber">Komisyon sadece %10</Callout>}>
            <Phone delay={0} tilt={-1}>
              <CalendarScreen />
            </Phone>
          </DayScene>
        ),
      },
      {
        dur: 96,
        el: (
          <DayScene time="19:00" prev="12:30" label="AKŞAM" tint={C.coral} title="Canlı derste *buluş*" callouts={<Callout delay={44} x={L} y={LOW} rot={-3} tone="feather">Katılım takibi</Callout>}>
            <Phone delay={0}>
              <LiveScreen />
            </Phone>
          </DayScene>
        ),
      },
      {
        dur: 96,
        el: (
          <DayScene time="23:00" prev="19:00" label="GECE" tint={C.sky} night title="Analitiğe bak, *yarını planla*" callouts={<Callout delay={50} x={L} y={LOW} rot={3}>İzlenme + beğeni</Callout>}>
            <Phone delay={0} tilt={-1}>
              <BarsScreen />
            </Phone>
          </DayScene>
        ),
      },
      { dur: 100, el: <CTA title="Tüm günün *tek platformda*" button={BTN} /> },
    ]),
  },

  /* ───── 10 · Müfredata bağlı içerik ───── */
  {
    id: "Ogretmen10",
    tone: "brand",
    scenes: withVo("Ogretmen10", s10, [
      {
        dur: 90,
        el: <HookStrike kicker="İÇERİĞİN" from="KAYBOLUR" to="BULUNUR" after="Doğru konuya bağla, *doğru öğrenciye* ulaşsın" />,
      },
      {
        dur: 150,
        el: (
          <FeatureScene
            kicker="MÜFREDAT AĞACI"
            title="*20.000+* müfredat konusu"
            callouts={
              <>
                <Callout delay={50} x={480} y={T2} rot={4}>Tam yerine bağla</Callout>
                <Callout delay={78} x={L} y={LOW} rot={-3}>Türev › Kurallar ✓</Callout>
              </>
            }
          >
            <Phone>
              <TreeScreen />
            </Phone>
          </FeatureScene>
        ),
      },
      {
        dur: 140,
        el: (
          <FeatureScene
            kicker="ÖĞRENCİ EKRANI"
            title="Konuyu çalışanın *karşısında*"
            callouts={
              <>
                <Callout delay={46} x={L} y={LOW} rot={-3} tone="feather">Konuna bağlı içerik</Callout>
              </>
            }
          >
            <Phone tilt={-1}>
              <StudentFeedScreen />
            </Phone>
          </FeatureScene>
        ),
      },
      { dur: 100, el: <CTA title="İçeriğin *doğru öğrenciyi* bulsun" button={BTN} /> },
    ]),
  },
];
