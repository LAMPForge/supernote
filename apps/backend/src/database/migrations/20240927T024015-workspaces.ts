import { Kysely, sql } from 'kysely';
import { UserRole } from '../../common/helpers/types/permission';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('workspaces')
    .addColumn('id', 'uuid', (column) =>
      column.primaryKey().defaultTo(sql`gen_uuid_v7()`),
    )
    .addColumn('name', 'varchar', (column) => column)
    .addColumn('description', 'varchar', (column) => column)
    .addColumn('logo', 'varchar', (column) => column)
    .addColumn('hostname', 'varchar', (column) => column)
    .addColumn('custom_domain', 'varchar', (column) => column)
    .addColumn('settings', 'jsonb', (column) => column)
    .addColumn('default_role', 'varchar', (col) =>
      col.defaultTo(UserRole.MEMBER).notNull(),
    )
    .addColumn('email_domains', sql`varchar[]`, (col) => col.defaultTo('{}'))
    .addColumn('created_at', 'timestamptz', (column) =>
      column.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', 'timestamptz', (column) =>
      column.notNull().defaultTo(sql`now()`),
    )
    .addColumn('deleted_at', 'timestamptz', (column) => column)
    .addUniqueConstraint('workspaces_hostname_unique', ['hostname'])
    .addUniqueConstraint('workspaces_custom_domain_unique', ['custom_domain'])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('workspaces').execute();
}
