import { MOCK_BUSINESSES, MOCK_REVIEWS, MOCK_REPLIES } from '@/lib/data'
import { IBusiness, IReview, IReply } from '@/claude/spec-contract'
import { NextRequest } from 'next/server'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = request.nextUrl
  const query = searchParams.get('q') || ''
  const type = searchParams.get('type') // Optional: 'business', 'review', 'reply'
  const lowerCaseQuery = query.toLowerCase()

  let allResults: Array<IBusiness | IReview | IReply> = []

  if (!query) {
    // If query is empty, return first 5 reviews as primary items
    allResults = MOCK_REVIEWS.slice(0, 5)
  } else {
    // Search across businesses
    if (!type || type === 'business') {
      const businessResults: IBusiness[] = MOCK_BUSINESSES.filter(
        (business: IBusiness) =>
          business.name.toLowerCase().includes(lowerCaseQuery) ||
          (business.description &&
            business.description.toLowerCase().includes(lowerCaseQuery)),
      )
      allResults.push(...businessResults)
    }

    // Search across reviews
    if (!type || type === 'review') {
      const reviewResults: IReview[] = MOCK_REVIEWS.filter((review: IReview) =>
        review.reviewText.toLowerCase().includes(lowerCaseQuery) ||
        review.reviewerName.toLowerCase().includes(lowerCaseQuery) ||
        review.platform.toLowerCase().includes(lowerCaseQuery) ||
        (review.reviewTitle &&
          review.reviewTitle.toLowerCase().includes(lowerCaseQuery)),
      )
      allResults.push(...reviewResults)
    }

    // Search across replies
    if (!type || type === 'reply') {
      const replyResults: IReply[] = MOCK_REPLIES.filter((reply: IReply) =>
        reply.finalReplyText.toLowerCase().includes(lowerCaseQuery) ||
        (reply.originalReplyText &&
          reply.originalReplyText.toLowerCase().includes(lowerCaseQuery)),
      )
      allResults.push(...replyResults)
    }
  }

  // Ensure unique results if items from different types match the same ID, and limit to 20
  const uniqueResults = Array.from(new Map(allResults.map(item => [item.id, item])).values()).slice(0, 20);

  return Response.json(
    {
      ok: true,
      data: {
        results: uniqueResults,
        total: uniqueResults.length,
        query: query,
      },
    },
    { headers: CORS_HEADERS },
  )
}

export async function OPTIONS(): Promise<Response> {
  return new Response(null, { status: 200, headers: CORS_HEADERS })
}