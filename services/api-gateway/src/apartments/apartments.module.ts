import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ApartmentsController } from './apartments.controller';

@Module({
  imports: [HttpModule],
  controllers: [ApartmentsController],
})
export class ApartmentsModule {}
