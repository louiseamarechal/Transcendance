import { ServerEvents } from "./ServerEvents";
import { Player, Ball } from "../common/classes/game.class";

export type OverlayType = string;
export type OverlayData = {
  p1name?: string;
  p2name?: string;
  p1ready?: boolean;
  p2ready?: boolean;
  timerval?: number;
  score?: [number, number];
};

export type GameData = {
  p1: Player;
  p2: Player;
  ball: Ball;
};

export type ServerPayloads = {
  [ServerEvents.updateOverlay]: { type: OverlayType; data: OverlayData };
  [ServerEvents.gameData]: GameData;
  [ServerEvents.privateGameNotCreated]: { why: string };
};
