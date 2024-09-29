import { Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';
import { KyselyDB, KyselyTransaction } from '@supernote/database/types/kysely.types';
import { GroupRepository } from '@supernote/database/repositories/group/group.repository';
import { SpaceRepository } from '@supernote/database/repositories/space/space.repository';
import { dbOrTrx } from '@supernote/database/utils';
import { InsertableSpaceMember } from '@supernote/database/types/entity.types';
import { PaginationOptions } from '@supernote/database/pagination/pagination-options';
import { executeWithPagination } from '@supernote/database/pagination/pagination';
import { UserSpaceRole } from '@supernote/database/repositories/space/types';

@Injectable()
export class SpaceMemberRepository {
  constructor(
    @InjectKysely() private readonly db: KyselyDB,
    private readonly groupRepository: GroupRepository,
    private readonly spaceRepository: SpaceRepository,
  ) {}

  async insertSpaceMember(
    insertableSpaceMember: InsertableSpaceMember,
    trx?: KyselyTransaction,
  ): Promise<void> {
    const db = dbOrTrx(this.db, trx);
    await db
      .insertInto('spaceMembers')
      .values(insertableSpaceMember)
      .returningAll()
      .execute();
  }

  async getUserSpaceIds(userId: string): Promise<string[]> {
    const membership = await this.db
      .selectFrom('spaceMembers')
      .innerJoin('spaces', 'spaces.id', 'spaceMembers.spaceId')
      .select(['spaces.id'])
      .where('userId', '=', userId)
      .union(
        this.db
          .selectFrom('spaceMembers')
          .innerJoin('groupUsers', 'groupUsers.groupId', 'spaceMembers.groupId')
          .innerJoin('spaces', 'spaces.id', 'spaceMembers.spaceId')
          .select(['spaces.id'])
          .where('groupUsers.userId', '=', userId),
      )
      .execute();

    return membership.map((space) => space.id);
  }

  async getUserSpaces(userId: string, pagination: PaginationOptions) {
    const userSpaceIds = await this.getUserSpaceIds(userId);

    let query = this.db
      .selectFrom('spaces')
      .selectAll('spaces')
      .select((eb) => [this.spaceRepository.withMemberCount(eb)])
      .where('id', 'in', userSpaceIds)
      .orderBy('createdAt', 'asc');

    if (pagination.query) {
      query = query.where((eb) =>
        eb('name', 'ilike', `%${pagination.query}%`).or(
          'description',
          'ilike',
          `%${pagination.query}%`,
        ),
      );
    }

    return executeWithPagination(query, {
      page: pagination.page,
      perPage: pagination.limit,
    });
  }

  async getUserSpaceRoles(
    userId: string,
    spaceId: string,
  ): Promise<UserSpaceRole[]> {
    const roles = await this.db
      .selectFrom('spaceMembers')
      .select(['userId', 'role'])
      .where('userId', '=', userId)
      .where('spaceId', '=', spaceId)
      .unionAll(
        this.db
          .selectFrom('spaceMembers')
          .innerJoin('groupUsers', 'groupUsers.groupId', 'spaceMembers.groupId')
          .select(['groupUsers.userId', 'spaceMembers.role'])
          .where('groupUsers.userId', '=', userId)
          .where('spaceMembers.spaceId', '=', spaceId),
      )
      .execute();

    if (!roles || roles.length === 0) {
      return undefined;
    }
    return roles;
  }
}
