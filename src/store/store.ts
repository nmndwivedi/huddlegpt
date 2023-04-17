import { create } from "zustand";

interface State {
  selectedChatId: string | null;
  setSelectedChatId: (by: string | null) => void;
}

const useStore = create<State>()((set) => ({
  selectedChatId: null,
  setSelectedChatId: (to) => set(() => ({ selectedChatId: to })),
}));

export default useStore;
