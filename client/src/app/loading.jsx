// loading.jsx
'use client';

import { LoaderPinwheel } from 'lucide-react';

export default function RootLoading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/50 z-50">
      <LoaderPinwheel className="h-20 w-20 animate-spin text-accent" />
    </div>
  );
}
