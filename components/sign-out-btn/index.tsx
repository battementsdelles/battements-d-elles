'use client';
import { logOut } from '@/lib/actions/auth';
import React from 'react';

const SignOutBtn = () => {
  const [loading, setLoading] = React.useState(false);

  const handelOnClickAction = async () => {
    setLoading(true);
    await logOut();
  };

  return (
    <button
      className="btn btn-outline w-full"
      disabled={loading}
      onClick={() => handelOnClickAction()}
    >
      {loading && <span className="loading loading-spinner"></span>}
      Logout
    </button>
  );
};

export default SignOutBtn;
