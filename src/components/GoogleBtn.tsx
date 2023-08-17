"use client";

import { Button } from "@/components/ui/button";

import { GoogleLogo } from "phosphor-react";

export function GoogleBtn() {
  return (
    <Button className="flex items-center gap-2 w-56" variant={"destructive"}>
      <GoogleLogo size={24} weight="bold" />
      Criar conta com Google
    </Button>
  );
}
