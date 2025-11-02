'use client';

import React from 'react';

export function MemphisShapes() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10">
      {/* Decorative shapes */}
      <div className="absolute top-20 left-10 w-32 h-32 border-4 border-brand-secondary rounded-full animate-float" />
      <div className="absolute top-40 right-20 w-24 h-24 bg-brand-primary/20 rotate-45 animate-pulse-slow" />
      <div className="absolute bottom-40 left-1/4 w-40 h-40 border-4 border-brand-border rounded-lg animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-brand-secondary/20 rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-20 right-10 w-36 h-36 border-4 border-brand-primary rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
    </div>
  );
}
