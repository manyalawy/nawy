import { Injectable, Logger } from '@nestjs/common';
import {
  MeilisearchService,
  MeilisearchApartment,
} from '../../meilisearch';
import { PrismaService } from '../../prisma.service';
import { FilterApartmentsDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ApartmentsSearchService {
  private readonly logger = new Logger(ApartmentsSearchService.name);

  constructor(
    private readonly meilisearchService: MeilisearchService,
    private readonly prisma: PrismaService,
  ) {}

  async search(filters: FilterApartmentsDto) {
    const { search } = filters;

    // Use Meilisearch if available and search query exists
    if (search && this.meilisearchService.isAvailable()) {
      return this.searchWithMeilisearch(filters);
    }

    // Fallback to Prisma for non-search queries or when Meilisearch is unavailable
    return this.searchWithPrisma(filters);
  }

  private async searchWithMeilisearch(filters: FilterApartmentsDto) {
    const {
      search,
      projectId,
      bedrooms,
      minPrice,
      maxPrice,
      status,
      page = 1,
      limit = 10,
    } = filters;

    // Build Meilisearch filters
    const meilisearchFilters: string[] = [];

    if (projectId) {
      meilisearchFilters.push(`projectId = "${projectId}"`);
    }
    if (bedrooms !== undefined) {
      meilisearchFilters.push(`bedrooms = ${bedrooms}`);
    }
    if (minPrice !== undefined) {
      meilisearchFilters.push(`price >= ${minPrice}`);
    }
    if (maxPrice !== undefined) {
      meilisearchFilters.push(`price <= ${maxPrice}`);
    }
    if (status) {
      meilisearchFilters.push(`status = "${status}"`);
    }

    try {
      const offset = (page - 1) * limit;
      const result = await this.meilisearchService.search(search || '', {
        filter: meilisearchFilters,
        limit,
        offset,
        sort: ['createdAt:desc'],
      });

      // Fetch fresh data from PostgreSQL using IDs from Meilisearch
      // This ensures data consistency while benefiting from Meilisearch's search
      const ids = result.hits.map((hit: MeilisearchApartment) => hit.id);

      if (ids.length === 0) {
        return {
          success: true,
          data: [],
          meta: {
            total: result.estimatedTotalHits || 0,
            page,
            limit,
            totalPages: Math.ceil((result.estimatedTotalHits || 0) / limit),
          },
          searchEngine: 'meilisearch',
        };
      }

      // Fetch from PostgreSQL with proper ordering
      const apartments = await this.prisma.apartment.findMany({
        where: { id: { in: ids } },
        include: { project: true },
      });

      // Maintain Meilisearch relevance order
      type ApartmentWithProject = (typeof apartments)[number];
      const orderedApartments: ApartmentWithProject[] = ids
        .map((id: string) => apartments.find((apt) => apt.id === id))
        .filter((apt): apt is ApartmentWithProject => apt !== undefined);

      return {
        success: true,
        data: orderedApartments.map((apt: ApartmentWithProject) => ({
          ...apt,
          price: Number(apt.price),
          area: Number(apt.area),
        })),
        meta: {
          total: result.estimatedTotalHits || 0,
          page,
          limit,
          totalPages: Math.ceil((result.estimatedTotalHits || 0) / limit),
        },
        searchEngine: 'meilisearch',
      };
    } catch (error) {
      this.logger.error(
        'Meilisearch search failed, falling back to Prisma',
        error,
      );
      return this.searchWithPrisma(filters);
    }
  }

  private async searchWithPrisma(filters: FilterApartmentsDto) {
    const {
      search,
      projectId,
      bedrooms,
      minPrice,
      maxPrice,
      status,
      page = 1,
      limit = 10,
    } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.ApartmentWhereInput = {};

    if (search) {
      where.OR = [
        { unitName: { contains: search, mode: 'insensitive' } },
        { unitNumber: { contains: search, mode: 'insensitive' } },
        { project: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (projectId) where.projectId = projectId;
    if (bedrooms !== undefined) where.bedrooms = bedrooms;
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }
    if (status) where.status = status;

    const [apartments, total] = await Promise.all([
      this.prisma.apartment.findMany({
        where,
        skip,
        take: limit,
        include: { project: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.apartment.count({ where }),
    ]);

    return {
      success: true,
      data: apartments.map((apt) => ({
        ...apt,
        price: Number(apt.price),
        area: Number(apt.area),
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      searchEngine: 'prisma',
    };
  }

  // Transform Prisma apartment to Meilisearch document
  transformToSearchDocument(apartment: {
    id: string;
    unitName: string;
    unitNumber: string;
    description: string | null;
    features: string[];
    projectId: string;
    project?: {
      name: string;
      location: string;
      developer: string | null;
    } | null;
    price: number | { toNumber: () => number };
    area: number | { toNumber: () => number };
    bedrooms: number;
    bathrooms: number;
    floor: number | null;
    status: string;
    createdAt: Date;
    images: string[];
  }): MeilisearchApartment {
    const price =
      typeof apartment.price === 'number'
        ? apartment.price
        : apartment.price.toNumber();
    const area =
      typeof apartment.area === 'number'
        ? apartment.area
        : apartment.area.toNumber();

    return {
      id: apartment.id,
      unitName: apartment.unitName,
      unitNumber: apartment.unitNumber,
      description: apartment.description,
      features: apartment.features || [],
      projectId: apartment.projectId,
      projectName: apartment.project?.name || '',
      projectLocation: apartment.project?.location || '',
      projectDeveloper: apartment.project?.developer || null,
      price,
      area,
      bedrooms: apartment.bedrooms,
      bathrooms: apartment.bathrooms,
      floor: apartment.floor,
      status: apartment.status,
      createdAt: new Date(apartment.createdAt).getTime(),
      images: apartment.images || [],
    };
  }
}
