import { Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';
import { KyselyDB, KyselyTransaction } from '@supernote/database/types/kysely.types';
import { InsertableGroup } from '@supernote/database/types/entity.types';
import { dbOrTrx } from '@supernote/database/utils';
import { DefaultGroup } from '../../../core/group/dto/create-group.dto';

@Injectable()
export class GroupRepository {
  constructor(@InjectKysely() private readonly db: KyselyDB) {}

  async insertGroup(
    insertableGroup: InsertableGroup,
    trx?: KyselyTransaction,
  ) {
    const db = dbOrTrx(this.db, trx);
    return db
      .insertInto('groups')
      .values(insertableGroup)
      .returningAll()
      .executeTakeFirst();
  }

  async createDefaultGroup(
    workspaceId: string,
    opts?: { userId?: string; trx?: KyselyTransaction },
  ) {
    const { userId, trx } = opts || {};
    const insertableGroup: InsertableGroup = {
      name: DefaultGroup.EVERYONE,
      isDefault: true,
      creatorId: userId || null,
      workspaceId: workspaceId,
    };

    return this.insertGroup(insertableGroup, trx);
  }
}
