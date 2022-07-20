/* eslint-disable @typescript-eslint/no-explicit-any */
import * as firebase from 'firebase/app';
import { getMessaging, getToken, onMessage} from 'firebase/messaging';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const firebaseConfig = {
  apiKey: publicRuntimeConfig.FIREBASE_API_KEY,
  authDomain: publicRuntimeConfig.FIREBASE_AUTH_DOMAIN,
  projectId: publicRuntimeConfig.FIREBASE_PROJECT_ID,
  storageBucket: publicRuntimeConfig.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: publicRuntimeConfig.FIREBASE_MESSAGING_SENDER_ID,
  appId: publicRuntimeConfig.FIREBASE_APP_ID,
  measurementId: publicRuntimeConfig.FIREBASE_MEASUREMENT_ID,
};

if (!firebase.getApps().length) {
  firebase.initializeApp(firebaseConfig);
}

const messaging = getMessaging();

type SetTokenFound = (isFound: boolean) => void;
const requestForToken = async (setTokenFound: SetTokenFound) => {
  try {
    // * the bellow function will wait until client allow if request popup was showed and client choose accept or denied
    // * if the client have accepted notification before, the bellow is going to return token immediately
    const token = await getToken(messaging, { vapidKey: publicRuntimeConfig.FIREBASE_VAPID_KEY });
    if (token) {
      setTokenFound(true);
    } else {
      setTokenFound(false);
    }

    return token;
  } catch (error) {
    //* The notification permission was not granted and blocked instead
    // eslint-disable-next-line no-console
    console.log('An error occurred while retrieving token. ', error);
    return null;
  }
};

// only run when client is focusing tab
const onMessageListener = (callback: any) => {
  onMessage(messaging, (payload: any) => {
    callback(payload);
  });
};

const getApps = () => {
  const length = firebase.getApps().length;
  return length;
};

export { onMessageListener, requestForToken, getApps };
