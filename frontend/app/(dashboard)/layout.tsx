'use client';
import { useState } from 'react'
import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/app/globals.css";
import { PlusCircle, Moon, Sun, Search, Tag, Pin, Trash, Mic, Image, CheckSquare, Type, X, Archive, Share2, Twitter, Link, MessageCircle, Grid, List, Edit, Sparkles } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from '@/components/ui/button'
import { AppSidebar } from "@/components/app-sidebar"
import { TextEditor } from "@/components/text-editor"
import MemoComponent from "@/components/MemoComponent";
import { SignInButton } from '@/components/sign-in-bottun'

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

type ViewMode = 'grid' | 'list'

export default function RootLayout({ children }: Readonly<{children: React.ReactNode;}>) {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  return (
<html lang="en">
  <TooltipProvider>
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}>
      <SidebarProvider>
        <AppSidebar />
        <main className="ml-5 mt-5 gap-y-5 flex flex-col h-full w-full">
          <div className={`h-full w-full p-4 ${isDarkTheme ? 'dark bg-gradient-to-br from-gray-900 to-purple-900' : 'bg-gradient-to-br from-pink-200 to-blue-200'}`}>
            <SidebarTrigger />
            <div className="flex justify-between items-center mb-6">
              <Button variant="ghost" size="icon" onClick={() => setIsDarkTheme(!isDarkTheme)}
                      className="bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300">
                {isDarkTheme ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
              </Button>
            </div>
            <MemoComponent />
            {children}
          </div>
        </main>
      </SidebarProvider>
    </body>
  </TooltipProvider>
</html>

  );
}