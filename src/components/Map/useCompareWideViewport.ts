"use client";

import { useEffect, useState } from "react";

import { COMPARE_WIDE_MQ } from "../../maps";

/**
 * Whether the viewport matches the compare desktop breakpoint (≥40rem).
 */
export function useCompareWideViewport(): boolean {
  const [isWide, setIsWide] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia(COMPARE_WIDE_MQ).matches
      : false,
  );

  useEffect(() => {
    const media = window.matchMedia(COMPARE_WIDE_MQ);
    const sync = () => setIsWide(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return isWide;
}
