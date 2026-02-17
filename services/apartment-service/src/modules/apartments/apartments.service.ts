import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import {
  FilterApartmentsDto,
  CreateApartmentDto,
  CreateProjectDto,
} from './dto';

@Injectable()
export class ApartmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: FilterApartmentsDto) {
    const { search, projectId, bedrooms, minPrice, maxPrice, status, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.ApartmentWhereInput = {};

    if (search) {
      where.OR = [
        { unitName: { contains: search, mode: 'insensitive' } },
        { unitNumber: { contains: search, mode: 'insensitive' } },
        { project: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (projectId) {
      where.projectId = projectId;
    }

    if (bedrooms !== undefined) {
      where.bedrooms = bedrooms;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        where.price.lte = maxPrice;
      }
    }

    if (status) {
      where.status = status;
    }

    const [apartments, total] = await Promise.all([
      this.prisma.apartment.findMany({
        where,
        skip,
        take: limit,
        include: {
          project: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
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
    };
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

    return {
      success: true,
      data: {
        ...apartment,
        price: Number(apartment.price),
        area: Number(apartment.area),
      },
    };
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
}
