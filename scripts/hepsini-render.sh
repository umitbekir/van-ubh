#!/bin/bash
# Tüm videoları tek bundle'dan render eder, kapak PNG'lerini (kare 70 = kanca tamamlanmış) çıkarır, videolar/ klasörüne kopyalar.
set -e
cd "$(dirname "$0")/.."
npx remotion bundle src/index.ts --out-dir build/final --bundle-cache=false --log=error
grup() { case $1 in Ogretmen6|Arac1|Sinav5|Marka1|Ogrenci6|Ogrenci7) echo ek;; Ogretmen*) echo ogretmen;; Ogrenci*) echo ogrenci;; Sinav*) echo sinav;; esac; }
IDS="Ogretmen1 Ogretmen2 Ogretmen3 Ogretmen4 Ogretmen5 Ogretmen6 Ogretmen7 Ogretmen8 Ogretmen9 Ogretmen10 Ogrenci1 Ogrenci2 Ogrenci3 Ogrenci4 Ogrenci5 Ogrenci6 Ogrenci7 Ogrenci8 Ogrenci9 Ogrenci10 Sinav1 Sinav2 Sinav3 Sinav4 Sinav5 Sinav6 Sinav7 Sinav8 Sinav9 Sinav10 Marka1 Arac1"
mkdir -p kapaklar
for id in $IDS; do
  g=$(grup $id); mkdir -p videolar/$g
  npx remotion render build/final $id videolar/$g/$id.mp4 --codec=h264 --concurrency=6 --log=error
  npx remotion still build/final $id kapaklar/$id.jpg --frame=70 --image-format=jpeg --jpeg-quality=90 --log=error
  echo "TAMAM $id"
done
