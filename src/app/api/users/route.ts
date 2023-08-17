// route users

import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { setCookie } from "nookies"
import { createCookie } from "@/app/actions"

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json()
    const { name, username } = body

    if (!name) {
      return new NextResponse("Missing name", { status: 400 })
    }

    if (!username) {
      return new NextResponse("Missing username", { status: 400 })
    }

    const uniqUsername = await prisma.user.findUnique({
      where: {
        username,
      },
    })

    if (uniqUsername) {
      return new NextResponse("Username already exists", { status: 400 })
    }

    const user = await prisma.user.create({
      data: {
        name,
        username,
      },
    })

    const cookie = createCookie(user.id)

    // const response = NextResponse.next()
    // response.cookies.set("@ignitecall:userId", user.id, {
    //   maxAge: 60 * 60 * 24 * 7, // 7 dias
    //   path: "/",
    // })

    return NextResponse.json(user)
  } catch (error) {
    console.log(`[USER_POST]`, error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
