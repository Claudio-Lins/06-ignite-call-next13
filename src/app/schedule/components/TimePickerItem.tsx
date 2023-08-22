import { ButtonHTMLAttributes } from "react"

export function TimePickerItem({
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="rounded bg-gray-600 py-2 text-sm leading-relaxed text-gray-100 last:mb-6 focus:shadow-[0_0_0_2px] focus:shadow-gray-100 enabled:hover:bg-gray-500 disabled:cursor-default disabled:bg-transparent disabled:opacity-40 max-md:last:mb-0"
    >
      {children}
    </button>
  )
}
