import { Controller, Post, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApartmentsSyncService } from './apartments-sync.service';
import { MeilisearchService } from '../../meilisearch';

@Controller('admin/search')
export class ApartmentsAdminController {
  constructor(
    private readonly syncService: ApartmentsSyncService,
    private readonly meilisearchService: MeilisearchService,
  ) {}

  @Post('reindex')
  @HttpCode(HttpStatus.OK)
  async reindex() {
    const result = await this.syncService.fullReindex();
    return {
      success: true,
      data: result,
    };
  }

  @Get('stats')
  async getStats() {
    const stats = await this.meilisearchService.getStats();
    return {
      success: true,
      data: {
        available: this.meilisearchService.isAvailable(),
        stats,
      },
    };
  }

  @Get('health')
  async health() {
    return {
      success: true,
      data: {
        meilisearch: this.meilisearchService.isAvailable(),
      },
    };
  }
}
