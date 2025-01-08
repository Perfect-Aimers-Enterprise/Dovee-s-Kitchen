const menuToggle = document.getElementById('menuToggle');
const closeMenu = document.getElementById('closeMenu');
const slidingNavbar = document.getElementById('slidingNavbar');

document.addEventListener('DOMContentLoaded', () => {
  activeNavBarFunc()
})

menuToggle.addEventListener('click', () => {
  slidingNavbar.classList.remove('translate-x-full');
});

closeMenu.addEventListener('click', () => {
  slidingNavbar.classList.add('translate-x-full');
});

// Optional: Close navbar when clicking outside
window.addEventListener('click', (e) => {
  if (!slidingNavbar.contains(e.target) && !menuToggle.contains(e.target)) {
    slidingNavbar.classList.add('translate-x-full');
  }
});


const activeNavBarFunc = () => {
  const currentPage = window.location.pathname.split('/').pop()
  const navLink = document.querySelectorAll('li a')
  
  console.log(navLink);
  
  navLink.forEach((link) => {
    console.log(link);
    let navColor = 'text-orange-400'
    if (link.getAttribute('href') === currentPage) {
      link.classList.add(navColor)
    }
  })
}


const menuOrderNow = document.querySelectorAll('.menuOrderNow')
menuOrderNow.forEach((eachMenuOrder) => {
  eachMenuOrder.addEventListener('click', () => {
    window.location.href = '../htmlFolder/menu2.html'
  })
})

const specialMenuOrder = document.querySelectorAll('.specialMenuOrder')
specialMenuOrder.forEach((eachSpecialOrder) => {
  eachSpecialOrder.addEventListener('click', () => {
    window.location.href = '../htmlFolder/special2.html'
  })
})

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/service-worker.js')
      .then(function(registration) {
        console.log('Service Worker registered:', registration);
        subscribeUserToPush();
      })
      .catch(function(error) {
        console.log('Service Worker registration failed:', error);
      });
  });
}

// frontend push subscription logic



//  if('serviceWorker' in navigator) {
//     subscribeUserToPush().catch(err => console.error(err))
//     }

const subscribeUserToPush = async () => {
  try {
    // Correct the path to the service worker
    // const registration = await navigator.serviceWorker.register('../../notification/service-worker.js');
    // const registration = await navigator.serviceWorker.register('/service-worker.js');

    // if('serviceWorker' in navigator) {
    //   send().catch(err => console.error(err))
    // }

    console.log('Registering Service Worker');
    
    const registration = await navigator.serviceWorker.register('../service-worker.js', {
      scope: '/public/'
    });

    console.log('Service Worker Registration');
    

    // Request notification permission
    // const permission = await Notification.requestPermission();
    // if (permission !== "granted") {
    //   console.error("Permission for notifications denied.");
    //   return;
    // }

    // Convert applicationServerKey to Uint8Array
    const applicationServerKey = urlBase64ToUint8Array('BB0ldobS0_bnh5yMIBUrklV8vBscFIEwxwu_gmeRdV8VZS6LPXmOM6N0YPPtQjKP9zeDUNU0mmPZ20nmnPNOy8w');

    // Subscribe the user to push notifications
    const pushSubscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });

    // Send subscription data to the backend
    const response = await fetch('http://localhost:3000/notification/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pushSubscription),
    });

    console.log('Push sent...');
    
    if (response.ok) {
      console.log("User subscribed for notifications:", pushSubscription);
    } else {
      console.error("Failed to subscribe user:", response.statusText);
    }
  } catch (error) {
    console.error("Error during subscription process:", error);
  }
};

// Helper function to convert Base64 key to Uint8Array
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

// Call the function to initiate subscription
subscribeUserToPush();
