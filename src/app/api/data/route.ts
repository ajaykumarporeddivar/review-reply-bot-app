import {
  MOCK_BUSINESSES,
  MOCK_PLATFORMINTEGRATIONS,
  MOCK_REVIEWS,
  MOCK_REPLIES,
  STATS,
} from '@/lib/data'
import { NextRequest } from 'next/server'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function GET(): Promise<Response> {
  return Response.json(
    {
      ok: true,
      data: {
        businesses: MOCK_BUSINESSES,
        platformIntegrations: MOCK_PLATFORMINTEGRATIONS,
        reviews: MOCK_REVIEWS,
        replies: MOCK_REPLIES,
        stats: STATS,
        totalBusinesses: MOCK_BUSINESSES.length,
        totalPlatformIntegrations: MOCK_PLATFORMINTEGRATIONS.length,
        totalReviews: MOCK_REVIEWS.length,
        totalReplies: MOCK_REPLIES.length,
      },
    },
    { headers: CORS_HEADERS },
  )
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = await request.json()
    return Response.json(
      {
        ok: true,
        message: 'Demo mode — data not persisted',
        received: body,
      },
      { status: 200, headers: CORS_HEADERS },
    )
  } catch (error) {
    return Response.json(
      { ok: false, message: 'Invalid JSON body' },
      { status: 400, headers: CORS_HEADERS },
    )
  }
}

export async function OPTIONS(): Promise<Response> {
  return new Response(null, { status: 200, headers: CORS_HEADERS })
}