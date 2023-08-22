"use client"

import "@/lib/dayjs"

import { queryClient } from "@/lib/react-query"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactNode } from "react"

type Props = {
  children?: ReactNode
}

export const ReactQueryProvider = ({ children }: Props) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)
