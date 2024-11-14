'use client'

import { useState } from 'react'
import { Home, Tag, Settings, ChevronDown } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
// import * as Lucide from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarProvider,
} from '@/components/ui/sidebar'

type Tag = {
  id: number;
  name: string;
};

export type AppSidebarProps = {
  tags: Tag[];
  onClickTag: (tagId: number) => void;
}

// テスト用のタグデータ
const testTags: Tag[] = [
  { id: 1, name: "仕事" },
  { id: 2, name: "個人" },
  { id: 3, name: "アイデア" },
  { id: 4, name: "プロジェクト" },
  { id: 5, name: "学習" },
]

export function AppSidebar({ tags, onClickTag }: AppSidebarProps) {
  const [isTagsOpen, setIsTagsOpen] = useState(false)
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null)

  const handleTagClick = (tagId: number) => {
    setSelectedTagId(tagId)
    onClickTag(tagId)
  }

  return (
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>アイテム</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#">
                      <Home className="mr-2 h-4 w-4" />
                      <span>メモ</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <Collapsible open={isTagsOpen} onOpenChange={setIsTagsOpen}>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="w-full justify-between">
                        <div className="flex items-center">
                          <Tag className="mr-2 h-4 w-4" />
                          <span>タグ</span>
                        </div>
                        <ChevronDown className={`h-4 w-4 transition-transform ${isTagsOpen ? 'rotate-180' : ''}`} />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {tags.map((tag) => (
                          <SidebarMenuSubItem key={tag.id}>
                            <SidebarMenuSubButton
                              onClick={() => handleTagClick(tag.id)}
                              className={selectedTagId === tag.id ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}
                            >
                              {tag.name}
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>設定</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
  )
}