import {IWorkspace} from '../../workspace/types/workspace.types';

export interface IUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  timezone: string;
  settings: IUserSettings;
  createdAt: Date;
  updatedAt: Date;
  role: string;
  workspaceId: string;
  deletedAt: Date;
}

export interface ICurrentUser {
  user: IUser;
  workspace: IWorkspace;
}

export interface IUserSettings {
  preferences: {
    fullPageWidth: boolean;
  }
}