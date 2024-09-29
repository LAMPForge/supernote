import { SpaceCaslAction, SpaceCaslSubject } from '../permissions/permissions.types.ts';
import { SpaceRole } from '../../../libs/types.ts';

export interface ISpace {
  id: string;
  name: string;
  description: string;
  icon: string;
  slug: string;
  hostname: string;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
  memberCount?: number;
  spaceId?: string;
  membership?: IMembership;
}

interface IMembership {
  userId: string;
  role: SpaceRole;
  permissions?: Permissions;
}

interface Permission {
  action: SpaceCaslAction;
  subject: SpaceCaslSubject;
}

type Permissions = Permission[];
