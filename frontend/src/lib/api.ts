import { AuthResponse, LoginCredentials, RegisterCredentials, User } from '@/types/user';
import { Apartment, FilterParams, PaginatedResponse, Project } from '@/types/apartment';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `Request failed with status ${response.status}`);
    }

    return response.json();
  }

  async register(credentials: RegisterCredentials): Promise<{ success: boolean; data: User }> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async login(credentials: LoginCredentials): Promise<{ success: boolean; data: AuthResponse }> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getMe(): Promise<{ success: boolean; data: User }> {
    return this.request('/auth/me');
  }

  async logout(): Promise<{ success: boolean; message: string }> {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getApartments(filters?: FilterParams): Promise<PaginatedResponse<Apartment>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const query = params.toString();
    return this.request(`/apartments${query ? `?${query}` : ''}`);
  }

  async getApartment(id: string): Promise<{ success: boolean; data: Apartment }> {
    return this.request(`/apartments/${id}`);
  }

  async getProjects(): Promise<{ success: boolean; data: Project[] }> {
    return this.request('/projects');
  }

  async createApartment(data: Partial<Apartment>): Promise<{ success: boolean; data: Apartment }> {
    return this.request('/apartments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createProject(data: Partial<Project>): Promise<{ success: boolean; data: Project }> {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient();
