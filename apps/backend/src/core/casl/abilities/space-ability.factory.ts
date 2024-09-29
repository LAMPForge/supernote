import { Injectable, NotFoundException } from '@nestjs/common';
import { SpaceMemberRepository } from '@supernote/database/repositories/space/space-member.repository';
import { User } from '@supernote/database/types/entity.types';
import { SpaceRole } from '../../../common/helpers/types/permission';
import { AbilityBuilder, createMongoAbility, MongoAbility } from '@casl/ability';
import { ISpaceAbility, SpaceCaslAction, SpaceCaslSubject } from '../interfaces/space-ability.types';
import { findHighestUserSpaceRole } from '@supernote/database/repositories/space/utils';

@Injectable()
export default class SpaceAbilityFactory {
  constructor(private readonly spaceMemberRepository: SpaceMemberRepository) {}

  async createForUser(user: User, spaceId: string) {
    const userSpaceRoles = await this.spaceMemberRepository.getUserSpaceRoles(
      user.id,
      spaceId,
    );

    const userSpaceRole = findHighestUserSpaceRole(userSpaceRoles);

    switch (userSpaceRole) {
      case SpaceRole.ADMIN:
        return this.buildSpaceAdminAbility();
      case SpaceRole.WRITER:
        return this.buildSpaceWriterAbility();
      case SpaceRole.READER:
        return this.buildSpaceReaderAbility();
      default:
        throw new NotFoundException('Space permissions not found');
    }
  }

  private buildSpaceAdminAbility() {
    const { can, build } = new AbilityBuilder<MongoAbility<ISpaceAbility>>(
      createMongoAbility,
    );
    can(SpaceCaslAction.Manage, SpaceCaslSubject.Settings);
    can(SpaceCaslAction.Manage, SpaceCaslSubject.Member);
    can(SpaceCaslAction.Manage, SpaceCaslSubject.Page);
    return build();
  }

  private buildSpaceWriterAbility() {
    const { can, build } = new AbilityBuilder<MongoAbility<ISpaceAbility>>(
      createMongoAbility,
    );
    can(SpaceCaslAction.Read, SpaceCaslSubject.Settings);
    can(SpaceCaslAction.Read, SpaceCaslSubject.Member);
    can(SpaceCaslAction.Manage, SpaceCaslSubject.Page);
    return build();
  }

  private buildSpaceReaderAbility() {
    const { can, build } = new AbilityBuilder<MongoAbility<ISpaceAbility>>(
      createMongoAbility,
    );
    can(SpaceCaslAction.Read, SpaceCaslSubject.Settings);
    can(SpaceCaslAction.Read, SpaceCaslSubject.Member);
    can(SpaceCaslAction.Read, SpaceCaslSubject.Page);
    return build();
  }
}