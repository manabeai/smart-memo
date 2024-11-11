'use client'

import { useState, useRef } from 'react'
import { SidebarTrigger } from "@/components/ui/sidebar";
import { PlusCircle, Moon, Sun, Search, Tag, Pin, Trash, Mic, Image, CheckSquare, Type, X, Archive, Share2, Twitter, Link, MessageCircle, Grid, List, Edit, Sparkles } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"

type NoteType = 'text' | 'checklist' | 'voice' | 'image'
type NoteStatus = 'active' | 'archived' | 'trashed'
type ViewMode = 'grid' | 'list'

type Note = {
  id: number
  type: NoteType
  title: string
  content: string
  color: string
  tags: string[]
  isPinned: boolean
  checklistItems?: { id: number; text: string; checked: boolean }[]
  voiceUrl?: string
  imageUrl?: string
  status: NoteStatus
  createdAt: Date
  updatedAt: Date
}

const colorOptions = [
  { name: 'ネオンピンク', value: 'from-pink-400 to-purple-500' },
  { name: 'エレクトリックブルー', value: 'from-blue-400 to-cyan-300' },
  { name: 'パステルアクア', value: 'from-teal-200 to-cyan-200' },
  { name: 'サンセットオレンジ', value: 'from-orange-300 to-pink-300' },
  { name: 'ディープパープル', value: 'from-purple-500 to-indigo-500' },
]

