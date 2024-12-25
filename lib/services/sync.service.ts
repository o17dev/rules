import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface CursorRule {
  tags: string[]
  title: string
  slug: string
  libs: string[]
  content: string
  author: {
    name: string
    url: string | null
    avatar: string | null
  }
}

interface CursorResponse {
  data: CursorRule[]
}

export async function syncRulesFromCursor() {
  try {
    console.log('Starting to sync rules...')
    
    // Get remote data
    const response = await fetch('https://cursor.directory/api')
    const { data: rules }: CursorResponse = await response.json()
    
    let created = 0
    let skipped = 0
    
    // Process each rule
    for (const rule of rules) {
      try {
        // First, check if the rule exists by slug
        const existingRuleBySlug = await prisma.rule.findFirst({
          where: { slug: rule.slug }
        })
        
        if (existingRuleBySlug) {
          skipped++
          continue
        }
        // Check if the author exists
        let author = await prisma.author.findFirst({
          where: { name: rule.author.name }
        })
        
        // If the author does not exist, create a new author
        if (!author) {
          author = await prisma.author.create({
            data: {
              name: rule.author.name,
              url: rule.author.url,
              avatar: rule.author.avatar
            }
          })
        }
        
        // Check if the rule already exists
        const existingRule = await prisma.rule.findFirst({
          where: { 
            OR: [
              { title: rule.title },
              { slug: rule.slug }
            ]
          }
        })
        
        if (existingRule) {
          skipped++
          continue
        }
        
        // Create a new rule
        await prisma.rule.create({
          data: {
            title: rule.title,
            slug: rule.slug,
            content: rule.content,
            status: 1, // Approved status
            authorId: author.id,
            tags: {
              connectOrCreate: rule.tags.map(tag => ({
                where: { name: tag },
                create: { name: tag }
              }))
            },
            libs: {
              connectOrCreate: rule.libs.map(lib => ({
                where: { name: lib },
                create: { name: lib }
              }))
            }
          }
        })
        
        created++
      } catch (error) {
        console.error('Error processing rule:', error)
      }
    }
    
    console.log(`Sync completed! Created: ${created}, Skipped: ${skipped}`)
    return { created, skipped }
  } catch (error) {
    console.error('Sync process error:', error)
    throw error
  }
}
