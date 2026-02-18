import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { MeilisearchService } from '../../meilisearch';
import { PrismaService } from '../../prisma.service';
import { ApartmentsSearchService } from './apartments-search.service';

@Injectable()
export class ApartmentsSyncService implements OnModuleInit {
  private readonly logger = new Logger(ApartmentsSyncService.name);
  private readonly BATCH_SIZE = 500;

  constructor(
    private readonly meilisearchService: MeilisearchService,
    private readonly prisma: PrismaService,
    private readonly searchService: ApartmentsSearchService,
  ) {}

  async onModuleInit() {
    // Perform initial sync on startup if Meilisearch is available
    if (this.meilisearchService.isAvailable()) {
      await this.performInitialSyncIfNeeded();
    }
  }

  private async performInitialSyncIfNeeded() {
    const stats = await this.meilisearchService.getStats();

    if (!stats || stats.numberOfDocuments === 0) {
      this.logger.log('Meilisearch index empty, performing full sync...');
      await this.fullReindex();
    } else {
      this.logger.log(
        `Meilisearch index has ${stats.numberOfDocuments} documents`,
      );
    }
  }

  async fullReindex(): Promise<{ indexed: number; duration: number }> {
    const startTime = Date.now();
    let totalIndexed = 0;
    let page = 0;

    // Clear existing index
    await this.meilisearchService.clearIndex();

    while (true) {
      const apartments = await this.prisma.apartment.findMany({
        skip: page * this.BATCH_SIZE,
        take: this.BATCH_SIZE,
        include: { project: true },
        orderBy: { createdAt: 'asc' },
      });

      if (apartments.length === 0) break;

      const documents = apartments.map((apt) =>
        this.searchService.transformToSearchDocument({
          ...apt,
          price: Number(apt.price),
          area: Number(apt.area),
        }),
      );

      await this.meilisearchService.indexApartments(documents);
      totalIndexed += documents.length;
      page++;

      this.logger.log(`Indexed batch ${page}, total: ${totalIndexed}`);
    }

    const duration = Date.now() - startTime;
    this.logger.log(
      `Full reindex complete: ${totalIndexed} documents in ${duration}ms`,
    );

    return { indexed: totalIndexed, duration };
  }

  async syncSingleApartment(apartmentId: string): Promise<void> {
    const apartment = await this.prisma.apartment.findUnique({
      where: { id: apartmentId },
      include: { project: true },
    });

    if (apartment) {
      const document = this.searchService.transformToSearchDocument({
        ...apartment,
        price: Number(apartment.price),
        area: Number(apartment.area),
      });
      await this.meilisearchService.indexApartment(document);
    }
  }

  async removeFromIndex(apartmentId: string): Promise<void> {
    await this.meilisearchService.deleteApartment(apartmentId);
  }

  async syncProjectApartments(projectId: string): Promise<void> {
    // When project is updated, reindex all its apartments
    const apartments = await this.prisma.apartment.findMany({
      where: { projectId },
      include: { project: true },
    });

    const documents = apartments.map((apt) =>
      this.searchService.transformToSearchDocument({
        ...apt,
        price: Number(apt.price),
        area: Number(apt.area),
      }),
    );

    await this.meilisearchService.indexApartments(documents);
  }
}
