import { handleAts } from './_ats.js'

/**
 * Vercel serverless function: POST /api/ats-analyze
 * Body: { resumeText: string, targetRole: string }
 * Always 200s with a report when text is valid — falls back to the mock
 * on any failure so the live demo is bulletproof.
 */
export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  if (req.method !== 'POST') {
    res.statusCode = 405
    return res.end(JSON.stringify({ error: 'Method not allowed — use POST.' }))
  }
  let payload = {}
  try {
    payload = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
  } catch {
    res.statusCode = 400
    return res.end(JSON.stringify({ error: 'Request body must be valid JSON.' }))
  }
  const { status, body } = await handleAts(payload, process.env)
  res.statusCode = status
  return res.end(JSON.stringify(body))
}
