import { Module } from '@nestjs/common';
import { ApartmentsModule } from './modules/apartments/apartments.module';
import { MeilisearchModule } from './meilisearch';
import { PrismaService } from './prisma.service';

@Module({
  imports: [MeilisearchModule, ApartmentsModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
