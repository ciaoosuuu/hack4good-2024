import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserAuth } from '../app/context/AuthContext';

const withAuth = (Components) => {
  return (props) => {
    const { user, isLoading } = UserAuth();
    const router = useRouter();

    useEffect(() => {
      if (isLoading) {
        return () => {}
      }

      if (!user) {
        router.push('/account/login');
      }
    }, [user, isLoading]);

    if (isLoading || !user) {
      return () => {}
    }

    return <Components user={user} {...props} />;
  };
};

export default withAuth;

