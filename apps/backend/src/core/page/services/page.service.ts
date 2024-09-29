import { Injectable, NotFoundException } from '@nestjs/common';
import { PageRepository } from '@supernote/database/repositories/page/page.repository';
import { InjectKysely } from 'nestjs-kysely';
import { KyselyDB } from '@supernote/database/types/kysely.types';
import { PaginationOptions } from '@supernote/database/pagination/pagination-options';
import { PaginationResult } from '@supernote/database/pagination/pagination';
import { Page } from '@supernote/database/types/entity.types';
import { CreatePageDto } from '../dto/create-page.dto';
import { generateJitteredKeyBetween } from 'fractional-indexing-jittered';
import { generateSlugId } from '../../../common/helpers/nanoid.utils';

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

  async create(
    userId: string,
    workspaceId: string,
    createPageDto: CreatePageDto,
  ): Promise<Page> {
    let parentPageId = undefined;
    if (createPageDto.parentPageId) {
      const parentPage = await this.pageRepository.findById(
        createPageDto.parentPageId,
      );

      if (!parentPage || parentPage.spaceId !== createPageDto.spaceId) {
        throw new NotFoundException('Parent page not found');
      }

      parentPageId = parentPage.id;
    }

    let pagePosition: string;

    const lastPageQuery = this.db
      .selectFrom('pages')
      .select(['id', 'position'])
      .where('spaceId', '=', createPageDto.spaceId)
      .orderBy('position', 'desc')
      .limit(1);

    if (parentPageId) {
      const lastPage = await lastPageQuery
        .where('parentPageId', '=', parentPageId)
        .executeTakeFirst();

      if (!lastPage) {
        pagePosition = generateJitteredKeyBetween(null, null);
      } else {
        pagePosition = generateJitteredKeyBetween(lastPage.position, null);
      }
    } else {
      const lastPage = await lastPageQuery
        .where('parentPageId', 'is', null)
        .executeTakeFirst();

      if (!lastPage) {
        pagePosition = generateJitteredKeyBetween(null, null);
      } else {
        pagePosition = generateJitteredKeyBetween(lastPage.position, null);
      }
    }

    return await this.pageRepository.insertPage({
      slugId: generateSlugId(),
      title: createPageDto.title,
      position: pagePosition,
      icon: createPageDto.icon,
      parentPageId: parentPageId,
      spaceId: createPageDto.spaceId,
      creatorId: userId,
      workspaceId: workspaceId,
      lastUpdatedById: userId,
    });
  }
}
