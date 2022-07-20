/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { createContext, ReactNode, useState } from 'react';
import { Box } from '@mui/system';
import { Loading } from '@els/client/app/shared/ui';
import { addAlpha } from '@els/client/shared/utils';

interface ComponentProps {
  children: ReactNode;
}

const LoadingContext = createContext({
  showLoading: (): void => undefined,
  hideLoading: (): void => undefined,
});

const { Provider } = LoadingContext;

const LoadingProvider = (props: ComponentProps) => {
  const { children } = props;

  const [loading, setLoading] = useState<boolean>(false);

  const showLoading = () => setLoading(true);
  const hideLoading = () => setLoading(false);

  return (
    <Provider
      value={{
        showLoading,
        hideLoading
      }}
    >
      <Box
        sx={{
          position: 'relative',
        }}
      >
        {children}
        { loading && (
          <Loading sx={{ position: 'fixed', height: '100vh', zIndex: 10000, backgroundColor: addAlpha('#ffffff', 0.5) }} />
        )}
      </Box>
    </Provider>
  );
};

export { LoadingContext, LoadingProvider };
