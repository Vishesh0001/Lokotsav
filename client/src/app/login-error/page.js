'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function LoginErrorPage() {
  const router = useRouter();

  useEffect(() => {
    toast.error('No login found. Please log in first.');
  }, []);

  return (
    <main className="flex h-screen items-center justify-center bg-background px-4">
      <div className="text-center space-y-6">
        <h1 className="text-2xl font-semibold text-red-600">You need to login first</h1>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => router.push('/login')}>Login</Button>
          <Button variant="secondary" onClick={() => router.push('/')}>Home</Button>
        </div>
      </div>
    </main>
  );
}
