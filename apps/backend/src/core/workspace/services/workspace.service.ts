import { Injectable, NotFoundException } from '@nestjs/common';
import { WorkspaceRepository } from '@supernote/database/repositories/workspace/workspace.repository';
import { GroupRepository } from '@supernote/database/repositories/group/group.repository';
import { GroupUserRepository } from '@supernote/database/repositories/group/group-user.repository';
import { UserRepository } from '@supernote/database/repositories/user/user.repository';
import { User } from '@supernote/database/types/entity.types';
import { CreateWorkspaceDto } from '../dto/create-workspace.dto';
import { KyselyDB, KyselyTransaction } from '@supernote/database/types/kysely.types';
import { executeTrx } from '@supernote/database/utils';
import { InjectKysely } from 'nestjs-kysely';
import { SpaceRole, UserRole } from '../../../common/helpers/types/permission';
import { CreateSpaceDto } from '../../space/dto/create-space.dto';
import { SpaceService } from '../../space/services/space.service';
import { SpaceMemberService } from '../../space/services/space-member.service';

@Injectable()
export class WorkspaceService {
  constructor(
    private workspaceRepository: WorkspaceRepository,
    private groupRepository: GroupRepository,
    private groupUserRepository: GroupUserRepository,
    private userRepository: UserRepository,
    private spaceService: SpaceService,
    private spaceMemberService: SpaceMemberService,
    @InjectKysely() private readonly db: KyselyDB,
  ) {}

  async create(
    user: User,
    createWorkspaceDto: CreateWorkspaceDto,
    trx?: KyselyTransaction,
  ) {
    return await executeTrx(
      this.db,
      async (trx) => {
        const workspace = await this.workspaceRepository.insertWorkspace(
          {
            name: createWorkspaceDto.name,
            hostname: createWorkspaceDto.hostname,
            description: createWorkspaceDto.description,
          },
          trx,
        );

        const group = await this.groupRepository.createDefaultGroup(
          workspace.id,
          {
            userId: user.id,
            trx,
          }
        );

        await trx
          .updateTable('users')
          .set({
            workspaceId: workspace.id,
            role: UserRole.OWNER,
          })
          .execute();

        await this.groupUserRepository.insertGroupUser(
          {
            userId: user.id,
            groupId: group.id,
          },
          trx,
        );

        const spaceInfo: CreateSpaceDto = {
          name: 'General',
          slug: 'general',
        }

        const space = await this.spaceService.create(
          user.id,
          workspace.id,
          spaceInfo,
          trx,
        );

        await this.spaceMemberService.addUserToSpace(
          user.id,
          space.id,
          SpaceRole.ADMIN,
          trx,
        )

        await this.spaceMemberService.addGroupToSpace(
          group.id,
          space.id,
          SpaceRole.ADMIN,
          trx,
        )

        workspace.defaultSpaceId = space.id;
        await this.workspaceRepository.updateWorkspace(
          workspace.id,
          {
            defaultSpaceId: space.id,
          },
          trx
        );

        return workspace;
      },
      trx,
    )
  }

  async getWorkspacePublicData(workspaceId: string) {
    const workspace = await this.db
      .selectFrom('workspaces')
      .select(['id'])
      .where('id', '=', workspaceId)
      .executeTakeFirst();
    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    return workspace;
  }
}
