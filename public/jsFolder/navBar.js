const config = {
  apiUrl: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : `${window.location.protocol}//${window.location.hostname}`
};

const menuToggle = document.getElementById('menuToggle');
const closeMenu = document.getElementById('closeMenu');
const slidingNavbar = document.getElementById('slidingNavbar');

document.addEventListener('DOMContentLoaded', () => {
  activeNavBarFunc()
  getFlyer1Display()
  getFlyer2Display()
  getHeroImageDisplay()
  getMenuLandingFunc()
  getSpecialLandingFunc()
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


const getHeroImageDisplay = async () => {
  try {
    const response = await fetch(`${config.apiUrl}/doveeysLanding/getHeroImage`)
    const data = await response.json()
    

    data.forEach((eachData) => {

      const dynamicHeroImage = document.getElementById('dynamicHeroImage')

      const populateHeroImage = `
        <div class="relative bg-cover bg-center text-white h-[50vh] md:h-[60vh] lg:h-[70vh] xl:h-[85vh]" style="background-image: url('../image/heroImage/${eachData.heroImage}');">
          <div class="hero-overlay absolute inset-0"></div>
          <div class="relative h-full flex flex-col justify-center items-center text-center">
            <h2 class="text-2xl md:text-5xl font-bold mb-4">${eachData.heroImageName}</h2>
            <p class="text-lg md:text-xl mb-6">${eachData.heroImageDes}</p>
            <a href="#menu" class="bg-orange-500 py-3 px-6 rounded-full hover:bg-orange-600">Explore Menu</a>
          </div>
        </div>
      `

      dynamicHeroImage.innerHTML = populateHeroImage

    })
    
    
  } catch (error) {
    console.log(error);
  }
}

const getFlyer1Display = async () => {
  try {
    const response = await fetch(`${config.apiUrl}/doveeysLanding/getFlyer1Schema`)

    const data = await response.json()
    
    data.forEach((eachData) => {
      const flyer1Section = document.getElementById('flyer1Section')

      const populateFlyer1 = `
        <a href="https://wa.me/message/LV4DUBT6DDZHA1" style="background-image: url(../image/flyer1/${eachData.flyer1Image}); background-size: cover;" class=" grid items-center text-[25px] font-bold relative h-[200px] md:h-[40vh] lg:h-[50vh] xl:h-[60vh]">
          <div class="bg-black opacity-50 inset-0 absolute"></div>
          <div class="text-center relative">
            <h1>${eachData.flyer1Title} (Contact Us)</h1>
          </div>
        </a>
      `

      flyer1Section.innerHTML = populateFlyer1
    })
    
  } catch (error) {
    console.log(error);
    
  }
}

const getFlyer2Display = async () => {
  try {
    const response = await fetch(`${config.apiUrl}/doveeysLanding/getFlyer2Schema`)
    const data = await response.json()
    
    data.forEach((eachData) => {
      const flyer2Section = document.getElementById('flyer2Section')

      const populateFlyer2 = `
        <a href="https://wa.me/message/LV4DUBT6DDZHA1" style="background-image: url(../image/flyer2/${eachData.flyer2Image}); background-size: cover;" class=" grid items-center text-[25px] font-bold relative h-[200px] md:h-[40vh] lg:h-[50vh] xl:h-[60vh]">
          <div class="bg-black opacity-50 inset-0 absolute"></div>
          <div class="text-center relative">
            <h1>${eachData.flyer2Title} (Contact Us)</h1>
          </div>
        </a>
      `

      flyer2Section.innerHTML = populateFlyer2
    })
    
  } catch (error) {
    console.log(error);
    
  }
}

const getMenuLandingFunc = async () => {
  try {
    const response = await fetch(`${config.apiUrl}/doveeysLanding/getAllMenuImage`)
    const data = await response.json()

    const menuDishCards = document.getElementById('menuDishCards')
    menuDishCards.innerHTML = ''

    data.forEach((eachData) => {

      const populateMenuLanding = `
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg">
          <img src="../image/menuLandingImage/${eachData.menuLandingImage}" alt="Grilled Chicken" class="rounded-lg w-full h-40 object-cover">
          <h4 class="mt-4 text-xl font-semibold">${eachData.menuLandingName}</h4>
          <p class="mt-2 text-gray-600">${eachData.menuLandingDes}</p>
          
          <button class="mt-6 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 w-full menuOrderNow">Order Now</button>
        </div>
      `
      menuDishCards.innerHTML += populateMenuLanding

      const menuOrderNow = document.querySelectorAll('.menuOrderNow')
      menuOrderNow.forEach((eachMenuOrder) => {
        eachMenuOrder.addEventListener('click', () => {
          window.location.href = '../htmlFolder/menu2.html'
        })
      })

    })
  
    
  } catch (error) {
    
  }
}


const getSpecialLandingFunc = async () => {
  try {
    const response = await fetch(`${config.apiUrl}/doveeysLanding/getAllSpecialImage`)
    const data = await response.json()

    const specialLandingPageDisplay = document.getElementById('specialLandingPageDisplay')
    specialLandingPageDisplay.innerHTML = ''

    data.forEach((eachData) => {

      const populateSpecialLanding = `
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg">
          <img src="../image/specialLandingImage/${eachData.specialLandingImage}" alt="Valentine Package" class="rounded-lg w-full h-40 object-cover">
          <h4 class="mt-4 text-xl font-semibold text-gray-900">${eachData.specialLandingName}</h4>
          <p class="mt-2 text-gray-600">${eachData.specialLandingDes}</p>
          
          <button class="mt-6 bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 w-full specialMenuOrder">Order Now</button>
        </div>
      `
      specialLandingPageDisplay.innerHTML += populateSpecialLanding

      const specialMenuOrder = document.querySelectorAll('.specialMenuOrder')
      specialMenuOrder.forEach((eachSpecialOrder) => {
        eachSpecialOrder.addEventListener('click', () => {
          window.location.href = '../htmlFolder/special2.html'
        })
      })

    })
  
    
  } catch (error) {
    console.log(error);
    
  }
}


if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('../service-worker.js')
      .then(function(registration) {
        console.log('Service Worker registered:', registration);
        subscribeUserToPush();
      })
      .catch(function(error) {
        console.error('Service Worker registration failed:', error);
      });
  });
}

