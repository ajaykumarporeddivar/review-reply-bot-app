FILE: src/app/page.tsx
<<<
import Link from 'next/link';
import {
  ArrowRight,
  FilePlus,
  LayoutDashboard,
  Download,
  Lock,
  Star,
  Sparkles,
  Zap,
  ShieldCheck,
  Settings,
  Users,
  Gauge,
  BarChart2,
  CreditCard,
} from 'lucide-react';

export const metadata = {
  title: 'Review Reply Bot — Master Your Online Reputation',
  description: 'The Review Reply Bot empowers small to medium e-commerce and local business owners to quickly intake customer reviews, generate brand-aligned replies, and manage their reply queue from a central dashboard, ready for export.',
};

export default function HomePage() {
  const PRODUCT_NAME = 'Review Reply Bot';

  const socialProofMetrics = [
    { value: '5 mins', label: 'Setup in' },
    { value: '2 mins', label: 'First Reply in' },
    { value: '99.9%', label: 'Uptime' },
    { value: '1000s', label: 'Businesses Trust' },
  ];

  const features = [
    {
      icon: FilePlus,
      name: 'Review Intake & Reply Generation',
      painPoint: 'Tired of manually writing every reply?',
      description: 'Quickly paste review text or URL, select your