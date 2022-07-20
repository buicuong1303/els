/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import { useMutation, useApolloClient } from '@apollo/client';
import { ApolloClient } from '@els/client/shared/data-access';
import { GraphqlMutations, GraphqlQueries, GraphqlTypes } from '@els/client/app/shared/data-access';
import { ToastifyContext } from '@els/client/app/shared/contexts';
import { orderBy } from 'lodash';
import { requestForToken, onMessageListener, getApps } from './firebase';
interface ComponentProps {
  children: ReactNode;
}
function isIOS() {
  const browserInfo = navigator.userAgent.toLowerCase();
  
  if (browserInfo.match('iphone') || browserInfo.match('ipad')) {
    return true;
  }
  if (['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform)) {
    return true;
  } 
  return false;
}
type NotificationContextType = {
  showNotification: (message: string, callback: any) => void;
  isAllowNotification: boolean
};

const NotificationContext = createContext<NotificationContextType>({} as NotificationContextType);
const { Provider } = NotificationContext;

const NotificationProvider = (props: ComponentProps) => {
  const { children } = props;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isTokenFound, setIsTokenFound] = useState(false);
  const [isAllowNotification, setIsAllowNotification] = useState(false);

  /**
   * Cannot using Notification in IOS because the Service Worker haven't support on IOS yet
   * refer https://stackoverflow.com/questions/43994660/push-notifications-on-ios-from-web-app
   */
  function isIOS() {
    const browserInfo = navigator.userAgent.toLowerCase();

    if (browserInfo.match('iphone') || browserInfo.match('ipad')) {
      return true;
    }
    if (['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform)) {
      return true;
    }
    return false;
  }

  const client = useApolloClient();
  const { toastify } = useContext(ToastifyContext);

  const [UpdateSettingApp, { loading: UpdateSettingAppLoading }] = useMutation<{
    settings: {
      updateApplication: GraphqlTypes.LearningTypes.Setting,
    }
  }>(GraphqlMutations.LearningMutations.Setting.UpdateSettingApp, {
    context: { serviceName: ApolloClient.ServiceName.Browser },
    onError: (error) => {
      toastify({
        message: error.message,
        type: 'error',
      });
    },
    refetchQueries: [
      GraphqlQueries.LearningQueries.User.GetUser,
    ],
  });

  //* callback to redirect
  const showNotification = (message: string, callback: any) => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notification');
      return;
    } else if (Notification.permission === 'granted') { // Notification.permission and setting user allow notification
      if (document.hidden) { // user is focusing another browser
        // let play audio

        const notification = new Notification('New message', {
          body: message,
          timestamp: 2 * 1000
        });

        notification.onclick = function (event) {
          event.preventDefault();
          callback();
        };
      }
    }
  };

  const [CreateDeviceGql] = useMutation(
    GraphqlMutations.LearningMutations.Device.CreateDevice,
    {
      context: { serviceName: ApolloClient.ServiceName.Browser },
      onError: (error) => {
        toastify({
          message: error.message,
          type: 'error',
        });
      },
      refetchQueries: [],
    }
  );

  const [DeleteDeviceGql] = useMutation(
    GraphqlMutations.LearningMutations.Device.DeleteDevice,
    {
      context: { serviceName: ApolloClient.ServiceName.Browser },
      onError: (error) => {
        toastify({
          message: error.message,
          type: 'error',
        });
      },
      refetchQueries: [],
    }
  );

  const [UpdateDeviceGql] = useMutation(
    GraphqlMutations.LearningMutations.Device.UpdateDevice,
    {
      context: { serviceName: ApolloClient.ServiceName.Browser },
      onError: (error) => {
        toastify({
          message: error.message,
          type: 'error',
        });
      },
    }
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const addNotificationToBell = (notification: GraphqlTypes.LearningTypes.NotificationData) => {
    // ? note: To write data to cache and re-render ui
    // First get the data from the cache
    // Then add new data
    // Finally use client.writeQuery to write data back to cache
    // note: The queries used in client.readQuery, client.writeQuery and useLazyQuery on components must be the same to be able to re-render the ui
    const currentNotifications: any = client.readQuery<{ notifications: GraphqlTypes.LearningTypes.NotificationData }>({
      query: GraphqlQueries.LearningQueries.Notification.GetNotifications,
    }) ?? { notifications: [] };

    const newNotifications: GraphqlTypes.LearningTypes.NotificationData[] = [
      {
        __typename: 'NotificationData',
        id: notification.id,
        actor: notification.actor,
        code: notification.code,
        message: notification.message,
        link: notification.link,
        status: notification.status,
        createdAt: notification.createdAt,
      },
      ...currentNotifications?.notifications,
    ];

    client.writeQuery({
      query: GraphqlQueries.LearningQueries.Notification.GetNotifications,
      data: {
        notifications: orderBy(newNotifications, (notification) => notification.createdAt, 'desc'),
      },
    });
  };

  useEffect(() => {
    if (isIOS()) return;
    if (typeof window !== 'undefined') {
      if (Notification.permission === 'default') {
        Notification.requestPermission().then((result) => {
          if (result === 'granted') {
            UpdateSettingApp({
              variables: {
                updateSettingAppInput: {
                  notification: true
                }
              }
            });
            setIsAllowNotification(true);
          } else if (result === 'denied') {
            UpdateSettingApp({
              variables: {
                updateSettingAppInput: {
                  notification: false
                }
              }
            });
            setIsAllowNotification(false);
          }
        });
      } else if(Notification.permission === 'denied'){
        UpdateSettingApp({
          variables: {
            updateSettingAppInput: {
              notification: false
            }
          }
        });
        setIsAllowNotification(false);
      } else if(Notification.permission === 'granted'){
        setIsAllowNotification(true); //* todo trigger get Notification token, don't care about user's setting allow or disallow notification
      }
    }
  }, [UpdateSettingApp]);

  useEffect(() => {
    if(!isAllowNotification) return;
    async function tokenFunc() {
      const data = await requestForToken(setIsTokenFound);
      if (data) {
        const currentToken = localStorage.getItem('tokenDevice');
        if (data !== currentToken) {
          CreateDeviceGql({
            variables: {
              createDeviceInput: {
                newToken: data,
              },
            },
          });

          currentToken &&
            DeleteDeviceGql({
              variables: {
                deleteDeviceInput: {
                  token: currentToken,
                },
              },
            });
        } else {
          UpdateDeviceGql({
            variables: {
              updateDeviceInput: {
                token: currentToken,
              },
            },
          });
        }

        localStorage.setItem('tokenDevice', data);
      }
    }

    tokenFunc();
  }, [CreateDeviceGql, DeleteDeviceGql, UpdateDeviceGql, isAllowNotification]);

  // handle notification with bell on top navbar
  if (typeof window !== 'undefined' && getApps()) { //* ignore if server-side
    onMessageListener((payload: any) => {
      // if (payload?.data) {
      //   addNotificationToBell(payload.data);
      // }

      toastify({
        message: payload.data.body.replace(/(<([^>]+)>)/ig, ''),
        type: 'info'
      });
    });
  }

  return (
    <Provider
      value={{
        showNotification,
        isAllowNotification
      }}
    >
      {children}
    </Provider>
  );
};

export { NotificationContext, NotificationProvider };
