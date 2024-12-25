import Link from "next/link";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { SubscribeForm } from "./ui/subscribe-form";
import { LanguageSwitcher } from "./language-switcher";
import { getTranslations } from '@/app/i18n';
import TranslationsProvider from '@/components/translations-provider';
import UserProfile from './user-profile'; // Add this line

export async function Header({ locale }: { locale: string }) {
  const { t } = await getTranslations({locale});

  return (
    <div className="md:fixed top-0 z-10 px-6 py-2 w-full flex justify-between items-center bg-background backdrop-filter backdrop-blur-sm bg-opacity-30">
      <Link href="/" className="font-medium font-mono text-sm">
      Rules
      </Link>

      <div className="flex items-center gap-4">

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="hover:bg-transparent p-0 text-sm font-medium"
            >
              {t('header.about')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('header.about')}</DialogTitle>
            </DialogHeader>

            <DialogDescription>
              Copy and add a .cursorrules or .windsurfrules file in the root of your project.
              <br />
              <br />
              The instructions in the .cursorrules or .windsurfrules file will be included for
              features such as Cursor/Windsurf Chat and Ctrl/⌘ K. <br />
              <br />
              The more specific your rules for your project, the better.

              <br />
              <br />
              <br />
            </DialogDescription>
          </DialogContent>
        </Dialog>
        <LanguageSwitcher />
        <UserProfile />
      </div>
    </div>
  );
}
