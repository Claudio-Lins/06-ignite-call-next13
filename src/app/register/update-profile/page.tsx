import { Steps } from "@/components/Steps"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { UpdateProfileForm } from "./components/UpdateProfileForm"
import { z } from "zod"

const updateProfileFormSchema = z.object({
  bio: z.string(),
})

type UpdateProfileFormData = z.infer<typeof updateProfileFormSchema>

export default async function UpdateProfile() {
  const session = await getServerSession(authOptions)

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
        <Steps step={4} />
      </header>
      <div className="p-6 bg-gray-800 rounded-lg mt-6">
        <UpdateProfileForm
          avatarUrl={session?.user.avatar_url}
          username={session?.user.username}
        />
      </div>
    </main>
  )
}
