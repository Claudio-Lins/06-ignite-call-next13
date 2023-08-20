"use client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight } from "phosphor-react"
import React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Avatar } from "@/components/ui/avatar"
import { AvatarImage } from "@radix-ui/react-avatar"
import { api } from "@/lib/axios"

interface UpdateProfileFormProps {
  avatarUrl?: string
  username?: string
}

const updateProfileFormSchema = z.object({
  bio: z.string(),
})

type UpdateProfileFormData = z.infer<typeof updateProfileFormSchema>

export function UpdateProfileForm({
  avatarUrl,
  username,
}: UpdateProfileFormProps) {
  const router = useRouter()

  const {
    formState: { isSubmitting },
    handleSubmit,
    register,
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileFormSchema),
  })

  if (!username) {
    router.push("/")
  }

  async function handleUpdateProfile(data: UpdateProfileFormData) {
    await api.put("users/profile", {
      bio: data.bio,
    })

    router.push(`/schedule/${username}`)
  }
  return (
    <form
      onSubmit={handleSubmit(handleUpdateProfile)}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col">
        <span className="text-sm">Foto de perfil</span>
        <div className="flex items-center gap-4 mt-2 ">
          <div className="flex flex-col items-center">
            <Avatar className="w-20 h-20 border-2 rounded-full">
              <AvatarImage src={avatarUrl} alt={username} />
            </Avatar>
          </div>
          <Button variant={"outline"} className="bg-transparent">
            Selecionar foto
          </Button>
        </div>
      </div>
      <div className="">
        <Label htmlFor="about">Sobre você</Label>
        <Textarea
          id="about"
          rows={5}
          {...register("bio")}
          className="bg-gray-700 rounded-lg p-4 my-2"
        />
        <span className="text-sm">
          Fale um pouco sobre você. Isto será exibido em sua página pessoal.
        </span>
      </div>
      <Button
        disabled={isSubmitting}
        type="submit"
        className="flex items-center gap-2 bg-ignite-500 hover:bg-ignite-600 h-12"
      >
        Finalizar
        <ArrowRight />
      </Button>
    </form>
  )
}
