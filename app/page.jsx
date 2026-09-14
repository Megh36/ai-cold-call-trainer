"use client";

import dynamic from "next/dynamic";

const ColdCallTrainer = dynamic(() => import("../cold-call-trainer"), {
  ssr: false,
});

export default function Page() {
  return <ColdCallTrainer />;
}
