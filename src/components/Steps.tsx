import { stepsStore } from "@/context/StepsStore"
import { cn } from "@/lib/utils"

import React from "react"

export function Steps() {
  const { step } = stepsStore()
  return (
    <div className="w-full">
      <span className="text-xs text-gray-200">Passo {step} de 4</span>
      <div className="flex justify-between items-center gap-1">
        <div
          className={cn(
            "w-1/4 h-1 rounded-full",
            step === 1 || step === 2 || step === 3 || step === 4
              ? " bg-gray-100"
              : "bg-gray-600"
          )}
        />
        <div
          className={cn(
            "w-1/4 h-1 rounded-full",
            step === 2 || step === 3 || step === 4
              ? " bg-gray-100"
              : "bg-gray-600"
          )}
        />
        <div
          className={cn(
            "w-1/4 h-1 rounded-full",
            step === 3 || step === 4 ? " bg-gray-100" : "bg-gray-600"
          )}
        />
        <div
          className={cn(
            "w-1/4 h-1 rounded-full",
            step === 4 ? " bg-gray-100" : "bg-gray-600"
          )}
        />
      </div>
    </div>
  )
}
