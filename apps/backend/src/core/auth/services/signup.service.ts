import { Injectable } from '@nestjs/common';
import { UserRepository } from '@supernote/database/repositories/user/user.repository';
import { WorkspaceService } from '../../workspace/services/workspace.service';
import { KyselyDB, KyselyTransaction } from '@supernote/database/types/kysely.types';
import { InjectKysely } from 'nestjs-kysely';
import { CreateOwnerUserDto } from '../dto/create-owner-user.dto';
import { executeTrx } from '@supernote/database/utils';
import { UserRole } from '../../../common/helpers/types/permission';
import { CreateWorkspaceDto } from '../../workspace/dto/create-workspace.dto';

@Injectable()
export class SignupService {
  constructor(
    private userRepository: UserRepository,
    private workspaceService: WorkspaceService,
    @InjectKysely() private readonly db: KyselyDB,
  ) {}

  async initialSetup(
    createOwnerUserDto: CreateOwnerUserDto,
    trx?: KyselyTransaction,
  ) {
    return await executeTrx(
      this.db,
      async (trx) => {
        const user = await this.userRepository.insertUser(
          {
            ...createOwnerUserDto,
            role: UserRole.OWNER,
          },
          trx,
        );

        const workspaceData: CreateWorkspaceDto = {
          name: createOwnerUserDto.workspaceName,
        }

        const workspace = await this.workspaceService.create(
          user,
          workspaceData,
          trx,
        );

        user.workspaceId = workspace.id;
        return user;
      },
      trx,
    )
  }
}
