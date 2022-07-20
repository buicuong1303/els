import { createContext, ReactNode } from 'react';

interface ComponentProps {
  children: ReactNode;
}

const PermissionContext = createContext({
  // authorizer: undefined,
  // setPermission: (userId: string) => undefined,
});

const { Provider } = PermissionContext;

const PermissionProvider = (props: ComponentProps) => {
  const { children } = props;

  return (
    <Provider
      value={{}}
    >
      {children}
    </Provider>
  );
};

export { PermissionContext, PermissionProvider };
