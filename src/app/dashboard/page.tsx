'use client';

import { useState, useEffect } from 'react';
import { STATS, MOCK_REVIEWS, RECENT_ACTIVITY, DEMO_USER, CHART_DATA, SPARKLINE_DATA } from '@/lib/data';
import { formatDate, formatCurrency } from '@/lib/utils';
import {
  StatCard,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Avatar,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Button,
  Input,
} from '@/components/ui';
import { BarChart, Sparkline } from '@/components/charts';
import { AppHeader } from '@/components/layout';
import { Download, Search } from 'lucide-react';
import { IReview } from '@/lib/data'; // Assuming IReview is exported for type safety
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Link from 'next/link';

// cn utility for conditional classNames
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function DashboardPage(): JSX.Element {
  const [selectedReview, setSelectedReview] = useState<IReview | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    if (toastMsg) {
      const timer = setTimeout(() => {
        setToastMsg(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [toastMsg]);

  const handleExportCSV = (): void => {
    const headers = ['Reviewer Name', 'Platform', 'Rating', 'Review Text', 'Status', 'Created At'];
    const rows = filteredReviews.map(review => [
      review.reviewerName,
      review.platform,
      review.rating,
      review.reviewText.replace(/"/g, '""'), // Escape double quotes
      review.status,
      formatDate(review.createdAt),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(field => `"${field}"`).join(',')), // Quote all fields
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'reviews_export.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setToastMsg('Reviews exported successfully!');
    }
  };

  const getReviewStatusVariant = (status: IReview['status']) => {
    switch (status) {
      case 'published':
        return 'success'; // text-emerald-600 bg-emerald-50
      case 'ready_to_publish':
        return 'primary'; // bg-zinc-900 (for actions, map to a distinct badge style)
      case 'pending':
        return 'warning'; // text-amber-600 bg-amber-50
      case 'draft':
        return 'default'; // default bg-zinc-100 text-zinc-800
      case 'generated':
        return 'info'; // Let's assume an info variant
      case 'archived':
        return 'muted'; // text-zinc-400
      default:
        return 'default';
    }
  };

  const filteredReviews = MOCK_REVIEWS.filter(review =>
    review.reviewerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.reviewText.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <>
      <AppHeader
        title="Dashboard"
        subtitle={`Good morning, ${DEMO_USER.name}`}
        actions={
          <Link href="/dashboard/review-intake">
            <Button size="sm">+ New Review</Button>
          </Link>
        }
      />

      {/* Section 2: KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Reviews"
          value={STATS[0].value}
          change={STATS[0].change}
          changeType={STATS[0].changeType}
          description={STATS[0].description}
        >
          <Sparkline data={SPARKLINE_DATA[0]} />
        </StatCard>
        <StatCard
          title="Published Replies"
          value={STATS[1].value}
          change={STATS[1].change}
          changeType={STATS[1].changeType}
          description={STATS[1].description}
        >
          <Sparkline data={SPARKLINE_DATA[1]} />
        </StatCard>
        <StatCard
          title="Avg. Rating"
          value={STATS[2].value}
          change={STATS[2].change}
          changeType={STATS[2].changeType}
          description={STATS[2].description}
        >
          <Sparkline data={SPARKLINE_DATA[2]} />
        </StatCard>
        <StatCard
          title="Pending Replies"
          value={STATS[3].value}
          change={STATS[3].change}
          changeType={STATS[3].changeType}
          description={STATS[3].description}
        >
          <Sparkline data={SPARKLINE_DATA[3]} />
        </StatCard>
      </div>

      {/* Section 3: Chart + Activity split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Reply Generation Overview</CardTitle>
            <p className="text-zinc-600 text-sm">Last 12 weeks</p>
          </CardHeader>
          <CardContent>
            <BarChart data={CHART_DATA.weekly} labels={CHART_DATA.labels} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {RECENT_ACTIVITY.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 py-2 border-b border-zinc-50 last:border-0">
                  <Avatar src={`https://api.dicebear.com/7.x/notionists/svg?seed=${activity.user}`} alt={activity.user} />
                  <div className="flex-1">
                    <p className="text-zinc-900 text-sm">{activity.action}</p>
                    <p className="text-zinc-400 text-xs">{formatDate(activity.time, { hour: 'numeric', minute: 'numeric' })}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section 4: Main data table */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>All Reviews</CardTitle>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <Input
                placeholder="Search reviews..."
                className="pl-9 pr-3 py-2 rounded-md border border-zinc-200 shadow-sm text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="mr-2" size={16} />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reviewer Name</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Review Snippet</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews.slice(0, 10).map((review) => (
                <TableRow
                  key={review.id}
                  onClick={() => setSelectedReview(review)}
                  className={cn(
                    'cursor-pointer hover:bg-zinc-50 transition-colors',
                    selectedReview?.id === review.id && 'bg-zinc-100'
                  )}
                >
                  <TableCell className="font-medium text-zinc-900">{review.reviewerName}</TableCell>
                  <TableCell className="text-zinc-600">{review.platform}</TableCell>
                  <TableCell className="text-zinc-600">{review.rating} / 5</TableCell>
                  <TableCell className="text-zinc-600 max-w-xs truncate">{review.reviewText.substring(0, 50)}...</TableCell>
                  <TableCell>
                    <Badge variant={getReviewStatusVariant(review.status)}>{review.status.replace(/_/g, ' ')}</Badge>
                  </TableCell>
                  <TableCell className="text-zinc-600">{formatDate(review.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedReview(review)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 text-sm text-zinc-600">
            Showing {Math.min(filteredReviews.length, 10)} of {filteredReviews.length} results
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Quick Actions row */}
      <div className="flex gap-4">
        <Link href="/dashboard/review-intake">
          <Button onClick={() => setToastMsg('Navigating to new review intake...')}>Generate New Reply</Button>
        </Link>
        <Button variant="outline" onClick={() => setToastMsg('Managing brand tones... (Coming soon)')}>Manage Brand Tones</Button>
        <Button variant="outline" onClick={() => setToastMsg('Viewing platform integrations... (Coming soon)')}>View Integrations</Button>
      </div>

      {toastMsg && (
        <div className="fixed bottom-6 right-6 bg-zinc-900 text-white px-4 py-2 rounded-lg shadow-lg text-sm transition-opacity duration-300">
          {toastMsg}
        </div>
      )}

      {/* A simple overlay/modal for selected review details - for demonstration */}
      {selectedReview && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50"
          onClick={() => setSelectedReview(null)}
        >
          <Card className="w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Review Details</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setSelectedReview(null)}>
                X
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold text-zinc-900">Reviewer: </p>
                <p className="text-zinc-700">{selectedReview.reviewerName}</p>
              </div>
              <div>
                <p className="font-semibold text-zinc-900">Platform: </p>
                <p className="text-zinc-700">{selectedReview.platform}</p>
              </div>
              <div>
                <p className="font-semibold text-zinc-900">Rating: </p>
                <p className="text-zinc-700">{selectedReview.rating} / 5</p>
              </div>
              <div>
                <p className="font-semibold text-zinc-900">Review Text: </p>
                <p className="text-zinc-700">{selectedReview.reviewText}</p>
              </div>
              <div>
                <p className="font-semibold text-zinc-900">Status: </p>
                <Badge variant={getReviewStatusVariant(selectedReview.status)}>
                  {selectedReview.status.replace(/_/g, ' ')}
                </Badge>
              </div>
              <Button onClick={() => setToastMsg(`Marking review ${selectedReview.id} as published... (simulated)`)}>
                Mark as Published
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}