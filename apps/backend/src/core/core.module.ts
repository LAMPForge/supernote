import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserModule } from '../user/user.module';
import {AuthModule} from "./auth/auth.module";

@Module({
  imports: [UserModule, AuthModule],
})
export class CoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply()
      .exclude(
        { path: 'auth/setup', method: RequestMethod.POST },
        { path: 'health', method: RequestMethod.GET },
      )
      .forRoutes('*');
  }
}
