console.log('Service Worker Loaded...');


// self.addEventListener('notificationclick', function(event) {
//   event.notification.close();

//   const targetUrl = event.notification.data && event.notification.data.url ? event.notification.data.url : '/';
//   event.waitUntil(
//       clients.openWindow(targetUrl)
//   );
// });



self.addEventListener('push', function(event) {
  const data = event.data ? JSON.parse(event.data.text()) : {};
  console.log('Push received:', data);

  const title = data.title || 'Notification';
  const options = {
      body: data.body || 'You have a new notification.',
      icon: data.icon || '/default-icon.png', // Replace with a default icon
      data: {
          url: data.url || '/' // Add the URL to open when notification is clicked
      }
  };

  event.waitUntil(
      self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const url = event.notification.data.url;
  if (url) {
      event.waitUntil(
          clients.openWindow(url) // Open the specified URL on notification click
      );
  }
});
