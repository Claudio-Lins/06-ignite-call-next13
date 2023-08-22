import prisma from "@/lib/prisma"
import dayjs from "dayjs"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Record<string, string> }
) {
  const username = params.username

  const { searchParams } = new URL(request.url)

  const date = searchParams.get("date")

  if (!date) {
    return NextResponse.json({ message: "Date not provided." }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { username } })

  if (!user) {
    return NextResponse.json(
      { message: "User does not exist." },
      { status: 400 }
    )
  }

  const referenceDate = dayjs(String(date))

  const isPastDate = referenceDate.endOf("day").isBefore(new Date())

  if (isPastDate) {
    return NextResponse.json({
      availableTimes: [],
      possibleTimes: [],
    })
  }

  const userDayAvailability = await prisma.userTimeInterval.findFirst({
    where: {
      user_id: user.id,
      week_day: referenceDate.get("day"),
    },
  })

  if (!userDayAvailability) {
    return NextResponse.json({
      availableTimes: [],
      possibleTimes: [],
    })
  }

  const { time_end_in_minutes, time_start_in_minutes } = userDayAvailability

  const startHour = time_start_in_minutes / 60

  const endHour = time_end_in_minutes / 60

  const possibleTimes = Array.from({ length: endHour - startHour }).map(
    (_, index) => startHour + index
  )

  const blockedTimes = await prisma.scheduling.findMany({
    select: {
      date: true,
    },
    where: {
      date: {
        gte: referenceDate.set("hour", startHour).toDate(),
        lte: referenceDate.set("hour", endHour).toDate(),
      },
      user_id: user.id,
    },
  })

  const availableTimes = possibleTimes.filter((time) => {
    const isTimeBlocked = blockedTimes.some(
      (blockedTime) => blockedTime.date.getHours() === time
    )

    const isTimeInpast = referenceDate.set("hour", time).isBefore(new Date())

    return !isTimeBlocked && !isTimeInpast
  })

  return NextResponse.json({ availableTimes, possibleTimes })
}
