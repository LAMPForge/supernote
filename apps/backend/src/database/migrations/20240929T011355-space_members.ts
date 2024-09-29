import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('space_members')
    .addColumn('id', 'uuid', (column) =>
      column.primaryKey().defaultTo(sql`gen_uuid_v7()`),
    )
    .addColumn('user_id', 'uuid', (column) =>
      column.references('users.id').onDelete('cascade'),
    )
    .addColumn('group_id', 'uuid', (column) =>
      column.references('groups.id').onDelete('cascade'),
    )
    .addColumn('space_id', 'uuid', (column) =>
      column.references('spaces.id').onDelete('cascade').notNull(),
    )
    .addColumn('role', 'varchar', (column) => column.notNull())
    .addColumn('added_by_id', 'uuid', (column) => column.references('users.id'))
    .addColumn('created_at', 'timestamptz', (column) =>
      column.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', 'timestamptz', (column) =>
      column.notNull().defaultTo(sql`now()`),
    )
    .addColumn('deleted_at', 'timestamptz', (column) => column)
    .addUniqueConstraint('space_members_space_id_user_id_unique', [
      'space_id',
      'user_id',
    ])
    .addUniqueConstraint('space_members_space_id_group_id_unique', [
      'space_id',
      'group_id',
    ])
    .addCheckConstraint(
      'allow_either_user_id_or_group_id_check',
      sql`(("user_id" IS NOT NULL AND "group_id" IS NULL) OR ("user_id" IS NULL AND "group_id" IS NOT NULL))`,
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('space_members').execute()
}
