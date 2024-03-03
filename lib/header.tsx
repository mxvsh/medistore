import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HiArrowLeft } from 'react-icons/hi';
import { Button } from '#/components/ui/button';

type Props = {
  actions?: React.ReactNode;
  back?: boolean;
};
function Header({ actions, back }: Props) {
  return (
    <div className="flex items-center py-4 border-b justify-between px-4 md:px-0">
      {back ? (
        <Link href="/">
          <Button variant="ghost">
            <HiArrowLeft />
          </Button>
        </Link>
      ) : (
        <Image
          alt="logo"
          src="/logo.png"
          width={40}
          height={40}
          className="rounded-xl"
        />
      )}
      <div className="flex-1"></div>
      <div className="flex items-center w-40% gap-4">{actions}</div>
    </div>
  );
}

export default Header;
