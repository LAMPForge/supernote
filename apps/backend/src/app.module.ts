import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { EnvironmentModule } from './integrations/environment/environment.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [CoreModule, DatabaseModule, EnvironmentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
