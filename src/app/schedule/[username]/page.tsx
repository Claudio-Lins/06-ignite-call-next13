import "server-only"

import prisma from "@/lib/prisma"
import { UserHeader } from "../components/UserHeader"
import { ScheduleForm } from "../components/page"

export const revalidate = 86400 // 1 day

export const metadata = {
  title: "Agendar horário ",
}

interface ScheduleProps {
  params: {
    username: string | string[]
  }
}

export default async function Schedule({ params }: ScheduleProps) {
  const user = await prisma.user.findFirst({
    where: {
      username: String(params.username),
    },
  })

  return (
    <div className="w-full flex flex-col items-center mt-10">
      <div className="max-w-[852px] px-4">
        {!!user && (
          <UserHeader
            name={user?.name!}
            bio={user?.bio!}
            src={user?.avatar_url!}
          />
        )}
        <ScheduleForm />
      </div>
    </div>
  )
}
