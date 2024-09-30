import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { EnvironmentModule } from './integrations/environment/environment.module';
import { DatabaseModule } from './database/database.module';
import { StaticModule } from './integrations/static/static.module';

@Module({
  imports: [
    CoreModule,
    DatabaseModule,
    EnvironmentModule,
    StaticModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
