"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { CarouselApi } from "@/components/ui/carousel";

export function useCarouselState(api: CarouselApi) {
  const subscribe = useCallback((update: () => void) => {
    api?.on("select", update);
    api?.on("reInit", update);
    return () => {
      api?.off("select", update);
      api?.off("reInit", update);
    };
  }, [api]);

  const current = useSyncExternalStore(subscribe, () => api?.selectedScrollSnap() ?? 0, () => 0);
  const count = useSyncExternalStore(subscribe, () => api?.scrollSnapList().length ?? 0, () => 0);
  return { current, count };
}
