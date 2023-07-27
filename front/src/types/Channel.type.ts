import { User } from './User.type';

export type Channel = {
  id: number;
  name: string;
  avatar: string;
  visibility: string;
  ownerId: number;
  members: {user: User}[];
  admins: {userId: number}[];
  banned: {userId: number}[];
  muted: {mutedUserId: number, mutedByUserId: number}[];
  passwordHash?: string;
};