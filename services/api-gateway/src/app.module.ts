import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ApartmentsModule } from './apartments/apartments.module';
import { HealthController } from './common/health.controller';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        { name: 'strict', ttl: 60000, limit: 5 },
      ],
      storage: new ThrottlerStorageRedisService(process.env.REDIS_URL),
    }),
    AuthModule,
    UsersModule,
    ApartmentsModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
