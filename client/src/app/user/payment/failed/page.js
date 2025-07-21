'use client'
import { XCircle, Home, CreditCard } from 'lucide-react';
import Link from 'next/link';

export default function PaymentFailed() {
  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <section className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-[0_4px_24px_0_rgba(0,0,0,0.05)]">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-red-50 text-red-600">
          <XCircle className="size-10 animate-[pulse_0.6s_ease-in-out]" />
        </div>

        <h1 className="mb-3 text-center text-2xl font-semibold text-gray-900">
          Payment Failed
        </h1>
        <p className="text-center text-gray-600">
          We could not process your payment. Please check your payment details and try again.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-200"
          >
            <Home className="size-5" />
            Go Home
          </Link>
          <Link
            href="/payment/retry"
            className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 font-medium text-white transition-colors hover:bg-red-700"
          >
            <CreditCard className="size-5" />
            Try Again
          </Link>
        </div>

        <div className="mt-6 rounded-lg bg-gray-50 p-4 text-center">
          <p className="text-sm text-gray-600">
            Need help? <Link href="/contact" className="text-indigo-600 hover:underline">Contact support</Link>
          </p>
        </div>
      </section>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </main>
  );
}