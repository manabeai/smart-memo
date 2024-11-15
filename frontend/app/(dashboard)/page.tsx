'use client';
import { useState, useEffect } from 'react'
import MemoList from '@/components/memo-list'
import { TextEditor } from '@/components/text-editor'
import { Memo, Tag } from '@/components/memo-card'
import api from '@/utils/index'
import { Button } from '@/components/ui/button'
import { Moon, Sun, } from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from '@/components/app-sidebar'

const Page = () => {

  const [memos, setMemos] = useState<Memo[]>([]);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<null | number>(null)

  const fetchMemos = async () => {
    try {
      const response = await api.get('/memos'); // /memosからデータを取得
      setMemos(response.data); // 取得したデータをステートに設定
    } catch (error) {
      console.error("メモの取得に失敗しました:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await api.get('/tags');
      setTags(response.data);
    } catch (error) {
      console.error("タグの取得に失敗しました:", error);
    }
  };
  useEffect(() => {
    fetchTags();
    fetchMemos();
  }, []);

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
    fetchTags();
  }

  const handleTagClick = (tagId: number) => {
    setSelectedTag((prevTagId) => (prevTagId === tagId ? null : tagId));
  };

  const filteredMemos = selectedTag
    ? memos.filter((memo) => memo.tags.some((tag) => tag.id === selectedTag))
    : memos;

  return (

    <SidebarProvider>
      <AppSidebar tags={tags} onClickTag={handleTagClick} isDarkTheme={isDarkTheme} />
      <main className={`h-auto w-screen bg-gradient-to-br ${!isDarkTheme ? 'from-pink-200 to-blue-200' : 'from-gray-900 to-purple-900'}`}>
        <div className={`h-auto w-full`}>
          <div className={`flex justify-start`}>
            <SidebarTrigger />
            <div className="flex justify-between items-center mb-6">
              <Button variant="ghost" size="icon" onClick={() => setIsDarkTheme(!isDarkTheme)}
                className={`bg-transparent ${!isDarkTheme ? "text-[#000] hover:bg-[#fff]/60" : "text-[#fff] hover:text-[#fff] hover:bg-[#000]/60"} transition-all duration-300`}>
                {isDarkTheme ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
              </Button>
            </div>
          </div>

        </div>
        <TextEditor onMemoCreate={handleNewMemo} isDarkTheme={isDarkTheme} />
        <MemoList memos={filteredMemos} onDelete={handleDeleteMemo} onUpdate={handleUpdateMemo} isDarkTheme={isDarkTheme} />
      </main>
    </SidebarProvider>
  )
};

export default Page;
