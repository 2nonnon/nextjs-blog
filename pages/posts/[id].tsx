import Head from 'next/head'
import type { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import type { LocaleType } from '../_app'
import type { PostData } from '@/lib/posts'
import { getAllPostIds, getPostData } from '@/lib/posts'
import Date from '@/components/date'

interface tagProps {
  tag: string
}

const Tag: React.FC<tagProps> = ({ tag }) => {
  return (
    <>
      <span className='inline-block px-3 border border-[var(--surface4)] hover:bg-[var(--surface4)] hover:text-[var(--text1)] rounded-full transition-all'>{`#${tag}`}</span>
    </>
  )
}

const copies = {
  en: {
    date: 'Created: ',
    update: 'Updated: ',
    author: 'Author: ',
    translator: 'Translator: ',
  },
  zh: {
    date: '创建时间：',
    update: '更新时间：',
    author: '作者：',
    translator: '译者：',
  },
}

export default function Post({
  postData,
  locale,
}: {
  postData: PostData
  locale: LocaleType
}) {
  const curCopies = copies[locale]
  const tags = postData.tags ? postData.tags.split(' ') : []

  return (
    <>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <section className='max-w-screen-lg mx-auto'>
        <article>
          <h1 className='text-4xl font-extrabold my-8'>{postData.title}</h1>
          <div className='flex gap-2'>
            {tags.map(tag => <Tag key={tag} tag={tag}></Tag>)}
          </div>
          <div className='opacity-80 flex gap-x-4 gap-y-1 flex-wrap my-3'>
            <span><span>{curCopies.date}</span><Date dateString={postData.date} locale={locale} /></span>
            <span><span>{curCopies.update}</span><Date dateString={postData.update} locale={locale} /></span>
            <span><span>{curCopies.author}</span><span>{postData.author}</span></span>
            {postData.translator ? <span><span>{curCopies.translator}</span><span>{postData.translator}</span></span> : null}
          </div>
          <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        </article>
        <nav className='my-8 opacity-80'>
          <div className='flex items-center justify-between mb-4 gap-2'>
            {postData.last ? <Link href={postData.last.id}>{`Last: ${postData.last.title}`}</Link> : <span></span>}
            {postData.next ? <Link href={postData.next.id}>{`Next: ${postData.next.title}`}</Link> : <span></span>}
          </div>
          <Link href="/posts">cd ..</Link>
        </nav>
      </section>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async ({ locales, defaultLocale }) => {
  const defaultPaths = getAllPostIds()
  const allPaths = locales.reduce((res, cur) => {
    if (cur !== defaultLocale) {
      res.push(...defaultPaths.map(path => ({
        params: {
          id: path.params.id,
        },
        locale: cur,
      })))
    }
    return res
  }, [...defaultPaths])

  return {
    paths: allPaths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postData = await getPostData(params?.id as string)
  return {
    props: {
      postData,
    },
  }
}
