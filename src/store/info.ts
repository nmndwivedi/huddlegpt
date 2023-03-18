import { create } from "zustand";

interface State {
  username: string;
  set: (by: string) => void;
}

const useStore = create<State>()((set) => ({
  username: "",
  set: (to) => set((state) => ({ username: to })),
}));

export default useStore;
