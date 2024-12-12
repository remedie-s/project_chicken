importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyBvdGEQeCZrTSboWWn7hJ1JdUBJ7aHkVP8",
    authDomain: "project-chicken-4c.firebaseapp.com",
    projectId: "project-chicken-4c",
    storageBucket: "project-chicken-4c.firebasestorage.app",
    messagingSenderId: "672951577203",
    appId: "1:672951577203:web:41b11a915050e129bad806",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

const showNotification = (title, options) => {
    self.registration.showNotification(title, options);
};

messaging.onBackgroundMessage((payload) => {
    const { title, body, icon } = payload.notification;
    showNotification(title, { body, icon });
});

self.addEventListener("push", (event) => {
    if (!event.data.json()) return;
    const { title, body, icon } = event.data.json().notification;
    showNotification(title, { body, icon });
});
