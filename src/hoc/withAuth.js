import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserAuth } from '../app/context/AuthContext';

const withAuth = (Component) => {
  const WrappedComponent = (props) => {
    const { user, isLoading } = UserAuth();
    const router = useRouter();

    useEffect(() => {
      if (isLoading) {
        return () => {}
      }

      if (!user) {
        router.push('/account/login');
      }
    }, [user, isLoading, router]);

    if (isLoading || !user) {
      return () => {};
    }

    return <Component user={user} {...props} />;
  };

  WrappedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;

  return WrappedComponent;
};

export default withAuth;
