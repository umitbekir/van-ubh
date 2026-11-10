import React from "react";
import { Composition } from "remotion";
import { Reel, total } from "./kit";
import { FPS, H, W } from "./theme";
import type { VideoDef } from "./types";
import { ornek } from "./videos/ornek";
import { ogretmen } from "./videos/ogretmen";
import { ogrenci } from "./videos/ogrenci";
import { sinav } from "./videos/sinav";

const all: VideoDef[] = [...ornek, ...ogretmen, ...ogrenci, ...sinav];
const byId = Object.fromEntries(all.map((v) => [v.id, v]));

const V: React.FC<{ vid: string; guides: boolean }> = ({ vid, guides }) => {
  const v = byId[vid];
  return <Reel scenes={v.scenes} tone={v.tone} guides={guides} />;
};

export const Root = () => (
  <>
    {all.map((v) => (
      <React.Fragment key={v.id}>
        <Composition id={v.id} component={V} durationInFrames={total(v.scenes)} fps={FPS} width={W} height={H} defaultProps={{ vid: v.id, guides: false }} />
        <Composition id={`${v.id}-Kilavuz`} component={V} durationInFrames={total(v.scenes)} fps={FPS} width={W} height={H} defaultProps={{ vid: v.id, guides: true }} />
      </React.Fragment>
    ))}
  </>
);
