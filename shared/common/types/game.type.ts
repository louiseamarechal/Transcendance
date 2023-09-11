import { PublicUser } from "./user.type";

export type Vec2D = { x: number; y: number };

export type GameRequest = {
  gameId: string;
  p1: PublicUser;
  p2: PublicUser;
};

export type GameSchema = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  uuid: string;
  private: boolean;
  player1Id: number;
  player1Name: string | null;
  player2Id: number | null;
  player2Name: string | null;
  winnerId: number | null;
  score1: number | null;
  score2: number | null;
};
