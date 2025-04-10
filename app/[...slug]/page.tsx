import path from 'path'
import fs from 'fs/promises'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

interface Page {
  slug: string
  title: string
  description?: string
  body: string
}

interface PageProps {
  params: {
    slug: string[]
  }
}

async function getAllPages(): Promise<Page[]> {
  const filePath = path.join(process.cwd(), 'data', 'pages.json')
  const json = await fs.readFile(filePath, 'utf-8')
  return JSON.parse(json)
}

async function getPageFromParams(params: PageProps["params"]) {
  const slug = params?.slug?.join('/')
  const pages = await getAllPages()
  return pages.find(page => page.slug === slug)
}

export async function generateStaticParams(): Promise<PageProps["params"][]> {
  const pages = await getAllPages()
  return pages.map((page) => ({
    slug: page.slug.split('/'),
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = await getPageFromParams(params)
  if (!page) return {}
  return {
    title: page.title,
    description: page.description,
  }
}

export default async function PagePage({ params }: PageProps) {
  const page = await getPageFromParams(params)

  if (!page) {
    notFound()
  }

  return (
    <article className="py-6 prose dark:prose-invert">
      <h1>{page.title}</h1>
      {page.description && <p className="text-xl">{page.description}</p>}
      <hr />
      <div dangerouslySetInnerHTML={{ __html: page.body }} />
    </article>
  )
}
