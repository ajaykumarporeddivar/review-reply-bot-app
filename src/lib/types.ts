/**
 * src/lib/types.ts
 *
 * Defines TypeScript interfaces for the Review Reply Bot application data.
 * This ensures type safety across all data structures used in the application.
 */

export type ReviewSentiment = 'positive' | 'negative' | 'neutral';
export type ReviewStatus = 'pending' | 'drafted' | 'replied' | 'archived';
export type ReplyStatus = 'draft' | 'ready' | 'sent';

export interface IReview {
  id: string;
  customerName: string;
  platform: 'Google' | 'Yelp' | 'Amazon' | 'Shopify' | 'Etsy' | 'Other';
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  sentiment: ReviewSentiment;
  receivedAt: string; // ISO 8601 date string
  status: ReviewStatus;
  replyId?: string; // Link to the associated reply if drafted/replied
  productId?: string;
  productName?: string;
}

export interface IReply {
  id: string;
  reviewId: string; // Link to the original review
  authorId: string; // User who drafted the reply
  content: string;
  draftedAt: string; // ISO 8601 date string
  lastEditedAt?: string; // ISO 8601 date string
  status: ReplyStatus;
  sentimentTone: ReviewSentiment; // Tone of the generated reply
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'manager' | 'staff';
  avatar: string;
}

export interface IActivity {
  id: string;
  userId: string;
  userName: string;
  type: 'review_received' | 'reply_drafted' | 'reply_sent' | 'review_archived' | 'settings_updated';
  description: string;
  timestamp: string; // ISO 8601 date string
  relatedId?: string; // ID of the review/reply/setting item
}

export interface IStat {
  id: string;
  label: string;
  value: number;
  delta: number;
  deltaType: 'increase' | 'decrease' | 'neutral';
  unit?: string;
}

export interface IChartDataPoint {
  name: string;
  value: number;
}

export interface ISparklineDataPoint {
  value: number;
}