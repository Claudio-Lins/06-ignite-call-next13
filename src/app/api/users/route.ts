// route users

import prisma from "@/lib/prisma"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const { name, username } = await request.json()

  const userExists = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (userExists) {
    return NextResponse.json(
      { message: "Username already registered." },
      { status: 400 }
    )
  }

  const user = await prisma.user.create({
    data: {
      name,
      username,
    },
  })

  // setCookie

  cookies().set("@ignitecall:userId", user.id, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })

  return NextResponse.json(user, { status: 201 })
}
