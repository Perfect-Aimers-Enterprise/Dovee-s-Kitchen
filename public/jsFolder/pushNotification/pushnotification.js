const subscribeUserToPush = async () => {
  try {
    // Register service worker
    const registration = await navigator.serviceWorker.register('../../service-worker.js'); 
    
    // Request notification permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.error("Permission for notifications denied.");
      return;
    }

    // Convert applicationServerKey to Uint8Array
    const applicationServerKey = urlBase64ToUint8Array('BB0ldobS0_bnh5yMIBUrklV8vBscFIEwxwu_gmeRdV8VZS6LPXmOM6N0YPPtQjKP9zeDUNU0mmPZ20nmnPNOy8w');

    // Subscribe the user to push notifications
    const pushSubscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });

    // Send subscription data to the backend
    const response = await fetch('/notification/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pushSubscription),
    });

    if (response.ok) {
      console.log("User subscribed for notifications:", pushSubscription);
    } else {
      console.error("Failed to subscribe user:", response.statusText);
    }
  } catch (error) {
    console.error("Error during subscription process:", error);
  }
};

// Helper function to convert base64 key to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}