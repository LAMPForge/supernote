import { Module } from '@nestjs/common';
import { WorkspaceController } from './controllers/workspace.controller';
import { WorkspaceService } from './services/workspace.service';
import { SpaceModule } from '../space/space.module';
import { TokenModule } from '../auth/token.module';

@Module({
  imports: [SpaceModule, TokenModule],
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
  exports: [WorkspaceService],
})
export class WorkspaceModule {}
