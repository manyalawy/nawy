import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { ApartmentsSearchService } from './apartments-search.service';
import { ApartmentsSyncService } from './apartments-sync.service';
import {
  FilterApartmentsDto,
  CreateApartmentDto,
  CreateProjectDto,
} from './dto';

@Injectable()
export class ApartmentsService {
  private readonly logger = new Logger(ApartmentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly searchService: ApartmentsSearchService,
    private readonly syncService: ApartmentsSyncService,
  ) {}

  async findAll(filters: FilterApartmentsDto) {
    // Delegate to search service (handles Meilisearch/Prisma routing)
    return this.searchService.search(filters);
  }

  async findOne(id: string) {
    const apartment = await this.prisma.apartment.findUnique({
      where: { id },
      include: {
        project: true,
      },
    });

    if (!apartment) {
      throw new NotFoundException(`Apartment with ID ${id} not found`);
    }

    return {
      success: true,
      data: {
        ...apartment,
        price: Number(apartment.price),
        area: Number(apartment.area),
      },
    };
  }

  async create(dto: CreateApartmentDto) {
    const project = await this.prisma.project.findUnique({
      where: { id: dto.projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${dto.projectId} not found`);
    }

    const apartment = await this.prisma.apartment.create({
      data: {
        unitName: dto.unitName,
        unitNumber: dto.unitNumber,
        projectId: dto.projectId,
        price: dto.price,
        area: dto.area,
        bedrooms: dto.bedrooms,
        bathrooms: dto.bathrooms,
        floor: dto.floor,
        description: dto.description,
        features: dto.features || [],
        images: dto.images || [],
      },
      include: {
        project: true,
      },
    });

    // Sync to Meilisearch (non-blocking)
    this.syncService
      .syncSingleApartment(apartment.id)
      .catch((err) => this.logger.error(`Failed to sync apartment ${apartment.id}`, err));

    return {
      success: true,
      data: {
        ...apartment,
        price: Number(apartment.price),
        area: Number(apartment.area),
      },
    };
  }

  async update(id: string, dto: Partial<CreateApartmentDto>) {
    const existing = await this.prisma.apartment.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Apartment with ID ${id} not found`);
    }

    const apartment = await this.prisma.apartment.update({
      where: { id },
      data: dto,
      include: { project: true },
    });

    // Sync to Meilisearch (non-blocking)
    this.syncService
      .syncSingleApartment(apartment.id)
      .catch((err) => this.logger.error(`Failed to sync apartment ${apartment.id}`, err));

    return {
      success: true,
      data: {
        ...apartment,
        price: Number(apartment.price),
        area: Number(apartment.area),
      },
    };
  }

  async delete(id: string) {
    const existing = await this.prisma.apartment.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Apartment with ID ${id} not found`);
    }

    await this.prisma.apartment.delete({ where: { id } });

    // Remove from Meilisearch (non-blocking)
    this.syncService
      .removeFromIndex(id)
      .catch((err) => this.logger.error(`Failed to remove apartment ${id} from index`, err));

    return { success: true };
  }

  async findAllProjects() {
    const projects = await this.prisma.project.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return {
      success: true,
      data: projects,
    };
  }

  async createProject(dto: CreateProjectDto) {
    const project = await this.prisma.project.create({
      data: dto,
    });

    return {
      success: true,
      data: project,
    };
  }

  async updateProject(id: string, dto: Partial<CreateProjectDto>) {
    const existing = await this.prisma.project.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    const project = await this.prisma.project.update({
      where: { id },
      data: dto,
    });

    // Reindex all apartments in this project (project data is denormalized in search)
    this.syncService
      .syncProjectApartments(id)
      .catch((err) => this.logger.error(`Failed to sync project ${id} apartments`, err));

    return {
      success: true,
      data: project,
    };
  }
}
