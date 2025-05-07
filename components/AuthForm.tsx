'use client';

import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { toast } from 'sonner';
import React from 'react';
import FormField from './FormField';
import { useRouter } from 'next/navigation';

const authFormSchema = (type: FormType) => {
  const formSchema = z.object({
    name: type === 'sign-up' ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(8, {
      message: 'Password must be at least 8 characters.',
    }),
  });
  return formSchema;
};
function AuthForm({ type }: { type: FormType }) {
  const router = useRouter();
  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Submit button clicked! Form submitted.');
    try {
      if (type === 'sign-up') {
        toast.success('Sign Up successful!');
        router.push('/signin');
        console.log('Sign Up', values);
      } else {
        toast.success('Sign In successful!');
        router.push('/');
        console.log('Sign In', values);
      }
    } catch (error) {
      console.log(error);
      toast.error(`smth wrong ${error}`);
    }
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  const isSignIn = type === 'sign-in';

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex gap-2 justify-center">
          <Image
            src="/logo.svg"
            alt="logo"
            width={38}
            height={32}
          />
          <h2>Practice job interview with AI</h2>{' '}
        </div>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6 mt-4 form"
        >
          {!isSignIn && (
            <FormField
              control={form.control}
              name="name"
              type="text"
              label="Name"
              placeholder="Your Name"
            />
          )}
          <FormField
            control={form.control}
            name="email"
            type="email"
            label="Email"
            placeholder="Your Email"
          />
          <FormField
            control={form.control}
            name="password"
            type="password"
            label="Password"
            placeholder="Your Password"
          />
          <Button
            className="btn"
            type="submit"
            onClick={() => console.log('Button clicked!')}
          >
            {isSignIn ? 'Sign In' : 'Create an Account'}
          </Button>
        </form>
      </Form>
      <p className="text-center">
        {isSignIn ? 'Not a member?' : 'Already a member?'}
        <Link
          href={!isSignIn ? '/signin' : '/signup'}
          className="font-bold text-user-primary ml-1"
        >
          {!isSignIn ? 'Sign in' : 'Sign up'}
        </Link>
      </p>
    </div>
  );
}

export default AuthForm;
