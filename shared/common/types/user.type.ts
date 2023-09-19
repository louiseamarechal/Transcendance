export type PublicUser = {
  id: number;
  login: string;
  name: string;
  level: number;
  avatar: string | null;
  status: string;
  achievement: {achievementName: string}[] ;
};
