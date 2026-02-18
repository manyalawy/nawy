import { Module, Global } from '@nestjs/common';
import { MeilisearchService } from './meilisearch.service';
import { MeilisearchHealthIndicator } from './meilisearch.health';

@Global()
@Module({
  providers: [MeilisearchService, MeilisearchHealthIndicator],
  exports: [MeilisearchService, MeilisearchHealthIndicator],
})
export class MeilisearchModule {}
