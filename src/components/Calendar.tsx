"use client"

import React, { useMemo, useState } from "react"
import { Button } from "./ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import dayjs from "dayjs"

import { getWeekDays } from "@/uteis/get-week-days"
import { cn } from "@/lib/utils"

interface CalendarWeek {
  days: Array<{
    date: dayjs.Dayjs
    disabled: boolean
  }>
  week: number
}

type CalendarWeeks = CalendarWeek[]

interface UnavailableDates {
  blockedDates: number[]
  blockedWeekDays: number[]
}

interface ParseCalendarWeeksProps {
  currentDate: dayjs.Dayjs
  unavailableDates?: UnavailableDates | null
}

interface CalendarProps {
  selectedDate: Date | null
  onDateSelected: (date: Date | null) => void
  // currentDate?: Date
  // onDateChange: (date: Date) => void
  // unavailableDates?: UnavailableDates | null
}

export function Calendar({ onDateSelected, selectedDate }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => {
    return dayjs().set("date", 1)
  })

  function handlePreviousMonth() {
    const previousMonthData = currentDate.subtract(1, "month")

    setCurrentDate(previousMonthData)
  }

  function handleNextMonth() {
    const nextMonthData = currentDate.add(1, "month")

    setCurrentDate(nextMonthData)
  }

  const shortWeekDays = getWeekDays({ short: true })
  const currentMonth = currentDate.format("MMMM")
  const currentYear = currentDate.format("YYYY")

  const calendarWeeks = useMemo(() => {
    const daysInMonthArray = Array.from({
      length: currentDate.daysInMonth(),
    }).map((_, i) => {
      return currentDate.set("date", i + 1)
    })
    const fisrtWeekDay = currentDate.get("day")

    const previousMonthFillArray = Array.from({
      length: fisrtWeekDay,
    })
      .map((_, i) => {
        return currentDate.subtract(i + 1, "day")
      })
      .reverse()

    const lastDayInCurrentMonth = currentDate.set(
      "date",
      currentDate.daysInMonth()
    )
    const lastWeekDay = lastDayInCurrentMonth.get("day")

    const nextMonthFillArray = Array.from({
      length: 7 - (lastWeekDay + 1),
    }).map((_, i) => {
      return lastDayInCurrentMonth.add(i + 1, "day")
    })

    const calendarDays = [
      ...previousMonthFillArray.map((date) => {
        return { date, disabled: true }
      }),
      ...daysInMonthArray.map((date) => {
        return { date, disabled: date.endOf("day").isBefore(new Date()) }
      }),
      ...nextMonthFillArray.map((date) => {
        return { date, disabled: true }
      }),
    ]

    const calendarWeeks = calendarDays.reduce<CalendarWeeks>(
      (weeks, _, i, original) => {
        const isNewWeek = i % 7 === 0

        if (isNewWeek) {
          weeks.push({ week: i / 7 + 1, days: original.slice(i, i + 7) })
        }
        return weeks
      },
      []
    )

    return calendarWeeks
  }, [currentDate])

  return (
    <div className="flex flex-col gap-2 p-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-medium capitalize">{currentMonth}</h2>
          <p className="text-gray-200">{currentYear}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handlePreviousMonth}
            title="Mês anterior"
            variant={"ghost"}
            className="text-gray-500 hover:bg-gray-800"
          >
            <ChevronLeft />
          </Button>
          <Button
            onClick={handleNextMonth}
            title="Próximo mês"
            variant={"ghost"}
            className="text-gray-500 hover:bg-gray-800"
          >
            <ChevronRight />
          </Button>
        </div>
      </header>
      <table className="w-full border-spacing-2 table-fixed border-separate">
        <thead className="">
          <tr className="w-full text-gray-500 text-sm font-medium">
            {shortWeekDays.map((day) => (
              <th key={day} className=" text-gray-200 text-sm font-medium">
                {day}.
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="before:leading-3 before:content-['.'] before:block before:text-gray-800">
          {calendarWeeks.map(({ week, days }) => (
            <tr key={week} className="w-full">
              {days.map(({ date, disabled }) => (
                <td key={date.format("DD")} className="w-full">
                  <button
                    disabled={disabled}
                    onClick={() => onDateSelected(date.toDate())}
                    className={cn(
                      "w-full aspect-square bg-gray-600 text-center cursor-pointer rounded-lg hover:bg-gray-700 disabled:bg-transparent disabled:opacity-40 disabled:cursor-default",
                      date.get("date") === new Date().getDate() &&
                        date.get("month") === new Date().getMonth() &&
                        date.get("year") === new Date().getFullYear() &&
                        "bg-gray-700"
                    )}
                  >
                    {date.get("date")}
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
