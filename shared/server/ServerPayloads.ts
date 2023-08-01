import { ServerEvents } from "./ServerEvents";

export type OverlayType = "ready" | "timer" | "playing";
export type OverlayData = {
  p1name?: string;
  p2name?: string;
  p1ready?: boolean;
  p2ready?: boolean;
  timerval?: number;
  score?: [number, number];
};

export type ServerPayloads = {
  [ServerEvents.updateOverlay]: { type: OverlayType; data: OverlayData };
};
