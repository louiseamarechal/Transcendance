import { ClientEvents } from "./ClientEvents";

export type ClientPayloads = {
  [ClientEvents.GameInput]: { gameId: string; val: number };
  [ClientEvents.GameSetReady]: { gameId: string };
  [ClientEvents.GameCreateGame]: {
    p1Id: number;
    p2Id: number;
    p1PaddleSize: number;
    p2PaddleSize: number;
  };
  [ClientEvents.GameAcceptGR]: { gameId: string };
  [ClientEvents.GameRefuseGR]: { gameId: string };
  [ClientEvents.GameDestroyGR]: { gameId: string };
};
