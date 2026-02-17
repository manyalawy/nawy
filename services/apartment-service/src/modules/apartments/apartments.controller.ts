import {
  Controller,
  Get,
  Post,
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

  @Get('projects')
  async findAllProjects() {
    return this.apartmentsService.findAllProjects();
  }

  @Post('projects')
  @HttpCode(HttpStatus.CREATED)
  async createProject(@Body() dto: CreateProjectDto) {
    return this.apartmentsService.createProject(dto);
  }
}
