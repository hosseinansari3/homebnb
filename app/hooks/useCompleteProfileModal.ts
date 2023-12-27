import { create } from "zustand";

interface CompleteProfileModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useCompleteProfilerModal = create<CompleteProfileModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useCompleteProfilerModal;
