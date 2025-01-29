const config29 = {
    apiUrl: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:3000'
      : `${window.location.protocol}//${window.location.hostname}`
  };

document.addEventListener('DOMContentLoaded', ()=> {

    fetchUserGallery()

    
})



async function fetchUserGallery() {
    try {
      const response = await fetch(`${config29.apiUrl}/galleryDisplay/getGallery`); // Fetch the gallery data
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json(); // Parse the response JSON

      console.log(response, data);
      

      const container = document.getElementById("galleryDiv"); // Select the container for gallery items
      console.log(container);
      
      container.innerHTML = ''
      data.forEach((item) => {
        let content;

        // Function to format the time in a human-readable format
        function timeAgo(date) {
          const now = new Date();
          const timeDifference = now - new Date(date);
          const seconds = Math.floor(timeDifference / 1000);
          const minutes = Math.floor(seconds / 60);
          const hours = Math.floor(minutes / 60);
          const days = Math.floor(hours / 24);
          const months = Math.floor(days / 30);
          const years = Math.floor(months / 12);

          if (years > 0) {
            return `${years} year${years > 1 ? 's' : ''} ago`;
          } else if (months > 0) {
            return `${months} month${months > 1 ? 's' : ''} ago`;
          } else if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''} ago`;
          } else if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
          } else if (minutes > 0) {
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
          } else {
            return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
          }
        }

        const timePosted = timeAgo(item.createdAt);
        

        if (item.galleryType === "image") {

          content = `
              <div class="border rounded-lg shadow-lg p-4 bg-white text-black">
                <img src="../image/GalleryVideo/${item.galleryMedia}" alt="${item.galleryTitle}" class="h-60 w-full object-fill rounded"></img>
                <h3 id="men" class="mt-4 text-xl font-semibold">${item.galleryTitle}</h3>
                <p class="text-gray-600"><span>Posted: </span>${timePosted}</p>
              </div>
          `
        } else if (item.galleryType === "video") {
          
    
          content = `
              <div class="border rounded-lg shadow-lg p-4 bg-white text-black">
                <video controls class="h-60 w-full object-fill rounded">
                    <source src="../image/GalleryVideo/${item.galleryMedia}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                <h3 id="men" class="mt-4 text-xl font-semibold">${item.galleryTitle}</h3>
                <p class="text-gray-600"><span>Posted: </span>${timePosted}</p>
              </div>
          `

        }

        container.innerHTML += content
        
      });
    } catch (err) {
      console.error("Failed to fetch gallery items:", err); // Log the error
    }
  }
