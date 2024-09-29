import { Injectable, NotFoundException } from '@nestjs/common';
import { User, Workspace } from '@supernote/database/types/entity.types';
import { UserRole } from '../../../common/helpers/types/permission';
import { AbilityBuilder, createMongoAbility, MongoAbility } from '@casl/ability';
import { IWorkspaceAbility, WorkspaceCaslAction, WorkspaceCaslSubject } from '../interfaces/workspace-ability.types';

@Injectable()
export default class WorkspaceAbilityFactory {
  private readonly ability: AbilityBuilder<MongoAbility<IWorkspaceAbility>>

  constructor() {
    this.ability = new AbilityBuilder<MongoAbility<IWorkspaceAbility>>(
      createMongoAbility,
    );
  }

  createForUser(user: User, workspace: Workspace) {
    const userRole = user.role;

    switch (userRole) {
      case UserRole.OWNER:
        return this.buildWorkspaceOwnerAbility();
      case UserRole.ADMIN:
        return this.buildWorkspaceAdminAbility();
      case UserRole.MEMBER:
        return this.buildWorkspaceMemberAbility();
      default:
        throw new NotFoundException('Workspace permissions not found');
    }
  }

  private buildWorkspaceOwnerAbility() {
    const { can, build } = this.ability;
    can(WorkspaceCaslAction.Manage, WorkspaceCaslSubject.Settings);
    can(WorkspaceCaslAction.Manage, WorkspaceCaslSubject.Member);
    can(WorkspaceCaslAction.Manage, WorkspaceCaslSubject.Space);
    can(WorkspaceCaslAction.Manage, WorkspaceCaslSubject.Group);
    can(WorkspaceCaslAction.Manage, WorkspaceCaslSubject.Member);
    return build();
  }

  private buildWorkspaceAdminAbility() {
    const { can, build } = this.ability;
    can(WorkspaceCaslAction.Manage, WorkspaceCaslSubject.Settings);
    can(WorkspaceCaslAction.Manage, WorkspaceCaslSubject.Member);
    can(WorkspaceCaslAction.Manage, WorkspaceCaslSubject.Space);
    can(WorkspaceCaslAction.Manage, WorkspaceCaslSubject.Group);
    can(WorkspaceCaslAction.Manage, WorkspaceCaslSubject.Member);
    return build();
  }

  private buildWorkspaceMemberAbility() {
    const { can, build } = this.ability;
    can(WorkspaceCaslAction.Read, WorkspaceCaslSubject.Settings);
    can(WorkspaceCaslAction.Read, WorkspaceCaslSubject.Member);
    can(WorkspaceCaslAction.Read, WorkspaceCaslSubject.Space);
    can(WorkspaceCaslAction.Read, WorkspaceCaslSubject.Group);
    return build();
  }
}