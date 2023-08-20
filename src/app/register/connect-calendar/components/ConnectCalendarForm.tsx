"use client"
import { Steps } from "@/components/Steps"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Check, ArrowRight, Calendar } from "lucide-react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

interface ConnectCalendarProps {
  hasAuthError: boolean
  isSignedIn: boolean
}

export function ConnectCalendarForm({
  hasAuthError,
  isSignedIn,
}: ConnectCalendarProps) {
  const router = useRouter()

  function handleConnectCalendar() {
    signIn()
  }

  async function handleNavigateToNextStep() {
    await router.push("/register/time-intervals")
  }
  return (
    <main className="max-w-[572px] px-4 mt-20 mx-auto">
      <header>
        <strong className="text-2xl text-white">Conecte sua agenda!</strong>
        <p className="text-gray-200 mb-6">
          Conecte o seu calendário para verificar automaticamente as horas
          ocupadas e os novos eventos à medida em que são agendados.
        </p>
        <Steps step={2} />
      </header>
      <div className="p-6 bg-gray-800 rounded-lg mt-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center border border-gray-500 py-4 px-6 rounded-lg w-full mb-2 justify-between">
            <div className="flex items-center gap-2">
              <Calendar />
              <span className="font-medium text-gray-100">Google Agenda</span>
            </div>
            {isSignedIn && !hasAuthError ? (
              <Button
                variant={"outline"}
                className="flex items-center gap-2 bg-transparent text-ignite-500 hover:text-white hover:bg-ignite-500 h-12"
              >
                Conectado
              </Button>
            ) : (
              <Button
                onClick={handleConnectCalendar}
                variant={"outline"}
                className="flex items-center gap-2 bg-transparent text-ignite-500 hover:text-white hover:bg-ignite-500 h-12"
              >
                Conectado
              </Button>
            )}
          </div>
          {hasAuthError && (
            <p className="text-red-500 text-sm">
              Você precisa permitir o acesso ao calendário para continuar.
            </p>
          )}
          <Button
            type="button"
            disabled={!isSignedIn}
            onClick={handleNavigateToNextStep}
            className={cn(
              "flex items-center gap-2 bg-ignite-500 hover:bg-ignite-600 h-12",
              !isSignedIn && "bg-gray-400 cursor-not-allowed"
            )}
          >
            Próximo passo
            <ArrowRight />
          </Button>
        </div>
      </div>
    </main>
  )
}
