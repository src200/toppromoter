/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import LoadingDots from '@/components/LoadingDots';
import { useUser } from '@/utils/useUser';
import { SEOMeta } from '@/templates/SEOMeta'; 
import AuthForm from '@/components/AuthForm';
import Logo from '@/components/Icons/Logo';

const AuthTemplate = ({ type }) => {
  const router = useRouter();
  const { user } = useUser();

  let authState = type === 'signin' ? 'Sign in' : type === 'signup' ? 'Sign up' : 'Sign in';

  useEffect(() => {
    if (user) {
      router.replace('/dashboard');
    }
  }, [user]);

  if (!user)
    return (
      <>
        <SEOMeta title={ authState } />
        <div className="py-24 px-4 bg-white text-center">
          <Logo width={ 200 } height={ 70 } className='mx-auto my-0' />
          <div className="p-10 rounded-lg bg-white border-2 border-gray-100 max-w-lg mx-auto">
            <AuthForm affiliate={ false } type={ type } />
          </div>
        </div>
      </>
    );

  return (
    <>
      <SEOMeta title="Sign Up" />
      <div className="m-6">
        <LoadingDots />
      </div>
    </>
  );
};

export default AuthTemplate;