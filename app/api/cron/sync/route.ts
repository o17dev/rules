import { NextResponse } from "next/server";
import type { NextRequest } from 'next/server';
import { syncRulesFromCursor } from '@/lib/services/sync.service'
import { auth } from "@/auth"
import { kv } from '@vercel/kv'

const SYNC_STATUS_KEY = 'sync_status'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (authHeader === `Bearer ${process.env.CRON_SECRET}`) {
      syncRulesFromCursor()
        .then(async (result) => {
          await kv.set(SYNC_STATUS_KEY, {
            status: 'completed',
            result,
            timestamp: Date.now()
          })
        })
        .catch(async (error) => {
          await kv.set(SYNC_STATUS_KEY, {
            status: 'failed',
            error: error.message,
            timestamp: Date.now()
          })
        })
      
      return NextResponse.json({ message: 'Sync started' }, {
        status: 202
      });
    }

    const session = await auth()
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, {
        status: 401
      });
    }

    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || []
    if (!session?.user?.email || !adminEmails.includes(session?.user?.email)) {
      return NextResponse.json({ message: 'Unauthorized' }, {
        status: 401
      });
    }
    
    const status = await kv.get(SYNC_STATUS_KEY)
    return NextResponse.json({ data: status }, {
      status: 200
    });
    
  } catch (error) {
    console.error('Sync operation failed:', error)
    return NextResponse.json({ message: 'Operation failed' }, {
      status: 500
    });
  }
}
