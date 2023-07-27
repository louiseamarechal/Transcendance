import { User } from './User.type';

export type Channel = {
  id: number;
  name: string;
  avatar: string;
  visibility: string;
  ownerId: number;
  admins: {user: User}[];
  members: {user: User}[];
  banned: {user: User}[];
  passwordHash?: string;
};
