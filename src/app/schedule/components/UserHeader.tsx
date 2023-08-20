"use client"

import { Avatar, AvatarImage } from "@/components/ui/avatar"

interface UserHeaderProps {
  name: string
  bio: string
  src: string
}

export function UserHeader({ bio, name, src }: UserHeaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Avatar className="w-20 h-20 border-2">
        <AvatarImage src={src} alt={name} />
      </Avatar>
      <strong className="font-bold text-2xl">{name}</strong>
      <span className="text-gray-200">{bio}</span>
    </div>
  )
}
