import { Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthUser } from '../../common/decorators/auth-user.decorator';
import { User } from '@supernote/database/types/entity.types';
import { AuthWorkspace } from '../../common/decorators/auth-workspace.decorator';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Post('me')
  async getUserProfile(
    @AuthUser() user: User,
    @AuthWorkspace() workspace: string,
  ): Promise<{ user: User; workspace: string }> {
    return {
      user: user,
      workspace: workspace,
    }
  }
}