"use client";
import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import api from '@/utils/index.ts';
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

type Memo = {
  id: number
  user_id: number
  title: string
  content: string
  created_at: string
  updated_at: string
}

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'yyyy年MM月dd日 HH:mm', { locale: ja })
}

// デフォルトでServer Componentとして動作します
export default function MemoList() {  
  const [memos, setMemos] = useState<Memo[]>([]); // ステートフックでメモを管理

  useEffect(() => {
    const fetchMemos = async () => {
      try {
        const response = await api.get('/memos'); // /memosからデータを取得
        setMemos(response.data); // 取得したデータをステートに設定
      } catch (error) {
        console.error("メモの取得に失敗しました:", error);
      }
    };

    fetchMemos(); // コンポーネントマウント時にデータをフェッチ
  }, []); // 空の依存配列で、初回レンダリング時のみ実行

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">メモ一覧</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memos.map((memo) => (
          <Card key={memo.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{memo.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{memo.content}</p>
              <div className="text-xs text-gray-500">
                <p>作成日時: {formatDate(memo.created_at)}</p>
                <p>更新日時: {formatDate(memo.updated_at)}</p>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-gray-500">ID: {memo.id}</p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
