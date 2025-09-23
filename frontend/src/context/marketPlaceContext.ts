import { createContext, useContext } from "react";

export type ListingStatus = "ACTIVE" | "SOLD";
export interface Listing {
  id: string;
  title: string;
  price: number;
  category: string;
  image: string;
  status: ListingStatus;
  seller?: string;
  posted?: string;
  description?: string;
}

export interface Filters {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface MarketPlaceContextValue {
  listings: Listing[];
  filters: Filters;
  setFilters: (f: Filters) => void;
  getListingById: (id?: string) => Listing | null;
  fetchListings: (params?: Record<string, unknown>) => Promise<void>;
}

// create context with null default
export const MarketPlaceContext = createContext<MarketPlaceContextValue | null>(null);

// safe hook
export function useMarketPlaceContext(): MarketPlaceContextValue {
  const ctx = useContext(MarketPlaceContext);
  if (!ctx) throw new Error("useMarketPlaceContext must be used within MarketPlaceProvider");
  return ctx;
}
