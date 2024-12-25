// import { Banner } from "@/components/banner";
import "./globals.css";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
// import { OpenPanelComponent } from "@openpanel/nextjs";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { PlusIcon } from "lucide-react";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { dir } from "i18next";
import { notFound } from "next/navigation";
import i18nConfig from "@/i18nConfig";
import TranslationsProvider from '@/components/translations-provider';
import { SessionProvider } from "next-auth/react";
import initTranslations from '../i18n';

export const metadata: Metadata = {
  title: "Rules",
  description: "Find the best cursor rules for your framework and language",
  icons: [
    {
      rel: "icon",
      url: "/logo.png",
    },
  ],
  openGraph: {
    title: "Rules",
    description: "Find the best cursor rules for your framework and language",
    url: "https://cursor.directory",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://cdn.midday.ai/cursor/opengraph-image.png",
        width: 800,
        height: 600,
      },
      {
        url: "https://cdn.midday.ai/cursor/opengraph-image.png",
        width: 1800,
        height: 1600,
      },
    ],
  },
  twitter: {
    title: "Cursor Directory",
    description: "Find the best cursor rules for your framework and language",
    images: [
      {
        url: "https://cdn.midday.ai/cursor/opengraph-image.png",
        width: 800,
        height: 600,
      },
      {
        url: "https://cdn.midday.ai/cursor/opengraph-image.png",
        width: 1800,
        height: 1600,
      },
    ],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)" },
    { media: "(prefers-color-scheme: dark)" },
  ],
};

export function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const { resources } = await initTranslations(locale);

  if (!i18nConfig.locales.includes(locale)) {
    notFound();
  }

  return (
    <html
      lang={locale}
      dir={dir(locale)}
      suppressHydrationWarning
      className={cn(
        `${GeistSans.variable} ${GeistMono.variable}`,
        "whitespace-pre-line antialiased bg-background text-foreground"
      )}
    >
      <body>
        <SessionProvider>
          <TranslationsProvider
            locale={locale}
            resources={resources}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Header locale={locale} />

              <div className="flex">
                {children}

                <a
                  href="https://github.com/pontusab/cursor.directory"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button
                    className="hidden size-[48px] bg-[#F5F5F3]/30 text-black border border-black rounded-full font-medium fixed bottom-4 left-6 z-10 backdrop-blur-lg dark:bg-[#F5F5F3]/30 dark:text-white dark:border-white"
                    variant="outline"
                    size="icon"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </Button>
                </a>
              </div>
              <Toaster />
            </ThemeProvider>
          </TranslationsProvider>
        </SessionProvider>
      </body>

      {/* <OpenPanelComponent
        clientId={process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID!}
        trackScreenViews
      /> */}
    </html>
  );
}
