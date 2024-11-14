// app/(auth)/sign_ins/page.tsx
'use client'

import api from '@/utils/index';
import { Button } from '@/components/ui/button';
import "@/app/globals.css";

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
			<p className={`text-8xl text-[#000]`}>MemoritAI</p>
			<Button
				onClick={handlePost}
				className={"bg-[#000] hover:bg-[#000]/60 w-auto h-auto rounded"}>
				Get Start
			</Button>
		</div>
  );
};

export default Page;
