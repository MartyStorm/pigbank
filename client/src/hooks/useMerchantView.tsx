import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
import type { Merchant } from "@shared/schema";

interface MerchantViewContextType {
  viewingMerchant: Merchant | null;
  isViewingMerchant: boolean;
  isInitialized: boolean;
  enterMerchantView: (merchant: Merchant) => void;
  exitMerchantView: () => void;
}

const STORAGE_KEY = "pigbank_viewing_merchant";

const MerchantViewContext = createContext<MerchantViewContextType | null>(null);

const EXIT_ROUTES = ["/landing", "/team/merchants", "/team/merchants/approved", "/pigbank-team"];

export function MerchantViewProvider({ children }: { children: ReactNode }) {
  const [viewingMerchant, setViewingMerchant] = useState<Merchant | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        setViewingMerchant(JSON.parse(stored));
      }
    } catch {
      // Ignore errors
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized && viewingMerchant && EXIT_ROUTES.includes(location)) {
      setViewingMerchant(null);
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [location, isInitialized, viewingMerchant]);

  useEffect(() => {
    if (!isInitialized) return;
    
    if (viewingMerchant) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(viewingMerchant));
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [viewingMerchant, isInitialized]);

  const enterMerchantView = useCallback((merchant: Merchant) => {
    // Save to sessionStorage synchronously BEFORE state update
    // This ensures navigation can read it immediately
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merchant));
    } catch {
      // Ignore errors
    }
    setViewingMerchant(merchant);
  }, []);

  const exitMerchantView = useCallback(() => {
    setViewingMerchant(null);
  }, []);

  return (
    <MerchantViewContext.Provider value={{
      viewingMerchant,
      isViewingMerchant: !!viewingMerchant,
      isInitialized,
      enterMerchantView,
      exitMerchantView,
    }}>
      {children}
    </MerchantViewContext.Provider>
  );
}

export function useMerchantView() {
  const context = useContext(MerchantViewContext);
  if (!context) {
    throw new Error("useMerchantView must be used within a MerchantViewProvider");
  }
  return context;
}
