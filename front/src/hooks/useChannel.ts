import { create } from 'zustand';
import { Channel, emptyChannel } from '../types/Channel.type';

type State = {
  self: Channel;
};

type Action = {
  reset: (newChannel: Channel) => void;
};

const useChannel = create<State & Action>((set) => ({
  self: emptyChannel,
  reset: (newChannel: Channel) =>
    set((state: State) => ({
      self: (state.self = newChannel),
    })),
}));

export default useChannel;
