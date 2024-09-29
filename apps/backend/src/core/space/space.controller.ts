import { Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SpaceService } from './services/space.service';
import { AuthUser } from '../../common/decorators/auth-user.decorator';
import { User } from '@supernote/database/types/entity.types';
import { AuthWorkspace } from '../../common/decorators/auth-workspace.decorator';

@UseGuards(JwtAuthGuard)
@Controller('spaces')
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  @HttpCode(HttpStatus.OK)
  @Post('me')
  async getSpaceProfile(
    @AuthUser() user: User,
    @AuthWorkspace() workspace: string,
  ): Promise<{ user: User; workspace: string }> {
    return {
      user: user,
      workspace: workspace,
    }
  }
}