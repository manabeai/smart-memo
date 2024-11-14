'use client';
import { useState, useEffect } from 'react';
import MemoList from '@/components/memo-list';
import { TextEditor } from '@/components/text-editor';
import { Memo } from '@/components/memo-card';
import api from '@/utils/index';
import { AxiosError } from 'axios';

interface PageProps {
  isDarkTheme: boolean;
}

const Page = ({ isDarkTheme }: PageProps) => {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fetchMemos = async () => {
    try {
      const response = await api.get('/memos');
      if (response.data && Array.isArray(response.data)) {
        setMemos(response.data);
      } else {
        setMemos([]);
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response) {
          setError('サーバーエラーが発生しました');
        } else if (error.request) {
          setError('サーバーからの応答がありません');
        } else {
          setError(`リクエスト設定エラー: ${error.message}`);
        }
      } else {
        setError('予期しないエラーが発生しました');
      }
      setMemos([]);
    }
  };

  useEffect(() => {
    fetchMemos();
  }, []); // 初回レンダリング時のみ実行

  const handleDeleteMemo = async (id: number) => {
    try {
      await api.delete(`/memos/${id}`);
      setMemos((prevMemos) => prevMemos.filter((memo) => memo.id !== id));
    } catch (error) {
      setError("メモの削除に失敗しました");
    }
  };

  const handleUpdateMemo = (updatedMemo: Memo) => {
    setMemos((prevMemos) =>
      prevMemos.map((memo) => (memo.id === updatedMemo.id ? updatedMemo : memo))
    );
  };

  const handleNewMemo = (newMemo: Memo) => {
    setMemos((prevMemos) => [newMemo, ...prevMemos]);
  };

  return (
    <div>
      {error && <div className="error-message">{error}</div>} {/* エラーメッセージの表示 */}
      <TextEditor onMemoCreate={handleNewMemo} isDarkTheme={isDarkTheme} />
      <MemoList memos={memos} onDelete={handleDeleteMemo} onUpdate={handleUpdateMemo} isDarkTheme={isDarkTheme} />
    </div>
  );
};

export default Page;
