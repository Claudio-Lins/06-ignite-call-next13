"use client"

import { Steps } from "@/components/Steps"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight } from "phosphor-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import axios, { AxiosError } from "axios"
import { api } from "@/lib/axios"

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: "O nome de usuário deve ter pelo menos 3 caracteres",
    })
    .max(10, {
      message: "O nome de usuário deve ter no máximo 10 caracteres",
    })
    .regex(/^([a-z\\-])+$/i, {
      message: "O nome de usuário deve conter apenas letras e traços",
    })
    .transform((username) => username.toLowerCase()),
  name: z.string().min(3, {
    message: "O nome deve ter pelo menos 3 caracteres",
  }),
})

type RegisterFormData = z.infer<typeof registerFormSchema>

export default function Register() {
  const router = useRouter()
  const query = useSearchParams()
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  })

  useEffect(() => {
    const username = query.get("username")
    if (username) {
      setValue("username", username)
    }
  }, [query, setValue])

  async function handleRegister(data: RegisterFormData) {
    console.log("Linha 57")
    try {
      await api.post("/users", {
        name: data.name,
        username: data.username,
      })
      console.log("Linha 63")

      router.push("/register/connect-calendar")
    } catch (err) {
      console.log("Linha 67")
      if (err instanceof AxiosError && err?.response?.data?.message) {
        alert(err.response.data.message)
        return
      }

      console.error(err, "Aqui")
    }
  }

  return (
    <main className="max-w-[572px] px-4 mt-20 mx-auto">
      <header>
        <strong className="text-2xl text-white">
          Bem-vindo ao Ignite Call!
        </strong>
        <p className="text-gray-200 mb-6">
          Precisamos de algumas informações para criar seu perfil! Ah, você pode
          editar essas informações depois.
        </p>
        <Steps step={1} />
      </header>
      <div className="p-6 bg-gray-800 rounded-lg mt-6">
        <form
          onSubmit={handleSubmit(handleRegister)}
          className="flex flex-col gap-4"
        >
          <div className="">
            <Label className="text-sm text-gray-100">Nome de usuário</Label>
            <Input
              type="text"
              placeholder="<Username>"
              className="bg-gray-700 rounded-lg p-4 mt-2"
              {...register("username")}
            />
            {errors.username && (
              <span className="text-red-500 text-sm">
                {errors.username.message}
              </span>
            )}
          </div>
          <div className="">
            <Label className="text-sm text-gray-100">Nome completo</Label>
            <Input
              type="text"
              placeholder="<Nome>"
              {...register("name")}
              className="bg-gray-700 rounded-lg p-4 mt-2"
            />
            {errors.name && (
              <span className="text-red-500 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>
          <Button
            disabled={isSubmitting}
            type="submit"
            className="flex items-center gap-2 bg-ignite-500 hover:bg-ignite-600 h-12"
          >
            Próximo passo
            <ArrowRight />
          </Button>
        </form>
      </div>
    </main>
  )
}
