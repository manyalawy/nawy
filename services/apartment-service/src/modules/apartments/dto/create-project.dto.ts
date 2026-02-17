import { IsString, IsOptional } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  location: string;

  @IsOptional()
  @IsString()
  developer?: string;
}
