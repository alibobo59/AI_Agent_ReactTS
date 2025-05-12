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
import { auth } from '@/firebase/client';
import { signIn, signUp } from '@/lib/actions/auth.action';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

type FormType = 'sign-in' | 'sign-up';

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === 'sign-up') {
        const { name, email, password } = values;
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const rs = await signUp({
          uid: userCredentials.user.uid,
          name: name!,
          email,
          password,
        });
        if (!rs?.success) {
          toast.error(rs?.message);
          return;
        }
        toast.success('Sign Up successful!');
        router.push('/signin');
        console.log('Sign Up', values);
      } else {
        const { email, password } = values;
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
          toast.error('sign in failed');

          return;
        }
        await signIn({
          email,
          idToken,
        });
        toast.success('Sign In successful!');
        router.push('/');
        console.log('Sign In', values);
      }
    } catch (error) {
      console.error(error);
      toast.error(`Something went wrong: ${error}`);
    }
  }

  const isSignIn = type === 'sign-in';

  return (
    <div className="auth-layout">
      <div className="card-border lg:min-w-[566px] w-full max-w-md animate-fadeIn">
        <div className="card py-10 px-8 flex flex-col gap-6">
          <div className="flex-center flex-col gap-4">
            <Image
              src="/logo.svg"
              alt="logo"
              width={48}
              height={40}
              className="w-12 h-10"
            />
            <h2 className="text-2xl font-bold text-light-100 text-center">
              {isSignIn ? 'Sign In to Your Account' : 'Create a New Account'}
            </h2>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="form space-y-5"
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
                type="submit"
                className="btn"
              >
                {isSignIn ? 'Sign In' : 'Create Account'}
              </Button>
            </form>
          </Form>
          <p className="text-center text-light-100 text-sm">
            {isSignIn ? 'Not a member?' : 'Already a member?'}{' '}
            <Link
              href={isSignIn ? '/signup' : '/signin'}
              className="font-bold text-primary-200 hover:text-primary-200/80"
            >
              {isSignIn ? 'Sign up' : 'Sign in'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