const subscribeUserToPush = async () => {
  try {
    console.log('Registering Service Worker');
    
    const registration = await navigator.serviceWorker.register('../service-worker.js', {
      scope: '/public/'
    });

    console.log('Service Worker Registration');

    // Request notification permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.error("Permission for notifications denied.");
      return; // Exit the function if permission is denied
    }

    // Check if the user is already subscribed
    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) {
      console.log("User is already subscribed:", existingSubscription);
      return; // Exit the function if the user is already subscribed
    }

    // Convert applicationServerKey to Uint8Array
    const applicationServerKey = urlBase64ToUint8Array('BB0ldobS0_bnh5yMIBUrklV8vBscFIEwxwu_gmeRdV8VZS6LPXmOM6N0YPPtQjKP9zeDUNU0mmPZ20nmnPNOy8w');

    // Subscribe the user to push notifications
    const pushSubscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });

    console.log('User subscribed for notifications:', pushSubscription);

    // Send subscription data to the backend
    const response = await fetch(`${config.apiUrl}/notification/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pushSubscription),
    });

    if (response.ok) {
      console.log("Subscription sent to the backend successfully.");
    } else {
      console.error("Failed to send subscription to backend:", response.statusText);
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


const toggleRegCloseBtn = document.getElementById('toggleRegCloseBtn')


toggleRegCloseBtn.onclick = () => {
  document.getElementById('navigationPopUp').classList.add('hidden')
}
