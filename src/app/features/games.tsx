'use client';

import React from 'react';
import Link from 'next/link';
import { BugOff, Gamepad2, Joystick } from 'lucide-react';

export default function GamesPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] bg-[#fcd7d7]">
      <h1 className="text-4xl font-monument mb-8">Games</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Snake Game Card */}
        <Link href="/features/snake">
          <div className="neo-brutalist-card p-6 h-64 w-64 flex flex-col items-center justify-center transition-transform hover:translate-y-[-5px]">
            <BugOff className="h-20 w-20 mb-4 text-white" />
            <h2 className="text-2xl font-monument text-white text-center">Snake</h2>
            <p className="text-white text-center mt-2">Classic snake game with Swedish existential thoughts</p>
          </div>
        </Link>
        
        {/* Zelenskyy Game Card */}
        <Link href="/features/zelenskyy">
          <div className="neo-brutalist-card p-6 h-64 w-64 flex flex-col items-center justify-center transition-transform hover:translate-y-[-5px]">
            <Gamepad2 className="h-20 w-20 mb-4 text-white" />
            <h2 className="text-2xl font-monument text-white text-center">Zelenskyy vs. The Kremlin</h2>
            <p className="text-white text-center mt-2">Help Zelenskyy defeat Trump enemies and the Putin boss</p>
          </div>
        </Link>
        
        {/* Mario Game Card */}
        <Link href="/features/mario">
          <div className="neo-brutalist-card p-6 h-64 w-64 flex flex-col items-center justify-center transition-transform hover:translate-y-[-5px]">
            <Joystick className="h-20 w-20 mb-4 text-white" />
            <h2 className="text-2xl font-monument text-white text-center">Self-Aware Mario</h2>
            <p className="text-white text-center mt-2">Play as a Mario who realizes he's in a game</p>
          </div>
        </Link>
      </div>
    </div>
  );
}