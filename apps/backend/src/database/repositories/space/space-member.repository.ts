import { Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';
import { KyselyDB, KyselyTransaction } from '@supernote/database/types/kysely.types';
import { GroupRepository } from '@supernote/database/repositories/group/group.repository';
import { SpaceRepository } from '@supernote/database/repositories/space/space.repository';
import { dbOrTrx } from '@supernote/database/utils';
import { InsertableSpaceMember } from '@supernote/database/types/entity.types';

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
}
