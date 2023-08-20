"use client"
import { Steps } from "@/components/Steps"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/axios"
import { cn } from "@/lib/utils"
import { convertTimeStringToMinuttes } from "@/uteis/convert-time-string-to-minutes"
import { getWeekDays } from "@/uteis/get-week-days"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { ArrowRight } from "phosphor-react"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

const timeIntervalsFormSchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
      })
    )
    .length(7)
    .transform((intervals) => intervals.filter((interval) => interval.enabled))
    .refine((intervals) => intervals.length > 0, {
      message: "Você deve selecionar pelo menos um dia da semana",
    })
    .transform((intervals) => {
      return intervals.map((interval) => {
        return {
          weekDay: interval.weekDay,
          startTimeInMinutes: convertTimeStringToMinuttes(interval.startTime),
          endTimeInMinutes: convertTimeStringToMinuttes(interval.endTime),
        }
      })
    })
    .refine(
      (intervals) => {
        return intervals.every(
          (interval) =>
            interval.endTimeInMinutes - 60 >= interval.startTimeInMinutes
        )
      },

      {
        message:
          "O horário final deve ser pelo menos 1 hora maior que o horário inicial",
      }
    ),
})

type TimeIntervalsFormInput = z.input<typeof timeIntervalsFormSchema>
type TimeIntervalsFormOutput = z.output<typeof timeIntervalsFormSchema>

export default function TimeIntervals() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TimeIntervalsFormInput>({
    resolver: zodResolver(timeIntervalsFormSchema),
    defaultValues: {
      intervals: [
        { weekDay: 0, enabled: false, startTime: "08:00", endTime: "18:00" },
        { weekDay: 1, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekDay: 2, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekDay: 3, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekDay: 4, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekDay: 5, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekDay: 6, enabled: false, startTime: "08:00", endTime: "18:00" },
      ],
    },
  })

  const weekDays = getWeekDays()

  const { fields } = useFieldArray({
    control,
    name: "intervals",
  })

  const intervals = watch("intervals")

  async function handleSetTimeIntervals(data: any) {
    const { intervals } = data as TimeIntervalsFormOutput
    await api.post("/users/time-intervals", { intervals })
    await router.push("/register/update-profile")
  }

  return (
    <main className="max-w-[572px] px-4 mt-20 mx-auto">
      <header>
        <strong className="text-2xl text-white">Conectar</strong>
        <p className="text-gray-200 mb-6">
          Defina o intervalo de horários que você está disponível em cada dia da
          semana.
        </p>
        <Steps step={3} />
      </header>
      <div className="p-6 bg-gray-800 rounded-lg mt-6">
        <form
          onSubmit={handleSubmit(handleSetTimeIntervals)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col items-center border border-gray-500 py-0 px-6 rounded-lg w-full mb-2 justify-between divide-y-[0.5px] divide-gray-500">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className=" w-full py-4 px-3  flex items-center justify-between "
              >
                <div className="flex items-center space-x-2">
                  <Controller
                    control={control}
                    name={`intervals.${index}.enabled` as const}
                    render={({ field }) => (
                      <Checkbox
                        onCheckedChange={(cheked) => {
                          field.onChange(cheked === true)
                        }}
                        checked={field.value}
                        className="bg-gray-900"
                      />
                    )}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {weekDays[field.weekDay]}
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    type="time"
                    step={60}
                    disabled={intervals[index].enabled === false}
                    {...register(`intervals.${index}.startTime` as const)}
                    className=" h-10 text-white bg-gray-900 disabled:opacity-60 border-none [&::-webkit-calendar-picker-indicator]:opacity-30 [&::-webkit-calendar-picker-indicator]:invert"
                  />
                  <Input
                    type="time"
                    step={60}
                    disabled={intervals[index].enabled === false}
                    {...register(`intervals.${index}.endTime` as const)}
                    className=" h-10 text-white bg-gray-900 disabled:opacity-60 border-none [&::-webkit-calendar-picker-indicator]:opacity-30 [&::-webkit-calendar-picker-indicator]:invert"
                  />
                </div>
              </div>
            ))}
          </div>
          {errors.intervals && (
            <span className="text-red-500 text-sm">
              {errors.intervals.message}
            </span>
          )}
          <Button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "flex items-center gap-2 bg-ignite-500 hover:bg-ignite-600 h-12"
            )}
          >
            Próximo passo
            <ArrowRight />
          </Button>
        </form>
      </div>
    </main>
  )
}
