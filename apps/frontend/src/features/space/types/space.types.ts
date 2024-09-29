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
}
