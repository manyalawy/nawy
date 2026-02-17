import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  Min,
  IsUUID,
} from 'class-validator';

export class CreateApartmentDto {
  @IsString()
  unitName: string;

  @IsString()
  unitNumber: string;

  @IsUUID()
  projectId: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  area: number;

  @IsNumber()
  @Min(0)
  bedrooms: number;

  @IsNumber()
  @Min(0)
  bathrooms: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  floor?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
