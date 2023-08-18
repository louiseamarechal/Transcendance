import { ClientEvents } from "./ClientEvents";

export type ClientPayloads = {
  [ClientEvents.GameInput]: { gameId: string; val: number };
  [ClientEvents.GameSetReady]: { gameId: string };
  [ClientEvents.GameCreateGame]: { p1Id: number; p2Id: number };
};
