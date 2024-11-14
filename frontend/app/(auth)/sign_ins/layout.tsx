'use client'
import Page from './page';
import "@/app/globals.css";

export default function RootLayout() {
  return (
    <html lang="en">
      <body className="w-screen h-screen flex flex-col justify-center items-center">
        <Page />
      </body>
    </html>
  )
}
