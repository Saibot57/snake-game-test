'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GamesRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the games hub
    router.push('/features/games');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#fcd7d7]">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting to Games Hub...</h1>
        <p>If you are not redirected automatically, click the button below:</p>
        <button 
          onClick={() => router.push('/features/games')}
          className="mt-4 bg-[#ff6b6b] hover:bg-[#ff5252] text-white font-bold py-2 px-4 rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black"
        >
          Go to Games Hub
        </button>
      </div>
    </div>
  );
}