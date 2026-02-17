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
  status: ApartmentStatus;
  createdAt: Date;
}

export enum ApartmentStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  SOLD = 'SOLD',
}

export interface FilterApartmentsDto {
  search?: string;
  projectId?: string;
  bedrooms?: number;
  minPrice?: number;
  maxPrice?: number;
  status?: ApartmentStatus;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateApartmentDto {
  unitName: string;
  unitNumber: string;
  projectId: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  floor?: number;
  description?: string;
  features?: string[];
  images?: string[];
}
