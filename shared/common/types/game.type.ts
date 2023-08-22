import { PublicUser } from "./user.type";

export type Vec2D = { x: number; y: number };

export type GameRequest = {
  gameId: string;
  p1: PublicUser;
  p2: PublicUser;
};
