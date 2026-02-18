import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { MeiliSearch, Index, SearchResponse, SearchParams } from 'meilisearch';

export interface MeilisearchApartment {
  id: string;
  unitName: string;
  unitNumber: string;
  description: string | null;
  features: string[];
  projectId: string;
  projectName: string;
  projectLocation: string;
  projectDeveloper: string | null;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  floor: number | null;
  status: string;
  createdAt: number;
  images: string[];
}

@Injectable()
export class MeilisearchService implements OnModuleInit {
  private readonly logger = new Logger(MeilisearchService.name);
  private client: MeiliSearch;
  private apartmentsIndex: Index<MeilisearchApartment>;
  private isHealthy = false;

  async onModuleInit() {
    await this.initializeClient();
  }

  private async initializeClient() {
    const host = process.env.MEILISEARCH_URL || 'http://localhost:7700';
    const apiKey = process.env.MEILISEARCH_MASTER_KEY;

    if (!apiKey) {
      this.logger.warn('MEILISEARCH_MASTER_KEY not set, Meilisearch disabled');
      return;
    }

    try {
      this.client = new MeiliSearch({ host, apiKey });

      // Verify connection
      await this.client.health();
      this.isHealthy = true;
      this.logger.log('Connected to Meilisearch');

      // Initialize index with settings
      await this.initializeIndex();
    } catch (error) {
      this.logger.error('Failed to connect to Meilisearch', error);
      this.isHealthy = false;
    }
  }

  private async initializeIndex() {
    const indexName = 'apartments';

    // Create index if it doesn't exist
    try {
      await this.client.createIndex(indexName, { primaryKey: 'id' });
      this.logger.log('Created apartments index');
    } catch {
      // Index may already exist, continue
    }

    this.apartmentsIndex = this.client.index<MeilisearchApartment>(indexName);

    // Configure index settings
    await this.apartmentsIndex.updateSettings({
      searchableAttributes: [
        'unitName',
        'unitNumber',
        'description',
        'features',
        'projectName',
        'projectLocation',
        'projectDeveloper',
      ],
      filterableAttributes: [
        'projectId',
        'bedrooms',
        'bathrooms',
        'price',
        'area',
        'floor',
        'status',
      ],
      sortableAttributes: ['price', 'area', 'bedrooms', 'createdAt'],
      rankingRules: [
        'words',
        'typo',
        'proximity',
        'attribute',
        'sort',
        'exactness',
      ],
      typoTolerance: {
        enabled: true,
        minWordSizeForTypos: { oneTypo: 4, twoTypos: 8 },
      },
    });

    this.logger.log('Meilisearch apartments index configured');
  }

  isAvailable(): boolean {
    return this.isHealthy;
  }

  async indexApartment(apartment: MeilisearchApartment): Promise<void> {
    if (!this.isHealthy) {
      this.logger.warn('Meilisearch unavailable, skipping index operation');
      return;
    }

    try {
      await this.apartmentsIndex.addDocuments([apartment]);
    } catch (error) {
      this.logger.error(`Failed to index apartment ${apartment.id}`, error);
    }
  }

  async indexApartments(apartments: MeilisearchApartment[]): Promise<void> {
    if (!this.isHealthy || apartments.length === 0) return;

    try {
      await this.apartmentsIndex.addDocuments(apartments);
      this.logger.log(`Indexed ${apartments.length} apartments`);
    } catch (error) {
      this.logger.error('Failed to bulk index apartments', error);
    }
  }

  async deleteApartment(id: string): Promise<void> {
    if (!this.isHealthy) return;

    try {
      await this.apartmentsIndex.deleteDocument(id);
    } catch (error) {
      this.logger.error(`Failed to delete apartment ${id} from index`, error);
    }
  }

  async search(
    query: string,
    options: {
      filter?: string[];
      sort?: string[];
      limit?: number;
      offset?: number;
    } = {},
  ): Promise<SearchResponse<MeilisearchApartment>> {
    const searchParams: SearchParams = {
      limit: options.limit || 10,
      offset: options.offset || 0,
    };

    if (options.filter && options.filter.length > 0) {
      searchParams.filter = options.filter;
    }

    if (options.sort && options.sort.length > 0) {
      searchParams.sort = options.sort;
    }

    return this.apartmentsIndex.search(query, searchParams);
  }

  async clearIndex(): Promise<void> {
    if (!this.isHealthy) return;
    await this.apartmentsIndex.deleteAllDocuments();
  }

  async getStats() {
    if (!this.isHealthy) return null;
    return this.apartmentsIndex.getStats();
  }
}
