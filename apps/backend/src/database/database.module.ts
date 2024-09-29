import {
  Global,
  Logger,
  Module,
  OnApplicationBootstrap,
  OnModuleDestroy,
} from '@nestjs/common';
import { InjectKysely, KyselyModule } from 'nestjs-kysely';
import { EnvironmentService } from '../integrations/environment/environment.service';
import { CamelCasePlugin, LogEvent, PostgresDialect, sql } from 'kysely';
import { Pool } from 'pg';
import { KyselyDB } from '@supernote/database/types/kysely.types';
import { MigrationService } from '@supernote/database/services/migration.service';
import { UserRepository } from '@supernote/database/repositories/user/user.repository';
import { WorkspaceRepository } from '@supernote/database/repositories/workspace/workspace.repository';
import { SpaceRepository } from '@supernote/database/repositories/space/space.repository';
import { SpaceMemberRepository } from '@supernote/database/repositories/space/space-member.repository';
import { GroupRepository } from '@supernote/database/repositories/group/group.repository';
import { GroupUserRepository } from '@supernote/database/repositories/group/group-user.repository';
import { PageRepository } from '@supernote/database/repositories/page/page.repository';

@Global()
@Module({
  imports: [
    KyselyModule.forRootAsync({
      imports: [],
      inject: [EnvironmentService],
      useFactory: (environmentService: EnvironmentService) => ({
        dialect: new PostgresDialect({
          pool: new Pool({
            connectionString: environmentService.getDatabaseUrl(),
          }).on('error', (err) => {
            console.error('Unexpected error on idle client', err);
          }),
        }),
        plugins: [new CamelCasePlugin()],
        log: (event: LogEvent) => {
          if (environmentService.getNodeEnv() !== 'DEVELOPMENT') {
            return;
          }
          if (event.level === 'query') {
            console.log(event.query);
          }
        },
      }),
    }),
  ],
  providers: [
    MigrationService,
    UserRepository,
    WorkspaceRepository,
    SpaceRepository,
    SpaceMemberRepository,
    GroupRepository,
    GroupUserRepository,
    PageRepository,
  ],
  exports: [
    UserRepository,
    WorkspaceRepository,
    SpaceRepository,
    SpaceMemberRepository,
    GroupRepository,
    GroupUserRepository,
    PageRepository,
  ],
})
export class DatabaseModule implements OnModuleDestroy, OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseModule.name);

  constructor(
    @InjectKysely() private readonly db: KyselyDB,
    private readonly migrationService: MigrationService,
    private readonly environmentService: EnvironmentService,
  ) {}

  async onApplicationBootstrap() {
    await this.establishConnection();

    if (this.environmentService.getNodeEnv() === 'production') {
      await this.migrationService.migrateToLatest();
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.db) {
      await this.db.destroy();
    }
  }

  async establishConnection() {
    const retryAttempts = 15;
    const retryDelay = 3000;

    this.logger.log('Establishing database connection');
    for (let i = 0; i < retryAttempts; i++) {
      try {
        await sql`SELECT 1=1`.execute(this.db);
        this.logger.log('Database connection successful');
        break;
      } catch (err) {
        if (err['errors']) {
          this.logger.error(err['errors'][0]);
        } else {
          this.logger.error(err);
        }

        if (i < retryAttempts - 1) {
          this.logger.log(
            `Retrying [${i + 1}/${retryAttempts}] in ${retryDelay / 1000} seconds`,
          );
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        } else {
          this.logger.error(
            `Failed to connect to database after ${retryAttempts} attempts. Exiting...`,
          );
          process.exit(1);
        }
      }
    }
  }
}
