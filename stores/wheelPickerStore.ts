import { create } from "zustand";

interface WheelPickerState {
  isReady: boolean;
  isShowingBuffer: boolean;
  setReady: (ready: boolean) => void;
  setShowingBuffer: (showing: boolean) => void;
}

export const useWheelPickerStore = create<WheelPickerState>((set) => ({
  isReady: false,
  isShowingBuffer: false,
  setReady: (ready) => set({ isReady: ready }),
  setShowingBuffer: (showing) => set({ isShowingBuffer: showing }),
}));

export const selectWheelPickerReady = (s: WheelPickerState) => s.isReady;
export const selectWheelPickerShowingBuffer = (s: WheelPickerState) => s.isShowingBuffer;
