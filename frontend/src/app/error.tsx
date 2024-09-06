'use client'; // Error boundaries must be Client Components

import { useEffect } from 'react';
import { Button } from './components';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <div className="max-w-[500px] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold mb-2 text-gray-900 text-center">
          Something has gone quite wrong, and you were not supposed to see this!
        </h2>
        <p className="mb-8 text-md font-light text-gray-500 text-center">
          I probably would have fixed this before it before production, but
          since this isn't production ready code, cheers to trying again
        </p>
        <Button onClick={() => reset()}>Try again</Button>
      </div>
    </div>
  );
}
