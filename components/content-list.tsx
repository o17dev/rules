'use client'

import { useState, useTransition } from 'react'
import { format } from 'date-fns'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination"
import { updateContentStatus } from '@/actions/content-action'
import type { Content, PaginatedResponse } from '@/types/rule'
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { TranslationDialog } from './translation-dialog'

interface ContentListProps {
  initialData: PaginatedResponse
}

export default function ContentList({ initialData }: ContentListProps) {
  const [selectedContent, setSelectedContent] = useState<Content | null>(null)
  const [isPending, startTransition] = useTransition()
  const [updateState, setUpdateState] = useState<{ success: boolean; message: string } | null>(null)
  const [currentPage, setCurrentPage] = useState(initialData.page)
  const totalPages = Math.ceil(initialData.total / initialData.pageSize)

  const handleStatusUpdate = async (id: string, status: number) => {
    startTransition(async () => {
      try {
        const result = await updateContentStatus(id, status)
        setUpdateState(result)
        if (result.success) {
          setSelectedContent(null)
          window.location.reload()
        }
      } catch (error) {
        setUpdateState({
          success: false,
          message: '更新状态失败'
        })
      }
    })
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-12rem)]">
      <Card className="flex-grow bg-background">
        <div className="relative rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
                <TableRow>
                  <TableHead className="w-[300px]">Title</TableHead>
                  <TableHead className="w-[200px]">Author</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="w-[150px]">Created</TableHead>
                  <TableHead className="w-[150px]">Updated</TableHead>
                  <TableHead className="w-[150px]">Translation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialData.items.map((content, index) => (
                  <motion.tr
                    key={content.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group cursor-pointer"
                    onClick={() => setSelectedContent(content)}
                  >
                    <TableCell className="font-medium group-hover:text-primary transition-colors">
                      {content.title}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border-2 border-muted">
                          <AvatarImage src={content.author.avatar || ''} />
                          <AvatarFallback className="bg-primary/10">
                            {content.author.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium leading-none">
                            {content.author.name}
                          </span>
                          {content.author.url && (
                            <span className="text-xs text-muted-foreground">
                              {new URL(content.author.url).hostname}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={content.status === 0 ? "secondary" : "default"}
                        className="shadow-sm"
                      >
                        {content.status === 0 ? 'Pending' : 'Approved'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(content.createdAt, 'PP')}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(content.updatedAt, 'PP')}
                    </TableCell>
                    <TableCell className="w-[50px]" onClick={(e) => e.stopPropagation()} >
                      <TranslationDialog 
                        contentId={content.id}
                        title={content.title}
                      />
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>

      <div className="py-4 border-t mt-auto">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                isActive={currentPage === 1}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                href="#"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                isActive={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <Dialog open={!!selectedContent} onOpenChange={() => setSelectedContent(null)}>
        {selectedContent && (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl">{selectedContent.title}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Author Information */}
              <Card className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-muted">
                    <AvatarImage src={selectedContent.author.avatar || ''} />
                    <AvatarFallback className="bg-primary/10 text-lg">
                      {selectedContent.author.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">{selectedContent.author.name}</h3>
                    {selectedContent.author.url && (
                      <a 
                        href={selectedContent.author.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                      >
                        {new URL(selectedContent.author.url).hostname}
                      </a>
                    )}
                  </div>
                </div>
              </Card>

              {/* Content */}
              <Card className="p-6  max-h-80 overflow-y-scroll">
                <div className="prose dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {selectedContent.content}
                  </div>
                </div>
              </Card>

              {/* Metadata */}
              <div className="flex justify-between text-sm text-muted-foreground px-1">
                <p>Created: {format(selectedContent.createdAt, 'PPpp')}</p>
                <p>Last updated: {format(selectedContent.updatedAt, 'PPpp')}</p>
              </div>

              {/* Action Buttons */}
              {selectedContent.status === 0 && (
                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => handleStatusUpdate(selectedContent.id, 2)}
                    className="w-32"
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate(selectedContent.id, 1)}
                    className="w-32"
                  >
                    Approve
                  </Button>
                </div>
              )}

              {/* Status Message */}
              {updateState && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg ${
                    updateState.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {updateState.message}
                </motion.div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
