/**
 * This file was generated by kysely-codegen.
 * Please do not edit it manually.
 */

import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Json = JsonValue;

export type JsonArray = JsonValue[];

export type JsonObject = {
  [x: string]: JsonValue | undefined;
};

export type JsonPrimitive = boolean | number | string | null;

export type JsonValue = JsonArray | JsonObject | JsonPrimitive;

export type Timestamp = ColumnType<Date, Date | string>;

export interface Groups {
  createdAt: Generated<Timestamp>;
  creatorId: string | null;
  deletedAt: Timestamp | null;
  description: string | null;
  id: Generated<string>;
  isDefault: boolean;
  name: string;
  updatedAt: Generated<Timestamp>;
  workspaceId: string;
}

export interface GroupUsers {
  createdAt: Generated<Timestamp>;
  groupId: string;
  id: Generated<string>;
  updatedAt: Generated<Timestamp>;
  userId: string;
}

export interface Pages {
  content: Json | null;
  coverPhoto: string | null;
  createdAt: Generated<Timestamp>;
  creatorId: string | null;
  deletedAt: Timestamp | null;
  deletedById: string | null;
  icon: string | null;
  id: Generated<string>;
  isLocked: Generated<boolean>;
  lastUpdatedById: string | null;
  parentPageId: string | null;
  position: string | null;
  slugId: string;
  spaceId: string;
  textContent: string | null;
  title: string | null;
  tsv: string | null;
  updatedAt: Generated<Timestamp>;
  workspaceId: string;
  ydoc: Buffer | null;
}

export interface SpaceMembers {
  addedById: string | null;
  createdAt: Generated<Timestamp>;
  deletedAt: Timestamp | null;
  groupId: string | null;
  id: Generated<string>;
  role: string;
  spaceId: string;
  updatedAt: Generated<Timestamp>;
  userId: string | null;
}

export interface Spaces {
  createdAt: Generated<Timestamp>;
  creatorId: string | null;
  defaultRole: Generated<string>;
  deletedAt: Timestamp | null;
  description: string | null;
  id: Generated<string>;
  logo: string | null;
  name: string | null;
  slug: string;
  updatedAt: Generated<Timestamp>;
  visibility: Generated<string>;
  workspaceId: string;
}

export interface Users {
  avatar: string | null;
  createdAt: Generated<Timestamp>;
  deletedAt: Timestamp | null;
  email: string;
  id: Generated<string>;
  locale: string | null;
  name: string | null;
  password: string | null;
  role: string | null;
  settings: Json | null;
  timezone: string | null;
  updatedAt: Generated<Timestamp>;
  workspaceId: string | null;
}

export interface Workspaces {
  createdAt: Generated<Timestamp>;
  customDomain: string | null;
  defaultRole: Generated<string>;
  defaultSpaceId: string | null;
  deletedAt: Timestamp | null;
  description: string | null;
  emailDomains: Generated<string[] | null>;
  hostname: string | null;
  id: Generated<string>;
  logo: string | null;
  name: string | null;
  settings: Json | null;
  updatedAt: Generated<Timestamp>;
}

export interface DB {
  groups: Groups;
  groupUsers: GroupUsers;
  pages: Pages;
  spaceMembers: SpaceMembers;
  spaces: Spaces;
  users: Users;
  workspaces: Workspaces;
}
