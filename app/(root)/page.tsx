import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

const page = () => {
  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview ready</h2>
          <p className="text-lg">
            Pracetice on real interview questions and get Instant feedback
          </p>
          <Button
            asChild
            className="btn-primary max-sm:w-full"
          >
            <Link href="/interview">Start Interview</Link>
          </Button>
        </div>
        <Image
          src="/robot.png"
          alt="robot-dude"
          width={400}
          height={400}
          className="max-sm:hidden"
        ></Image>
      </section>
      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Interviews</h2>
        <div className="interview-section">
          <p>You haven &apos; t taken any interviews yet.</p>
        </div>
      </section>
      <section className="flex flex-col gap-6 mt-8">
        <h2>Take an Interview</h2>
        <div className="interviews-section">
          <p>there are no interviews available</p>
        </div>
      </section>
    </>
  );
};

export default page;
