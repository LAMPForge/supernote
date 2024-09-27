import { Injectable } from '@nestjs/common';
import {
  KyselyDB,
  KyselyTransaction,
} from '@supernote/database/types/kysely.types';
import { InjectKysely } from 'nestjs-kysely';
import { Workspace } from '@supernote/database/types/entity.types';
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
}
