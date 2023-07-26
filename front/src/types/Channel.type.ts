import { User } from './User.type';

export type Channel = {
  id: number;
  name: string;
  avatar: string;
  visibility: string;
  ownerId: number;
  admins: {user: User}[];
  members: {user: User}[];
  blocked: {user: User}[];
  passwordHash?: string;
};
