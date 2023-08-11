import { create } from 'zustand';

type State = {
  notif: {
    friends: number;
    game: number;
    chat: number;
  };
};

type Actions = {
  increment: (category: keyof State['notif'], qty: number) => void;
  reset: (category: keyof State['notif']) => void;
};

const useNotif = create<State & Actions>((set) => ({
  notif: {
    friends: 0,
    game: 0,
    chat: 0,
  },
  increment: (category, qty) =>
    set((state) => ({
      notif: {
        ...state.notif,
        [category]: state.notif[category] + qty,
      },
    })),
  reset: (category) =>
    set((state) => ({
      notif: {
        ...state.notif,
        [category]: (state.notif[category] = 0),
      },
    })),
}));

export default useNotif;
