"use client"

import { useParams } from "next/navigation"
import { Calendar } from "@/components/Calendar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { api } from "@/lib/axios"
import { cn } from "@/lib/utils"
import dayjs from "dayjs"
import React, { useEffect, useState } from "react"
import { TimePickerItem } from "@/app/schedule/components/TimePickerItem"
import { useQuery } from "@tanstack/react-query"

interface Availability {
  possibleTimes: number[]
  availableTimes: number[]
}

interface CalendarStepProps {
  onSelectDateTime: (date: Date) => void
}

export function CalendarStep({ onSelectDateTime }: CalendarStepProps) {
  const { username } = useParams()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const isDateSelected = !!selectedDate

  const weekDay = selectedDate ? dayjs(selectedDate).format("dddd") : null
  const describedDate = selectedDate
    ? dayjs(selectedDate).format("DD[ de ]MMMM")
    : null

  const dayAndMonth = selectedDate
    ? dayjs(selectedDate).format("DD[ de ]MMMM")
    : null

  const selectedDateWithoutTime = selectedDate
    ? dayjs(selectedDate).format("YYYY-MM-DD")
    : null

  const { data: availability } = useQuery<Availability>(
    ["availability", selectedDateWithoutTime],
    async () => {
      const response = await api.get(`/users/${username}/availability`, {
        params: {
          date: selectedDateWithoutTime,
        },
      })

      return response.data
    },
    {
      enabled: !!selectedDate,
    }
  )
  function handleSelectTime(hour: number) {
    const dateWithTime = dayjs(selectedDate)
      .set("hour", hour)
      .startOf("hour")
      .toDate()

    onSelectDateTime(dateWithTime)
  }

  return (
    <div
      className={cn(
        " mt-6 p-0 grid mx-auto  relative bg-gray-800 rounded-lg overflow-hidden",
        isDateSelected ? "grid-cols-[1fr,280px]" : "w-[540px] grid-cols-1"
      )}
    >
      <Calendar selectedDate={selectedDate} onDateSelected={setSelectedDate} />
      {isDateSelected && (
        <div className="time-piker overflow-auto w-[280px] bg-gray-800 border-l border-gray-400 px-6 pt-6 pb-0 absolute top-0 bottom-0 right-0">
          <header className="flex items-center gap-2">
            <span className="font-medium capitalize">{weekDay} </span>
            <span className="text-gray-200">{dayAndMonth}</span>
          </header>

          <ScrollArea>
            <div className="mt-3 flex flex-col gap-2">
              {availability?.possibleTimes.map((hour) => (
                <TimePickerItem
                  key={hour}
                  disabled={!availability.availableTimes.includes(hour)}
                  onClick={() => handleSelectTime(hour)}
                >
                  {String(hour).padStart(2, "0")}:00h
                </TimePickerItem>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  )
}
