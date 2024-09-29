import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('groups')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_uuid_v7()`),
    )
    .addColumn('name', 'varchar', (column) => column.notNull())
    .addColumn('description', 'text', (column) => column)
    .addColumn('is_default', 'boolean', (column) => column.notNull())
    .addColumn('workspace_id', 'uuid', (column) =>
      column.references('workspaces.id').onDelete('cascade').notNull(),
    )
    .addColumn('creator_id', 'uuid', (column) => column.references('users.id'))
    .addColumn('created_at', 'timestamptz', (column) =>
      column.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', 'timestamptz', (column) =>
      column.notNull().defaultTo(sql`now()`),
    )
    .addColumn('deleted_at', 'timestamptz', (column) => column)
    .addUniqueConstraint('groups_name_workspace_id_unique', [
      'name',
      'workspace_id',
    ])
    .execute()

  await db.schema
    .createTable('group_users')
        .addColumn('id', 'uuid', (column) =>
      column.primaryKey().defaultTo(sql`gen_uuid_v7()`),
    )
    .addColumn('user_id', 'uuid', (column) =>
      column.references('users.id').onDelete('cascade').notNull(),
    )
    .addColumn('group_id', 'uuid', (column) =>
      column.references('groups.id').onDelete('cascade').notNull(),
    )
    .addColumn('created_at', 'timestamptz', (column) =>
      column.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', 'timestamptz', (column) =>
      column.notNull().defaultTo(sql`now()`),
    )
    .addUniqueConstraint('group_users_group_id_user_id_unique', [
      'group_id',
      'user_id',
    ])
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('group_users').execute();
  await db.schema.dropTable('groups').execute();
}
