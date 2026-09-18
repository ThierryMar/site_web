import type { Metadata } from 'next'
import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap'

export const dynamic = 'force-dynamic'
type Args = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

export default async function Page({ params, searchParams }: Args) {
  // Keep this async boundary so React can time Payload's suspended renders
  // and redirects correctly in development (next.js#86060).
  return await RootPage({ config, params, searchParams, importMap })
}
