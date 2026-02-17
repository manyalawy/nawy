export interface Project {
  id: string;
  name: string;
  description?: string;
  location: string;
  developer?: string;
}

export interface Apartment {
  id: string;
  unitName: string;
  unitNumber: string;
  projectId: string;
  project?: Project;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  floor?: number;
  description?: string;
  features: string[];
  images: string[];
  status: 'AVAILABLE' | 'RESERVED' | 'SOLD';
  createdAt: string;
}

export interface FilterParams {
  search?: string;
  projectId?: string;
  bedrooms?: number;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
