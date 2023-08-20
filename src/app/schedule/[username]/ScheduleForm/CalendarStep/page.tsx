"use client"

import TimePicker from "@/app/schedule/components/TimePicker"
import { Calendar } from "@/components/Calendar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import React, { useState } from "react"

export function CalendarStep() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const isDateSelected = !!selectedDate
  return (
    <div
      className={cn(
        " mt-6 p-0 grid mx-auto  relative bg-gray-800 rounded-lg overflow-hidden",
        isDateSelected ? "grid-cols-[1fr,280px]" : "w-[540px] grid-cols-1"
      )}
    >
      <Calendar selectedDate={selectedDate} onDateSelected={setSelectedDate} />
      {isDateSelected && (
        <div className="time-piker w-[280px] bg-gray-800 border-l border-gray-400 px-6 pt-6 pb-0 overflow-y-scroll absolute top-0 bottom-0 right-0">
          <header className="font-medium">
            Ter <span className="text-gray-200">20 de dezembro</span>
          </header>
          <div className="time-picker-list w-full flex flex-col gap-2 last:mb-6 p-2 mt-2">
            <Button className="time-picker-item bg-gray-600 text-gray-100 text-sm disabled:bg-none focus:shadow-sm">
              08:00
            </Button>
            <Button className="time-picker-item bg-gray-600 text-gray-100 text-sm disabled:bg-none focus:shadow-sm">
              08:00
            </Button>
            <Button className="time-picker-item bg-gray-600 text-gray-100 text-sm disabled:bg-none focus:shadow-sm">
              08:00
            </Button>
            <Button className="time-picker-item bg-gray-600 text-gray-100 text-sm disabled:bg-none focus:shadow-sm">
              08:00
            </Button>
            <Button className="time-picker-item bg-gray-600 text-gray-100 text-sm disabled:bg-none focus:shadow-sm">
              08:00
            </Button>
            <Button className="time-picker-item bg-gray-600 text-gray-100 text-sm disabled:bg-none focus:shadow-sm">
              08:00
            </Button>
            <Button className="time-picker-item bg-gray-600 text-gray-100 text-sm disabled:bg-none focus:shadow-sm">
              08:00
            </Button>
            <Button className="time-picker-item bg-gray-600 text-gray-100 text-sm disabled:bg-none focus:shadow-sm">
              08:00
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
