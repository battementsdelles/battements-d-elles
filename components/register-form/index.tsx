'use client';
import CustomInput from '@/components/controlled-input';
import { CustomError, ICustomError } from '@/lib/helpers/custom-error';
import { AlertType } from '@/lib/helpers/enums';
import {
  CreateUserSchema,
  ICreateUserDto,
} from '@/lib/zod/schemas/user.registration';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import Alert from '../alert';
import GoogleSignInBtn from '../google-sign-in-btn';

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState<
    { type: AlertType; message: string } | undefined
  >(undefined);
  const [resultError, setResultError] = React.useState<
    ICustomError | undefined
  >(undefined);

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
      password: '%PitchouX1',
      confirmPassword: '%PitchouX1',
    },
  });

  const onSubmit: SubmitHandler<ICreateUserDto> = async (data) => {
    setLoading(true);
    setResultError(undefined);
    setAlert(undefined);
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(getValues()),
    });
    const result = await res.json();
    if (res.status === 201) {
      setAlert({
        type: AlertType.SUCCESS,
        message: 'Account created! You can now log in.',
      });
    } else {
      if (result.error?.customError) {
        setResultError(result.error.customError);
      } else {
        setAlert({
          type: AlertType.ERROR,
          message: 'Unexpected Server Error! Please try again',
        });
      }
      console.log({ error: result });
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
          <Alert
            display={!!alert}
            text={alert?.message}
            type={alert?.type}
            onClose={() => setAlert(undefined)}
          ></Alert>

          <form className="space-y-4">
            {/* Email Input  */}
            <CustomInput
              label="Email"
              placeholder="Email"
              name="email"
              control={control}
              customError={
                CustomError.parse(errors.email?.message) || resultError
              }
            />
            <CustomInput
              label="Username"
              placeholder="Username"
              name="username"
              control={control}
              customError={
                CustomError.parse(errors.username?.message) || resultError
              }
            />
            <CustomInput
              control={control}
              name="password"
              label="Password"
              placeholder="Password"
              secureText={true}
              customError={
                CustomError.parse(errors.password?.message) || resultError
              }
            />
            <CustomInput
              control={control}
              name="confirmPassword"
              label="Confirm password"
              placeholder="Confirm password"
              secureText={true}
              customError={
                CustomError.parse(errors.confirmPassword?.message) ||
                resultError
              }
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
