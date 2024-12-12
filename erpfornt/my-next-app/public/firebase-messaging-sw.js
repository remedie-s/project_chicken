// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyBvdGEQeCZrTSboWWn7hJ1JdUBJ7aHkVP8",
    authDomain: "project-chicken-4c.firebaseapp.com",
    projectId: "project-chicken-4c",
    storageBucket: "project-chicken-4c.firebasestorage.app",
    messagingSenderId: "672951577203",
    appId: "1:672951577203:web:41b11a915050e129bad806"
};

// Initialize Firebase app in the service worker
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

self.addEventListener("install", function (e) {
    self.skipWaiting();
});

self.addEventListener("activate", function (e) {
    console.log("fcm service worker가 실행되었습니다.");
});
self.addEventListener("push", function (e) {
    if (!e.data.json()) return;
    const resultData = e.data.json().notification;
    const notificationTitle = resultData.title;
    const notificationOptions = {
        body: resultData.body,
    };
    console.log(resultData.title, {
        body: resultData.body,
    });
    e.waitUntil(self.registration.showNotification(notificationTitle, notificationOptions));
});

// Background message handler
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message: ', payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon,
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});
