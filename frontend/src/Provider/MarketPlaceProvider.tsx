import React, { useMemo, useState } from "react";
import axios from "axios";
import {
  MarketPlaceContext,
  type Listing,
  type Filters,
  type MarketPlaceContextValue
} from "../context/marketPlaceContext";

// dummy data
const DUMMY_LISTINGS: Listing[] = [
  {
    id: "1",
    title: "Calculus Textbook - Stewart 8th Edition",
    price: 45,
    category: "Textbooks",
    image: "https://placehold.co/800x400?text=Calculus%20Textbook",
    status: "ACTIVE",
    seller: "John Doe",
    posted: "2 hours ago",
    description: "Gently used calculus textbook, minimal highlights, excellent condition."
  },
  {
    id: "2",
    title: 'MacBook Pro 13" - 2020 Model',
    price: 1200,
    category: "Electronics",
    image: "https://placehold.co/800x400?text=MacBook%20Pro",
    status: "ACTIVE",
    seller: "Jane Smith",
    posted: "1 day ago",
    description: "M1 MacBook Pro, 8GB RAM, 256GB SSD. Includes charger and case."
  },
  {
    id: "3",
    title: "Gaming Chair - Ergonomic",
    price: 150,
    category: "Furniture",
    image: "https://placehold.co/800x400?text=Gaming%20Chair",
    status: "ACTIVE",
    seller: "Mike",
    posted: "3 days ago",
    description: "Ergonomic gaming chair, adjustable armrests, lumbar support."
  },
  {
    id: "4",
    title: "Data Structures Textbook",
    price: 30,
    category: "Textbooks",
    image: "https://placehold.co/800x400?text=DS%20Textbook",
    status: "ACTIVE",
    seller: "Sara",
    posted: "5 hours ago",
    description: "Used textbook with clean pages. Covers key topics in Data Structures."
  },
  {
    id: "5",
    title: "Mechanical Keyboard",
    price: 80,
    category: "Electronics",
    image: "https://placehold.co/800x400?text=Keyboard",
    status: "ACTIVE",
    seller: "Tom",
    posted: "6 hours ago",
    description: "RGB mechanical keyboard with tactile switches, great for gaming."
  }
];


export function MarketPlaceProvider({ children }: { children: React.ReactNode }) {
  const [listings, setListings] = useState<Listing[]>(DUMMY_LISTINGS);
  const [filters, setFilters] = useState<Filters>({});

  const fetchListings = React.useCallback(async (params: Record<string, unknown> = {}) => {
    try {
      const res = await axios.get<Listing[]>("/api/listings", { params });
      setListings(res.data);
    } catch (e) {
      console.error("Failed to fetch listings:", e);
    }
  }, []);

  const getListingById = React.useCallback((id?: string) => (id ? listings.find(l => l.id === id) ?? null : null), [listings]);

  const value = useMemo<MarketPlaceContextValue>(() => ({
    listings,
    filters,
    setFilters,
    getListingById,
    fetchListings
  }), [listings, filters, getListingById, fetchListings]);

  return (
    <MarketPlaceContext.Provider value={value}>
      {children}
    </MarketPlaceContext.Provider>
  );
}

export default MarketPlaceProvider;
