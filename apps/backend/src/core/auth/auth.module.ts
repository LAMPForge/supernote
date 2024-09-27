import { Module } from '@nestjs/common';
import { TokenModule } from './token.module';
import { WorkspaceModule } from '../workspace/workspace.module';
import {AuthController} from "./controllers/auth.controller";
import {AuthService} from "./services/auth.service";
import {JwtStrategy} from "./strategies/jwt.strategy";

@Module({
  imports: [TokenModule, WorkspaceModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
