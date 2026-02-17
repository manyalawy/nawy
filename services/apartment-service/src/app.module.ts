import { Module } from '@nestjs/common';
import { ApartmentsModule } from './modules/apartments/apartments.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [ApartmentsModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
