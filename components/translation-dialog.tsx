'use client'

import { useState, useTransition } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Languages, Loader2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { createTranslation } from "@/actions/content-action"

const LANGUAGES = [
  { id: 'en', label: 'English', description: 'Translate to English' },
  { id: 'zh', label: '中文', description: 'Translate to Chinese' },
  { id: 'zh-TW', label: '中文(繁體)', description: 'Translate to Traditional Chinese' },
  { id: 'ja', label: '日本語', description: 'Translate to Japanese' },
  { id: 'ko', label: '한국어', description: 'Translate to Korean' },
] as const

interface TranslationDialogProps {
  contentId: string
  title: string
}

export function TranslationDialog({ contentId, title }: TranslationDialogProps) {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = () => {
    if (selectedLanguages.length === 0) return
    console.log('selectedLanguages', selectedLanguages)
    startTransition(async () => {
      try {
        await createTranslation(contentId, selectedLanguages)
        setOpen(false)
        setSelectedLanguages([])
      } catch (error) {
        console.error("Translation error:", error)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Languages className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>翻译设置</DialogTitle>
          <DialogDescription>
            为 &quot;{title}&quot; 生成多语言翻译
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            <Label>选择目标语言</Label>
            {LANGUAGES.map((language) => (
              <div
                key={language.id}
                className="flex items-center space-x-2 mt-2"
              >
                <Checkbox
                  id={language.id}
                  checked={selectedLanguages.includes(language.id)}
                  onCheckedChange={(checked) => {
                    setSelectedLanguages(
                      checked
                        ? [...selectedLanguages, language.id]
                        : selectedLanguages.filter((id) => id !== language.id)
                    )
                  }}
                />
                <Label htmlFor={language.id}>{language.label}</Label>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={isPending || selectedLanguages.length === 0}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                生成中...
              </>
            ) : (
              "生成翻译"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
