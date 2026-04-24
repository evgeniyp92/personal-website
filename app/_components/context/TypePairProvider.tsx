"use client";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type TypePairContextValue = {
  active: string;
  setActive: (id: string) => void;
};

export type Pairing = {
  id: string;
  label: string;
};

export const PAIRINGS: Pairing[] = [
  { id: "geist-instrumentserif", label: "Geist · Instrument Serif" },
  { id: "satoshi-bodonimoda", label: "Satoshi · Bodoni Moda" },
];

export const DEFAULT_PAIR = PAIRINGS[0].id;

const TypePairContext = createContext<TypePairContextValue | null>(null);

export const TypePairProvider = ({ children }: { children: ReactNode }) => {
  const [typePair, setTypePair] = useState<string>(DEFAULT_PAIR);

  const setActive = useCallback((typePairToSet: string) => {
    try {
      setTypePair(typePairToSet);
      document.documentElement.dataset.typePair = typePairToSet;
      localStorage.setItem("type-pair", typePairToSet);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("type-pair");
      if (stored && stored !== typePair) {
        setActive(stored);
      }
    } catch {}
  }, [setActive, typePair]);

  return (
    <TypePairContext.Provider value={{ active: typePair, setActive }}>
      {children}
    </TypePairContext.Provider>
  );
};

export function useTypePair() {
  const ctx = useContext(TypePairContext);
  if (!ctx)
    throw new Error("useTypePair must be used within a TypePairProvider");
  return ctx;
}
