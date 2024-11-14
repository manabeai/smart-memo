'use client';
import { useState, useEffect } from 'react'
import MemoList from '@/components/memo-list'
import { TextEditor } from '@/components/text-editor'
import { Memo } from '@/components/memo-card'
import api from '@/utils/index'

interface PageProps {
  isDarkTheme: boolean;
}

const Page = ({isDarkTheme}: PageProps) => {
  
  const [memos, setMemos] = useState<Memo[]>([]);

  const fetchMemos = async () => {
    try {
      const response = await api.get('/memos'); // /memosからデータを取得
      setMemos(response.data); // 取得したデータをステートに設定
    } catch (error) {
      console.error("メモの取得に失敗しました:", error);
    }
  };
  useEffect(() => {
      fetchMemos(); // コンポーネントマウント時にデータをフェッチ
    }, []); // 空の依存配列で、初回レンダリング時のみ実行

  const handleDeleteMemo = (id: number) => {
    setMemos((prevMemos) => prevMemos.filter((memo) => memo.id !== id));
    api.delete(`/memos/${id}`)
  };

  const handleUpdateMemo = (updatedMemo: Memo) => {
    setMemos((prevMemos) =>
      prevMemos.map((memo) => (memo.id === updatedMemo.id ? updatedMemo : memo))
    );
  };

  const handleNewMemo = (newMemo: Memo) => {
    setMemos((memos) => [newMemo, ...memos]);
  }

  return (
    <div>
      <TextEditor onMemoCreate={handleNewMemo} isDarkTheme={isDarkTheme}/>
      <MemoList memos={memos} onDelete={handleDeleteMemo} onUpdate={handleUpdateMemo} isDarkTheme={isDarkTheme}/>
    </div>
  )
};

export default Page;