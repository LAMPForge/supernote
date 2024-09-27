import { Global, Module } from '@nestjs/common';
import { KyselyModule } from 'nestjs-kysely';
import { EnvironmentService } from '../integrations/environment/environment.service';
import { CamelCasePlugin, LogEvent, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

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
})
export class DatabaseModule {}
