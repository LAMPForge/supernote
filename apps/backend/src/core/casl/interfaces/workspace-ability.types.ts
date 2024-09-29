export enum WorkspaceCaslAction {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Edit = 'edit',
  Delete = 'delete',
}
export enum WorkspaceCaslSubject {
  Settings = 'settings',
  Member = 'member',
  Space = 'space',
  Group = 'group',
}

export type IWorkspaceAbility =
  | [WorkspaceCaslAction, WorkspaceCaslSubject.Settings]
  | [WorkspaceCaslAction, WorkspaceCaslSubject.Member]
  | [WorkspaceCaslAction, WorkspaceCaslSubject.Space]
  | [WorkspaceCaslAction, WorkspaceCaslSubject.Group]
