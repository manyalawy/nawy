import {
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  IsArray,
  IsUUID,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ApartmentStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  SOLD = 'SOLD',
}

export class FilterApartmentsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bedrooms?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  @ApiPropertyOptional({ enum: ApartmentStatus })
  @IsOptional()
  @IsEnum(ApartmentStatus)
  status?: ApartmentStatus;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}

export class CreateApartmentDto {
  @ApiProperty({ example: 'Skyline Suite A' })
  @IsString()
  unitName: string;

  @ApiProperty({ example: 'TG-1501' })
  @IsString()
  unitNumber: string;

  @ApiProperty({ example: 'uuid-of-project' })
  @IsUUID()
  projectId: string;

  @ApiProperty({ example: 4500000 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 180 })
  @IsNumber()
  @Min(0)
  area: number;

  @ApiProperty({ example: 3 })
  @IsNumber()
  @Min(0)
  bedrooms: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(0)
  bathrooms: number;

  @ApiPropertyOptional({ example: 15 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  floor?: number;

  @ApiPropertyOptional({ example: 'Luxurious apartment with city views' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: ['Balcony', 'Gym Access'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @ApiPropertyOptional({ example: ['https://example.com/image1.jpg'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}

export class CreateProjectDto {
  @ApiProperty({ example: 'The Gate Residence' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Luxury high-rise apartments in New Cairo' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'New Cairo, Egypt' })
  @IsString()
  location: string;

  @ApiPropertyOptional({ example: 'Palm Hills Developments' })
  @IsOptional()
  @IsString()
  developer?: string;
}
