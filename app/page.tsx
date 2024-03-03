'use client';

import Link from 'next/link';
import Header from '#/lib/header';
import { Button } from '#/components/ui/button';
import { MainLayout } from '#/lib/layout';
import { trpc } from '#/lib/trpc/client';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '#/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover';
import { HiIdentification, HiOutlineTrash } from 'react-icons/hi';
import { useMemo, useRef, useState } from 'react';
import { CheckIcon } from 'lucide-react';
import { cn } from '#/lib/utils';
import { Input } from '#/components/ui/input';
import { Product } from '@prisma/client';
import { Card } from '#/components/ui/card';

export default function Home() {
  const { data, isLoading } = trpc.product.list.useQuery();

  const qRef = useRef<HTMLInputElement>(null);

  // States
  const [open, setOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [items, setItems] = useState<
    {
      quantity: number;
      product: Product;
    }[]
  >([]);

  function handleSubmit() {
    const quantity = qRef.current?.value;
    if (!quantity) {
      return;
    }

    const product = data?.find(
      (product) => product.id.toString() === selectedProductId,
    );

    if (!product) {
      return;
    }

    // @ts-ignore
    setItems((prev) => [
      ...prev,
      {
        quantity: parseInt(quantity, 10),
        product,
      },
    ]);
  }

  const total = useMemo(() => {
    let total = 0;
    items.forEach((item) => {
      total += (item.product.price / item.product.quantity) * item.quantity;
    });

    return total;
  }, [items]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data</div>;
  }

  return (
    <MainLayout
      bottom={
        <>
          <div className="flex justify-end">
            <h1 className="text-lg font-bold">Total: ₹{total.toFixed(2)}</h1>
          </div>
          <div className="mt-4 flex items-center justify-between gap-4 p-4 border-1 rounded-t-xl drop-shadow-xl bg-neutral-50">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] justify-between"
                >
                  {selectedProductId
                    ? data.find(
                        (product) =>
                          product.id.toString() === selectedProductId,
                      )?.name
                    : 'Select product...'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Search product..."
                    className="h-9"
                  />
                  <CommandEmpty>No product found.</CommandEmpty>
                  <CommandGroup>
                    {data.map((product) => (
                      <CommandItem
                        key={product.id}
                        value={product.id.toString()}
                        onSelect={(currentValue) => {
                          setSelectedProductId(currentValue);
                          setOpen(false);
                        }}
                      >
                        {product.name}
                        <CheckIcon
                          className={cn(
                            'ml-auto h-4 w-4',
                            selectedProductId === product.id.toString()
                              ? 'opacity-100'
                              : 'opacity-0',
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            <Input
              ref={qRef}
              placeholder="Quantity"
              type="number"
              className="w-40"
            />
            <Button color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </>
      }
    >
      <Header
        actions={
          <Link href="/catalog">
            <Button color="primary">Catalog</Button>
          </Link>
        }
      />
      <div className="mt-4 space-y-4">
        {items.length === 0 && (
          <div className="flex items-center justify-center">
            <p className="text-lg font-bold">No items</p>
          </div>
        )}
        <AnimatePresence>
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="flex items-center justify-between p-4">
                <div>
                  <h1 className="font-bold">{item.product.name}</h1>
                  <p>
                    ₹
                    {(
                      (item.product.price / item.product.quantity) *
                      item.quantity
                    ).toFixed(2)}
                    <span className="text-sm text-neutral-500">
                      {' '}
                      ({item.quantity} x ₹
                      {item.product.price / item.product.quantity})
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    defaultValue={item.quantity}
                    className="w-20 appearance-none"
                    onChange={(e) => {
                      const value = e.target.value;
                      setItems((prev) =>
                        prev.map((i) => {
                          if (i.product.id === item.product.id) {
                            return {
                              ...i,
                              quantity: parseInt(value, 10),
                            };
                          }
                          return i;
                        }),
                      );
                    }}
                  />
                  <HiOutlineTrash
                    size={20}
                    onClick={() => {
                      const copy = [...items];
                      copy.splice(index, 1);
                      setItems(copy);
                    }}
                  />
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
}
