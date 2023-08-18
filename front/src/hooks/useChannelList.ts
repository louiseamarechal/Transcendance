import { create } from 'zustand';
import { ChannelShort } from '../types/Channel.type';

type State = {
  self: ChannelShort[];
};

type Actions = {
  reset: (newChannelList: ChannelShort[]) => void;
  add: (channel: ChannelShort) => void;
};

const useChannelList = create<State & Actions>((set) => ({
  self: [],
  reset: (newChannelList: ChannelShort[]) =>
    set((state: State) => ({
      self: (state.self = newChannelList),
    })),
  add: (channel: ChannelShort) =>
    set((state: State) => ({
      self: (state.self = [...state.self, channel]),
    })),
}));

export default useChannelList;
