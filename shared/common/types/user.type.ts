export type PublicUser = {
  id: number;
  login: string;
  name: string;
  level: number;
  avatar: string | null;
  statTotalGame: number;
  statTotalWin: number;
  status: string;
  blockedUsers: { blockedId: number }[];
};
