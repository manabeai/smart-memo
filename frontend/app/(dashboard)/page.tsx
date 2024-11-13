'use client';
import { React, useState } from 'react'
import MemoList from '@/components/memo-list'
import { TextEditor } from '@/components/text-editor'

const Page = () => {

  const [memos, setMemos] = useState<Memo[]>([]);

  const handleDeleteMemo = (id: number) => {
    setMemos((prevMemos) => prevMemos.filter((memo) => memo.id !== id));
  };

  const handleUpdateMemo = (updatedMemo: Memo) => {
    setMemos((prevMemos) =>
      prevMemos.map((memo) => (memo.id === updatedMemo.id ? updatedMemo : memo))
    );
  };

  return (
    <div>
      <TextEditor setMemos={setMemos} />
      <MemoList onDelete={handleDeleteMemo} onUpdate={handleUpdateMemo} />
    </div>
  )
};

export default Page;