'use client'

import { signIn } from 'next-auth/react'
import { Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'

export default function LoginPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen items-center justify-center w-full">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Image
              src="/logo.png"
              alt="Rules Logo"
              width={48}
              height={48}
            />
          </div>
          <CardTitle className="text-2xl">{t('login.title')}</CardTitle>
          <CardDescription>
            {t('login.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => signIn('github', { callbackUrl: '/' })}
            >
              <Github className="w-5 h-5" />
              {t('login.button')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
