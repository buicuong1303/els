import { useEffect } from 'react';
import { useRouter } from 'next/router';

const useScrollTop = (): null => {
  const location = useRouter();

  useEffect(() => {
    const rootContent = document.getElementsByClassName('MuiBox-root');
    if (rootContent?.[0]) rootContent?.[0]?.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
};

export { useScrollTop };