const ColorPicker = ({ selectedColor, onColorSelect }) => {
  return (
    <div className="grid grid-cols-5 gap-2">
      {colorOptions.map((color) => (
        <TooltipProvider key={color.value}>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                className={`w-8 h-8 rounded-full shadow-md bg-gradient-to-br ${color.value} ${selectedColor === color.value ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                onClick={() => onColorSelect(color.value)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`色を選択: ${color.name}`}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>{color.name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  )
}

const shareNote = (note: Note, method: string) => {
  switch (method) {
    case 'link':
      const link = `https://yourdomain.com/share/${note.id}`
      navigator.clipboard.writeText(link)
      alert('リンクがクリップボードにコピーされました')
      break
    case 'twitter':
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(note.title)}&url=${encodeURIComponent(`https://yourdomain.com/share/${note.id}`)}`
      window.open(twitterUrl, '_blank')
      break
    case 'line':
      const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(`https://yourdomain.com/share/${note.id}`)}`
      window.open(lineUrl, '_blank')
      break
  }
}

// AIによるタグ生成の仮実装
const generateTags = () => {
  return ['AI', '自動生成', 'タグ']
}

export default function Component() {
  const [notes, setNotes] = useState<Note[]>([])
  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<NoteStatus>('active')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [newNote, setNewNote] = useState<Omit<Note, 'id' | 'status' | 'createdAt' | 'updatedAt'>>({
    type: 'text',
    title: '',
    content: '',
    color: colorOptions[0].value,
    tags: [],
    isPinned: false,
    checklistItems: []
  })
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)

  const addNote = async () => {
    if (newNote.title.trim() !== '' || newNote.content.trim() !== '' || newNote.checklistItems?.length > 0 || newNote.voiceUrl || newNote.imageUrl) {
      setIsAdding(true)
      await new Promise(resolve => setTimeout(resolve, 1000)) // 擬似的な遅延
      const now = new Date()
      setNotes([
        {
          ...newNote,
          id: Date.now(),
          status: 'active',
          createdAt: now,
          updatedAt: now
        },
        ...notes
      ])
      setNewNote({
        type: 'text',
        title: '',
        content: '',
        color: colorOptions[0].value,
        tags: [],
        isPinned: false,
        checklistItems: []
      })
      setAudioBlob(null)
      setIsAdding(false)
      setIsDialogOpen(false)
    }
  }

  const updateNoteStatus = (id: number, status: NoteStatus) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, status, updatedAt: new Date() } : note
    ))
  }

  const togglePin = (id: number) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, isPinned: !note.isPinned, updatedAt: new Date() } : note
    ))
  }

  const deleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id))
  }

  const filteredNotes = notes.filter(note => 
    note.status === activeTab &&
    (note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  )

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1
    return b.updatedAt.getTime() - a.updatedAt.getTime()
  })

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      const audioChunks: BlobPart[] = []

      mediaRecorder.addEventListener('dataavailable', (event) => {
        audioChunks.push(event.data)
      })

      mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
        setAudioBlob(audioBlob)
        setNewNote({ ...newNote, voiceUrl: URL.createObjectURL(audioBlob) })
      })

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setNewNote({ ...newNote, type: 'image', imageUrl })
    }
  }

  const addChecklistItem = () => {
    setNewNote({
      ...newNote,
      checklistItems: [
        ...(newNote.checklistItems || []),
        { id: Date.now(), text: '', checked: false }
      ]
    })
  }

  const updateChecklistItem = (id: number, text: string) => {
    setNewNote({
      ...newNote,
      checklistItems: newNote.checklistItems?.map(item =>
        item.id === id ? { ...item, text } : item
      )
    })
  }

  const toggleChecklistItem = (id: number) => {
    setNewNote({
      ...newNote,
      checklistItems: newNote.checklistItems?.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    })
  }

  const removeChecklistItem = (id: number) => {
    setNewNote({
      ...newNote,
      checklistItems: newNote.checklistItems?.filter(item => item.id !== id)
    })
  }

  const openEditDialog = (note: Note) => {
    setEditingNote(note)
    setIsDialogOpen(true)
  }

  const saveEditedNote = async () => {
    if (editingNote) {
      setIsAdding(true)
      await new Promise(resolve => setTimeout(resolve, 1000)) // 擬似的な遅延
      setNotes(notes.map(note =>
        note.id === editingNote.id ? { ...editingNote, updatedAt: new Date() } : note
      ))
      setIsAdding(false)
      setIsDialogOpen(false)
      setEditingNote(null)
    }
  }

  return (
    <TooltipProvider>
      <div className={`min-h-screen h-full w-full p-4 ${isDarkTheme ? 'dark bg-gradient-to-br from-gray-900 to-purple-900' : 'bg-gradient-to-br from-pink-200 to-blue-200'}`}>
        <SidebarTrigger />
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500">メモ一覧</h1>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                      className="bg-transparent border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white transition-all duration-300">
                {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsDarkTheme(!isDarkTheme)}
                      className="bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300">
                {isDarkTheme ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
              </Button>
            </div>
          </div>
          <div className="flex space-x-4 mb-6">
            <div className="flex-grow">
              <Input
                type="search"
                placeholder="メモを検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent border-2 border-purple-500 text-purple-500 placeholder-purple-300"
              />
            </div>
          </div>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as NoteStatus)} className="mb-6">
            <TabsList className="bg-transparent">
              <TabsTrigger value="active" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">アクティブ</TabsTrigger>
              <TabsTrigger value="archived" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">アーカイブ</TabsTrigger>
              <TabsTrigger value="trashed" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">ゴミ箱</TabsTrigger>
            </TabsList>
          </Tabs>
          <AnimatePresence>
            <motion.div
              className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {sortedNotes.map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className={`flex flex-col bg-gradient-to-br ${note.color} shadow-lg hover:shadow-xl transition-all duration-300 ${isDarkTheme ? 'dark:bg-opacity-50' : ''} overflow-hidden ${note.isPinned ? 'border-2 border-yellow-400' : ''} backdrop-blur-sm`}>
                    <CardHeader className="flex justify-between items-start">
                      <h2 className="text-xl font-bold text-white">{note.title}</h2>
                      <div className="flex space-x-2">
                        {note.status === 'active' && (
                          <>
                            <Button variant="ghost" size="icon" onClick={() => togglePin(note.id)}
                                    className="text-white hover:bg-white hover:bg-opacity-20">
                              <Pin className={`h-4 w-4 ${note.isPinned ? 'fill-current' : ''}`} />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => updateNoteStatus(note.id, 'archived')}
                                    className="text-white hover:bg-white hover:bg-opacity-20">
                              <Archive className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {note.status === 'archived' && (
                          <Button variant="ghost" size="icon" onClick={() => updateNoteStatus(note.id, 'active')}
                                  className="text-white hover:bg-white hover:bg-opacity-20">
                            <Archive className="h-4 w-4 fill-current" />
                          </Button>
                        )}
                        {note.status !== 'trashed' ? (
                          <Button variant="ghost" size="icon" onClick={() => updateNoteStatus(note.id, 'trashed')}
                                  className="text-white hover:bg-white hover:bg-opacity-20">
                            <Trash className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="icon" onClick={() => deleteNote(note.id)}
                                  className="text-white hover:bg-white hover:bg-opacity-20">
                            <Trash className="h-4 w-4 fill-current" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(note)}
                                className="text-white hover:bg-white hover:bg-opacity-20">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="text-white">
                      {note.type === 'text' && <p>{note.content}</p>}
                      {note.type === 'checklist' && (
                        <ul>
                          {note.checklistItems?.map((item) => (
                            <li key={item.id} className="flex items-center space-x-2">
                              <Checkbox checked={item.checked} className="border-white" />
                              <span className={item.checked ? 'line-through' : ''}>{item.text}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {note.type === 'voice' && note.voiceUrl && (
                        <audio controls src={note.voiceUrl} className="w-full" />
                      )}
                      {note.type === 'image' && note.imageUrl && (
                        <img src={note.imageUrl} alt="Note" className="max-w-full h-auto rounded-lg" />
                      )}
                    </CardContent>
                    <CardFooter className="flex flex-wrap justify-between items-center">
                      <div className="flex flex-wrap gap-2">
                        {note.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="bg-white bg-opacity-20 text-white">
                            <Tag className="mr-1 h-3 w-3" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center space-x-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-white hover:bg-white hover:bg-opacity-20">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => shareNote(note, 'link')}>
                              <Link className="mr-2 h-4 w-4" />
                              <span>リンク作成</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => shareNote(note, 'twitter')}>
                              <Twitter className="mr-2 h-4 w-4" />
                              <span>Xで共有</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => shareNote(note, 'line')}>
                              <MessageCircle className="mr-2 h-4 w-4" />
                              <span>LINEで共有</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="fixed bottom-4 right-4 rounded-full shadow-lg bg-gradient-to-r from-pink-500 to-blue-500 text-white hover:from-pink-600 hover:to-blue-600 transition-all duration-300">
              <PlusCircle className="mr-2 h-4 w-4" /> 新規メモ
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-purple-400 to-pink-300 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white">{editingNote ? 'メモを編集' : '新規メモ作成'}</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="text" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-white bg-opacity-20">
                <TabsTrigger value="text" className="text-white data-[state=active]:bg-white data-[state=active]:bg-opacity-30"><Type className="h-4 w-4 mr-2" />テキスト</TabsTrigger>
                <TabsTrigger value="checklist" className="text-white data-[state=active]:bg-white data-[state=active]:bg-opacity-30"><CheckSquare className="h-4 w-4 mr-2" />チェックリスト</TabsTrigger>
                <TabsTrigger value="voice" className="text-white data-[state=active]:bg-white data-[state=active]:bg-opacity-30"><Mic className="h-4 w-4 mr-2" />音声</TabsTrigger>
                <TabsTrigger value="image" className="text-white data-[state=active]:bg-white data-[state=active]:bg-opacity-30"><Image className="h-4 w-4 mr-2" />画像</TabsTrigger>
              </TabsList>
              <TabsContent value="text">
                <div className="space-y-4">
                  <Input
                    value={editingNote ? editingNote.title : newNote.title}
                    onChange={(e) => editingNote ? setEditingNote({ ...editingNote, title: e.target.value }) : setNewNote({ ...newNote, title: e.target.value })}
                    placeholder="タイトル"
                    className="bg-white bg-opacity-20 border-white border-opacity-50 text-white placeholder-white placeholder-opacity-75"
                  />
                  <Textarea
                    value={editingNote ? editingNote.content : newNote.content}
                    onChange={(e) => editingNote ? setEditingNote({ ...editingNote, content: e.target.value }) : setNewNote({ ...newNote, content: e.target.value })}
                    placeholder="内容"
                    className="bg-white bg-opacity-20 border-white border-opacity-50 text-white placeholder-white placeholder-opacity-75"
                  />
                </div>
              </TabsContent>
              <TabsContent value="checklist">
                <div className="space-y-4">
                  <Input
                    value={editingNote ? editingNote.title : newNote.title}
                    onChange={(e) => editingNote ? setEditingNote({ ...editingNote, title: e.target.value }) : setNewNote({ ...newNote, title: e.target.value })}
                    placeholder="タイトル"
                    className="bg-white bg-opacity-20 border-white border-opacity-50 text-white placeholder-white placeholder-opacity-75"
                  />
                  {(editingNote ? editingNote.checklistItems : newNote.checklistItems)?.map((item) => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <Checkbox
                        checked={item.checked}
                        onCheckedChange={() => editingNote ? setEditingNote({
                          ...editingNote,
                          checklistItems: editingNote.checklistItems?.map(i =>
                            i.id === item.id ? { ...i, checked: !i.checked } : i
                          )
                        }) : toggleChecklistItem(item.id)}
                        className="border-white"
                      />
                      <Input
                        value={item.text}
                        onChange={(e) => editingNote ? setEditingNote({
                          ...editingNote,
                          checklistItems: editingNote.checklistItems?.map(i =>
                            i.id === item.id ? { ...i, text: e.target.value } : i
                          )
                        }) : updateChecklistItem(item.id, e.target.value)}
                        placeholder="チェックリストアイテム"
                        className="bg-white bg-opacity-20 border-white border-opacity-50 text-white placeholder-white placeholder-opacity-75"
                      />
                      <Button variant="ghost" size="icon" onClick={() => editingNote ? setEditingNote({
                        ...editingNote,
                        checklistItems: editingNote.checklistItems?.filter(i => i.id !== item.id)
                      }) : removeChecklistItem(item.id)}
                              className="text-white hover:bg-white hover:bg-opacity-20">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button onClick={() => editingNote ? setEditingNote({
                    ...editingNote,
                    checklistItems: [
                      ...(editingNote.checklistItems || []),
                      { id: Date.now(), text: '', checked: false }
                    ]
                  }) : addChecklistItem()} className="w-full bg-white bg-opacity-20 text-white hover:bg-opacity-30">アイテムを追加</Button>
                </div>
              </TabsContent>
              <TabsContent value="voice">
                <div className="space-y-4">
                  <Input
                    value={editingNote ? editingNote.title : newNote.title}
                    onChange={(e) => editingNote ? setEditingNote({ ...editingNote, title: e.target.value }) : setNewNote({ ...newNote, title: e.target.value })}
                    placeholder="タイトル"
                    className="bg-white bg-opacity-20 border-white border-opacity-50 text-white placeholder-white placeholder-opacity-75"
                  />
                  {!isRecording && !audioBlob && (
                    <Button onClick={startRecording} className="w-full bg-white bg-opacity-20 text-white hover:bg-opacity-30">録音開始</Button>
                  )}
                  {isRecording && (
                    <Button onClick={stopRecording} className="w-full bg-red-500 text-white hover:bg-red-600">録音停止</Button>
                  )}
                  {(editingNote?.voiceUrl || newNote.voiceUrl) && (
                    <audio controls src={editingNote?.voiceUrl || newNote.voiceUrl} className="w-full" />
                  )}
                </div>
              </TabsContent>
              <TabsContent value="image">
                <div className="space-y-4">
                  <Input
                    value={editingNote ? editingNote.title : newNote.title}
                    onChange={(e) => editingNote ? setEditingNote({ ...editingNote, title: e.target.value }) : setNewNote({ ...newNote, title: e.target.value })}
                    placeholder="タイトル"
                    className="bg-white bg-opacity-20 border-white border-opacity-50 text-white placeholder-white placeholder-opacity-75"
                  />
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="bg-white bg-opacity-20 border-white border-opacity-50 text-white file:bg-pink-500 file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4 file:hover:bg-pink-600"
                  />
                  {(editingNote?.imageUrl || newNote.imageUrl) && (
                    <img src={editingNote?.imageUrl || newNote.imageUrl} alt="Uploaded" className="max-w-full h-auto rounded-lg" />
                  )}
                </div>
              </TabsContent>
            </Tabs>
            <div className="mt-4 space-y-2">
              <div className="flex items-center space-x-2">
                <Input
                  value={(editingNote ? editingNote.tags : newNote.tags).join(', ')}
                  onChange={(e) => {
                    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
                    editingNote
                      ? setEditingNote({ ...editingNote, tags })
                      : setNewNote({ ...newNote, tags })
                  }}
                  placeholder="タグ (カンマ区切り)"
                  className="bg-white bg-opacity-20 border-white border-opacity-50 text-white placeholder-white placeholder-opacity-75"
                />
                <Button
                  onClick={() => {
                    const aiTags = generateTags()
                    const currentTags = editingNote ? editingNote.tags : newNote.tags
                    const updatedTags = [...new Set([...currentTags, ...aiTags])]
                    editingNote
                      ? setEditingNote({ ...editingNote, tags: updatedTags })
                      : setNewNote({ ...newNote, tags: updatedTags })
                  }}
                  size="icon"
                  variant="outline"
                  className="bg-white bg-opacity-20 border-white text-white hover:bg-opacity-30"
                >
                  <Sparkles className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-white text-opacity-75">AIでタグを自動生成するには、スパークルアイコンをクリックしてください。</p>
            </div>
            <div className="mt-4">
              <p className="mb-2 font-semibold text-white">色を選択:</p>
              <ColorPicker
                selectedColor={editingNote ? editingNote.color : newNote.color}
                onColorSelect={(color) => editingNote ? setEditingNote({ ...editingNote, color }) : setNewNote({ ...newNote, color })}
              />
            </div>
            <Button onClick={editingNote ? saveEditedNote : addNote} className="mt-4 w-full bg-gradient-to-r from-pink-500 to-blue-500 text-white hover:from-pink-600 hover:to-blue-600" disabled={isAdding}>
              {isAdding ? '保存中...' : (editingNote ? '更新' : '保存')}
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}