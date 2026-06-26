'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { FileText, FolderOpen, Users, Home } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isAdmin, isEditor } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || (!isAdmin && !isEditor)) {
      router.push('/login');
    }
  }, [isAuthenticated, isAdmin, isEditor, router]);

  if (!isAuthenticated || (!isAdmin && !isEditor)) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <nav className="space-y-2">
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full justify-start">
                <Home className="h-4 w-4 mr-2" />
                Overview
              </Button>
            </Link>
            <Link href="/dashboard/posts">
              <Button variant="ghost" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Posts
              </Button>
            </Link>
            <Link href="/dashboard/categories">
              <Button variant="ghost" className="w-full justify-start">
                <FolderOpen className="h-4 w-4 mr-2" />
                Categories
              </Button>
            </Link>
            {isAdmin && (
              <Link href="/dashboard/users">
                <Button variant="ghost" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Users
                </Button>
              </Link>
            )}
          </nav>
        </aside>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
