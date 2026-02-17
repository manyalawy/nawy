import { Module } from '@nestjs/common';
import { ApartmentsController } from './apartments.controller';
import { ApartmentsService } from './apartments.service';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [ApartmentsController],
  providers: [ApartmentsService, PrismaService],
  exports: [ApartmentsService],
})
export class ApartmentsModule {}
