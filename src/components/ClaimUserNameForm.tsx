"use client";

import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ArrowRight } from "phosphor-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

const claimUsernameFormSchema = z.object({
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
});

type ClaimUsernameFormData = z.infer<typeof claimUsernameFormSchema>;

export function ClaimUserNameForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClaimUsernameFormData>({
    resolver: zodResolver(claimUsernameFormSchema),
  });

  async function handleClaimUsername(data: ClaimUsernameFormData) {
    const { username } = data;
    await router.push(`/register?username=${username}`);
    reset();
  }

  return (
    <form
      onSubmit={handleSubmit(handleClaimUsername)}
      className="flex flex-col bg-gray-800 p-4 rounded-lg"
    >
      <div className="flex items-center gap-2 mb-2">
        <span>clins.com/</span>
        <Input
          type="text"
          placeholder="Seu usuário"
          {...register("username")}
          className="
          bg-gray-800
          text-white
          placeholder-gray-400
          focus:ring-0
          focus:outline-none
        "
        />
        <Button type="submit" disabled={isSubmitting}>
          Resevar usuário
          <ArrowRight />
        </Button>
      </div>
      {/* TODO: Show error messages */}
      {errors.username && (
        <small className="text-red-200">{errors.username.message}</small>
      )}
    </form>
  );
}
