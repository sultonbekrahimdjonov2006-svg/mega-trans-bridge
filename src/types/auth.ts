export type CustomerProfile = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  sizes: string[];
  preferences: string[];
  favoriteProductIds: string[];
  addressIds: string[];
  orderIds: string[];
  reservationIds: string[];
};
export type AuthSession = {
  id: string;
  user: CustomerProfile;
  expiresAt: string;
};
export interface AuthProvider {
  getCurrentSession(): Promise<AuthSession | null>;
}
