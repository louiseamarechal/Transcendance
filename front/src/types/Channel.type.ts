import { User } from './User.type';

export type Channel = {
  id: number;
  name: string;
  avatar: string;
  visibility: string;
  ownerId: number;
  members: { user?: User; userId?: number }[];
  admins: { userId: number }[];
  blocked: { userId: number }[];
  muted: { mutedUserId: number; mutedByUserId: number }[];
};
