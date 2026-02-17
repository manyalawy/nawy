import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [AuthModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
