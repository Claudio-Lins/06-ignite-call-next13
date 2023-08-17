import { create } from "zustand"

interface stepsStoreProps {
  step: 1 | 2 | 3 | 4 | number
  setStep: (step: number) => void
}

export const stepsStore = create<stepsStoreProps>((set) => ({
  step: 1,
  setStep: (step) => set({ step }),
}))
