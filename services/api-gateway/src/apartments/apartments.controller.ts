import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { FilterApartmentsDto, CreateApartmentDto, CreateProjectDto } from './dto';

@ApiTags('Apartments')
@Controller()
export class ApartmentsController {
  private readonly apartmentServiceUrl: string;

  constructor(private readonly httpService: HttpService) {
    this.apartmentServiceUrl = process.env.APARTMENT_SERVICE_URL || 'http://localhost:3003';
  }

  @Get('apartments')
  @Public()
  @ApiOperation({ summary: 'List all apartments with filters' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'projectId', required: false })
  @ApiQuery({ name: 'bedrooms', required: false, type: Number })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(@Query() filters: FilterApartmentsDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.apartmentServiceUrl}/apartments`, {
          params: filters,
        }),
      );
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: unknown } };
      throw new HttpException(
        err.response?.data || 'Failed to fetch apartments',
        err.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('apartments/:id')
  @Public()
  @ApiOperation({ summary: 'Get apartment details by ID' })
  async findOne(@Param('id') id: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.apartmentServiceUrl}/apartments/${id}`),
      );
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: unknown } };
      throw new HttpException(
        err.response?.data || 'Apartment not found',
        err.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('apartments')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new apartment (Admin only)' })
  async create(@Body() dto: CreateApartmentDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.apartmentServiceUrl}/apartments`, dto),
      );
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: unknown } };
      throw new HttpException(
        err.response?.data || 'Failed to create apartment',
        err.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('apartments/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an apartment (Admin only)' })
  async update(@Param('id') id: string, @Body() dto: Partial<CreateApartmentDto>) {
    try {
      const response = await firstValueFrom(
        this.httpService.put(`${this.apartmentServiceUrl}/apartments/${id}`, dto),
      );
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: unknown } };
      throw new HttpException(
        err.response?.data || 'Failed to update apartment',
        err.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('apartments/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete an apartment (Admin only)' })
  async delete(@Param('id') id: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${this.apartmentServiceUrl}/apartments/${id}`),
      );
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: unknown } };
      throw new HttpException(
        err.response?.data || 'Failed to delete apartment',
        err.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('projects')
  @Public()
  @ApiOperation({ summary: 'List all projects' })
  async findAllProjects() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.apartmentServiceUrl}/projects`),
      );
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: unknown } };
      throw new HttpException(
        err.response?.data || 'Failed to fetch projects',
        err.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('projects')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new project (Admin only)' })
  async createProject(@Body() dto: CreateProjectDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.apartmentServiceUrl}/projects`, dto),
      );
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: unknown } };
      throw new HttpException(
        err.response?.data || 'Failed to create project',
        err.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('projects/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a project (Admin only)' })
  async updateProject(@Param('id') id: string, @Body() dto: Partial<CreateProjectDto>) {
    try {
      const response = await firstValueFrom(
        this.httpService.put(`${this.apartmentServiceUrl}/projects/${id}`, dto),
      );
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: unknown } };
      throw new HttpException(
        err.response?.data || 'Failed to update project',
        err.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('admin/search/reindex')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Trigger full search reindex (Admin only)' })
  async reindex() {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.apartmentServiceUrl}/admin/search/reindex`),
      );
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: unknown } };
      throw new HttpException(
        err.response?.data || 'Failed to trigger reindex',
        err.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('admin/search/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get search index statistics (Admin only)' })
  async getSearchStats() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.apartmentServiceUrl}/admin/search/stats`),
      );
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: unknown } };
      throw new HttpException(
        err.response?.data || 'Failed to get search stats',
        err.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('admin/search/health')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check search engine health (Admin only)' })
  async getSearchHealth() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.apartmentServiceUrl}/admin/search/health`),
      );
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: unknown } };
      throw new HttpException(
        err.response?.data || 'Failed to get search health',
        err.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
