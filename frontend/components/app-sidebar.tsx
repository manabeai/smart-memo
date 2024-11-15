'use client'

import { useState } from 'react'
import { Home, Settings, ChevronDown, Tag as IconTagg } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tag } from '@/components/memo-card'

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
} from '@/components/ui/sidebar'

interface AppSidebarProps {
  tags: Tag[]
  onClickTag: (tagId: number) => void;
	isDarkTheme: boolean;
}

export function AppSidebar({ tags, onClickTag, isDarkTheme }: AppSidebarProps) {

  const [isTagsOpen, setIsTagsOpen] = useState(false)
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null)

  const handleTagClick = (tagId: number) => {
    setSelectedTagId(tagId)
    onClickTag(tagId)
  }

  return (
    
      <Sidebar>
        <SidebarContent>
          <SidebarGroup className={`h-full ${!isDarkTheme ? "bg-[#fff] text-[#000]" : "bg-[#000] text-[#fff]"}`}>
            <SidebarGroupLabel className={`${!isDarkTheme ? "text-[#000]/60" : "text-[#fff]/60"}`}>アイテム</SidebarGroupLabel>
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
                          <IconTagg className="mr-2 h-4 w-4" />
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