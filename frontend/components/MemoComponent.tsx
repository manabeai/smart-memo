'use client'

import React, { useState, useEffect } from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { HexColorPicker } from 'react-colorful'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Search, Tag, Archive, Trash, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

const ResponsiveGridLayout = WidthProvider(Responsive)

interface MemoCard {
  id: string
  title: string
  content: string
  color: string
  tags: string[]
  createdAt: Date
  isArchived: boolean
  reminder?: Date
}

const MemoCard: React.FC<{ 
  card: MemoCard; 
  onDelete: () => void; 
  onArchive: () => void;
  onChange: (card: MemoCard) => void;
  onColorChange: (color: string) => void;
  onReminder: (date: Date) => void;
}> = ({ card, onDelete, onArchive, onChange, onColorChange, onReminder }) => {
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false)
  const [isReminderOpen, setIsReminderOpen] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`h-full`} style={{ backgroundColor: card.color }}>
        <CardHeader className="p-2">
          <div className="flex justify-between items-center">
            <Input
              className="font-bold bg-transparent border-none"
              value={card.title}
              onChange={(e) => onChange({ ...card, title: e.target.value })}
              placeholder="タイトル"
            />
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={onArchive}>
                <Archive className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onDelete}>
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-2">
          <Textarea
            className="w-full bg-transparent border-none resize-none"
            value={card.content}
            onChange={(e) => onChange({ ...card, content: e.target.value })}
            placeholder="内容"
          />
        </CardContent>
        <CardFooter className="p-2 flex flex-wrap gap-2">
          {card.tags.map((tag, index) => (
            <span key={index} className="bg-gray-200 rounded-full px-2 py-1 text-sm">
              {tag}
            </span>
          ))}
          <Dialog open={isColorPickerOpen} onOpenChange={setIsColorPickerOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">色を変更</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>色を選択</DialogTitle>
              </DialogHeader>
              <HexColorPicker color={card.color} onChange={(color) => {
                onColorChange(color)
                setIsColorPickerOpen(false)
              }} />
            </DialogContent>
          </Dialog>
          <Dialog open={isReminderOpen} onOpenChange={setIsReminderOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm"><Clock className="h-4 w-4 mr-2" />リマインダー</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>リマインダーを設定</DialogTitle>
              </DialogHeader>
              <Input
                type="datetime-local"
                onChange={(e) => {
                  onReminder(new Date(e.target.value))
                  setIsReminderOpen(false)
                }}
              />
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default function Component() {
  const [cards, setCards] = useState<MemoCard[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')

  const addCard = () => {
    const newCard: MemoCard = {
      id: Date.now().toString(),
      title: '',
      content: '',
      color: '#ffffff',
      tags: [],
      createdAt: new Date(),
      isArchived: false,
    }
    setCards([...cards, newCard])
  }

  const deleteCard = (id: string) => {
    setCards(cards.filter(card => card.id !== id))
  }

  const archiveCard = (id: string) => {
    setCards(cards.map(card => card.id === id ? { ...card, isArchived: !card.isArchived } : card))
  }

  const updateCard = (updatedCard: MemoCard) => {
    setCards(cards.map(card => card.id === updatedCard.id ? updatedCard : card))
  }

  const changeCardColor = (id: string, color: string) => {
    setCards(cards.map(card => card.id === id ? { ...card, color } : card))
  }

  const setReminder = (id: string, date: Date) => {
    setCards(cards.map(card => card.id === id ? { ...card, reminder: date } : card))
  }

  const generateTags = async (content: string) => {
    // OpenAIの統合をモックアップ
    const mockTags = ['重要', 'タスク', '会議', '個人', '仕事', 'アイデア']
    return mockTags.filter(() => Math.random() > 0.5)
  }

  useEffect(() => {
    const updateTagsForCards = async () => {
      const updatedCards = await Promise.all(cards.map(async (card) => {
        if (card.tags.length === 0) {
          const newTags = await generateTags(card.content)
          return { ...card, tags: newTags }
        }
        return card
      }))
      setCards(updatedCards)
    }

    updateTagsForCards()
  }, [cards])

  const filteredCards = cards
    .filter(card => !card.isArchived)
    .filter(card => 
      card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'createdAt') {
        return b.createdAt.getTime() - a.createdAt.getTime()
      } else if (sortBy === 'color') {
        return a.color.localeCompare(b.color)
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title)
      }
      return 0
    })

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return
    }
    const items = Array.from(filteredCards)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    setCards([...items, ...cards.filter(card => card.isArchived)])
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex gap-4">
        <Button onClick={addCard}>
          <Plus className="mr-2 h-4 w-4" /> 新しいメモを追加
        </Button>
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="並べ替え" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">日付</SelectItem>
            <SelectItem value="color">色</SelectItem>
            <SelectItem value="title">タイトル</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="cards" direction="horizontal">
          {(provided) => (
            <ResponsiveGridLayout
              className="layout"
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
              rowHeight={30}
              isResizable={true}
              isBounded={true}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <AnimatePresence>
                {filteredCards.map((card, index) => (
                  <Draggable key={card.id} draggableId={card.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="h-full"
                        data-grid={{
                          x: (index % 4) * 3,
                          y: Math.floor(index / 4) * 3,
                          w: 3,
                          h: Math.max(2, Math.ceil((card.title.length + card.content.length) / 50)),
                          minW: 2,
                          maxW: 6,
                          minH: 2,
                          maxH: 10,
                        }}
                      >
                        <MemoCard
                          card={card}
                          onDelete={() => deleteCard(card.id)}
                          onArchive={() => archiveCard(card.id)}
                          onChange={updateCard}
                          onColorChange={(color) => changeCardColor(card.id, color)}
                          onReminder={(date) => setReminder(card.id, date)}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
              </AnimatePresence>
              {provided.placeholder}
            </ResponsiveGridLayout>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}