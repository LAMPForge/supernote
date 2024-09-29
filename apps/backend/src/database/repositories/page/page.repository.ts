import { Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';
import { KyselyDB } from '@supernote/database/types/kysely.types';
import { SpaceMemberRepository } from '@supernote/database/repositories/space/space-member.repository';
import { Page } from '@supernote/database/types/entity.types';
import { ExpressionBuilder } from 'kysely';
import { DB } from '@supernote/database/types/db';
import { jsonObjectFrom } from 'kysely/helpers/postgres';
import { PaginationOptions } from '@supernote/database/pagination/pagination-options';
import { executeWithPagination } from '@supernote/database/pagination/pagination';

@Injectable()
export class PageRepository {
  constructor(
    @InjectKysely() private readonly db: KyselyDB,
    private spaceMemberRepository: SpaceMemberRepository,
  ) {}

  private baseFields: Array<keyof Page> = [
    'id',
    'slugId',
    'title',
    'icon',
    'coverPhoto',
    'position',
    'parentPageId',
    'creatorId',
    'lastUpdatedById',
    'spaceId',
    'workspaceId',
    'isLocked',
    'createdAt',
    'updatedAt',
    'deletedAt',
  ];

  withSpace(eb: ExpressionBuilder<DB, 'pages'>) {
    return jsonObjectFrom(
      eb
        .selectFrom('spaces')
        .select(['spaces.id', 'spaces.name', 'spaces.slug'])
        .whereRef('spaces.id', '=', 'pages.spaceId'),
    ).as('space');
  }

  async getRecentPagesInSpace(spaceId: string, pagination: PaginationOptions) {
    const query = this.db
      .selectFrom('pages')
      .select(this.baseFields)
      .select((eb) => this.withSpace(eb))
      .where('spaceId', '=', spaceId)
      .orderBy('updatedAt', 'desc');

    return executeWithPagination(query, {
      page: pagination.page,
      perPage: pagination.limit,
    });
  }

  async getRecentPages(userId: string, pagination: PaginationOptions) {
    const userSpaceIds = await this.spaceMemberRepository.getUserSpaceIds(userId);

    const query = this.db
      .selectFrom('pages')
      .select(this.baseFields)
      .select((eb) => this.withSpace(eb))
      .where('spaceId', 'in', userSpaceIds)
      .orderBy('updatedAt', 'desc');

    return executeWithPagination(query, {
      page: pagination.page,
      perPage: pagination.limit,
    });
  }
}
