/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/8.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.9.0/firebase-messaging.js');
// importScripts('https://www.gstatic.com/firebasejs/8.9.0/firebase-analytics.js');

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('../firebase-messaging-sw.js')
  .then(function(registration) {
    console.log('Registration successful, scope is:', registration.scope);
  }).catch(function(err) {
    console.log('Service worker registration failed, error:', err);
  });
}

// "Default" Firebase configuration (prevents errors), this config will be replaced by self.firebaseConfig which was set in firebase.ts
const defaultConfig = {
  apiKey: true,
  authDomain: true,
  projectId: true,
  storageBucket: true,
  messagingSenderId: true,
  appId: true,
  measurementId: true
};

firebase.initializeApp(defaultConfig);
const messaging = firebase.messaging();

// only run when client is hiden tab, close tab but still open browser
messaging.onBackgroundMessage(function (payload) {
  const title = payload.data.title
  const option = {
    body: payload.data.body,
    icon: "/logo192.png",
    data: payload.data
  };

  return self.registration.showNotification(
    title,
    option
  );
});

//* handle when client click to notification
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(clients.matchAll({
    type: "window"
  }).then(function(clientList) {
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i];
      if (client.url == '/' && 'focus' in client)
        return client.focus();
    }
    if (clients.openWindow)
      return clients.openWindow('/');
  }));
});
