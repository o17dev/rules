"use client";

import { SearchInput } from "@/components/search-input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import type { Section } from "@/lib/services/rule.service";

interface MenuClientProps {
  initialSections: Section[];
}

export function MenuClient({ initialSections }: MenuClientProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [sections, setSections] = useState(initialSections);

  const handleClick = (tag: string) => {
    router.push("/", { scroll: false });

    const element = document.getElementById(tag);
    if (!element) return;

    window.scrollTo({
      top: element.offsetTop - 56,
      behavior: "smooth",
    });

    clearSearch();
  };

  const clearSearch = () => {
    setSections(initialSections);
  };

  return (
    <aside className="w-64 p-4 flex flex-col">
      <SearchInput
        onSearch={(term) =>
          setSections(
            initialSections.filter((section) =>
              section.tag.toLowerCase().includes(term.toLowerCase()),
            ),
          )
        }
        clearSearch={clearSearch}
      />

      <Separator className="my-4" />

      <ScrollArea className="flex-1">
        <div className="space-y-1">
          {sections.map((section) => (
            <Button
              key={section.tag}
              variant="ghost"
              className="w-full justify-start font-normal"
              onClick={() => handleClick(section.tag)}
            >
              {section.tag}
            </Button>
          ))}
        </div>
      </ScrollArea>

      <Separator className="my-4" />

      <Button variant="outline" className="w-full" asChild>
        <a
          href="/submit"
          target="_blank"
          rel="noopener noreferrer"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          {t('header.submit')}
        </a>
      </Button>
    </aside>
  );
}
