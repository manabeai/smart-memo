'use client'
import React, { useState } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"
import { RefreshCcw } from "lucide-react"
import api from '@/utils/index'
import { Memo } from '@/components/memo-card'

type Tag = {
	name: string;
}

type suggestedTag = {
	name: string
	is_user_defined: number | null
}

interface PostMemo {
	title: string
	content: string
};

interface TextEditorProps {
	onMemoCreate: (memo: Memo) => void;
	isDarkTheme: boolean;
}

export function TextEditor({ onMemoCreate, isDarkTheme }: TextEditorProps) {

	const textareaRef = React.useRef<HTMLTextAreaElement>(null)
	const [newMemo, setNewMemo] = useState<PostMemo>({ title: '', content: '' })
	const [suggestedTags, setSuggestedTags] = useState<suggestedTag[]>([])
	const [selectedTags, setSelectedTags] = useState<suggestedTag[]>([])

	// 前にAIに送信したとき、または文字を消したときの文字数
	const [prevMemoLength, setPrevMemoLength] = useState<number>(0)

	const handleChangeMemo = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		// テキストエリアの高さを自動調整
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto'
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
		}

		// 削除した場合
		if (newMemo.content.length > e.target.value.length) {
			setPrevMemoLength(e.target.value.length)
		}
		else {
			// もし文字数がn文字以上増えたらAIに送信
			// 今の文字列の長さが短いほど頻度を高く(最大10)
			if (Math.min(prevMemoLength * 1.5, prevMemoLength + 10) < e.target.value.length) {
				setPrevMemoLength(e.target.value.length)
				handleSuggest({ ...newMemo, content: e.target.value })
			}
		}
		setNewMemo({ ...newMemo, content: e.target.value })
	}

	const handleSuggest = async (memoData: PostMemo) => {
		// メモが空の場合は何もしない
		// メモが空白文字のみ、または改行のみの場合は何もしない
		if (memoData.content.trim().length === 0) return;


		console.log("AIに送信")
		const response = await api.post('/memos', memoData);
		setSuggestedTags(response["data"]["tags"]);
		setSelectedTags([])
	}

	const handleMemoCreate = async (memoData: PostMemo) => {
		// メモが空の場合は何もしない
		// メモが空白文字のみ、または改行のみの場合は何もしない
		if (memoData.content.trim().length === 0) return;

		const response = await api.post('/memos/create', { ...memoData, tags: selectedTags });
		setSuggestedTags([])
		setSelectedTags([])
		setNewMemo({ title: '', content: '' })
		console.log('メモ作成に成功' + response)
		onMemoCreate(response.data);
	}

	const handleTagClick = (tag: suggestedTag) => {
		setSelectedTags(prevTags =>
			prevTags.some(t => t.name === tag.name)
				? prevTags.filter(t => t.name !== tag.name)
				: [...prevTags, tag]
		)
	}
	const isTagSelected = (tag: Tag) => selectedTags.some(t => t.name === tag.name)

	return (
		<div className="w-2/3 space-y-4 mx-auto">
			<Input
				type="text"
				placeholder="タイトル"
				value={newMemo.title}
				onChange={(e) => setNewMemo({ ...newMemo, title: e.target.value })}
				className={`mb-2 ${!isDarkTheme ? "bg-[#fff] text-[#000]":"bg-[#000] text-[#fff]"}`}
			/>
			<Textarea
				ref={textareaRef}
				placeholder="メモの内容"
				value={newMemo.content}
				onChange={handleChangeMemo}
				className={`w-full p-2 border rounded mb-2 ${!isDarkTheme ? "bg-[#fff] text-[#000]":"bg-[#000] text-[#fff]"} resize-none overflow-y-auto max-h-[65vh]`}
				rows={3}
			/>
			<Button onClick={(e) => handleMemoCreate(newMemo)} className={`${!isDarkTheme ? "text-[#fff] bg-[#000] hover:bg-[#000]/60" : "text-[#000] bg-[#fff] hover:bg-[#fff]/60"}`}>作成</Button>
			{suggestedTags.length > 0 && (
				<div className="mt-4">
					<div className="flex gap-3 items-center mb-2">
						<h3 className={`text-lg font-semibold ${!isDarkTheme ? "text-[#000]" : "text-[#fff]"}`}>おすすめのタグ</h3>
						<Button size="icon" onClick={(e) => handleSuggest(newMemo)} className={`h-6 w-6 ${!isDarkTheme ? "text-[#fff] bg-[#000] hover:bg-[#000]/60" : "text-[#000] bg-[#fff] hover:bg-[#fff]/60"}`}>
							<RefreshCcw className={`${!isDarkTheme ? "text-[#fff]" : "text-[#000]"}`} size={24} />
						</Button>
					</div>
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
