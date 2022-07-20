/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, ReactNode, useRef } from 'react';
import {
  ToastContainer,
  toast,
  ToastPosition,
  TypeOptions,
  ToastTransition,
  Theme,
} from 'react-toastify';
import { Bounce } from 'react-toastify';
import { Box } from '@mui/system';

interface ComponentProps {
  children: ReactNode;
}

interface ToastConfig {
  message: ReactNode;
  type: TypeOptions;
  position?: ToastPosition;
  theme?: Theme;
  autoClose?: number | false;
  transition?: ToastTransition;
  onClick?: () => void;
}

const ToastifyContext = createContext({
  toastify: (_toastConfig: ToastConfig) => undefined,
  toastDismiss: () => undefined,
  toastDismissAll: () => undefined,
});

const { Provider } = ToastifyContext;

const ToastifyProvider = (props: ComponentProps) => {
  const { children } = props;

  const toastId = useRef<any>();

  const toastify = (toastConfig: ToastConfig) => {
    (toastId.current = toast.success(toastConfig.message, {
      type: toastConfig.type,
      theme: toastConfig.theme || 'colored',
      position: toastConfig.position || 'bottom-left',
      autoClose: toastConfig.autoClose !== undefined ? toastConfig.autoClose : 5000,
      transition: toastConfig.transition || Bounce,
      onClick: toastConfig.onClick,
    }));
    return undefined;
  };

  const toastDismiss = () => {
    toast.dismiss(toastId.current);
    return undefined;
  };

  const toastDismissAll = () => {
    toast.dismiss();
    return undefined;
  };

  return (
    <Provider
      value={{
        toastify,
        toastDismiss,
        toastDismissAll,
      }}
    >
      {children}
      <Box
        sx={{
          '.Toastify__toast-container': {
            maxWidth: '400px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'end',
            '.Toastify__toast': {
              width: 'fit-content',
              minWidth: '250px',
            },
          },
        }}
      >
        <ToastContainer limit={5} />
      </Box>
    </Provider>
  );
};

export { ToastifyContext, ToastifyProvider };
