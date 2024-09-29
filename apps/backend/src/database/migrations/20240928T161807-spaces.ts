import { Kysely, sql } from 'kysely';
import { SpaceRole, SpaceVisibility } from '../../common/helpers/types/permission';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('spaces')
    .addColumn('id', 'uuid', (column) =>
      column.primaryKey().defaultTo(sql`gen_uuid_v7()`),
    )
    .addColumn('name', 'varchar', (column) => column)
    .addColumn('description', 'text', (column) => column)
    .addColumn('slug', 'varchar', (column) => column.notNull())
    .addColumn('logo', 'varchar', (column) => column)
    .addColumn('visibility', 'varchar', (column) =>
      column.defaultTo(SpaceVisibility.PRIVATE).notNull(),
    )
    .addColumn('default_role', 'varchar', (column) =>
      column.defaultTo(SpaceRole.WRITER).notNull(),
    )
    .addColumn('creator_id', 'uuid', (column) => column.references('users.id'))
    .addColumn('workspace_id', 'uuid', (column) =>
      column.references('workspaces.id').onDelete('cascade').notNull(),
    )
    .addColumn('created_at', 'timestamptz', (column) =>
      column.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', 'timestamptz', (column) =>
      column.notNull().defaultTo(sql`now()`),
    )
    .addColumn('deleted_at', 'timestamptz', (column) => column)
    .addUniqueConstraint('spaces_slug_workspace_id_unique', [
      'slug',
      'workspace_id',
    ])
    .execute();

  await db.schema.alterTable('workspaces').addColumn('default_space_id', 'uuid', (column) =>
    column.references('spaces.id').onDelete('set null')
  ).execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('spaces').execute();
  await db.schema.alterTable('workspaces')
    .dropColumn('default_space_id').execute();
}
