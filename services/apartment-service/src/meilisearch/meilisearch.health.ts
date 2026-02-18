import { Injectable } from '@nestjs/common';
import { MeilisearchService } from './meilisearch.service';

@Injectable()
export class MeilisearchHealthIndicator {
  constructor(private readonly meilisearchService: MeilisearchService) {}

  isHealthy(): boolean {
    return this.meilisearchService.isAvailable();
  }
}
