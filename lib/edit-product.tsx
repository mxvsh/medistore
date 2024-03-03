'use client';
import { Button } from '#/components/ui/button';
import { DialogHeader } from '#/components/ui/dialog';
import { Input } from '#/components/ui/input';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '#/components/ui/dialog';
import React from 'react';
import { HiOutlinePencil, HiOutlinePlus } from 'react-icons/hi';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '#/components/ui/form';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '#/components/ui/select';
import { trpc } from './trpc/client';
import { toast } from 'sonner';
import { Product } from '@prisma/client';

function EditProductButton({ product }: { product: Product }) {
  const utils = trpc.useUtils();
  const form = useForm({
    defaultValues: {
      name: product.name,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      category: product.category,
    },
  });
  const updateProduct = trpc.product.update.useMutation();

  function handleSubmit(data: Record<string, string>) {
    updateProduct
      .mutateAsync({
        id: product.id,
        name: data.name,
        price: Number(data.price),
        quantity: Number(data.quantity),
        category: data.category,
      })
      .then(() => {
        toast.success('Product updated successfully');
        utils.product.list.invalidate();
      });
  }

  return (
    <Form {...form}>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            <HiOutlinePencil />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>Edit product details</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter product name"
                        spellCheck={false}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter price"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter quantity"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select product category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {['Capsule', 'Tablet', 'Syrup', 'Injection'].map(
                          (category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" isLoading={updateProduct.isLoading}>
              Submit
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Form>
  );
}

export default EditProductButton;
