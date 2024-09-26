import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {CoreModule} from "./core/core.module";
import {EnvironmentModule} from "./integrations/environment/environment.module";

@Module({
  imports: [
    CoreModule,
    EnvironmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
