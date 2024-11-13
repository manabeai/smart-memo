'use client'
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Badge } from "@/components/ui/badge"

import { toast } from "@/hooks/use-toast"
import { Button } from "./ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"
import api from '@/utils/index'
import { Memo, Tag } from '@/components/memo-card'

  
const FormSchema = z.object({
    title: z
      .string(),
    content: z
      .string()
      .min(1, {
        message: "何も入力されていません",
    }),
});

type suggestedTag = {
    name: string
    is_user_defined: number | null
}

interface PostMemo {
    title: string
    content: string
};

interface CreateMemo extends PostMemo {
    tags: suggestedTag[]
};

interface TextEditorProps {
    onMemoCreate: (memo: Memo) => void;
}

export function TextEditor({ onMemoCreate }: TextEditorProps) {

    const [newMemo, setNewMemo] = useState<PostMemo>({ title: '', content: ''})
    const [suggestedTags, setSuggestedTags] = useState<suggestedTag[]>([])
    const [selectedTags, setSelectedTags] = useState<suggestedTag[]>([])
    const handleSubmit = async () => {
        const response = await api.post('/memos', newMemo);
        setSuggestedTags(response["data"]["tags"]);
        setSelectedTags([])
        console.log(response);
      }
      
      const handleMemoCreate = async () => {
        const response = await api.post('/memos/create', { ...newMemo, tags:selectedTags });
        setSuggestedTags([])
        setSelectedTags([])
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
        <div className="w-2/3 space-y-4">
        <Input
          type="text"
          placeholder="タイトル"
          value={newMemo.title}
          onChange={(e) => setNewMemo({ ...newMemo, title: e.target.value })}
          className="mb-2"
        />
        <Textarea
          placeholder="メモの内容"
          value={newMemo.content}
          onChange={(e) => setNewMemo({ ...newMemo, content: e.target.value })}
          className="w-full p-2 border rounded mb-2"
          rows={3}
        />
        <Button onClick={handleSubmit}>AI</Button>
        <Button onClick={handleMemoCreate}>作成</Button>
  
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