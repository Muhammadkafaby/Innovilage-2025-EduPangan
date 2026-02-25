'use client';

import React from 'react';

export function Skeleton({ className = '', variant = 'text', width, height }) {
  const baseClasses = 'shimmer rounded-lg';
  
  const variantClasses = {
    text: 'h-4 w-full',
    title: 'h-6 w-3/4',
    avatar: 'h-12 w-12 rounded-full',
    button: 'h-10 w-24 rounded-xl',
    card: 'h-32 w-full rounded-2xl',
    image: 'h-40 w-full rounded-xl',
    circle: 'rounded-full',
    rect: '',
  };

  const style = {
    width: width,
    height: height,
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="neo-card p-4 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton variant="avatar" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="w-1/2" />
          <Skeleton variant="text" className="w-1/4" />
        </div>
      </div>
      <Skeleton variant="text" />
      <Skeleton variant="text" className="w-3/4" />
    </div>
  );
}

export function ListSkeleton({ count = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="neo-card-sm p-3 flex items-center gap-3">
          <Skeleton variant="avatar" className="h-10 w-10" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="w-1/2" />
            <Skeleton variant="text" className="w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function GridSkeleton({ count = 6, columns = 2 }) {
  return (
    <div className={`grid grid-cols-${columns} gap-3`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="neo-card-sm p-3">
          <Skeleton variant="image" className="h-24 mb-2" />
          <Skeleton variant="text" className="w-3/4 mb-1" />
          <Skeleton variant="text" className="w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="neo-card p-4">
      <div className="flex items-center justify-between mb-2">
        <Skeleton variant="circle" width={32} height={32} />
        <Skeleton variant="text" className="w-16" />
      </div>
      <Skeleton variant="title" className="mb-1" />
      <Skeleton variant="text" className="w-1/2" />
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <Skeleton variant="text" className="w-24" />
          <Skeleton variant="rect" className="h-12 w-full" />
        </div>
      ))}
      <Skeleton variant="button" className="w-full h-12 mt-4" />
    </div>
  );
}

export default Skeleton;
