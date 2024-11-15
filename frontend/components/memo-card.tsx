import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

export type Tag = {
  id: number;
  name: string;
}

export type Memo = {
  id: number;
  user_id: number;
  title: string;
  content: string;
  created_at: Date;
  updated_at: Date;
  tags: Tag[];
};

export interface MemoCardProps {
  memo: Memo;
  onDelete: (id: number) => void;
  onUpdate: (updatedMemo: Memo) => void;  // 編集後のメモを親コンポーネントに渡す
  isDarkTheme: boolean;
};

export const MemoCard: React.FC<MemoCardProps> = ({ memo, onDelete, onUpdate, isDarkTheme }) => {

  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [updatedMemo, setUpdatedMemo] = useState({ ...memo });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedMemo({ ...updatedMemo, title: e.target.value });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
	// テキストエリアの高さを自動調整
	if (textareaRef.current) {
		textareaRef.current.style.height = 'auto'
		textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
	}
    setUpdatedMemo({ ...updatedMemo, content: e.target.value });
  };

  const handleSubmitEdit = () => {
    onUpdate(updatedMemo);  // 親コンポーネントに更新したメモを渡す
    setIsEditingTitle(false);
    setIsEditingContent(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`${!isDarkTheme ? "bg-[#fff] text-[#000]":"bg-[#000] text-[#fff]"} transition hover:opacity-75 hover:scale-105`}>
        <CardHeader className=''>
          <div className="flex justify-between items-center relative">
            {isEditingTitle ? (
              <Input
                value={updatedMemo.title}
                onChange={handleTitleChange}
                autoFocus
                onBlur={() => setIsEditingTitle(false)}  // 編集終了
                className={`w-[85%] ${!isDarkTheme ? "bg-[#fff] text-[#000]":"bg-[#000] text-[#fff]"}`}
              />
            ) : (
              <CardTitle onClick={() => setIsEditingTitle(true)} className="overflow-hidden min-h-5 w-[85%]">{memo.title}</CardTitle>
            )}
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-0 right-0"
                onClick={() => onDelete(memo.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isEditingContent ? (
            <textarea
			  ref={textareaRef}
              value={updatedMemo.content}
			  onFocus={textareaRef.current ? (e) => {textareaRef.current.style.height = "auto"; textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`} : () => {}}
              onChange={handleContentChange}
              onBlur={() => setIsEditingContent(false)}  // 編集終了
              className={`w-full resize-none overflow-y-auto max-h-[65vh] ${!isDarkTheme ? "bg-[#fff] text-[#000]":"bg-[#000] text-[#fff]"}`}
              autoFocus
            />
          ) : (
            <p onClick={() => setIsEditingContent(true)} className="overflow-clip">{memo.content}</p>  // クリックで編集モードへ
          )}
          <div className="mt-2">
            {memo.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="mr-1">
                {tag.name}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter>
		  <div className="flex gap-4 justify-between items-center">
			<p className="text-xs text-gray-500">作成日時 {memo.created_at.toString()}</p>
			{(isEditingTitle || isEditingContent) && (
			  <Button onClick={handleSubmitEdit}>保存</Button>
			)}
		  </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
