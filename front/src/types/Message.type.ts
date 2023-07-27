export type Message = {
  id: number;
  createdAt: Date;
  senderId: number;
  sender: { name: string };
  channelId: number;
  body: string;
};
