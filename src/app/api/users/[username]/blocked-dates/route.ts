import { ScrollArea } from "@/components/ui/scroll-area"
import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Record<string, string> }
) {
  const username = params.username

  const { searchParams } = new URL(request.url)

  const year = searchParams.get("year")
  const month = searchParams.get("month")

  if (!year || !month) {
    return NextResponse.json(
      { message: "Year or month not specified." },
      { status: 400 }
    )
  }

  const user = await prisma.user.findUnique({ where: { username } })

  if (!user) {
    return NextResponse.json(
      { message: "User does not exist." },
      { status: 400 }
    )
  }

  const availableWeekDays = await prisma.userTimeInterval.findMany({
    select: {
      week_day: true,
    },
    where: {
      user_id: user.id,
    },
  })

  const blockedWeekDays = Array.from({ length: 7 })
    .map((_, index) => index)
    .filter(
      (weekDay) =>
        !availableWeekDays.some(
          (availableWeekDay) => availableWeekDay.week_day === weekDay
        )
    )

  const blockedDatesRaw: Array<{
    date: number
  }> = await prisma.$queryRaw`
    SELECT
    EXTRACT(DAY FROM S.date) AS date,
    COUNT(S.date) AS amount,
    ((uti.time_end_in_minutes - uti.time_start_in_minutes) / 60) AS size
    FROM schedulings S

    LEFT JOIN user_time_intervals uti
      ON uti.week_day = WEEKDAY(DATE_ADD(S.date, INTERVAL 1 DAY))

    WHERE S.user_id = ${user.id}
          AND DATE_FORMAT(S.date, "%Y-%m") = ${`${year}-${month.padStart(
            2,
            "0"
          )}`}
    
    GROUP BY EXTRACT(DAY FROM S.date),
      ((uti.time_end_in_minutes - uti.time_start_in_minutes) / 60)
    
    HAVING amount >= size

  `

  const blockedDates = blockedDatesRaw.map((item) => item.date)

  return NextResponse.json({ blockedWeekDays, blockedDates })
}
