'use client'
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import { Memo } from '@/components/memo-card'

  
const FormSchema = z.object({
    title: z
      .string(),
    content: z
      .string()
      .min(1, {
        message: "何も入力されていません",
    }),
});

interface PostMemo {
    title: string
    content: string
};

export function TextEditor() {

    const [newMemo, setNewMemo] = useState<PostMemo>({ title: '', content: ''})

    const handleSubmit = async () => {
        // await api.get('/');
        const response = await api.post('/memos', newMemo);
        console.log(response);
    }

    return (
        <div className="w-2/3 space-y-4">
            <Input
                type="text"
                placeholder="タイトル"
                value={newMemo.title}
                onChange={(e) => setNewMemo({ ...newMemo, title: e.target.value })}
                className="mb-2"
            />
            <textarea
                placeholder="メモの内容"
                value={newMemo.content}
                onChange={(e) => setNewMemo({ ...newMemo, content: e.target.value })}
                className="w-full p-2 border rounded mb-2"
                rows={3}
            />
            <Button onClick={handleSubmit}>Submit</Button>
        </div>
    );
}