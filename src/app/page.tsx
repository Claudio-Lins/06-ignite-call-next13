import Image from "next/image"
import previewImage from "@/assets/app-preview.png"
import { ClaimUserNameForm } from "@/components/ClaimUserNameForm"

export default function Home() {
  return (
    <main className="max-w-[calc(100vw-(100vw-1160px)/2)] ml-auto min-h-screen flex gap-20 items-center">
      <div className="flex w-1/2 justify-end ">
        <div className="w-[480px]">
          <h1 className="font-extrabold text-[64px] leading-tight">
            Agendamento descomplicado
          </h1>
          <p className="text-xl text-gray-200 mb-6">
            Conecte seu calendário e permita que as pessoas marquem agendamentos
            no seu tempo livre.
          </p>
          <ClaimUserNameForm />
        </div>
      </div>
      <div className="md:flex justify-end flex-1 pr-8 overflow-hidden hidden">
        <Image
          src={previewImage}
          height={400}
          alt="App preview"
          quality={100}
          priority
        />
      </div>
    </main>
  )
}
