'use client';

import React from 'react';
import Header from '#/lib/header';
import { Input } from '#/components/ui/input';
import AddProductButton from '#/lib/add-product';
import { Card } from '#/components/ui/card';
import { trpc } from '#/lib/trpc/client';
import { Loader2 } from 'lucide-react';
import { HiOutlinePencil } from 'react-icons/hi';
import { Button } from '#/components/ui/button';

function Page() {
  const { data: products, isLoading } = trpc.product.list.useQuery();

  return (
    <div className="h-screen">
      <div className="max-w-2xl mx-auto space-y-4">
        <Header
          back
          actions={
            <>
              <Input placeholder="Search" />
              <AddProductButton />
            </>
          }
        />

        <div className="flex flex-col gap-2">
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
                <Button variant={'outline'}>
                  <HiOutlinePencil />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Page;
