import { PublicUser } from "../../../shared/common/types/user.type";

export type Channel = {
  id: number;
  name: string;
  avatar: string;
  visibility: string;
  ownerId: number;
  members: { user: PublicUser }[];
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
