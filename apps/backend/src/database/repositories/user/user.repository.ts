import { Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';
import {
  KyselyDB,
  KyselyTransaction,
} from '@supernote/database/types/kysely.types';
import { InsertableUser, User } from '@supernote/database/types/entity.types';
import { dbOrTrx } from '@supernote/database/utils';
import { Users } from '@supernote/database/types/db';
import { sql } from 'kysely';
import { hashPassword } from '../../../common/helpers';

@Injectable()
export class UserRepository {
  constructor(@InjectKysely() private readonly db: KyselyDB) {}

  public baseFields: Array<keyof Users> = [
    'id',
    'email',
    'name',
    'avatar',
    'role',
    'workspaceId',
    'locale',
    'timezone',
    'settings',
    'createdAt',
    'updatedAt',
    'deletedAt',
  ];

  async findById(
    userId: string,
    workspaceId: string,
    options?: {
      includePassword?: boolean;
      transaction?: KyselyTransaction;
    },
  ): Promise<User> {
    const db = dbOrTrx(this.db, options?.transaction);
    return db
      .selectFrom('users')
      .select(this.baseFields)
      .$if(options?.includePassword, (qb) => qb.select('password'))
      .where('id', '=', userId)
      .where('workspaceId', '=', workspaceId)
      .executeTakeFirst();
  }

  async findByEmail(
    email: string,
    workspaceId: string,
    includePassword?: boolean,
  ): Promise<User> {
    return this.db
      .selectFrom('users')
      .select(this.baseFields)
      .$if(includePassword, (qb) => qb.select('password'))
      .where(sql`LOWER(email)`, '=', sql`LOWER(${email})`)
      .where('workspaceId', '=', workspaceId)
      .executeTakeFirst();
  }

  async insertUser(
    insertableUser: InsertableUser,
    trx?: KyselyTransaction,
  ): Promise<User> {
    const user: InsertableUser = {
      name: insertableUser.name || insertableUser.email.toLowerCase(),
      email: insertableUser.email.toLowerCase(),
      password: await hashPassword(insertableUser.password),
      locale: 'vi-VN',
      role: insertableUser?.role,
    }

    const db = dbOrTrx(this.db, trx);
    return db
      .insertInto('users')
      .values(user)
      .returningAll()
      .executeTakeFirst();
  }
}
