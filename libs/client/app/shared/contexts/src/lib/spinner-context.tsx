/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { createContext, ReactNode, useState } from 'react';
import { ReactSpinner } from '@els/client/app/shared/ui';
import { useTheme } from '@mui/material';

interface ComponentProps {
  children: ReactNode;
}

const SpinnerContext = createContext({
  showSpinner: (): void => undefined,
  hideSpinner: (): void => undefined,
});

const { Provider } = SpinnerContext;

const SpinnerProvider = (props: ComponentProps) => {
  const { children } = props;

  const theme = useTheme();

  const [loading, setLoading] = useState<boolean>(false);

  const showSpinner = () => setLoading(true);
  const hideSpinner = () => setLoading(false);

  return (
    <Provider
      value={{
        showSpinner,
        hideSpinner,
      }}
    >
      {children}
      {loading &&
        <ReactSpinner
          bgColor={theme.palette.background.default}
          color={theme.colors.primary.main}
          sx={{
            // left: {
            //   xs: 0,
            //   lg: `calc(${theme.sidebar.width} + 20px)`,
            // },
            // width: {
            //   xs: '100%',
            //   lg: `calc(100% - ${theme.sidebar.width})`,
            // },
          }}
        />
      }
    </Provider>
  );
};

export { SpinnerContext, SpinnerProvider };
