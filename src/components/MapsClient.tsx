"use client";
import dynamic from "next/dynamic";

const BlankMapMaker = dynamic(() => import("@/components/BlankMapMaker"), {
  ssr: false,
  loading: () => <div className="card flex h-96 items-center justify-center text-sm text-mute">Preparing map library…</div>,
});

export default function MapsClient() {
  return <BlankMapMaker />;
}
