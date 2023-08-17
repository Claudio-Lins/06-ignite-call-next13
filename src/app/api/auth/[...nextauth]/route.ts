import { buildNextAuthOptions } from "@/lib/auth"
import NextAuth, { AuthOptions } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

// @ts-ignore
const authOptions: AuthOptions = buildNextAuthOptions(req, res)

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
