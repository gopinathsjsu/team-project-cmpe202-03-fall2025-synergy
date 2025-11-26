/**
 * Product type that matches backend ProductResponseDto
 * Uses snake_case to match backend JSON naming strategy
 */
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  seller_id: number;
  image_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  match_percentage?: number; // Optional, only present in search results
}

/**
 * User profile type
 */
export interface UserProfile {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  status: 'ACTIVE' | 'SUSPENDED';
}

