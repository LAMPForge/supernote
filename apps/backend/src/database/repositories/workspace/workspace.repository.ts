import { Injectable } from '@nestjs/common';
import {
  KyselyDB,
  KyselyTransaction,
} from '@supernote/database/types/kysely.types';
import { InjectKysely } from 'nestjs-kysely';
import {
  InsertableWorkspace,
  UpdatableWorkspace,
  Workspace,
} from '@supernote/database/types/entity.types';
import { dbOrTrx } from '@supernote/database/utils';

@Injectable()
export class WorkspaceRepository {
  constructor(@InjectKysely() private readonly db: KyselyDB) {}

  async findById(
    id: string,
    options?: {
      transaction?: KyselyTransaction;
    },
  ): Promise<Workspace> {
    const db = dbOrTrx(this.db, options?.transaction);
    return db
      .selectFrom('workspaces')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
  }

  async findFirst(): Promise<Workspace> {
    return await this.db
      .selectFrom('workspaces')
      .selectAll()
      .orderBy('createdAt', 'asc')
      .executeTakeFirst();
  }

  async insertWorkspace(
    insertableWorkspace: InsertableWorkspace,
    transaction?: KyselyTransaction,
  ): Promise<Workspace> {
    const db = dbOrTrx(this.db, transaction);
    return db
      .insertInto('workspaces')
      .values(insertableWorkspace)
      .returningAll()
      .executeTakeFirst();
  }

  async updateWorkspace(
    id: string,
    updatableWorkspace: UpdatableWorkspace,
    transaction?: KyselyTransaction,
  ) {
    const db = dbOrTrx(this.db, transaction);
    return db
      .updateTable('workspaces')
      .set({ ...updatableWorkspace, updatedAt: new Date() })
      .where('id', '=', id)
      .execute();
  }

  async count(): Promise<number> {
    const { count } = await this.db
      .selectFrom('workspaces')
      .select((eb) => eb.fn.count('id').as('count'))
      .executeTakeFirst();
    return count as number;
  }
}
