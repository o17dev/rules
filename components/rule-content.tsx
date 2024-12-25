"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { CopyButton } from "./copy-button";
import { ShareButton } from "./share-button";
import { TranslationButton } from "./translation-button";
// import { toast } from 'sonner'

import { RuleWithRelations } from "@/lib/services/rule.service";

import { ScrollArea } from "@/components/ui/scroll-area";

interface RuleContentProps {
  rule: RuleWithRelations;
}

export default function RuleContent({ rule }: RuleContentProps) {
  const { author, libs } = rule;
  const [isLibrariesOpen, setIsLibrariesOpen] = useState(false);

  return (
    <Card className="w-full max-w-3xl mx-auto overflow-hidden bg-background">
      {/* Author Header - Always Visible */}
      <div className="p-4 md:p-6 border-b flex items-center justify-between gap-4 bg-muted/30">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="h-10 w-10 border-2 border-muted">
            <AvatarImage src={author.avatar || ""} />
            <AvatarFallback>{author.name[0]}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="font-semibold truncate">{author.name}</div>
            {author.url && (
              <a
                href={author.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary truncate inline-flex items-center gap-1"
              >
                {new URL(author.url).hostname}
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-foreground"
                onClick={() => setIsLibrariesOpen(!isLibrariesOpen)}
              >
                Libraries
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isLibrariesOpen && "transform rotate-180"
                  )}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Click to view used libraries</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Mobile Libraries Toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setIsLibrariesOpen(!isLibrariesOpen)}
        >
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              isLibrariesOpen && "transform rotate-180"
            )}
          />
        </Button>
      </div>

      {/* Libraries Section - Expandable */}
      <AnimatePresence>
        {isLibrariesOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-b bg-muted/10"
          >
            <div className="p-4 md:p-6 space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Used Libraries ({libs.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {libs.map((lib, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm p-2 rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <div className="h-2 w-2 rounded-full bg-primary/60" />
                    {lib.name}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Area */}
      <div className="relative group">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="p-4 md:p-6 font-mono text-sm whitespace-pre-wrap bg-muted/30 rounded-md m-4 md:m-6">
            {rule.content}
          </div>
        </ScrollArea>
        <div className="group-hover:flex hidden right-8 bottom-6 absolute z-10 space-x-2">
          <ShareButton slug={rule.slug} />
          <CopyButton content={rule.content} slug={rule.slug} />
          <TranslationButton
            content={rule.content}
            slug={rule.slug}
            id={rule.id}
          />
        </div>
      </div>
    </Card>
  );
}
