"use client"
import React, { useState } from "react"
import { CalendarStep } from "./ScheduleForm/CalendarStep"
import { ConfirmStep } from "./ScheduleForm/ConfirmStep/page"

export function ScheduleForm() {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>()

  function handleClearSelectedDateTime() {
    setSelectedDateTime(null)
  }

  if (selectedDateTime) {
    return (
      <ConfirmStep
        schedulingDate={selectedDateTime}
        onCancelConfirmation={handleClearSelectedDateTime}
      />
    )
  }

  return <CalendarStep onSelectDateTime={setSelectedDateTime} />
}
