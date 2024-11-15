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
};

export const MemoCard: React.FC<MemoCardProps> = ({ memo, onDelete, onUpdate }) => {

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [updatedMemo, setUpdatedMemo] = useState({ ...memo });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedMemo({ ...updatedMemo, title: e.target.value });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
      <Card style={{ backgroundColor: '#ffffff' }}>
        <CardHeader>
          <div className="flex justify-between items-center relative">
            {isEditingTitle ? (
              <Input
                value={updatedMemo.title}
                onChange={handleTitleChange}
                autoFocus
                onBlur={() => setIsEditingTitle(false)}  // 編集終了
                className="w-full"
              />
            ) : (
              <CardTitle onClick={() => setIsEditingTitle(true)}>{memo.title}</CardTitle>
            )}
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1"
                onClick={() => onDelete(memo.id)}
              >
                <X className="h-4 w-4" />
              </Button>
              {/* <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditingContent(true)}  // 内容編集モードを開く
              >
                <Edit className="h-4 w-4" />
              </Button> */}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isEditingContent ? (
            <textarea
              value={updatedMemo.content}
              onChange={handleContentChange}
              onBlur={() => setIsEditingContent(false)}  // 編集終了
              className="w-full"
              autoFocus
            />
          ) : (
            <p onClick={() => setIsEditingContent(true)}>{memo.content}</p>  // クリックで編集モードへ
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
          <p className="text-xs text-gray-500">Created on {memo.created_at.toString()}</p>
          {(isEditingTitle || isEditingContent) && (
            <Button onClick={handleSubmitEdit} className="mt-4">Save</Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};
