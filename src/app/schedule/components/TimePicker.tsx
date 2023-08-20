import { Button } from "@/components/ui/button"
import React from "react"

export default function TimePicker() {
  return (
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
  )
}
