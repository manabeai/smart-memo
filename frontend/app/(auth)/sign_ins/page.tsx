// app/(auth)/sign_ins/page.tsx
'use client'

import api from '@/utils/index';
import { Button } from '@/components/ui/button';
import localFont from "next/font/local";
import "@/app/globals.css";

const geistUbuntuMono = localFont({
	src: "../../fonts/UbuntuMono-Regular.ttf",
	variable: "--font-ubuntu-mono",
});

const handlePost = async () => {
  try {
    const response = await api.post('/sign_ins');
    console.log('Response:', response.data);
    window.location.href = '/';
  } catch (error) {
    console.error('Error:', error);
  }
};

const Page = () => {
  return (
		<div className={`w-[50%] h-[40%] flex flex-col items-center justify-around`}>
			<p className={`text-8xl text-[#000] ${geistUbuntuMono.variable} antialiased`}>MemoritAI</p>
			<Button
				onClick={handlePost}
				className={"bg-[#000] hover:bg-[#000]/60 w-auto h-auto rounded text-1xl text-[#fff] "}>
				Get Start
			</Button>
		</div>
  );
};

export default Page;
