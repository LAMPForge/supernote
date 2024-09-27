import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('users')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_uuid_v7()`),
    )
    .addColumn('name', 'varchar', (col) => col)
    .addColumn('email', 'varchar', (col) => col.notNull())
    .addColumn('password', 'varchar', (col) => col)
    .addColumn('avatar', 'varchar', (col) => col)
    .addColumn('role', 'varchar', (col) => col)
    .addColumn('workspace_id', 'uuid', (col) =>
      col.references('workspaces.id').onDelete('cascade'),
    )
    .addColumn('locale', 'varchar', (col) => col)
    .addColumn('timezone', 'varchar', (col) => col)
    .addColumn('settings', 'jsonb', (col) => col)
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('deleted_at', 'timestamptz', (col) => col)
    .addUniqueConstraint('users_email_workspace_id_unique', [
      'email',
      'workspace_id',
    ])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('users').execute();
}
