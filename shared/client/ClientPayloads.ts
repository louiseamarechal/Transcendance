import { ClientEvents } from "./ClientEvents";

export type ClientPayloads = {
  [ClientEvents.Ping]: any;
  [ClientEvents.GameInput]: any;
};
