'use client'
import "@/app/globals.css";
import Page from "@/app/(auth)/sign_ins/page";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="w-screen h-screen flex flex-col justify-center items-center">
        <Page />
      </body>
    </html>
  )
}