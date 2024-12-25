export interface Author {
  id: string
  name: string
  url?: string | null
  avatar?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Content {
  id: string
  title: string
  slug: string
  content: string
  status: number
  createdAt: Date
  updatedAt: Date
  author: Author
  authorId: string
  tags: Tag[]
  libs: Tag[]
}

export interface PaginatedResponse {
  items: Content[]
  total: number
  page: number
  pageSize: number
}


export interface Tag {
  id: string
  name: string
}
