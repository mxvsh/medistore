'use client';

import React, { useMemo, useState } from 'react';
import Header from '#/lib/header';
import { Input } from '#/components/ui/input';
import AddProductButton from '#/lib/add-product';
import { Card } from '#/components/ui/card';
import { trpc } from '#/lib/trpc/client';
import { Loader2 } from 'lucide-react';
import { HiOutlinePencil } from 'react-icons/hi';
import { Button } from '#/components/ui/button';
import { MainLayout } from '#/lib/layout';
import EditProductButton from '#/lib/edit-product';

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

    return data;
  }, [q, data]);

  return (
    <MainLayout
      top={
        <Header
          back
          actions={
            <>
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
              <h2 className="text-lg">{product.name}</h2>
              <h1 className="font-bold text-lg">₹{product.price}</h1>
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
