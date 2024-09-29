import { Injectable } from '@nestjs/common';
import { SpaceMemberRepository } from '@supernote/database/repositories/space/space-member.repository';
import { SpaceRepository } from '@supernote/database/repositories/space/space.repository';
import { InjectKysely } from 'nestjs-kysely';
import { KyselyDB, KyselyTransaction } from '@supernote/database/types/kysely.types';

@Injectable()
export class SpaceMemberService {
  constructor(
    private spaceMemberRepository: SpaceMemberRepository,
    private spaceRepository: SpaceRepository,
    @InjectKysely() private readonly db: KyselyDB,
  ) {}

  async addUserToSpace(
    userId: string,
    spaceId: string,
    role: string,
    trx?: KyselyTransaction,
  ): Promise<void> {
    await this.spaceMemberRepository.insertSpaceMember(
      {
        userId: userId,
        spaceId: spaceId,
        role: role,
      },
      trx,
    );
  }

  async addGroupToSpace(
    groupId: string,
    spaceId: string,
    role: string,
    trx?: KyselyTransaction,
  ): Promise<void> {
    await this.spaceMemberRepository.insertSpaceMember(
      {
        groupId: groupId,
        spaceId: spaceId,
        role: role,
      },
      trx,
    );
  }
}
