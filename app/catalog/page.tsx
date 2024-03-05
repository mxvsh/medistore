'use client';

import React, { useMemo, useState } from 'react';
import Header from '#/lib/header';
import { Input } from '#/components/ui/input';
import AddProductButton from '#/lib/add-product';
import { Card } from '#/components/ui/card';
import { trpc } from '#/lib/trpc/client';
import { Loader2 } from 'lucide-react';
import { MainLayout } from '#/lib/layout';
import EditProductButton from '#/lib/edit-product';
import { Badge } from '#/components/ui/badge';
import { Button } from '#/components/ui/button';
import { HiDownload, HiOutlineDownload } from 'react-icons/hi';

function Page() {
  const [q, setQ] = useState('');
  const { data, isLoading } = trpc.product.list.useQuery();

  const products = useMemo(() => {
    if (!data) {
      return [];
    }

    if (q !== '') {
      return data.filter((product) =>
        product.name.toLowerCase().includes(q.toLowerCase()),
      );
    }

    return data.sort((a, b) => a.name.localeCompare(b.name));
  }, [q, data]);

  return (
    <MainLayout
      top={
        <Header
          back
          actions={
            <>
              <span className="text-sm text-right">
                {data?.length} products
              </span>
              <Button
                variant={'outline'}
                onClick={() => {
                  // download JSON
                  const element = document.createElement('a');
                  const file = new Blob([JSON.stringify(data)], {
                    type: 'text/plain',
                  });
                  element.href = URL.createObjectURL(file);
                  element.download = `products-${new Date().toISOString()}.json`;
                  document.body.appendChild(element); // Required for this to work in FireFox
                  element.click();
                }}
              >
                <HiOutlineDownload />
              </Button>
              <Input
                placeholder="Search"
                onChange={(e) => setQ(e.target.value)}
              />
              <AddProductButton />
            </>
          }
        />
      }
    >
      <div className="mt-4 flex flex-col gap-2">
        {isLoading && (
          <div>
            <Loader2 className="animate-spin" />
          </div>
        )}
        {products?.map((product) => (
          <Card
            key={product.id}
            className="p-4 flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg">{product.name}</h2>
                <Badge variant={'outline'}>{product.category}</Badge>
              </div>

              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg">
                  ₹{product.price.toFixed(2)}
                </h1>
                <span className="text-neutral-500 text-sm">
                  for {product.quantity} item
                </span>
              </div>
            </div>
            <div>
              {/* @ts-ignore */}
              <EditProductButton product={product} />
            </div>
          </Card>
        ))}
      </div>
    </MainLayout>
  );
}

export default Page;
