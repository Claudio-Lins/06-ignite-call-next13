"use client"

import React, { useMemo, useState } from "react"
import { Button } from "./ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import dayjs from "dayjs"

import { getWeekDays } from "@/uteis/get-week-days"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { useParams } from "next/navigation"

interface CalendarWeek {
  week: number
  days: Array<{
    date: dayjs.Dayjs
    disabled: boolean
  }>
}

type CalendarWeeks = CalendarWeek[]

interface BlockedDates {
  blockedWeekDays: number[]
  blockedDates: number[]
}

interface CalendarProps {
  selectedDate: Date | null
  onDateSelected: (date: Date) => void
}

export function Calendar({ selectedDate, onDateSelected }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => {
    return dayjs().set("date", 1)
  })

  const { username } = useParams()

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

  const { data: blockedDates } = useQuery<BlockedDates>(
    ["blocked-dates", currentDate.get("year"), currentDate.get("month")],
    async () => {
      const response = await api.get(`/users/${username}/blocked-dates`, {
        params: {
          year: currentDate.get("year"),
          month: currentDate.get("month") + 1,
        },
      })

      return response.data
    }
  )

  const calendarWeeks = useMemo(() => {
    if (!blockedDates) {
      return []
    }

    const daysInMonthArray = Array.from({
      length: currentDate.daysInMonth(),
    }).map((_, i) => {
      return currentDate.set("date", i + 1)
    })

    const firstWeekDay = currentDate.get("day")

    const previousMonthFillArray = Array.from({
      length: firstWeekDay,
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
        return {
          date,
          disabled:
            date.endOf("day").isBefore(new Date()) ||
            (blockedDates &&
              (blockedDates.blockedWeekDays.includes(date.get("day")) ||
                blockedDates.blockedDates?.includes(date.get("date")))),
        }
      }),
      ...nextMonthFillArray.map((date) => {
        return { date, disabled: true }
      }),
    ]

    const calendarWeeks = calendarDays.reduce<CalendarWeeks>(
      (weeks, _, i, original) => {
        const isNewWeek = i % 7 === 0

        if (isNewWeek) {
          weeks.push({
            week: i / 7 + 1,
            days: original.slice(i, i + 7),
          })
        }

        return weeks
      },
      []
    )
    return calendarWeeks
  }, [currentDate, blockedDates])

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
            {shortWeekDays.map((weekDay) => (
              <th key={weekDay} className=" text-gray-200 text-sm font-medium">
                {weekDay}.
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="before:leading-3 before:content-['.'] before:block before:text-gray-800">
          {calendarWeeks.map(({ week, days }) => {
            return (
              <tr key={week} className="w-full">
                {days.map(({ date, disabled }) => {
                  return (
                    <td key={date.format("DD")} className="w-full">
                      <button
                        disabled={disabled}
                        onClick={() => onDateSelected(date.toDate())}
                        className={cn(
                          "w-full aspect-square bg-gray-600 text-center cursor-pointer rounded-lg focus:border hover:bg-gray-700 disabled:bg-transparent disabled:opacity-40 disabled:cursor-default"
                        )}
                      >
                        {date.get("date")}
                      </button>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
