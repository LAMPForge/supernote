import { Injectable, Logger } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';
import { KyselyDB } from '../types/kysely.types';
import { FileMigrationProvider, Migrator } from 'kysely';
import * as path from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class MigrationService {
  private readonly logger = new Logger(`::DATABASE:: ${MigrationService.name}`);

  constructor(@InjectKysely() private readonly db: KyselyDB) {}

  async migrateToLatest(): Promise<void> {
    const migrator = new Migrator({
      db: this.db,
      provider: new FileMigrationProvider({
        fs,
        path,
        migrationFolder: path.resolve(__dirname, '..', 'migrations'),
      }),
    });

    const { error, results } = await migrator.migrateToLatest();

    if (results && results.length === 0) {
      this.logger.log('No migrations to run');
      return;
    }

    results?.forEach((result) => {
      if (result.status === 'Success') {
        this.logger.log(`Migration ${result.migrationName} ran successfully`);
      } else if (result.status === 'Error') {
        this.logger.error(
          `Failed to execute migration "${result.migrationName}"`,
        );
      }
    });

    if (error) {
      this.logger.error('Failed to run database migration. Exiting program.');
      this.logger.error(error);
      process.exit(1);
    }
  }
}
