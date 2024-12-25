import { prisma } from '../prisma'
import { Rule, Author, Tag, Library, RuleTranslation } from '@prisma/client'

export interface RuleWithRelations extends Rule {
  author: Author
  tags: Tag[]
  libs: Library[]
}

export interface Section {
  tag: string
  rules: RuleWithRelations[]
}

export async function getRules(): Promise<RuleWithRelations[]> {
  const rules = await prisma.rule.findMany({
    include: {
      author: true,
      tags: true,
      libs: true,
    },
    where: {
      status: {
        equals: 1
      }
    },
  })
  return rules
}

export async function getSections(): Promise<Section[]> {
  const rules = await getRules()
  
  // Get all unique tags
  const tags = await prisma.tag.findMany()
  
  // Group rules by tag
  return tags.map(tag => ({
    tag: tag.name,
    rules: rules.filter(rule => 
      rule.tags.some(t => t.name === tag.name)
    ),
  })).filter(section => section.rules.length > 0)
}

export async function getRuleBySlug(slug: string): Promise<RuleWithRelations | null> {
  const rule = await prisma.rule.findUnique({
    where: { slug },
    include: {
      author: true,
      tags: true,
      libs: true,
    },
  })
  return rule
}


export async function getTranslation(id: string, language: string): Promise<string | null> {
  const translation = await prisma.ruleTranslation.findUnique({
    where: { ruleId_language: { ruleId: id, language: language as RuleTranslation['language'] } },
  })
  return translation?.content || null
}