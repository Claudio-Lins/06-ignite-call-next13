import React from "react"
import { CalendarStep } from "./CalendarStep/page"
import { ConfirmStep } from "./ConfirmStep/page"

export function ScheduleForm() {
  return (
    <div>
      <CalendarStep />
      {/* <ConfirmStep /> */}
    </div>
  )
}
