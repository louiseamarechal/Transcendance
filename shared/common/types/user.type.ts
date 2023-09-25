export type PublicUser = {
  createdAt: Date;
  id: number;
  login: string;
  name: string;
  level: number;
  avatar: string | null;
  status: string;
  achievement: { achievementName: string }[];
  blockedUsers: { blockedId: number }[];
};

export const PublicUserSelect = {
  createdAt: true,
  id: true,
  login: true,
  name: true,
  level: true,
  avatar: true,
  s2fa: true,
  status: true,
  achievement: {
    select: {
      achievementName: true,
    },
  },
  blockedUsers: {
    select: {
      blockedId: true,
    },
  },
};
