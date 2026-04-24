"use client";

import {
  PAIRINGS,
  useTypePair,
} from "@/app/_components/context/TypePairProvider";

export const SerifDisplay = () => {
  const typePair = useTypePair();
  const pairing = PAIRINGS.find((p) => p.id === typePair.active);

  return (
    <div
      className="font-serif italic text-[5.25rem] leading-[0.95] tracking-tight text-titanium"
      style={{ fontVariationSettings: '"opsz" 32, "wght" 400' }}
    >
      {pairing?.roomName ?? "Spooky backrooms"}
    </div>
  );
};
