'use client';

import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface PanelProps {
  open: boolean;
  children: ReactNode;
  close?: string;
}
export function Panel({ close = '/', open, children }: PanelProps) {
  const router = useRouter();
  return (
    <>
      <div
        className={clsx(
          'fixed bg-white left-3 sm:left-auto sm:max-w-[400px] sm:w-screen rounded-lg top-3 bottom-3 right-3 z-50 transition-transform duration-200',
          open && 'border translate-x-0',
          !open && 'pointer-events-none translate-x-[120%]'
        )}
      >
        <div className="p-6 h-full overflow-y-auto">{children}</div>
      </div>
      <div
        onClick={() => router.push(close)}
        className={clsx(
          'fixed inset-0  z-40 transition-colors duration-200',
          open && 'bg-black bg-opacity-55',
          !open && 'pointer-events-none'
        )}
      ></div>
    </>
  );
}
