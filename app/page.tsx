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
import { HiOutlineTrash } from 'react-icons/hi';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CheckIcon, Loader2 } from 'lucide-react';
import { cn } from '#/lib/utils';
import { Input } from '#/components/ui/input';
import { Product } from '@prisma/client';
import { Card } from '#/components/ui/card';
import { Badge } from '#/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog';
import { categories } from '#/lib/category';

const colors: Record<(typeof categories)[number], string> = {
  Capsule: '#f59e0b',
  Tablet: '#a78bfa',
  Syrup: '#f472b6',
  Injection: '#34d399',
  Cream: '#f97316',
  Drops: '#93c5fd',
  Ointment: '#fbbf24',
};

export default function Home() {
  const { data, isLoading } = trpc.product.list.useQuery();

  const qRef = useRef<HTMLInputElement>(null);

  // States
  const [open, setOpen] = useState(false);
  const [summary, setSummary] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
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

    if (!selectedProduct) {
      return;
    }

    const newItem = [
      ...items,
      { quantity: parseInt(quantity, 10), product: selectedProduct },
    ];
    // @ts-ignore
    setItems(newItem);
    updateLocalStorage(newItem);
  }

  function updateLocalStorage(value: typeof items) {
    localStorage.setItem('cart', JSON.stringify(value));
  }

  useEffect(() => {
    const local = localStorage.getItem('cart');
    if (local) {
      setItems(JSON.parse(local));
    }
  }, []);

  const total = useMemo(() => {
    let total = 0;
    items.forEach((item) => {
      total +=
        (item.product.price / item.product.quantity) * (item.quantity || 0);
    });

    return total;
  }, [items]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center pt-12">
          <Loader2 className="animate-spin h-8 w-8" />
        </div>
      </MainLayout>
    );
  }

  if (!data) {
    return <MainLayout>No data</MainLayout>;
  }

  return (
    <MainLayout
      bottom={
        <>
          <div className="flex items-center justify-end px-4 md:px-0">
            <h1 className="text-lg font-bold">
              Total: ₹{(total || 0).toFixed(2)}
            </h1>
            <Button
              variant={'link'}
              onClick={() => {
                setSummary(true);
              }}
            >
              Summary
            </Button>
          </div>
          <div className="mt-4 flex items-center justify-between gap-4 p-4 border-1 rounded-t-xl drop-shadow-xl bg-neutral-50 px-4">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] justify-between"
                >
                  {selectedProduct?.name || 'Select product'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[250px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Search product..."
                    className="h-9"
                  />
                  <CommandEmpty>No product found.</CommandEmpty>
                  <CommandGroup className="max-h-72 overflow-auto">
                    {data.map((product) => (
                      <CommandItem
                        key={product.id}
                        value={product.name}
                        onSelect={() => {
                          // @ts-ignore
                          setSelectedProduct(product);
                          setOpen(false);
                        }}
                      >
                        <Badge className="flex w-12 justify-center">
                          {product.category.substring(0, 3).toLowerCase()}
                        </Badge>
                        <span className="ml-2">{product.name}</span>
                        <CheckIcon
                          className={cn(
                            'ml-auto h-4 w-4',
                            selectedProduct?.id === product.id
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
              className="w-32"
            />
            <div className="flex items-center gap-2">
              <Button color="primary" onClick={handleSubmit}>
                Submit
              </Button>
              <Button
                variant={'outline'}
                onClick={() => {
                  const cnf = confirm(
                    'Are you sure you want to clear the cart?',
                  );
                  if (cnf) {
                    setItems([]);
                    localStorage.removeItem('cart');
                  }
                }}
              >
                Clear
              </Button>
            </div>
          </div>
        </>
      }
      top={
        <Header
          actions={
            <Link href="/catalog">
              <Button color="primary">Catalog</Button>
            </Link>
          }
        />
      }
    >
      <div className="mt-4 space-y-4">
        {items.length === 0 && (
          <div className="flex items-center justify-center">
            <p className="text-lg">No items</p>
          </div>
        )}
        <AnimatePresence>
          {items.map((item, index) => {
            const color = colors[item.product.category as any];

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="flex items-center p-4 gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge
                        variant={'outline'}
                        style={{
                          backgroundColor: color,
                          color: 'white',
                          borderWidth: 0,
                        }}
                      >
                        {item.product.category}
                      </Badge>
                    </div>

                    <h1 className="text-lg font-bold mt-1">
                      {item.product.name}
                    </h1>
                    <h5>
                      ₹
                      {(
                        (item.product.price / item.product.quantity) *
                        (item.quantity || 0)
                      ).toFixed(2)}{' '}
                      <span className="text-xs text-neutral-500">
                        ₹{item.product.price.toFixed(2)} for{' '}
                        {item.product.quantity} unit
                        {item.product.quantity > 1 ? 's' : ''}
                      </span>
                    </h5>
                  </div>
                  <div className="flex-1" />
                  <div className="flex items-center gap-2">
                    <Badge color="primary">
                      ₹{(item.product.price / item.product.quantity).toFixed(2)}
                    </Badge>
                    <span className="text-sm text-neutral-500">x</span>
                    <Input
                      type="number"
                      value={item.quantity}
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
                        updateLocalStorage(copy);
                      }}
                    />
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <Dialog
        open={summary}
        onOpenChange={() => {
          setSummary(!summary);
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Summary</DialogTitle>
            <DialogDescription>View order summary</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {items.map((item) => (
              <div
                className="flex items-center justify-between"
                key={item.product.id}
              >
                <div>
                  <h1 className="text-lg font-bold">{item.product.name}</h1>
                  <p>
                    ₹
                    {(
                      (item.product.price / item.product.quantity) *
                      item.quantity
                    ).toFixed(2)}
                    <span className="text-sm text-neutral-500">
                      {' '}
                      ({item.quantity} x ₹
                      {(item.product.price / item.product.quantity).toFixed(2)})
                    </span>
                  </p>
                </div>
                <div className="flex-1" />
                <div>
                  <Badge color="primary" className="text-lg">
                    {item.quantity}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
