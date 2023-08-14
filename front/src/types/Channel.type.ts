import { User } from './User.type';

export type Channel = {
  id: number;
  name: string;
  avatar: string;
  visibility: string;
  ownerId: number;
  members: { user: User }[];
  admins: { userId: number }[];
  blocked: { userId: number }[];
  muted: { mutedUserId: number; mutedByUserId: number }[];
};

export type ChannelShort = {
  id: number;
  name: string;
  avatar: string;
  visibility: string;
  ownerId: number;
  members: { userId: number }[];
};

export const emptyChannel: Channel = {
  id: NaN,
  name: '',
  avatar: '',
  visibility: '',
  ownerId: NaN,
  members: [],
  admins: [],
  blocked: [],
  muted: [],
};
