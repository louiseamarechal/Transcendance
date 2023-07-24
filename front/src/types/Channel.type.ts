import { User } from './User.type';

export type Channel = {
  id: number;
  name: string;
  avatar: string;
  visibility: string;
  ownerId: number;
  admins: User[];
  members: User[];
  blocked: User[];
  passwordHash?: string;
};
