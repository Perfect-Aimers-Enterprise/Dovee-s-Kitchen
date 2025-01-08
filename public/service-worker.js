console.log('Service Worker Loaded...');


self.addEventListener('push', e => {
  // let payload = { title: 'Default Title', body: 'No message', icon: '/default-icon.png' };

  const data = e.data.json()

  console.log('push received....');
  

  // const options = {
  //     body: 'Notified by us',
  //     icon: 'https://images.app.goo.gl/3s9PZ74fVUAvs3757',
  //     badge: '/doveeLogo.png',
  // };

  console.log('options');
  
  self.registration.showNotification(data.title, {
    body: 'Notified by us',
      icon: 'https://images.app.goo.gl/3s9PZ74fVUAvs3757',
  })

});



// self.addEventListener('notificationclick', function(event) {
//   event.notification.close();

//   const targetUrl = event.notification.data && event.notification.data.url ? event.notification.data.url : '/';
//   event.waitUntil(
//       clients.openWindow(targetUrl)
//   );
// });
