'use client';

import { ReactNode } from 'react';
import { AppSidebar } from '@/components/layout';
import { FilePlus, LayoutDashboard, Download } from 'lucide-react';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { icon: <FilePlus size={16} />, label: 'New Review', href: '/dashboard/review-intake' },
  { icon: <LayoutDashboard size={16} />, label: 'Replies', href: '/dashboard/reply-dashboard' },
  { icon: <Download size={16} />, label: 'Export Report', href: '/dashboard/reply-exports' },
];

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <div className="flex min-h-screen bg-zinc-50">
      <AppSidebar items={navItems} projectName="Review Reply Bot" />
      <div className="flex-1 ml-64 flex flex-col min-h-full">
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}