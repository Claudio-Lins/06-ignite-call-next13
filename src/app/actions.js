// create a serverAction to create a cookie from users

"use server"

import { cookies } from "next/headers"

export async function createCookie(data) {
  cookies().set({
    name: "@ignitecall",
    value: data,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  })
}
