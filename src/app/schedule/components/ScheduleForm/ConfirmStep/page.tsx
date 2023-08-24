import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { Label } from "@radix-ui/react-label"
import dayjs from "dayjs"
import { Calendar, Clock } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useParams, useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Spinner } from "phosphor-react"

const confirmFormSchema = z.object({
  name: z.string().min(3, { message: "O nome precisa no mínimo 3 caracteres" }),
  email: z.string().email({ message: "Digite um e-mail válido" }),
  observations: z.string().nullable(),
})

type ConfirmFormData = z.infer<typeof confirmFormSchema>

interface ConfirmStepProps {
  schedulingDate: Date
  onCancelConfirmation: () => void
}

export function ConfirmStep({
  schedulingDate,
  onCancelConfirmation,
}: ConfirmStepProps) {
  const { username } = useParams()
  const router = useRouter()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ConfirmFormData>({
    resolver: zodResolver(confirmFormSchema),
  })

  async function handleConfirmSchedule(data: ConfirmFormData) {
    await api.post(`/users/${username}/schedule`, {
      name: data.name,
      email: data.email,
      observations: data.observations,
      date: schedulingDate,
    })
    toast({
      title: "Agendamento realizado com sucesso!",
    })
    onCancelConfirmation()
  }

  const describeDate = dayjs(schedulingDate).format("DD[ de ]MMMM[ de ]YYYY")
  const describeTime = dayjs(schedulingDate).format("HH:mm[h]")

  return (
    <div className="mt-6 w-[540px] bg-gray-800 p-6 flex flex-col">
      <header className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-200" />
          <span className="text-white">{describeDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-gray-200" />
          <span className="text-white">{describeTime}</span>
        </div>
      </header>
      <hr className=" border-gray-600 my-6" />
      <div className="px-6 bg-gray-800 rounded-lg">
        <form
          onSubmit={handleSubmit(handleConfirmSchedule)}
          className="flex flex-col gap-4"
        >
          <div className="">
            <Label className="text-sm text-gray-100">Seu nome</Label>
            <Input
              type="text"
              placeholder="cal.com/"
              className="bg-gray-900 rounded-lg p-4 mt-2 border-gray-600"
              {...register("name")}
            />
            {errors.name && (
              <span className="text-red-500 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>
          <div className="">
            <Label className="text-sm text-gray-100">Endereço de e-mail</Label>
            <Input
              type="email"
              placeholder="johndoe@exemplo.com"
              {...register("email")}
              className="bg-gray-900 rounded-lg p-4 mt-2 border-gray-600"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>
          <div className="">
            <Label htmlFor="about">Observações</Label>
            <Textarea
              id="about"
              {...register("observations")}
              className="bg-gray-900 rounded-lg p-4 my-2 border-gray-600"
            />
          </div>
          <div className="flex items-center justify-end gap-4">
            <Button
              onClick={onCancelConfirmation}
              variant={"ghost"}
              disabled={isSubmitting}
              type="button"
              className=""
            >
              Cancelar
            </Button>
            <Button
              disabled={isSubmitting}
              type="submit"
              className="flex items-center gap-2 bg-ignite-500 hover:bg-ignite-600"
            >
              Confirmar
              {isSubmitting && <Spinner className="animate-spin" />}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
