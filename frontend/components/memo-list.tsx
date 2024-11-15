"use client";
import React from 'react'
import { MemoCard, Memo } from './memo-card'

interface MemoListProps {
  memos: Memo[];
  onDelete: (id: number) => void;
  onUpdate: (updateMemo: Memo) =>  void;
  isDarkTheme: boolean;
}

// デフォルトでServer Componentとして動作します
export default function MemoList({ memos, onDelete, onUpdate, isDarkTheme }: MemoListProps) {

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className={`text-3xl font-bold mb-6 ${(!isDarkTheme) ? ' text-[#000]' : 'text-[#fff]'}`}>メモ一覧</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memos.map((memo: Memo) => (
          <MemoCard key={memo.id} memo={memo} onDelete={onDelete} onUpdate={onUpdate} isDarkTheme={isDarkTheme} />
        ))}
      </div>
    </div>
  );
}