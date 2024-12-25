"use client";

import { translate, ActionTranslationResponse } from "@/actions/translate-action";
import { Languages, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { ScrollArea } from "./ui/scroll-area";
import { useTranslation } from 'react-i18next';
import { Button } from "./ui/button";

export function TranslationButton({
  content,
  slug,
  id,
}: { content: string; slug: string; id: string }) {
  const [translatedContent, setTranslatedContent] = useState<string>(content);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { i18n, t } = useTranslation();
  const currentLocale = i18n.language;
  
  useEffect(() => {
    if (open) {
      const getTranslatedContent = async () => {
        try {
          setIsLoading(true);
          const { data: result } = await translate({
            ruleId: id,
            locale: currentLocale,
          }) as ActionTranslationResponse;

          console.log("Translation result:", result?.data);
          
          if (!result) {
            setTranslatedContent(content);
            return;
          }
          
          if (result?.success && result?.data) {
            setTranslatedContent(result?.data || "");
          } else {
            setTranslatedContent(content); // 如果没有翻译，显示原文
          }
        } catch (error) {
          console.error("Translation error:", error);
          setTranslatedContent(content); // 发生错误时显示原文
        } finally {
          setIsLoading(false);
        }
      };

      getTranslatedContent();
    }
  }, [open, content, currentLocale, id]);

  const handleOpenChange = (state: boolean) => {
    setOpen(state);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-xs bg-black text-white dark:bg-white dark:text-black p-2 rounded-full size-9 flex items-center justify-center">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Languages className="h-4 w-4" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('header.translation')}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="mt-4 h-[450px] w-full rounded-md border p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="text-sm">{translatedContent}</div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
