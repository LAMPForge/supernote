import { Injectable } from '@nestjs/common';
import { PageRepository } from '@supernote/database/repositories/page/page.repository';
import { InjectKysely } from 'nestjs-kysely';
import { KyselyDB } from '@supernote/database/types/kysely.types';
import { PaginationOptions } from '@supernote/database/pagination/pagination-options';
import { PaginationResult } from '@supernote/database/pagination/pagination';
import { Page } from '@supernote/database/types/entity.types';

@Injectable()
export class PageService {
  constructor(
    private pageRepository: PageRepository,
    @InjectKysely() private readonly db: KyselyDB,
  ) {}

  async getRecentSpacePages(
    spaceId: string,
    pagination: PaginationOptions,
  ): Promise<PaginationResult<Page>> {
    return await this.pageRepository.getRecentPagesInSpace(spaceId, pagination);
  }

  async getRecentPages(
    userId: string,
    pagination: PaginationOptions,
  ): Promise<PaginationResult<Page>> {
    return await this.pageRepository.getRecentPages(userId, pagination);
  }
}
