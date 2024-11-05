"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import api from '@/utils/index.ts'; // axiosインスタンスをインポート

let init : boolean = false;
export default function Posts() {
	const [data, setData] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			console.log("APIを叩きました");
		  init = true;
			const result = await api.get("/posts");
			setData(result.data)
		};
		if (!init) {
			fetchData();
		}
	}, [])

	return (
		<ScrollArea className="h-[400px] w-full rounded-md border p-4">
			<h2 className="text-2xl font-bold mb-4">投稿</h2>
			<ul className="grid gap-4">
				{data && data.map((post) => (
					<li key={post.id}>
						<Card>
							<CardHeader>
								<CardTitle>{post.title}</CardTitle>
							</CardHeader>
						</Card>
					</li>
				))}
			</ul>
		</ScrollArea>
	);
}
