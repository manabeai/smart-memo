'use client';

import { useState, ReactNode } from 'react'
import React from 'react';
import localFont from "next/font/local";
import "@/app/globals.css";

import { TooltipProvider } from "@/components/ui/tooltip"
import { SidebarProvider } from "@/components/ui/sidebar"


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

interface RootLayoutProps {
	children: ReactNode;
  }

export default function RootLayout({ children }: RootLayoutProps) {
	
	return (
		<html lang="ja">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased h-auto`}>
			<SidebarProvider>
			<TooltipProvider>
				
				    {children}
				
			</TooltipProvider>
			</SidebarProvider>
			</body>
		</html>

	);
}
