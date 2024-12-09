'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Auth sayfasına yönlendir
    router.push('/auth/signin');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">United Granite</h1>
          <p className="text-gray-600">Countertop Calculator</p>
        </div>
        <div className="animate-pulse">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    </div>
  );
}