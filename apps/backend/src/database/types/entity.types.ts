import { Insertable, Selectable, Updateable } from 'kysely';
import { Workspaces, Users } from '@supernote/database/types/db';

// Workspace types
export type Workspace = Selectable<Workspaces>;
export type InsertableWorkspace = Insertable<Workspaces>;
export type UpdatableWorkspace = Updateable<Omit<Workspaces, 'id'>>;

// User types
export type User = Selectable<Users>;
export type InsertableUser = Insertable<Users>;
export type UpdatableUser = Updateable<Omit<Users, 'id'>>;
