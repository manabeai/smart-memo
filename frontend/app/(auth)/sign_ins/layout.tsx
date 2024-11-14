'use client'
import { Button } from "@/components/ui/button"
import "@/app/globals.css";

export default function RootLayout() {
  return (
    <html lang="en">
      <body className="w-screen h-screen flex flex-col justify-center items-center">
        <Button variant="ghost" className="w-10 h-auto rounded bg-black-500 hover:bg-black-500/60">Hello!!</Button>
      </body>
    </html>
  )
}
