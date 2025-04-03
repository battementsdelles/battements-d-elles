'use client';
import CustomInput from '@/components/controlled-input';
import { CustomError } from '@/lib/helpers/custom-error';
import {
  CreateUserSchema,
  ICreateUserDto,
} from '@/lib/helpers/zod/schemas/user.registration';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import GoogleSignInBtn from '../google-sign-in-btn';

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [showAlert, setShowAlert] = React.useState(false);

  // user login form
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ICreateUserDto>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      email: 'mehdicheref@gmail.com',
      username: 'mehdicheref',
      password: '%PitchouX',
      confirmPassword: '%PitchouX',
    },
  });

  const onSubmit: SubmitHandler<ICreateUserDto> = async (data) => {
    setLoading(true);
    console.log(data);
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(getValues()),
    });
    if (res.status !== 201) {
      const error = await res.json();
      console.log({ error });
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-[50vh]">
      <div className="card w-full max-w-md shadow-xl bg-base-100 border border-base-200">
        {/* Header */}
        <div className="card-body">
          <h2 className="text-2xl font-bold">Registration</h2>
          <p className="text-sm mb-4">
            Enter information below to create your account
          </p>
          {showAlert && (
            <div
              id="alert-2"
              className="flex items-center p-4 mb-4 text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
              role="alert"
            >
              <svg
                className="shrink-0 w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
              <span className="sr-only">Info</span>
              <div className="ms-3 text-sm font-medium">
                Invalid credentials!
              </div>
              <button
                type="button"
                className="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
                data-dismiss-target="#alert-2"
                aria-label="Close"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                  onClick={() => setShowAlert(false)}
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </button>
            </div>
          )}

          <form className="space-y-4">
            {/* Email Input  */}
            <CustomInput
              label="Email"
              placeholder="Email"
              name="email"
              control={control}
              customError={CustomError.parse(errors.email?.message)}
            />
            <CustomInput
              label="Username"
              placeholder="Username"
              name="username"
              control={control}
              customError={CustomError.parse(errors.username?.message)}
            />
            <CustomInput
              control={control}
              name="password"
              label="Password"
              placeholder="Password"
              secureText={true}
              customError={CustomError.parse(errors.password?.message)}
            />
            <CustomInput
              control={control}
              name="confirmPassword"
              label="Confirm password"
              placeholder="Confirm password"
              secureText={true}
              customError={CustomError.parse(errors.confirmPassword?.message)}
            />

            <button
              className="btn btn-primary w-full"
              disabled={loading}
              onClick={handleSubmit(onSubmit)}
            >
              {loading && <span className="loading loading-spinner"></span>}
              Register
            </button>

            {/* Google Login Button */}
            <GoogleSignInBtn></GoogleSignInBtn>

            {/* Sign-Up Link */}
            <p className="text-center text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:text-accent">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
