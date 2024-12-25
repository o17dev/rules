import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, generateNameAbbr, isImageUrl } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { CopyButton } from "./copy-button";
import { ShareButton } from "./share-button";
import { TranslationButton }  from "./translation-button";
import { RuleWithRelations } from "@/lib/services/rule.service";
// import { getTranslation } from "@/lib/services/rule.service";

export async function RuleCard({ rule, isPage }: { rule: RuleWithRelations; isPage?: boolean }) {
  // const content = await getTranslation(rule.id, 'zh');
  // if (content) {
  //   rule.content = content;
  // }

  return (
    <Card className="bg-background p-4 max-h-[calc(100vh-8rem)] aspect-square flex flex-col">
      <CardContent
        className={cn(
          "bg-card h-full mb-2 font-mono p-4 pr-1 text-sm opacity-50 hover:opacity-100 transition-opacity group relative flex-grow",
          isPage && "opacity-100",
        )}
      >
        <div className="group-hover:flex hidden right-4 bottom-4 absolute z-10 space-x-2">
          <ShareButton slug={rule.slug} />
          <CopyButton content={rule.content} slug={rule.slug} />
          <TranslationButton content={rule.content} slug={rule.slug} id={rule.id} />
        </div>

        <Link href={`/${rule.slug}`}>
          <ScrollArea className="h-full">
            <code className="text-sm block pr-3">{rule.content}</code>
          </ScrollArea>
        </Link>
      </CardContent>

      <CardHeader className="p-0 space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">{rule.author.name}</CardTitle>
          <a href={rule.author.url || "/"} target="_blank" rel="noopener noreferrer">
            <Avatar className="size-6">
              {isImageUrl(rule.author.avatar || "") ? (
                <AvatarImage src={rule.author.avatar || ""} alt={rule.author.name} />
              ) : (
                <AvatarFallback>
                  {generateNameAbbr(rule.author.name)}
                </AvatarFallback>
              )}
            </Avatar>
          </a>
        </div>
        {rule.libs && rule.libs.length > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <button className="inline-flex items-center text-xs text-muted-foreground">
                <span>Libraries</span>
                <ChevronDown className="h-3 w-3 ml-1" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <ScrollArea className="h-[200px]">
                <div className="p-4">
                  <div className="space-y-2">
                    {rule.libs.map((lib) => (
                      <div
                        key={lib.name}
                        className="text-sm"
                      >
                        {lib.name}
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        )}
      </CardHeader>
    </Card>
  );
}
