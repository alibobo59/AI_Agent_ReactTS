import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { isAuthenticated } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';

async function RootLayout({ children }: { children: React.ReactNode }) {
  const isUserAuthenticated = await isAuthenticated();

  if (!isUserAuthenticated) {
    redirect('/signin');
  }
  return (
    <div className="root-layout">
      <nav>
        <Link
          href="/"
          className="flex items-center gap-2"
        >
          <Image
            src="/logo.svg"
            alt="Logo"
            width={38}
            height={32}
          />
        </Link>
      </nav>
      {children}
    </div>
  );
}

export default RootLayout;
