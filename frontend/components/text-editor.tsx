'use client'
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Badge } from "@/components/ui/badge"
import { Button } from "./ui/button"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"
import api from '@/utils/index'
import axios from 'axios';
import { Memo, Tag } from '@/components/memo-card'

const FormSchema = z.object({
	title: z.string(),
	content: z.string().min(1, {
		message: "何も入力されていません",
	}),
});

type SuggestedTag = {
	name: string
	is_user_defined: number | null
}

interface PostMemo {
	title: string
	content: string
};

interface CreateMemo extends PostMemo {
	tags: SuggestedTag[]
};

interface TextEditorProps {
	onMemoCreate: (memo: Memo) => void;
	isDarkTheme: boolean;
}

export function TextEditor({ onMemoCreate, isDarkTheme }: TextEditorProps) {

	const [newMemo, setNewMemo] = useState<PostMemo>({ title: '', content: '' })
	const [suggestedTags, setSuggestedTags] = useState<SuggestedTag[]>([])
	const [selectedTags, setSelectedTags] = useState<SuggestedTag[]>([])

	const handleSubmit = async () => {
		try {
			const response = await axios.post('https://api.openai.com/v1/completions', {
				model: "gpt-4-turbo",
				prompt: `タイトル: ${newMemo.title}\n内容: ${newMemo.content}\nこのメモに適したタグを3から5つ出力してください。`,
				max_tokens: 50,
				n: 1,
				stop: null,
				temperature: 0.5
			  }, {
				headers: {
				  'Authorization': `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`,
				  'Content-Type': 'application/json'
				}
			  });			  

			const generatedTags = response.data.choices[0].text.trim().split(',').map(tag => ({
				name: tag.trim(),
				is_user_defined: null
			}));
			setSuggestedTags(generatedTags);

		} catch (error) {
			console.error("AIメモの作成に失敗しました:", error);
		}
	};

	const handleMemoCreate = async () => {
		try {
		  const response = await api.post('/memos/create', {
			memo: newMemo,
			tags: selectedTags.map(tag => ({
			  name: tag.name,
			  is_user_defined: tag.is_user_defined
			}))
		  });
		  setSuggestedTags([]);
		  setSelectedTags([]);
		  onMemoCreate(response.data);
		  console.log('メモ作成に成功', response);
		} catch (error) {
		  console.error("メモの作成に失敗しました:", error);
		}
	  };	  

	const handleTagClick = (tag: SuggestedTag) => {
		setSelectedTags(prevTags =>
			prevTags.some(t => t.name === tag.name)
				? prevTags.filter(t => t.name !== tag.name)
				: [...prevTags, tag]
		)
	};

	const isTagSelected = (tag: Tag) => selectedTags.some(t => t.name === tag.name);

	return (
		<div className="w-2/3 space-y-4 mx-auto">
			<Input
				type="text"
				placeholder="タイトル"
				value={newMemo.title}
				onChange={(e) => setNewMemo({ ...newMemo, title: e.target.value })}
				className={`mb-2 ${!isDarkTheme ? "bg-[#fff] text-[#000]" : "bg-[#000] text-[#fff]"}`}
			/>
			<Textarea
				placeholder="メモの内容"
				value={newMemo.content}
				onChange={(e) => setNewMemo({ ...newMemo, content: e.target.value })}
				className={`w-full p-2 border rounded mb-2 ${!isDarkTheme ? "bg-[#fff] text-[#000]" : "bg-[#000] text-[#fff]"}`}
				rows={3}
			/>
			<div className='flex justify-start gap-x-3'>
				<Button onClick={handleSubmit} className={`${!isDarkTheme ? "text-[#fff] bg-[#000] hover:bg-[#000]/60" : "text-[#000] bg-[#fff] hover:bg-[#fff]/60"}`}>AI</Button>
				<Button onClick={handleMemoCreate} className={`${!isDarkTheme ? "text-[#fff] bg-[#000] hover:bg-[#000]/60" : "text-[#000] bg-[#fff] hover:bg-[#fff]/60"}`}>作成</Button>
			</div>

			{suggestedTags.length > 0 && (
				<div className="mt-4">
					<h3 className="text-lg font-semibold mb-2">おすすめのタグ：</h3>
					<div className="flex flex-wrap gap-2">
						{suggestedTags.map((tag, index) => (
							<Badge
								key={index}
								variant={tag.is_user_defined === null ? "secondary" : "default"}
								className={`cursor-pointer ${isTagSelected(tag) ? 'ring-2 ring-blue-500' : ''}`}
								onClick={() => handleTagClick(tag)}
							>
								{tag.name}
								{tag.is_user_defined === null && (
									<span className="ml-1 text-xs">(新規)</span>
								)}
							</Badge>
						))}
					</div>
				</div>
			)}
		</div>
	)
}
