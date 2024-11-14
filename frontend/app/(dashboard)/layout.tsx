'use client';
import { cloneElement, useState } from 'react'
import React from 'react';
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

import Page from "./page"

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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
	const [isDarkTheme, setIsDarkTheme] = useState(false);
	return (
		<html lang="ja">
			<TooltipProvider>
				<body className={`${geistSans.variable} ${geistMono.variable} antialiased h-auto`}>
					<SidebarProvider>
						<AppSidebar isDarkTheme={isDarkTheme} />
						<main className={`h-auto w-screen bg-gradient-to-br ${!isDarkTheme ? 'from-pink-200 to-blue-200' : 'from-gray-900 to-purple-900'}`}>
							<div className={`h-auto w-full`}>
								<div className={`flex justify-start ml-2 mt-2 gap-x-2`}>
									<SidebarTrigger className={`bg-transparent ${!isDarkTheme ? 'text-black hover:bg-gray-100' : 'text-gray-100 hover:text-gray-100 hover:bg-purple-900'} transition-all duration-300`}/>
									<div className="flex justify-between items-center mb-6">
										<Button variant="ghost" size="icon" onClick={() => setIsDarkTheme(!isDarkTheme)}
											className={`bg-transparent ${!isDarkTheme ? 'text-black hover:bg-gray-100' : 'text-gray-100 hover:text-gray-100 hover:bg-purple-900'} transition-all duration-300`}>
											{isDarkTheme ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
										</Button>
									</div>
								</div>

								<Page isDarkTheme={isDarkTheme} />
							</div>
						</main>
					</SidebarProvider>
				</body>
			</TooltipProvider>
		</html>

	);
}
