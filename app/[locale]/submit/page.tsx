import ContentSubmissionForm from '@/components/content-form'
import { PrismaClient } from '@prisma/client'
import { unstable_cache } from 'next/cache';

const prisma = new PrismaClient()

// Wrap the data fetching function with unstable_cache
const getMetadataWithCache = unstable_cache(
  async () => {
    const [tags, libraries] = await Promise.all([
      prisma.tag.findMany({
        select: {
          name: true,
        },
        orderBy: {
          name: 'asc',
        },
      }),
      prisma.library.findMany({
        select: {
          name: true,
        },
        orderBy: {
          name: 'asc',
        },
      }),
    ]);

    return {
      tags: tags.map(tag => tag.name),
      libraries: libraries.map(lib => lib.name),
    };
  },
  ['metadata-cache'], // Cache key
  {
    revalidate: 3600, // Revalidate after 1 hour
    tags: ['metadata'], // Cache tags, can be used for manual revalidation
  }
);

export default async function Page() {
  const { tags, libraries } = await getMetadataWithCache();

  return (
    <main className="container mx-auto py-8">
      <ContentSubmissionForm initialTags={tags} initialLibraries={libraries} />
    </main>
  )
}
