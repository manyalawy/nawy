import { Module } from '@nestjs/common';
import { ApartmentsController } from './apartments.controller';
import { ApartmentsAdminController } from './apartments-admin.controller';
import { ApartmentsService } from './apartments.service';
import { ApartmentsSearchService } from './apartments-search.service';
import { ApartmentsSyncService } from './apartments-sync.service';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [ApartmentsController, ApartmentsAdminController],
  providers: [
    ApartmentsService,
    ApartmentsSearchService,
    ApartmentsSyncService,
    PrismaService,
  ],
  exports: [ApartmentsService, ApartmentsSyncService],
})
export class ApartmentsModule {}
