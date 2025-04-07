'use client';
import CustomInput from '@/components/controlled-input';
import { credentialsSignIn } from '@/lib/actions/auth';
import { CustomError } from '@/lib/helpers/custom-error';
import { AlertType } from '@/lib/helpers/enums';
import { ILoginDto, LoginSchema } from '@/lib/zod/schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import Alert from '../alert';
import GoogleSignInBtn from '../google-sign-in-btn';

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [showAlert, setShowAlert] = React.useState(false);

  // user login form
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginDto>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: 'mehdicheref@gmail.com',
      password: '%PitchouX',
    },
  });

  const onSubmit: SubmitHandler<ILoginDto> = async (data) => {
    setLoading(true);
    const result = await credentialsSignIn(data);
    if (!result.response) {
      setLoading(false);
      setShowAlert(true);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[50vh]">
      <div className="card w-full max-w-md shadow-xl bg-base-100 border border-base-200">
        {/* Header */}
        <div className="card-body">
          <h2 className="text-2xl font-bold">Login</h2>
          <p className="text-sm mb-4">
            Enter your email below to login to your account
          </p>

          <Alert
            display={showAlert}
            text="Invalid Credentials"
            type={AlertType.ERROR}
            onClose={() => setShowAlert(false)}
          ></Alert>

          {/* Form */}
          <form className="space-y-4">
            {/* Email Input */}
            <CustomInput
              label="Email"
              placeholder="Email"
              name="email"
              control={control}
              customError={CustomError.parse(errors.email?.message)}
            />
            {/* Password Input */}
            <CustomInput
              control={control}
              name="password"
              label="Password"
              placeholder="Password"
              secureText={true}
              customError={CustomError.parse(errors.password?.message)}
            />
            <div className="flex justify-end">
              <a href="#" className="text-sm text-primary hover:text-accent">
                Forgot your password?
              </a>
            </div>
            {/* Login Button */}
            <button
              className="btn btn-primary w-full"
              disabled={loading}
              onClick={handleSubmit(onSubmit)}
            >
              {loading && <span className="loading loading-spinner"></span>}
              Login
            </button>

            {/* Google Login Button */}
            <GoogleSignInBtn></GoogleSignInBtn>

            {/* Sign-Up Link */}
            <p className="text-center text-sm">
              Don't have an account?{' '}
              <Link href="/register" className="text-primary hover:text-accent">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
