export type Message = {
  id: number;
  createdAt: string;
  senderId: number;
  sender: { name: string };
  channelId: number;
  body: string;
};
