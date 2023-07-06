import { ClientEvents } from "./ClientEvents";

export type ClientPayloads = {
  [ClientEvents.Ping]: any;
};
