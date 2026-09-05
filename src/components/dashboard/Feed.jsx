import { useState } from 'react'
import {
  BookmarkIcon,
  ChatIcon,
  ExternalIcon,
  HeartIcon,
  ShareIcon,
} from '../Icons'

const INITIAL_POSTS = [
  {
    id: 'f1',
    author: 'Priya Nair',
    meta: '2nd Year · ECE · Quantum University',
    initials: 'PN',
    tint: 'bg-rose-500',
    time: '2h',
    badge: { label: 'Deployed 🚀', cls: 'bg-emerald-50 text-emerald-700' },
    text: 'Shipped my first React + Vite app to Vercel today — a mess-to-mastery journey in 3 weekends. Zero-downtime deploys feel like magic. Repo and live link below, roast my code!',
    tags: ['#react', '#vite', '#vercel'],
    likes: 47,
    cta: { type: 'link', label: 'View deployment', url: 'https://vercel.com' },
    comments: [
      { id: 'c1', author: 'Kabir T.', text: 'The landing page animations are so clean 👏' },
    ],
  },
  {
    id: 'f2',
    author: 'E-Cell, Quantum University',
    meta: 'Official · Campus Club',
    initials: 'EC',
    tint: 'bg-indigo-600',
    time: '5h',
    badge: { label: 'Hackathon', cls: 'bg-amber-50 text-amber-700' },
    text: '⚡ QuantumHacks 2026 is HERE. 13–14 September · 36 hours · prizes worth ₹50K + direct internship interviews for the top 3 teams. Teams of 2–4. Problem statements: EdTech, HealthTech and FinTech. Seats are limited — register before 10 Sept.',
    tags: ['#QuantumHacks2026', '#hackathon'],
    likes: 132,
    cta: { type: 'register', label: 'Register now' },
    comments: [
      { id: 'c2', author: 'Ananya S.', text: 'Forming a team for EdTech track — DM me!' },
      { id: 'c3', author: 'Vikram P.', text: 'Won 2nd place last year. 100% worth it.' },
    ],
  },
  {
    id: 'f3',
    author: 'Rohit Sharma',
    meta: '3rd Year · B.Tech CSE · Quantum University',
    initials: 'RS',
    tint: 'bg-emerald-500',
    time: '1d',
    badge: { label: 'Study tip', cls: 'bg-indigo-50 text-indigo-700' },
    text: 'Binary search finally clicked for me, and here is the trick: before writing a single line, dry-run your loop on arrays of size 1 and 2. Every off-by-one error shows up there instantly. Thank me after your DSA mid-sem. 🧠',
    tags: ['#dsa', '#algorithms', '#studygram'],
    likes: 89,
    comments: [],
  },
]

