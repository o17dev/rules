import { NextResponse } from "next/server";

import { syncRulesFromCursor } from '@/lib/services/sync.service'
import { auth } from "@/auth"

export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401
      });
    }

    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || []
    if (! session?.user?.email || !adminEmails.includes(session?.user?.email)) {
      return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401
      });
    }
    
    const result = await syncRulesFromCursor()
    return new NextResponse(JSON.stringify({ data: result }), {
      status: 200
    });
  } catch (error) {
    console.error('Sync failed:', error)
    return new NextResponse(JSON.stringify({ message: 'Sync failed' }), {
      status: 500
    });
  }
  
}
