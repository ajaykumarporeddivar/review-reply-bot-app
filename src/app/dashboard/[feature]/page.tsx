FILE: src/app/dashboard/[feature]/page.tsx
<<<
'use client'
import { useParams } from 'next/navigation'
import { useState, useMemo, ChangeEvent } from 'react'
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Input, Textarea, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui'
import { AppHeader } from '@/components/layout'
import { formatDate, formatCurrency } from '@/lib/utils'
// ⚠ Import ONLY the MOCK arrays defined in your SPEC CONTRACT Entity Reference Table:
import { MOCK_REVIEWS, MOCK_REPLIES, MOCK_BUSINESSES } from '@/lib/data'
import { Search, Plus, Download, Eye, CheckCircle2, XCircle, Info, MessageSquare, Star, ReplyIcon } from 'lucide-react'
import { IReview, IReply } from '@/lib/types' // Import interfaces for type safety

export default function FeaturePage() {
  const params = useParams()
  const slug = (params.feature as string) ?? ''
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null) // For dashboard detail view
  const [selectedReplyId, setSelectedReplyId] = useState<string | null>(null) // For export audit log detail view

  // F1: Review Intake & Reply Generation states
  const [newReviewText, setNewReviewText] = useState('')
  const [newReviewerName, setNewReviewerName] = useState('')
  const [newReviewRating, setNewReviewRating] = useState<number | ''>(5)
  const [newReviewPlatform, setNewReviewPlatform] = useState('')
  const [selectedBrandTone, setSelectedBrandTone] = useState<IReview['brandTone']>('Friendly & Empathetic') // Default to first available
  const [generatedReplyText, setGeneratedReplyText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleGenerateReply = () => {
    setIsGenerating(true)
    setMessage(null)
    // Simulate AI generation
    setTimeout(() => {
      let tonePrefix = ''
      if (selectedBrandTone === 'Friendly & Empathetic') tonePrefix = "Thanks so much for sharing! We really appreciate it."
      if (selectedBrandTone === 'Professional & Concise') tonePrefix = "We acknowledge your feedback and appreciate you taking the time to share it."
      if (selectedBrandTone === 'Enthusiastic & Promotional') tonePrefix = "Wow, incredible to hear! We're thrilled!"

      const generated = `${tonePrefix} ${newReviewerName ? newReviewerName : 'Customer'}, regarding your review: "${newReviewText.substring(0, 100)}..." We aim for 5-star experiences, and your input helps us. Please reach out if you need anything else! (Generated with ${selectedBrandTone} tone)`
      setGeneratedReplyText(generated)
      setIsGenerating(false)
      setMessage({ type: 'success', text: 'Reply generated successfully!' })
    }, 1500)
  }

  const handleSaveReviewAndReply = () => {
    setIsSaving(true)
    setMessage(null)
    setTimeout(() => {
      // Simulate saving to a backend
      console.log('Saving Review & Reply:', {
        reviewText: newReviewText,
        reviewerName: newReviewerName,
        rating: newReviewRating,
        platform: newReviewPlatform,
        brandTone: selectedBrandTone,
        finalReplyText: generatedReplyText,
        status: 'generated', // Assume it's generated and ready for review
        createdAt: new Date().toISOString(),
      })
      // Reset form
      setNewReviewText('')
      setNewReviewerName('')
      setNewReviewRating(5)
      setNewReviewPlatform('')
      setSelectedBrandTone('Friendly & Empathetic')
      setGeneratedReplyText('')
      setIsSaving(false)
      setMessage({ type: 'success', text: 'Review and reply saved to dashboard for publishing!' })
    }, 1500)
  }

  const brandToneOptions: IReview['brandTone'][] = ['Friendly & Empathetic', 'Professional & Concise', 'Enthusiastic & Promotional']

  // ── Feature 1: Review Intake & Reply Generation (/dashboard/review-intake) ──────────────────────
  if (slug === 'review-intake') {
    return (
      <div className="space-y-6">
        <AppHeader
          title="Review Intake & Reply Generation"
          subtitle="Capture new reviews and generate brand-aligned replies."
          actions={
            <Button
              size="sm"
              onClick={handleSaveReviewAndReply}
              disabled={!newReviewText || !generatedReplyText || isSaving || isGenerating}
            >
              {isSaving ? 'Saving...' : <><CheckCircle2 size={14} className="mr-1" />Save Review & Reply</>}
            </Button>
          }
        />

        {message && (
          <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message.type === 'success' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            <span>{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Review Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="reviewText" className="block text-sm font-medium text-zinc-700 mb-1">
                  Original Review Text <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="reviewText"
                  value={newReviewText}
                  onChange={e => setNewReviewText(e.target.value)}
                  placeholder="Paste the customer review text here..."
                  rows={6}
                  className="w-full border border-zinc-200 rounded-md shadow-sm p-3 text-sm focus:ring-zinc-900 focus:border-zinc-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="reviewerName" className="block text-sm font-medium text-zinc-700 mb-1">Reviewer Name</label>
                  <Input
                    id="reviewerName"
                    value={newReviewerName}
                    onChange={e => setNewReviewerName(e.target.value)}
                    placeholder="e.g., John D."
                    className="border-zinc-200"
                  />
                </div>
                <div>
                  <label htmlFor="reviewPlatform" className="block text-sm font-medium text-zinc-700 mb-1">Platform</label>
                  <Input
                    id="reviewPlatform"
                    value={newReviewPlatform}
                    onChange={e => setNewReviewPlatform(e.target.value)}
                    placeholder="e.g., Google, Shopify, Yelp"
                    className="border-zinc-200"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="reviewRating" className="block text-sm font-medium text-zinc-700 mb-1">Star Rating</label>
                <Select
                  value={String(newReviewRating)}
                  onValueChange={(value: string) => setNewReviewRating(Number(value))}
                >
                  <SelectTrigger className="w-full border-zinc-200">
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map(rating => (
                      <SelectItem key={rating} value={String(rating)}>
                        {rating} Star{rating !== 1 ? 's' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="brandTone" className="block text-sm font-medium text-zinc-700 mb-1">
                  Brand Tone <span className="text-red-500">*</span>
                </label>
                <Select
                  value={selectedBrandTone}
                  onValueChange={(value: IReview['brandTone']) => setSelectedBrandTone(value)}
                >
                  <SelectTrigger className="w-full border-zinc-200">
                    <SelectValue placeholder="Select a brand tone" />
                  </SelectTrigger>
                  <SelectContent>
                    {brandToneOptions.map(tone => (
                      <SelectItem key={tone} value={tone}>
                        {tone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleGenerateReply}
                disabled={!newReviewText || isGenerating || isSaving}
                className="w-full mt-4"
              >
                {isGenerating ? 'Generating...' : <><MessageSquare size={14} className="mr-1" />Generate Reply</>}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Generated Reply Preview</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="generatedReplyText" className="block text-sm font-medium text-zinc-700 mb-1">
                  Editable Reply
                </label>
                <Textarea
                  id="generatedReplyText"
                  value={generatedReplyText}
                  onChange={e => setGeneratedReplyText(e.target.value)}
                  placeholder="Generated reply will appear here. You can edit it."
                  rows={10}
                  className="w-full border border-zinc-200 rounded-md shadow-sm p-3 text-sm focus:ring-zinc-900 focus:border-zinc-900"
                />
              </div>
              <p className="text-sm text-zinc-500">
                Review this reply and make any necessary edits before saving. Once saved, it will appear in your Replies Dashboard.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // ── Feature 2: Reply Management Dashboard (/dashboard/reply-dashboard) ──────────────────────
  if (slug === 'reply-dashboard') {
    const filteredReviews = useMemo(() => {
      return MOCK_REVIEWS.filter(review =>
        (!search || review.reviewerName.toLowerCase().includes(search.toLowerCase()) || review.reviewText.toLowerCase().includes(search.toLowerCase())) &&
        (!statusFilter || review.status === statusFilter)
      )
    }, [search, statusFilter])

    const allReviewStatuses: IReview['status'][] = ['pending', 'draft', 'generated', 'ready_to_publish', 'published', 'archived']

    const getBadgeVariant = (status: IReview['status']) => {
      switch (status) {
        case 'ready_to_publish':
        case 'published':
          return 'success'
        case 'pending':
          return 'warning'
        case 'draft':
        case 'generated':
        case 'archived':
        default:
          return 'info' // A neutral or default style
      }
    }

    const selectedReview = selectedReviewId ? MOCK_REVIEWS.find(r => r.id === selectedReviewId) : null
    const associatedReply = selectedReview ? MOCK_REPLIES.find(rep => rep.reviewId === selectedReview.id) : null

    const handleUpdateReviewStatus = (reviewId: string, newStatus: IReview['status']) => {
      console.log(`Simulating update of Review ${reviewId} status to: ${newStatus}`)
      // In a real app, this would update MOCK_REVIEWS or a backend.
      // For this demo, we'll just log and clear selection for simplicity.
      setMessage({ type: 'success', text: `Review status updated to '${newStatus}' (simulated)` })
      setTimeout(() => setMessage(null), 3000)
      setSelectedReviewId(null); // Close the detail view
    }

    return (
      <div className="space-y-6">
        <AppHeader
          title="Reply Management Dashboard"
          subtitle={`${filteredReviews.length} reviews to action`}
          actions={<Button size="sm"><Plus size={14} className="mr-1" />New Review Intake</Button>}
        />
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <Input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search reviewer or review snippet..."
                  className="w-full pl-9 pr-3 py-2 text-sm border-zinc-200"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="max-w-[200px] border-zinc-200">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  {allReviewStatuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="border-b border-zinc-100">
                <tr className="text-left text-zinc-500 text-xs uppercase tracking-wide">
                  <th className="px-6 py-3">Reviewer</th>
                  <th className="px-6 py-3">Rating</th>
                  <th className="px-6 py-3">Snippet</th>
                  <th className="px-6 py-3">Platform</th>
                  <th className="px-6 py-3">Date Received</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {filteredReviews.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-zinc-500">No reviews match your criteria.</td>
                  </tr>
                ) : (
                  filteredReviews.map(review => (
                    <>
                      <tr
                        key={review.id}
                        onClick={() => setSelectedReviewId(selectedReviewId === review.id ? null : review.id)}
                        className={`hover:bg-zinc-50 cursor-pointer transition-colors ${selectedReviewId === review.id ? 'bg-indigo-50' : ''}`}
                      >
                        <td className="px-6 py-3 font-medium text-zinc-900">{review.reviewerName}</td>
                        <td className="px-6 py-3 text-zinc-500 flex items-center gap-1">
                          <Star size={12} className="text-amber-400 fill-amber-400" /> {review.rating}
                        </td>
                        <td className="px-6 py-3 text-zinc-700 max-w-[250px] truncate">{review.reviewText.substring(0, 70)}{review.reviewText.length > 70 ? '...' : ''}</td>
                        <td className="px-6 py-3 text-zinc-500">{review.platform}</td>
                        <td className="px-6 py-3 text-zinc-400 text-xs">{formatDate(review.createdAt)}</td>
                        <td className="px-6 py-3">
                          <Badge variant={getBadgeVariant(review.status)}>
                            {review.status.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}
                          </Badge>
                        </td>
                        <td className="px-6 py-3">
                          <button className="text-zinc-400 hover:text-zinc-700 p-1">
                            {selectedReviewId === review.id ? <XCircle size={14} /> : <Eye size={14} />}
                          </button>
                        </td>
                      </tr>
                      {selectedReviewId === review.id && selectedReview && (
                        <tr className="bg-indigo-50/50">
                          <td colSpan={7} className="px-6 py-4">
                            <div className="bg-white border border-zinc-200 rounded-lg p-4 space-y-4 shadow-sm">
                              <h4 className="font-semibold text-zinc-900 text-base">Review from {selectedReview.reviewerName} on {selectedReview.platform}</h4>
                              <p className="text-sm text-zinc-600">"{selectedReview.reviewText}"</p>
                              <div className="flex items-center gap-2 text-sm text-zinc-500">
                                <Star size={14} className="text-amber-400 fill-amber-400" /> {selectedReview.rating} Star Rating
                                <span className="mx-2 text-zinc-300">|</span>
                                <Info size={14} className="text-zinc-400" /> Current Status: <Badge variant={getBadgeVariant(selectedReview.status)}>{selectedReview.status.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}</Badge>
                              </div>
                              {associatedReply && (
                                <div className="border-t border-zinc-100 pt-4 mt-4 space-y-2">
                                  <h5 className="font-semibold text-zinc-800">Generated Reply:</h5>
                                  <Textarea
                                    value={associatedReply.finalReplyText}
                                    rows={4}
                                    readOnly
                                    className="w-full bg-zinc-50 border-zinc-200 rounded-md shadow-inner p-3 text-sm resize-none"
                                  />
                                  <p className="text-xs text-zinc-500">Tone: {associatedReply.brandTone}</p>
                                </div>
                              )}
                              <div className="flex gap-2 mt-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleUpdateReviewStatus(selectedReview.id, 'published')}
                                  disabled={selectedReview.status === 'published'}
                                >
                                  <CheckCircle2 size={14} className="mr-1" /> Mark as Published
                                </Button>
                                <Button
                                  variant="outline"