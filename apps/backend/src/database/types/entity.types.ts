import { Insertable, Selectable, Updateable } from 'kysely';
import { Workspaces } from '@supernote/database/types/db';

// Workspace types
export type Workspace = Selectable<Workspaces>;
export type InsertableWorkspace = Insertable<Workspaces>;
export type UpdateableWorkspace = Updateable<Omit<Workspaces, 'id'>>;
