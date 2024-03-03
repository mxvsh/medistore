'use client';

import React, { useState } from 'react';
import { Toaster } from 'sonner';
import { httpBatchLink } from '@trpc/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { trpc } from './trpc/client';

type Props = {
  children: React.ReactNode;
};
function Providers({ children }: Props) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
        }),
      ],
    }),
  );

  return (
    <>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>

        <ProgressBar
          color="#e2e2e2"
          options={{
            showSpinner: false,
          }}
        />
        <Toaster />
      </trpc.Provider>
    </>
  );
}

export default Providers;
