import type { Metadata } from 'next'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { homeStatic } from '@/endpoints/seed/home-static'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { HeaderClient } from '@/Header/Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'

type Locale = 'fr' | 'en'

type Args = {
  params: {
    slug?: string
    locale: Locale
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const locales: Locale[] = ['fr', 'en']
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = []
  for (const locale of locales) {
    for (const doc of pages.docs) {
      if (doc.slug !== 'home') {
        params.push({ slug: doc.slug, locale })
      }
    }
  }
  return params
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home', locale } = await paramsPromise
  const url = '/' + slug

  type LocalizedSlugs = { [key in Locale]: string | null }

  let page: (RequiredDataFromCollectionSlug<'pages'> & { localizedSlugs?: LocalizedSlugs }) | null

  page = await queryPageBySlug({
    slug,
    locale,
    fallbackLocales: ['fr', 'en'],
  })

  // Remove this code once your website is seeded
  if (!page && slug === 'home') {
    page = homeStatic
  }

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page

  const headerData = await getCachedGlobal('header', 1)()

  console.log('localizedSlugs:', page.localizedSlugs)

  return (
    <>
      {/* <HeaderClient data={headerData} pageSlugs={page.localizedSlugs} /> */}
      <article className="pt-16 pb-24">
        <PageClient />
        {/* Allows redirects for valid pages too */}
        <PayloadRedirects disableNotFound url={url} />
        {draft && <LivePreviewListener />}
        <RenderHero {...hero} />
        <RenderBlocks blocks={layout} />
      </article>
    </>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home', locale } = await paramsPromise

  const page = await queryPageBySlug({
    slug,
    locale,
    fallbackLocales: ['fr', 'en'],
  })

  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(
  async ({
    slug,
    locale,
    fallbackLocales,
  }: {
    slug: string
    locale: Locale
    fallbackLocales?: Locale[]
  }) => {
    const { isEnabled: draft } = await draftMode()
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'pages',
      draft,
      limit: 1,
      locale,
      pagination: false,
      overrideAccess: draft,
      where: {
        slug: {
          equals: slug,
        },
      },
    })

    let page = result.docs?.[0] || null

    if (page && fallbackLocales) {
      let localizedSlugs: { [key in Locale]: string | null } = { fr: null, en: null }
      for (const loc of fallbackLocales) {
        if (loc !== locale) {
          const res = await payload.find({
            collection: 'pages',
            draft,
            limit: 1,
            locale: loc,
            pagination: false,
            overrideAccess: draft,
            where: {
              id: {
                equals: page.id,
              },
            },
          })
          localizedSlugs[loc] = res.docs?.[0]?.slug ?? null
        } else {
          localizedSlugs[loc] = page.slug ?? null
        }
      }
      ;(page as any).localizedSlugs = localizedSlugs
    }

    return page
  },
)
