import ContentList from '@/components/content-list'
import { getContents } from '@/actions/content-action'

export default async function Page() {
  const initialData = await getContents(1, 10)
  
  return (
    <main className="container max-w-7xl mx-auto pb-8 pt-24 px-4">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Content Review</h1>
          <p className="text-muted-foreground">
            Showing {initialData.items.length} of {initialData.total} items
          </p>
        </div>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <ContentList initialData={initialData as any} />
      </div>
    </main>
  )
}

