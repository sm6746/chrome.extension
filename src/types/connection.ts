export interface Connection {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  profilePicture: string;
  headline: string;
  currentPosition?: string;
  company: {
    name: string;
    logo?: string;
    industry?: string;
  };
  location?: string;
  connectionDate: string;
  mutualConnections?: number;
}

export interface CacheData<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

export interface ConnectionsCache {
  connections: CacheData<Connection[]>;
  companies: Record<string, CacheData<Connection['company']>>;
}