function PostCard({ post: initialPost, notify }) {
  const [post, setPost] = useState({
    ...initialPost,
    liked: false,
    bookmarked: false,
    commentsOpen: false,
    registered: false,
  })
  const [draft, setDraft] = useState('')

  const toggleLike = () =>
    setPost((p) => ({ ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) }))

  const addComment = (e) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    setPost((p) => ({
      ...p,
      comments: [...p.comments, { id: `c${Date.now()}`, author: 'You', text }],
    }))
    setDraft('')
    notify('Comment posted')
  }

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 transition duration-150 hover:border-gray-300 hover:shadow-md hover:shadow-gray-100">
      {/* Header */}
      <div className="flex items-start gap-3">
        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-xs font-bold text-white ${post.tint}`}>
          {post.initials}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900">
            {post.author} <span className="font-normal text-gray-400">· {post.time}</span>
          </p>
          <p className="truncate text-xs text-gray-500">{post.meta}</p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${post.badge.cls}`}>
          {post.badge.label}
        </span>
        <button
          onClick={() => setPost((p) => ({ ...p, bookmarked: !p.bookmarked }))}
          aria-label="Bookmark post"
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition ${
            post.bookmarked ? 'text-indigo-600' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
          }`}
        >
          <BookmarkIcon className="h-[18px] w-[18px]" filled={post.bookmarked} />
        </button>
      </div>

      {/* Body */}
      <p className="mt-3 text-sm leading-relaxed text-gray-700">{post.text}</p>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {post.tags.map((t) => (
          <button
            key={t}
            onClick={() => notify(`Filtering feed by ${t} — demo`)}
            className="text-xs font-semibold text-indigo-600 transition hover:underline"
          >
            {t}
          </button>
        ))}
      </div>

      {/* Optional CTA */}
      {post.cta?.type === 'link' && (
        <a
          href={post.cta.url}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-gray-700"
        >
          <ExternalIcon className="h-3.5 w-3.5" />
          {post.cta.label}
        </a>
      )}
      {post.cta?.type === 'register' && (
        <button
          onClick={() => {
            if (post.registered) return
            setPost((p) => ({ ...p, registered: true }))
            notify('🎉 Registered for QuantumHacks 2026 — check your email for details')
          }}
          disabled={post.registered}
          className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition active:scale-[0.98] ${
            post.registered
              ? 'cursor-default bg-emerald-100 text-emerald-700'
              : 'bg-amber-400 text-amber-950 hover:bg-amber-300'
          }`}
        >
          {post.registered ? '✓ Registered' : post.cta.label}
        </button>
      )}

      {/* Actions */}
      <div className="mt-4 flex items-center gap-1 border-t border-gray-100 pt-3">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
            post.liked ? 'text-rose-500' : 'text-gray-500 hover:bg-gray-50 hover:text-rose-500'
          }`}
        >
          <HeartIcon className="h-[18px] w-[18px]" filled={post.liked} />
          {post.likes}
        </button>
        <button
          onClick={() => setPost((p) => ({ ...p, commentsOpen: !p.commentsOpen }))}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
            post.commentsOpen ? 'text-indigo-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
          }`}
        >
          <ChatIcon className="h-[18px] w-[18px]" />
          {post.comments.length > 0 ? `${post.comments.length} comments` : 'Comment'}
        </button>
        <button
          onClick={() => notify('Post link copied to clipboard')}
          className="ml-auto flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 transition hover:bg-gray-50 hover:text-gray-700"
        >
          <ShareIcon className="h-[18px] w-[18px]" />
          Share
        </button>
      </div>

      {/* Comments */}
      {post.commentsOpen && (
        <div className="mt-3 animate-fade-up space-y-3 border-t border-gray-100 pt-3">
          {post.comments.map((c) => (
            <div key={c.id} className="flex items-start gap-2.5">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gray-200 text-[10px] font-bold text-gray-600">
                {c.author[0]}
              </span>
              <div className="rounded-xl bg-gray-50 px-3 py-2 text-xs leading-relaxed text-gray-700">
                <span className="font-semibold text-gray-900">{c.author}</span> {c.text}
              </div>
            </div>
          ))}
          <form onSubmit={addComment} className="flex items-center gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Write a comment…"
              className="h-9 flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 text-xs outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              className="h-9 rounded-full bg-indigo-600 px-4 text-xs font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-40"
            >
              Post
            </button>
          </form>
        </div>
      )}
    </article>
  )
}

export default function Feed({ query, notify }) {
  const q = query.trim().toLowerCase()
  const posts = q
    ? INITIAL_POSTS.filter(
        (p) =>
          p.author.toLowerCase().includes(q) ||
          p.text.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      )
    : INITIAL_POSTS

  return (
    <section>
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Personalized Feed</h2>
          <p className="text-xs text-gray-500">
            Based on your skills, your circle and Quantum University
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {posts.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
            No posts match “{query}”. Try “react”, “hackathon” or “dsa”.
          </div>
        )}
        {posts.map((p) => (
          <PostCard key={p.id} post={p} notify={notify} />
        ))}
      </div>
    </section>
  )
}
