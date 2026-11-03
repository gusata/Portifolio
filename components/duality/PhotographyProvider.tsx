"use client";

import { createContext, useContext, type ReactNode } from "react";
import { photographs, photographyIsDemo, type Photograph } from "@/content/duality";

export type PhotographyLibrary = { photographs: Photograph[]; photographyIsDemo: boolean };
const PhotographyContext = createContext<PhotographyLibrary>({ photographs, photographyIsDemo });

export function PhotographyProvider({ library, children }: { library: PhotographyLibrary; children: ReactNode }) {
  return <PhotographyContext.Provider value={library}>{children}</PhotographyContext.Provider>;
}

export function usePhotography() {
  return useContext(PhotographyContext);
}
