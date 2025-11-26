import type { UserProfile } from '../types/product';

/**
 * Get the JWT token from localStorage
 */
export function getToken(): string | null {
  return localStorage.getItem('token');
}

/**
 * Get the current user profile from localStorage
 */
export function getCurrentUser(): UserProfile | null {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr) as UserProfile;
  } catch (error) {
    console.error('Failed to parse user from localStorage:', error);
    return null;
  }
}

/**
 * Get current user ID from localStorage user object or JWT
 */
export function getCurrentUserId(): number | null {
  // Try to get from stored user object first
  const user = getCurrentUser();
  if (user?.id) return user.id;
  
  // Fallback: decode from JWT token
  const token = getToken();
  if (!token) return null;
  
  return getUserIdFromToken(token);
}

/**
 * Decode JWT and extract user ID
 */
export function getUserIdFromToken(token: string): number | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    return payload.userId || payload.sub || null;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

/**
 * Store auth data after successful login
 */
export function storeAuthData(token: string, user: UserProfile): void {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('userAuth', 'true');
  localStorage.setItem('userId', user.id.toString());
  localStorage.setItem('username', user.username);
  localStorage.setItem('userEmail', user.email);
  if (user.firstName) localStorage.setItem('firstName', user.firstName);
  if (user.lastName) localStorage.setItem('lastName', user.lastName);
}

/**
 * Clear auth data on logout
 */
export function clearAuthData(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('userAuth');
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('firstName');
  localStorage.removeItem('lastName');
  
  // Trigger logout event for components listening
  window.dispatchEvent(new Event('userLogout'));
}

/**
 * Check if user is currently authenticated
 */
export function isAuthenticated(): boolean {
  const token = getToken();
  return token !== null && localStorage.getItem('userAuth') === 'true';
}

