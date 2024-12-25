'use client'

import { useSession, signOut } from 'next-auth/react'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Brain, LogOut } from 'lucide-react'

export default function UserProfile() {
  const { data: session } = useSession()
  const router = useRouter()

  if (session?.user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage 
              src={session.user.image || ''} 
              alt={session.user.name || '用户头像'} 
            />
            <AvatarFallback>{session.user.name?.[0] || '用'}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => router.push('/prompts')} className="gap-2">
            <Brain className="w-4 h-4" />
            <span>我的规则</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut()} className="gap-2 text-red-600">
            <LogOut className="w-4 h-4" />
            <span>退出登录</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button 
      variant="ghost" 
      className="text-sm font-medium"
      onClick={() => router.push('/login')}
    >
      登录
    </Button>
  )
}