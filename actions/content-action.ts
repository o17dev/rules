'use server'

import { z } from 'zod'
import { PrismaClient, RuleTranslation, Prisma } from '@prisma/client'
// import { getSession } from 'next-auth/react'
import { auth } from "@/auth"
import { translate as translateText } from "./translate";

const prisma = new PrismaClient()

interface Content {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: number;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  author: {
    id: string;
    name: string;
    url: string | null;
    avatar: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// Define content validation schema
const ContentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  slug: z.string().min(1, "Slug is required"),
  libs: z.array(z.string()).min(1, "At least one library is required"),
  content: z.string().min(10, "Content must be at least 10 characters")
})

export type State = {
  message: string
  success: boolean
  errors?: Array<{ message: string }>
}

export async function submitContent(prevState: State, formData: FormData): Promise<State> {
  try {
    if (!formData) {
      return {
        message: 'No form data provided',
        success: false,
        errors: [{ message: 'Form data is required' }]
      }
    }
    console.log('Form data:', formData)

    const rawFormData = {
      title: formData.get('title'),
      tags: formData.getAll('tags'),
      slug: formData.get('slug'),
      libs: formData.getAll('libs'),
      content: formData.get('content')
    }

    const validatedData = ContentSchema.parse(rawFormData)

    console.log('Validated data:', validatedData)
    
    const session = await auth()
    
    const author = await prisma.author.findFirst({
      where: {
        name: session?.user?.name || "Anonymous"
      }
    }) || await prisma.author.create({
      data: {
        name: session?.user?.name || "Anonymous",
        url: session?.user?.image || null,
        avatar: session?.user?.image || null,
        email: session?.user?.email || undefined
      }
    })

    await prisma.rule.create({
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        content: validatedData.content,
        author: {
          connect: {
            id: author.id
          }
        },
        tags: {
          connectOrCreate: validatedData.tags.map(tag => ({
            where: { name: tag },
            create: { name: tag }
          }))
        },
        libs: {
          connectOrCreate: validatedData.libs.map(lib => ({
            where: { name: lib },
            create: { name: lib }
          }))
        }
      },
      include: {
        author: true,
        tags: true,
        libs: true
      }
    })

    return {
      message: 'Content submitted successfully!',
      success: true,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        message: 'Validation failed',
        success: false,
        errors: error.errors
      }
    }
    console.error('Content submission error:', error)
    return {
      message: 'An unexpected error occurred',
      success: false,
    }
  }
}

export async function getContents(
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedResponse<Content>> {
  try {
    const total = await prisma.rule.count()

    const items = await prisma.rule.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        author: true,
        tags: true,
        libs: true,
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return {
      items,
      total,
      page,
      pageSize
    }
  } catch (error) {
    console.error('Error fetching contents:', error)
    return {
      items: [],
      total: 0,
      page,
      pageSize
    }
  }
}

export async function updateContentStatus(id: string, status: number) {
  try {
    const updatedRule = await prisma.rule.update({
      where: {
        id: id
      },
      data: {
        status: status
      }
    })

    return {
      success: true,
      message: `Content ${status === 1 ? 'approved' : 'rejected'}`,
      data: updatedRule
    }
  } catch (error) {
    console.error('Error updating content status:', error)
    return {
      success: false,
      message: 'Failed to update status',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export const createTranslation = async (ruleId: string, language: string[]) => {
  const result = await prisma.rule.findUnique({
    where: { id: ruleId },
    select: { content: true }
  })
  if (!result) {
    throw new Error('Rule not found')
  }
  language.forEach(async (item) => {
    const translation = await prisma.ruleTranslation.findUnique({
      where: { ruleId_language: { ruleId, language: item as RuleTranslation['language'] } }
    })
    if (translation) {
      return
    }
    const content = await translateText(result?.content, item)
    await prisma.ruleTranslation.create({
      data: {
        content: content || '',
        language: item as RuleTranslation['language'],
        ruleId
      }
    })
  })
}

export async function getUserRules(
  page: number = 1,
  pageSize: number = 10,
  search?: string
) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return {
        items: [],
        total: 0,
        error: 'User not logged in'
      };
    }

    const author = await prisma.author.findFirst({
      where: {
        email: session?.user?.email || "Anonymous"
      }
    })
    
    if (!author) {
      return {
        items: [],
        total: 0,
        error: 'User not found'
      };
    }

    const where = {
      authorId: author.id,
      ...(search ? {
        OR: [
          { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { content: { contains: search, mode: Prisma.QueryMode.insensitive } },
        ],
      } : {}),
    };

    const total = await prisma.rule.count({ where });

    const rules = await prisma.rule.findMany({
      where,
      include: {
        author: true,
        tags: true,
        libs: true,
      },
      orderBy: {
        updatedAt: 'desc'
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      items: rules,
      total,
      error: null
    };
  } catch (error) {
    console.error('Failed to fetch user rules:', error);
    return {
      items: [],
      total: 0,
      error: 'Failed to fetch user rules'
    };
  }
}