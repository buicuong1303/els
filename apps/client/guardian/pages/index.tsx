/* eslint-disable react-hooks/exhaustive-deps */
import { NextPageContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export function Index() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, []);

  return null;
}

Index.getInitialProps = async (ctx: NextPageContext) => {
  return {};
};

export default Index;
