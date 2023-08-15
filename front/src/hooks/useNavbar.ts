import { create } from 'zustand';

type State = {
  navbarState: boolean;
};

type Actions = {
  toggle: (isVisible: boolean) => void;
};

const useNavbar = create<State & Actions>((set) => ({
  navbarState: false,
  toggle: (isVisible: boolean) => set((state) => ({ navbarState: (state.navbarState = isVisible) })),
}));

export default useNavbar;
