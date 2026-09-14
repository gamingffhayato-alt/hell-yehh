# Intern X — Student Dashboard Rebuild (arena-ai-prompt.md)

## Signature Layout Choices
- **3-icon left sidebar** — exact spec: Dashboard standalone, Profile expands to ATS/Projects/Assessment, Market expands to Trending/Feed/Applications. Never nests Dashboard under Profile. Custom treatment: floating 88px sidebar with vertical Intern X · 2026 type, 48px rounded icon buttons, active left-border indicator, circular completion gauge at bottom linking to /profile.
- **Asymmetric hero + Bento grid** — top hero is 1.6fr / 1fr split: left identity (avatar, name, chips, summary strip 3 cols), right completion + quick actions + ATS redirect. Below: modular sections 1.6fr main (Smart Matches, Featured Projects) + 1fr side (Trending 2026, Assessment teaser). No purple-gradient template — restrained palette slate-900/white + localized amber/emerald/violet glows.
- **Type scale & spacing** — Display: Fraunces 22-28px, Body: Inter 12-14px tracking -0.01em, Meta: Geist Mono 10-11px uppercase 0.08em. Rhythm: rounded-[20px]/[16px]/[14px]/[12px], p-6/5/4, gap-5/4/3. Micro-interactions: hover ring shift, active scale, pulse dot, toast slide, progress ring dashoffset transition 700ms.

## Files Created / Rebuilt
- `src/components/dashboard/StudentDashboard.jsx` — full rebuild per Task 1: username field (localStorage `internx_username`) used ONLY for searching/looking up profile, redesign banner/header, landing layout top hero strip + modular sections below, left sidebar exactly 3 icons, real-time profile completion (memo from profile fields + username) linking to /profile, ATS redirect button.
- `src/components/dashboard/DashboardShell.jsx` — shared layout for standalone routes, preserves 3-icon nav, completion, username editing, toast.
- `src/components/dashboard/pages/AtsPage.jsx` — own page/route `/dashboard/ats`. Flow: Already uploaded (existingResume from localStorage) → Continue existing OR Upload another, New resume → upload flow directly. Reuses pdfjs-dist extraction MAX_BYTES 5MB MAX_PAGES 8 MAX_CHARS 4500 pattern, POST /api/ats-analyze.
- `src/components/dashboard/pages/ProjectsPage.jsx` — 10 demo seeded (JARVIS, Campus Notes, ATS Engine, SkillGap Visualizer, Portfolio Forge, Interview Scheduler, CodeCollab, Resume Tailor AI, Placement Pulse, Mock Interview Bot). Each card Add/Edit + live link + codebase link, full add/edit functionality via form.
- `src/components/dashboard/pages/TrendingSkillsPage.jsx` — 2026 market data 8 skills, % Employability Rate per skill, growth, jobs count, demo job listings per skill. Method note: 12k+ JDs.
- `src/components/dashboard/pages/FeedPage.jsx` — chips Internships/Jobs/Trending Skills → Courses, query filter, search uses username lookup note.
- `src/components/dashboard/pages/AssessmentPage.jsx` — AI coding test 5 questions generated live via Groq at request time not hardcoded, student uploads .txt answers, AI grader returns feedback/score. Uses /api/assessment-generate + /api/assessment-grade.
- `src/components/dashboard/pages/ApplicationsPage.jsx` — tracker 3 cols applied/shortlisted/interviewing with move actions.
- `api/_assessment.js` — shared Groq logic, uses ASS_KEY only (never AI_API_KEY), mock fallback, strict JSON response_format.
- `api/assessment-generate.js` + `api/assessment-grade.js` — Vercel serverless handlers reading ASS_KEY env server-only.
- `vite.config.js` — mounts new APIs in dev via devApiPlugin.

## Routes Added in App.jsx
- /dashboard (StudentDashboard)
- /dashboard/ats (AtsPage)
- /dashboard/projects (ProjectsPage)
- /dashboard/trending (TrendingSkillsPage)
- /dashboard/feed (FeedPage)
- /dashboard/assessment (AssessmentPage)
- /dashboard/applications (ApplicationsPage)
All ProtectedRoute.

## Env
- Existing chat: AI_API_KEY (server-only) — used in api/_shared.js
- New assessment: ASS_KEY (server-only) + optional ASS_MODEL (default openai/gpt-oss-20b). Never exposed to client bundle. Set in Vercel env + .env.local for dev. Dev fallback serves mockQuestions/mockGrade when missing, so UI works without key.

## Preserved Conventions
- useAuth() for session/profile, Supabase signOut, Tailwind v4, dark:bg-slate-950 dark:text-white dark:border-slate-800 meticulous, no backend jargon in UI copy (except minimal "live via Groq" for transparency in assessment spec).

## Username Lookup Spec
- Field stored localStorage `internx_username`, editable in sidebar. Used only for search: placeholder "try @username for profile lookup", search handler detects @ prefix and shows profile lookup toast. Not used as display handle (name still from profile.full_name).

## Build
- `npm run build` → 115 modules, chunks: pdf.worker 1.2MB, index 722KB (includes pdfjs), passes.
