import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApartmentsService } from './apartments.service';
import {
  FilterApartmentsDto,
  CreateApartmentDto,
  CreateProjectDto,
} from './dto';

@Controller()
export class ApartmentsController {
  constructor(private readonly apartmentsService: ApartmentsService) {}

  @Get('apartments')
  async findAll(@Query() filters: FilterApartmentsDto) {
    return this.apartmentsService.findAll(filters);
  }

  @Get('apartments/:id')
  async findOne(@Param('id') id: string) {
    return this.apartmentsService.findOne(id);
  }

  @Post('apartments')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateApartmentDto) {
    return this.apartmentsService.create(dto);
  }

  @Put('apartments/:id')
  async update(@Param('id') id: string, @Body() dto: Partial<CreateApartmentDto>) {
    return this.apartmentsService.update(id, dto);
  }

  @Delete('apartments/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string) {
    return this.apartmentsService.delete(id);
  }

  @Get('projects')
  async findAllProjects() {
    return this.apartmentsService.findAllProjects();
  }

  @Post('projects')
  @HttpCode(HttpStatus.CREATED)
  async createProject(@Body() dto: CreateProjectDto) {
    return this.apartmentsService.createProject(dto);
  }

  @Put('projects/:id')
  async updateProject(@Param('id') id: string, @Body() dto: Partial<CreateProjectDto>) {
    return this.apartmentsService.updateProject(id, dto);
  }
}
