import { Body, Controller, ForbiddenException, HttpCode, HttpStatus, NotFoundException, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SpaceService } from './services/space.service';
import { AuthUser } from '../../common/decorators/auth-user.decorator';
import { User, Workspace } from '@supernote/database/types/entity.types';
import { AuthWorkspace } from '../../common/decorators/auth-workspace.decorator';
import { SpaceMemberService } from './services/space-member.service';
import { PaginationOptions } from '@supernote/database/pagination/pagination-options';
import { SpaceIdDto } from './dto/space-id.dto';
import SpaceAbilityFactory from '../casl/abilities/space-ability.factory';
import WorkspaceAbilityFactory from '../casl/abilities/workspace-ability.factory';
import { SpaceCaslAction, SpaceCaslSubject } from '../casl/interfaces/space-ability.types';
import { findHighestUserSpaceRole } from '@supernote/database/repositories/space/utils';
import { SpaceMemberRepository } from '@supernote/database/repositories/space/space-member.repository';

@UseGuards(JwtAuthGuard)
@Controller('spaces')
export class SpaceController {
  constructor(
    private readonly spaceService: SpaceService,
    private readonly spaceMemberService: SpaceMemberService,
    private readonly spaceAbility: SpaceAbilityFactory,
    private readonly workspaceAbility: WorkspaceAbilityFactory,
    private readonly spaceMemberRepository: SpaceMemberRepository,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('/')
  async getWorkspaceSpaces(
    @Body() pagination: PaginationOptions,
    @AuthUser() user: User,
  ) {
    return this.spaceMemberService.getUserSpaces(user.id, pagination);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/info')
  async getSpaceInfo(
    @Body() spaceIdDto: SpaceIdDto,
    @AuthUser() user: User,
    @AuthWorkspace() workspace: Workspace,
  ) {
    const space = await this.spaceService.getSpaceInfo(
      spaceIdDto.spaceId,
      workspace.id,
    );

    if (!space) {
      throw new NotFoundException('Space not found');
    }

    const ability = await this.spaceAbility.createForUser(user, space.id);
    if (ability.cannot(SpaceCaslAction.Read, SpaceCaslSubject.Settings)) {
      throw new ForbiddenException();
    }

    const userSpaceRoles = await this.spaceMemberRepository.getUserSpaceRoles(
      user.id,
      space.id,
    );

    const userSpaceRole = findHighestUserSpaceRole(userSpaceRoles);

    const membership = {
      userId: user.id,
      role: userSpaceRole,
      permissions: ability.rules,
    };

    return { ...space, membership };
  }
}