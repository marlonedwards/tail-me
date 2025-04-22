export const following_cache_key = "following_cache_key"

export interface User {
    id: string;
    address: string;
    following: Trader[];
}

export interface Trader {
    id: string;
    name: string;
    avatar: string;
    stats: {
      roi: number;
      followers: number;
    }
  }
