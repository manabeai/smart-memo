'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

// OpenAI APIのモックアップ関数
const mockGenerateTags = async (content: string) => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  return ['タグ1', 'タグ2', 'タグ3']
}

interface Memo {
  id: number
  title: string
  content: string
  color: string
  tags: string[]
}

const ColorPicker = ({ colors, selectedColor, onColorSelect }) => (
  <div className="grid grid-cols-5 gap-2">
    {colors.map((color) => (
      <motion.button
        key={color}
        className="w-8 h-8 rounded-full"
        style={{ backgroundColor: color }}
        onClick={() => onColorSelect(color)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      />
    ))}
  </div>
)

const MemoCard = ({ memo, onDelete }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ duration: 0.3 }}
  >
    <Card style={{ backgroundColor: memo.color }}>
      <CardHeader>
        <CardTitle>{memo.title}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2"
          onClick={() => onDelete(memo.id)}
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <p>{memo.content}</p>
        <div className="mt-2">
          {memo.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="mr-1">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  </motion.div>
)

export default function MemoApp() {
  const [memos, setMemos] = useState<Memo[]>([])
  const [newMemo, setNewMemo] = useState({ title: '', content: '', color: '#ffffff' })
  const [searchTerm, setSearchTerm] = useState('')
  const [isColorModalOpen, setIsColorModalOpen] = useState(false)

  const colors = ['#ffffff', '#f28b82', '#fbbc04', '#fff475', '#ccff90', '#a7ffeb', '#cbf0f8', '#aecbfa', '#d7aefb', '#fdcfe8']

  const addMemo = async () => {
    if (newMemo.title || newMemo.content) {
      const tags = await mockGenerateTags(newMemo.content)
      const memo: Memo = {
        id: Date.now(),
        ...newMemo,
        tags
      }
      setMemos([...memos, memo])
      setNewMemo({ title: '', content: '', color: '#ffffff' })
    }
  }

  const deleteMemo = (id: number) => {
    setMemos(memos.filter(memo => memo.id !== id))
  }

  const filteredMemos = memos.filter(memo =>
    memo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    memo.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    memo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const onDragEnd = (result) => {
    if (!result.destination) return

    const items = Array.from(filteredMemos)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setMemos(items)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex gap-2">
        <Input
          type="text"
          placeholder="検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Search className="w-6 h-6 text-gray-500" />
      </div>

      <div className="mb-4">
        <Input
          type="text"
          placeholder="タイトル"
          value={newMemo.title}
          onChange={(e) => setNewMemo({ ...newMemo, title: e.target.value })}
          className="mb-2"
        />
        <textarea
          placeholder="メモの内容"
          value={newMemo.content}
          onChange={(e) => setNewMemo({ ...newMemo, content: e.target.value })}
          className="w-full p-2 border rounded mb-2"
          rows={3}
        />
        <div className="flex justify-between">
          <Dialog open={isColorModalOpen} onOpenChange={setIsColorModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" style={{ backgroundColor: newMemo.color }}>
                色を選択
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>色を選択</DialogTitle>
              </DialogHeader>
              <ColorPicker
                colors={colors}
                selectedColor={newMemo.color}
                onColorSelect={(color) => {
                  setNewMemo({ ...newMemo, color })
                  setIsColorModalOpen(false)
                }}
              />
            </DialogContent>
          </Dialog>
          <Button onClick={addMemo}>
            <Plus className="mr-2 h-4 w-4" /> メモを追加
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="memos">
          {(provided) => (
            <motion.div
              {...provided.droppableProps}
              ref={provided.innerRef}
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              <AnimatePresence>
                {filteredMemos.map((memo, index) => (
                  <Draggable key={memo.id} draggableId={memo.id.toString()} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <MemoCard memo={memo} onDelete={deleteMemo} />
                      </div>
                    )}
                  </Draggable>
                ))}
              </AnimatePresence>
              {provided.placeholder}
            </motion.div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}