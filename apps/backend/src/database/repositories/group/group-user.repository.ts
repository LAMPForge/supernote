import { Injectable } from '@nestjs/common';
import { KyselyDB, KyselyTransaction } from '@supernote/database/types/kysely.types';
import { InjectKysely } from 'nestjs-kysely';
import { UserRepository } from '@supernote/database/repositories/user/user.repository';
import { GroupRepository } from '@supernote/database/repositories/group/group.repository';
import { GroupUser, InsertableGroupUser } from '@supernote/database/types/entity.types';
import { dbOrTrx } from '@supernote/database/utils';

@Injectable()
export class GroupUserRepository {
  constructor(
    @InjectKysely() private readonly db: KyselyDB,
    private readonly userRepository: UserRepository,
    private readonly groupRepository: GroupRepository,
  ) {}

  async insertGroupUser(
    insertableGroupUser: InsertableGroupUser,
    trx?: KyselyTransaction,
  ): Promise<GroupUser> {
    const db = dbOrTrx(this.db, trx);
    return db
      .insertInto('groupUsers')
      .values(insertableGroupUser)
      .returningAll()
      .executeTakeFirst();
  }
}
