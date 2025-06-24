const config = {
  apiUrl: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : `${window.location.protocol}//${window.location.hostname}`
};


document.addEventListener('DOMContentLoaded', () => {
  getMenuProductFunc()
  fetchAllOrders()
  fetTotalOrderIncome()
  countPendingOrdersFunc()
  countRegisteredUsers()
  getWeeklyGrowthFunc()
  getAllUserMessageFunc()
  getAdminMenuLandingFunc()
  getAllSpecialImagesFunc()
  fetchGallery();
  getAllDailyMenus()
})

// All Api URL Testing
// 
const getMenuProductFuncUrl = `${config.apiUrl}/doveeysKitchen/product/getMenuProducts`
const menuProductFormUrl = `${config.apiUrl}/doveeysKitchen/product/createMenuProduct`



const menuProductForm = document.getElementById('menuProductForm')
const menuProductList = document.getElementById('menuProductList')

menuProductForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  let menuProductTarget = e.target

  const formData = new FormData(menuProductTarget)

  formData.forEach((value, key) => {
    // console.log(key, value);
  });

  try {
    const createMenuProduct = await fetch(`${config.apiUrl}/doveeysKitchen/product/createMenuProduct`, {
      method: 'POST',
      body: formData
    })


    if (createMenuProduct.ok) {
      alert('Product created successfully!');
      getMenuProductFunc(); // Refresh product list
    } else {
      alert('Failed to create product.');
    }

    const data = await createMenuProduct.json()

  } catch (error) {
    console.error(error);

  }
})

// getMenuProducts
// getMenuProducts
const getMenuProductFunc = async (e) => {
  document.getElementById('preloader').classList.remove('hidden')
  try {
    const getMenuProductsResponse = await fetch(getMenuProductFuncUrl);

    console.log(getMenuProductsResponse);

    const data = await getMenuProductsResponse.json();
    console.log(data);

    menuProductList.innerHTML = '';

    data.forEach((eachData) => {
      console.log('Data eachdata', eachData);

      const menuProductId = eachData._id;
      console.log(menuProductId);

      let productContent = '';

      // Check if product has price or variations
      if (eachData.menuPrice && (!eachData.variations || eachData.variations.length === 0 || isAllVariationsInvalid(eachData.variations))) {
        // Display product with price
        productContent = `
          <div class="flex items-center justify-between border rounded-lg shadow-md p-4 menuProductEach" data-id="${menuProductId}">
            <div class="flex items-center space-x-4">
              <img src="../image/menuImage/${eachData.menuImage}" alt="${eachData.menuProductName}" class="w-16 h-16 object-cover rounded">
              <div>
                <h4 class="font-semibold">${eachData.menuProductName}</h4>
                <p class="text-sm text-gray-600">₦${eachData.menuPrice}</p>
              </div>
            </div>
            <div class="flex space-x-2">
              <button class="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 editButton" data-id="${menuProductId}">
                <p class="hidden md:block">Edit</p>
                <i class="fas fa-pencil-alt md:hidden"></i>
              </button>
              <button class="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 deleteButton" data-id="${menuProductId}">
                <p class="hidden md:block">Delete</p>
                <i class="fas fa-trash md:hidden"></i>
              </button>
            </div>
          </div>
        `;
      } else if (eachData.variations && eachData.variations.length > 0) {


        // Display product with variations
        let variationsContent = '';
        eachData.variations.forEach((variation) => {
          variationsContent += `
            <div class="flex items-center space-x-4 mb-2">
              <p class="text-sm text-gray-600">${variation.size} - ₦${variation.price}</p>
            </div>
          `;
        });

        productContent = `
          <div class="flex items-center justify-between border rounded-lg shadow-md p-4 menuProductEach" data-id="${menuProductId}">
            <div class="flex items-center space-x-4">
              <img src="../image/menuImage/${eachData.menuImage}" alt="${eachData.menuProductName}" class="w-16 h-16 object-cover rounded">
              <div>
                <h4 class="font-semibold">${eachData.menuProductName}</h4>
                <div class="text-sm text-gray-600">
                  ${variationsContent}
                </div>
              </div>
            </div>
            <div class="flex space-x-2">
              <button class="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 editButton" data-id="${menuProductId}">
                <p class="hidden md:block">Edit</p>
                <i class="fas fa-pencil-alt md:hidden"></i>
              </button>
              <button class="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 deleteButton" data-id="${menuProductId}">
                <p class="hidden md:block">Delete</p>
                <i class="fas fa-trash md:hidden"></i>
              </button>
            </div>
          </div>
        `;
      }

      // Append the product content to the product list
      menuProductList.innerHTML += productContent;
    });

    attachEditEventListeners();

  } catch (error) {
    console.error(error);
  } finally {
    document.getElementById('preloader').classList.add('hidden')
  }
};


// Helper function to check if all variations are invalid
function isAllVariationsInvalid(variations) {
  return variations.every((variation) => !variation.size || variation.price === null);
}


const attachEditEventListeners = () => {

  // Edit Listerner Section 
  const editButton = document.querySelectorAll('.editButton')
  editButton.forEach((button) => {
    button.addEventListener('click', (e) => {
      const menuProductId = e.target.closest('.editButton').dataset.id

      console.log(menuProductId);

      fetchSingleProductFunc(menuProductId)
    })
  })

  // Delete Listener Section 
  const deleteButton = document.querySelectorAll('.deleteButton')
  deleteButton.forEach((button) => {
    button.addEventListener('click', (e) => {
      const menuProductId = e.target.closest('.menuProductEach').dataset.id

      deleteSingleProductFunc(menuProductId)
    })
  })


}

const fetchSingleProductFunc = async (menuProductId) => {

  document.getElementById('preloader').classList.remove('hidden')

  try {
    const fetchSingleProductResponse = await fetch(`${config.apiUrl}/doveeysKitchen/product/getSingleMenuProduct/${menuProductId}`)


    const data = await fetchSingleProductResponse.json()
    console.log(data);

    const menuPopUpSection = document.getElementById('menuPopUpSection')
    menuPopUpSection.classList.remove('hidden')

    const menuPopUpDiv = document.getElementById('menuPopUpDiv')
    menuPopUpDiv.innerHTML = ""


    const editEachProduct = `
      <div id="closeMenuPopUp" class="text-red-500 flex items-center font-bold">
          <div><i class="fas fa-times"></i></div>
            <p>close</p>
          </div>
      <h2 class="text-xl font-bold mb-4 text-center mt-[10px]">Edit Menu Products</h2>

      <form id="editMenuProductForm"  class="space-y-4 border-b pb-6 mb-6 text-black">
                <div class="eachEditMenuProductDiv">
                  <label for="menuName" class="block text-sm font-medium ">${data.menuProductName}</label>
                  <input
                    type="text"
                    id="menuName"
                    value="${data.menuProductName}"
                    name="menuName"
                    class="mt-1 p-2 block w-full border border-gray-300 rounded"
                    placeholder="Enter new product name"
                  />
                </div>
            
                <div>
                  <label for="menuProductDescription" class="block text-sm font-medium ">${data.menuDescription}</label>
                  <textarea
                    id="menuProductDescription"
                    name="menuProductDescription"
                    class="mt-1 p-2 block w-full border border-gray-300 rounded"
                    rows="3"
                    placeholder="Enter new product description"
                  >${data.menuDescription}</textarea>
                </div>
            
                <div>
                  <label for="menuProductPrice" class="block text-sm font-medium ">₦${data.menuPrice}</label>
                  <input
                    type="number"
                    id="menuProductPrice"
                    name="menuProductPrice"
                    value="${data.menuPrice}"
                    class="mt-1 p-2 block w-full border border-gray-300 rounded"
                    placeholder="Enter new product price"
                  />
                </div>
            
                <button
                  type="submit"
                  class="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 w-full"
                >
                  Upload Product
                </button>
                
              </form>
    `;
    menuPopUpDiv.innerHTML = editEachProduct

    const closeMenuPopUp = document.getElementById('closeMenuPopUp')

    closeMenuPopUp.addEventListener('click', () => {
      menuPopUpSection.classList.add('hidden')
    })

    // Edit Listener Section 
    const editMenuProductForm = document.getElementById('editMenuProductForm')
    editMenuProductForm.addEventListener('submit', async (e) => {
      e.preventDefault()

      const menuName = document.getElementById('menuName').value;
      const menuProductDescription = document.getElementById('menuProductDescription').value;
      const menuProductPrice = document.getElementById('menuProductPrice').value;

      console.log('Menu Product Name:', menuName);
      console.log('Menu Description:', menuProductDescription);
      console.log('Menu Price:', menuProductPrice);

      const formData = {
        menuProductName: menuName,
        menuDescription: menuProductDescription,
        menuPrice: menuProductPrice,
      };

      console.log('FormData:', formData);

      await updateMenuProductFunc(menuProductId, formData)
      menuPopUpSection.classList.add('hidden')
    })

  } catch (error) {
    console.error(error);

  } finally {
    document.getElementById('preloader').classList.add('hidden')
  }
}

const updateMenuProductFunc = async (menuProductId, formData) => {

  console.log(formData);
  document.getElementById('preloader').classList.remove('hidden')

  try {
    const updateMenuProductResponse = await fetch(`${config.apiUrl}/doveeysKitchen/product/updateMenuProduct/${menuProductId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })

    console.log(updateMenuProductResponse);


    if (updateMenuProductResponse.ok) {
      alert('Product updated successfully!');
      getMenuProductFunc(); // Refresh product list
    } else {
      alert('Failed to update product.');
    }

    // alert('successful')
  } catch (error) {
    console.error(error);

  } finally {
    document.getElementById('preloader').classList.add('hidden')
  }
}


const deleteSingleProductFunc = async (menuProductId) => {
  document.getElementById('preloader').classList.remove('hidden')
  try {
    const deleteSingleProductResponse = await fetch(`${config.apiUrl}/doveeysKitchen/product/deleteMenuProduct/${menuProductId}`, {
      method: 'DELETE',
    })

    // console.log(deleteSingleProductResponse);

    if (deleteSingleProductResponse.ok) {
      alert('Product Deleted successfully!');
      getMenuProductFunc(); // Refresh product list
    } else {
      alert('Failed to delete product.');
    }

  } catch (error) {
    console.error(error);

  } finally {
    document.getElementById('preloader').classList.add('hidden')
  }
}

// Select all sidebar links and sections
const sidebarLinks = document.querySelectorAll('nav a');
const sections = document.querySelectorAll('.content');

// Add click event listeners to each sidebar link
sidebarLinks.forEach((link, index) => {
  link.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default link behavior

    // Hide all sections and remove active class from links
    sections.forEach(section => section.classList.add('hidden'));
    sidebarLinks.forEach(link => link.classList.remove('bg-gray-700'));

    // Show the clicked section and add active class to the link
    sections[index].classList.remove('hidden');
    link.classList.add('bg-gray-700');
  });
});

const adminOrdersList = document.getElementById('adminOrdersList')


const fetchAllOrders = async () => {
  adminOrdersList.innerHTML = '';
  document.getElementById('preloader').classList.remove('hidden')

  try {
    const response = await fetch(`${config.apiUrl}/doveeysKitchen/adminGetOrder/adminGetAllProceedOrder`);

    const data = await response.json();
    console.log('admin Data', data.orderProceed);

    const spreadData = data.orderProceed;

    document.getElementById('manageorderhtag').innerText = `Manage Orders (${spreadData.length > 0 ? spreadData.length : 0})`

    spreadData.forEach((eachData) => {
      // console.log(eachData.menuProductOrderVariation.size
      // );
      const menuOrderId = eachData._id;

      // Format the createdAt date
      const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true, // For AM/PM format
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        };
        return date.toLocaleString('en-US', options);
      };

      const ordersDisplay = `
        <div class="border rounded-lg shadow-md p-4 ordersIdClass" data-id="${menuOrderId}">
          <div class="flex items-center justify-between">
            <!-- Product Info -->
            <div class="flex items-center space-x-4">
              <img src="${eachData.menuProductOrderImage}" alt="${eachData.menuProductOrderName}" class="w-16 h-16 object-cover rounded">
              <div>
                <h4 class="font-semibold">${eachData.menuProductOrderName}</h4>
                <p class="text-sm text-gray-600">₦${eachData.menuProductOrderPrice}</p>
              </div>
            </div>
            <!-- Order Time -->
            <div class="text-sm text-gray-500">
              <p>Ordered At:</p>
              <p>${formatDate(eachData.createdAt)}</p>
            </div>
          </div>

          <!-- Client Info -->
          <div class="mt-4 space-y-2">
            <p><strong>Client Name:</strong> ${eachData.userName}</p>
            <p><strong>Email:</strong> ${eachData.userEmail}</p>
            <p><strong>Phone:</strong> ${eachData.userPhone}</p>
            <p><strong>Order Tel:</strong> ${eachData.menuProductOrderContact}</p>


            <p><strong>Address:</strong> ${eachData.menuProductOrderAddress}</p>
            <p><strong>Quantity:</strong> ${eachData.menuProductOrderQuantity}</p>
            <p><strong>Total Price:</strong> ₦${eachData.menuTotalProductOrderPrice}</p>
          </div>

          <!-- Actions -->
          <div class="mt-4 md:flex md:space-x-4 space-y-1 md:space-y-0">
            <button class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 w-full cancleOrderBtn">
              Cancel Order
            </button>
            
            <button id="confirmOrderBtn" class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 w-full">
              Confirm/Delivered
            </button>
          </div>
        </div>
      `;

      adminOrdersList.innerHTML += ordersDisplay;

      console.log(adminOrdersList);

      const confirmOrderBtn = document.getElementById('confirmOrderBtn');
      confirmOrderBtn.addEventListener('click', (e) => {
        const confirmMenuOrderId = e.target.closest('.ordersIdClass').dataset.id;
        confirmUserOrders(confirmMenuOrderId);
      });
    });

    document.querySelectorAll('.cancleOrderBtn').forEach((button) => {
      button.addEventListener('click', (e) => {
        const deleteMenuOrderId = e.target.closest('.ordersIdClass').dataset.id;
        cancleUserOrders(deleteMenuOrderId);
      });
    });


  } catch (error) {
    console.error(error);
  } finally {
    document.getElementById('preloader').classList.add('hidden')
  }
};


const cancleUserOrders = async (menuOrderId) => {
  try {
    document.getElementById('preloader').classList.remove('hidden')
    const response = await fetch(`${config.apiUrl}/doveeysKitchen/order/adminCancleOrder/${menuOrderId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })


    const data = await response.json()
    fetchAllOrders()

  } catch (error) {
    console.error(error);

  } finally {
    document.getElementById('preloader').classList.add('hidden')
  }
}

const confirmUserOrders = async (menuOrderId) => {
  try {
    document.getElementById('preloader').classList.remove('hidden')

    const response = await fetch(`${config.apiUrl}/doveeysKitchen/order/adminConfirmOrder/${menuOrderId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })

    console.log(response);

    const data = await response.json()
    console.log(data);


    fetchAllOrders()

  } catch (error) {
    console.error(error);

  } finally {
    document.getElementById('preloader').classList.add('hidden')
  }
}

const fetTotalOrderIncome = async () => {
  try {
    const response = await fetch(`${config.apiUrl}/doveeysKitchen/adminGetOrder/adminGetAllConfirmedOrdersPrice`)

    console.log('Total Price', response);

    const data = await response.json()
    console.log('total Price Data', data.totalPrice);

    const analyticTotalPrice = data.totalPrice

    const analyTicEarning = document.getElementById('analyTicEarning')

    analyTicEarning.textContent = analyticTotalPrice
  } catch (error) {

  }
}

const countPendingOrdersFunc = async () => {
  try {
    const response = await fetch(`${config.apiUrl}/doveeysKitchen/adminGetOrder/adminGetAllProceedOrder`);

    const data = await response.json()
    console.log(data);

    const countData = data.count
    document.getElementById('pendingOrders').textContent = countData
  } catch (error) {
    console.log(error);

  }
}

const countRegisteredUsers = async () => {
  try {
    const response = await fetch(`${config.apiUrl}/doveeysKitchen/api/getRegisteredUser`)

    console.log(response);


    const data = await response.json()
    console.log('reg users count', data);
    document.getElementById('regUserCount').textContent = data.count

  } catch (error) {
    console.log(error);

  }
}

const getWeeklyGrowthFunc = async () => {
  try {
    const response = await fetch(`${config.apiUrl}/doveeysKitchen/adminGetOrder/getWeeklyGrowth`)

    const data = await response.json()
    console.log('adminChart', data);

    const { growthPercentage } = data;

    // Update the growth percentage in the UI
    const weeklyGrowthElem = document.getElementById('weeklyGrowth');
    // weeklyGrowthElem.textContent = `${growthPercentage > 0 ? '+' : ''}${growthPercentage}%`;
    // weeklyGrowthElem.className = `text-2xl font-bold ${
    //   growthPercentage >= 0 ? 'text-green-500' : 'text-red-500'
    // }`;

    weeklyGrowthElem.textContent = growthPercentage !== undefined
      ? `${growthPercentage > 0 ? '+' : ''}${growthPercentage}%`
      : 'Data Unavailable';
    weeklyGrowthElem.className = `text-2xl font-bold ${growthPercentage >= 0 ? 'text-green-500' : 'text-red-500'
      }`;


  } catch (error) {
    console.log(error);

  }
}


const getAllUserMessageFunc = async () => {
  try {

    const response = await fetch(`${config.apiUrl}/doveeysKitchen/message/getAllUserMessage`);

    const data = await response.json();

    const messagesList = document.getElementById('messagesList');

    // Clear the message list
    messagesList.innerHTML = '';

    // Helper function to format the date
    const formatDate = (timestamp) => {
      const date = new Date(timestamp);
      const options = { hour: '2-digit', minute: '2-digit', year: 'numeric', month: 'short', day: 'numeric' };
      return date.toLocaleString('en-US', options); // Adjust 'en-US' for locale preferences
    };

    // Populate messages
    data.forEach((eachData) => {
      const formattedTime = formatDate(eachData.createdAt); // Format the timestamp

      const populateAllUserMessage = `
        <div id="eachPopulateMessage" class="border rounded-lg shadow-md p-4 cursor-pointer" data-id="${eachData._id}">
          <div class="flex justify-between items-center">
            <!-- User Info -->
            <div>
              <h4 class="font-semibold">${eachData.userName}</h4>
              <p class="text-sm text-gray-600">${eachData.userMessageTitle}</p>
            </div>
            <!-- Time Posted -->
            <p class="text-sm text-gray-500">${formattedTime}</p>
          </div>
        </div>
      `;
      messagesList.innerHTML += populateAllUserMessage;
    });

    // Add event listeners for each message
    const eachPopulateMessage = document.querySelectorAll('#eachPopulateMessage');

    eachPopulateMessage.forEach((button) => {
      button.addEventListener('click', (e) => {
        const messageId = e.target.closest('#eachPopulateMessage').dataset.id;

        getSingleUserMessageFunc(messageId);
      });
    });
  } catch (error) {
    console.log(error);
  }
};


const getSingleUserMessageFunc = async (messageId) => {
  try {
    const response = await fetch(`${config.apiUrl}/doveeysKitchen/message/getSingleUserMessage/${messageId}`)

    const data = await response.json()

    const messagePopup = document.getElementById('messagePopup')
    messagePopup.classList.remove('hidden')
    messagePopup.innerHTML = ''

    const populateEachMessage = `
      <div class="bg-white w-96 rounded-lg shadow-lg p-6">
            <h2 id="popupUserName" class="text-xl font-bold mb-2">Name: ${data.userName}</h2>
            <p id="popupTitle" class="text-lg font-semibold mb-2">Message Title: ${data.userMessageTitle}</p>
            <p id="popupDescription" class="text-gray-600 mb-4">Message: ${data.userMessage}</p>
            <p><strong>Phone:</strong> <span id="popupPhone">${data.userPhone}</span></p>
            <p><strong>Email:</strong> <span id="popupEmail">${data.userEmail}</span></p>
            <button id="closeMessage" class="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 w-full">Close</button>
          </div>
    `
    messagePopup.innerHTML = populateEachMessage

    const closeMessage = document.getElementById('closeMessage')
    closeMessage.addEventListener('click', () => {
      messagePopup.classList.add('hidden')
    })

  } catch (error) {

  }
}


// Handle dynamic variation addition
const addVariationBtn = document.getElementById("addVariationBtn");
const variationsContainer = document.getElementById("variationsContainer");
const priceSection = document.getElementById('priceSection');
const showVariationBtn = document.getElementById('showVariationBtn')
// let variationAdded = true;

// Toggle between Price or Variation form
function toggleVariationOption() {
  if (variationsContainer.classList.contains('hidden')) {
    priceSection.classList.add('hidden');
    showVariationBtn.textContent = 'Close Variation'
    showVariationBtn.classList.add('bg-red-500')
    showVariationBtn.classList.remove('bg-blue-500')
    variationsContainer.classList.remove('hidden');
    addVariationBtn.classList.remove('hidden');


  } else {
    priceSection.classList.remove('hidden');
    showVariationBtn.classList.remove('hidden')
    showVariationBtn.classList.remove('bg-red-500')
    showVariationBtn.classList.add('bg-blue-500')
    showVariationBtn.textContent = 'Show Variation'
    variationsContainer.classList.add('hidden');
    addVariationBtn.classList.add('hidden');
  }
}

// Add Variation Button Clicked
showVariationBtn.addEventListener('click', () => {
  // variationAdded = false;
  toggleVariationOption();
});


addVariationBtn.addEventListener("click", () => {
  const newVariation = document.createElement("div");
  newVariation.classList.add("flex", "space-x-4", "mb-4");

  newVariation.innerHTML = `
    <input
      type="text"
      name="variationSize[]"
      class="mt-1 p-2 block w-1/2 border border-gray-300 rounded"
      placeholder="Enter variation size (e.g., 1L)"
    />
    <input
      type="number"
      name="variationPrice[]"
      class="mt-1 p-2 block w-1/2 border border-gray-300 rounded"
      placeholder="Enter price"
    />
  `;

  variationsContainer.appendChild(newVariation);
});



// Generic function to handle form submissions
async function handleFormSubmit(event, endpoint) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  try {
    const response = await fetch(`${config.apiUrl}${endpoint}`, {
      method: "PATCH",
      body: formData,
    });
    const result = await response.json();

    if (response.ok) {
      alert(result.message);
      form.reset();
    } else {
      alert(result.message || "An error occurred.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to upload. Please try again.");
  }
}



// Attach event listeners to forms
document.getElementById("heroImageForm").addEventListener("submit", (e) => handleFormSubmit(e, "/doveeysLanding/updateHeroImageSchema"));

document.getElementById("flyer1Form").addEventListener("submit", (e) => handleFormSubmit(e, "/doveeysLanding/uploadFlyer1Schema"));

document.getElementById("flyer2Form").addEventListener("submit", (e) => handleFormSubmit(e, "/doveeysLanding/uploadFlyer2Schema"));


async function handleCreateFormSubmit(event, endpoint) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  try {
    const response = await fetch(`${config.apiUrl}${endpoint}`, {
      method: "POST",
      body: formData,
    });
    const result = await response.json();

    if (response.ok) {
      alert(result.message);
      form.reset();
    } else {
      alert(result.message || "An error occurred.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to upload. Please try again.");
  }
}

document.getElementById("menuImageForm").addEventListener("submit", (e) => handleCreateFormSubmit(e, "/doveeysLanding/createMenuImage"));

document.getElementById("specialImageForm").addEventListener("submit", (e) => handleCreateFormSubmit(e, "/doveeysLanding/createSpecialImage"));



const getAdminMenuLandingFunc = async () => {
  try {
    const response = await fetch(`${config.apiUrl}/doveeysLanding/getAllMenuImage`);
    const data = await response.json();

    const updatedMenuList = document.getElementById('updatedMenuList');
    updatedMenuList.innerHTML = '';

    data.forEach((eachData) => {
      const dataId = eachData._id;

      console.log('get Menu Landing DataId', eachData);

      const populateMenuLanding = `
        <div id="populatedMenuLandingDiv" class="flex items-center justify-between border rounded-lg shadow-md p-4" data-id="${dataId}">
          <div class="flex items-center space-x-4">
            <img src="../image/menuLandingImage/${eachData.menuLandingImage}" alt="${eachData.menuLandingName}" class="w-16 h-16 object-cover rounded">
          </div>

          <div>
            <h4 class="font-semibold">${eachData.menuLandingName}</h4>
            <p class="text-sm text-gray-600 font-semibold">${eachData.menuLandingDes}</p>
          </div>

          <div class="flex space-x-2">
            <button id="updateMenuLanding" class="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600">
              <p class="hidden md:block">Update</p>
              <i class="fas fa-pencil-alt md:hidden"></i>
            </button>
          </div>
        </div>
      `;
      updatedMenuList.innerHTML += populateMenuLanding;
    });

    const updateMenuLandingButtons = document.querySelectorAll('#updateMenuLanding');
    const MenuLandingPageEditPopUpSection = document.getElementById('MenuLandingPageEditPopUpSection');

    updateMenuLandingButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        MenuLandingPageEditPopUpSection.classList.remove('hidden');
        const menuLandingId = e.target.closest('#populatedMenuLandingDiv').dataset.id;

        // Fetch the menu landing data and populate the form
        fetchSingleAdminMenuLanding(menuLandingId);
      });
    });
  } catch (error) {
    console.error('Error fetching menu landing data:', error);
  }
};


const fetchSingleAdminMenuLanding = async (menuLandingId) => {
  try {
    const response = await fetch(`${config.apiUrl}/doveeysLanding/getSingleMenuImage/${menuLandingId}`);
    const data = await response.json();

    // Attach the event listener for the form submission
    const menuLandingImageForm = document.getElementById('menuLandingImageForm');
    menuLandingImageForm.onsubmit = (e) => {
      e.preventDefault(); // Prevent default form submission
      const formData = new FormData(menuLandingImageForm);
      updateAdminMenuLanding(formData, menuLandingId);
    };
  } catch (error) {
    console.error('Error fetching single menu landing:', error);
  }
};


const updateAdminMenuLanding = async (formData, menuLandingId) => {
  try {
    const response = await fetch(`${config.apiUrl}/doveeysLanding/uploadMenuImageSchema/${menuLandingId}`, {
      method: 'PATCH',
      body: formData, // Correctly pass FormData in the body
    });

    if (response.ok) {
      alert('Update Successful');
      getAdminMenuLandingFunc(); // Refresh the menu list after update
      document.getElementById('MenuLandingPageEditPopUpSection').classList.add('hidden'); // Hide the popup
    } else {
      alert('Update failed');
      console.error('Failed response:', await response.text());
    }
  } catch (error) {
    console.error('Error updating menu landing:', error);
    alert('Update failed');
  }
};



const getAllSpecialImagesFunc = async () => {
  try {
    const response = await fetch(`${config.apiUrl}/doveeysLanding/getAllSpecialImage`);
    const data = await response.json();

    const updatedSpecialList = document.getElementById('updatedSpecialList');
    updatedSpecialList.innerHTML = ''; // Clear previous entries

    data.forEach((eachData) => {
      const dataId = eachData._id;

      const populateSpecialLanding = `
        <div id="populatedSpecialLandingDiv" class="flex items-center justify-between border rounded-lg shadow-md p-4" data-id="${dataId}">
          <div class="flex items-center space-x-4">
            <img src="../image/specialLandingImage/${eachData.specialLandingImage}" alt="${eachData.specialLandingName}" class="w-16 h-16 object-cover rounded">
          </div>

          <div>
            <h4 class="font-semibold">${eachData.specialLandingName}</h4>
            <p class="text-sm text-gray-600 font-semibold">${eachData.specialLandingDes}</p>
          </div>

          <div class="flex space-x-2">
            <button id="updateSpecialLanding" class="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600">
              <p class="hidden md:block">Update</p>
              <i class="fas fa-pencil-alt md:hidden"></i>
            </button>
          </div>
        </div>
      `;

      updatedSpecialList.innerHTML += populateSpecialLanding;
    });

    // Add event listeners to "Update" buttons
    const updateSpecialLandingButtons = document.querySelectorAll('#updateSpecialLanding');
    const specialLandingPageEditPopUpSection = document.getElementById('specialLandingPageEditPopUpSection');

    updateSpecialLandingButtons.forEach((eachSpecialLanding) => {
      eachSpecialLanding.addEventListener('click', (e) => {
        specialLandingPageEditPopUpSection.classList.remove('hidden');
        const specialLandingId = e.target.closest('#populatedSpecialLandingDiv').dataset.id;

        fetchSingleSpecialImage(specialLandingId);
      });
    });
  } catch (error) {
    console.error('Error fetching special images:', error);
  }
};


const fetchSingleSpecialImage = async (specialLandingId) => {
  try {
    const response = await fetch(`${config.apiUrl}/doveeysLanding/getSingleSpecialImage/${specialLandingId}`);
    const data = await response.json();

    document.getElementById('specialLandingImageForm').addEventListener('submit', (e) => {
      e.preventDefault(); // Prevent default form submission
      const form = e.target;
      const formData = new FormData(form);

      updateSpecialImage(formData, specialLandingId);
    });

  } catch (error) {
    console.error('Error fetching single special image:', error);
  }
};


const updateSpecialImage = async (formData, specialLandingId) => {
  try {
    const response = await fetch(`${config.apiUrl}/doveeysLanding/uploadSpecialImageSchema/${specialLandingId}`, {
      method: 'PATCH',
      body: formData, // Attach the FormData object
    });

    if (response.ok) {
      alert('Update Successful');
      getAllSpecialImagesFunc(); // Refresh the list
    } else {
      const errorText = await response.text();
      alert('Update failed');
      console.error('Failed response:', errorText);
    }
  } catch (error) {
    console.error('Error updating special image:', error);
    alert('Update failed');
  }
};


const galleryForm = document.getElementById('galleryForm')

const createGalleryFunc = async () => {
  document.getElementById("preloader").classList.remove('hidden')
  const formData = new FormData(galleryForm);
  try {

    const response = await fetch(`${config.apiUrl}/galleryDisplay/createGallery`, {
      method: 'POST',
      body: formData
    })

    const result = await response.json();
    if (response.ok) {
      alert("File uploaded successfully!");
      // fetchGallery(); 
      fetchGallery()
      return
    } else {
      alert(result.error || "Failed to upload file.");
    }
  } catch (error) {
    console.error(err);
    alert("An error occurred while uploading the file.");
  } finally {
    document.getElementById("preloader").classList.add('hidden')
  }
}

galleryForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  await createGalleryFunc()
})


async function fetchGallery() {
  try {
    const response = await fetch(`${config.apiUrl}/galleryDisplay/getGallery`); // Fetch the gallery data
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json(); // Parse the response JSON

    console.log(response, data);


    const container = document.getElementById("galleryListDiv"); // Select the container for gallery items
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

      const deleteId = item._id

      console.log('deleted Id', deleteId);


      if (item.galleryType === "image") {

        content = `
          <div id="galleryIdDiv" class="flex items-center justify-between border rounded-lg shadow-md p-4" data-id="${deleteId}">
            <div id="galleryDisplayDiv" class="flex items-center space-x-4">
              <img src="../image/GalleryVideo/${item.galleryMedia}" alt="${item.galleryTitle}" class="w-16 h-16 object-cover rounded">
            </div>

            <div>
              <h4 class="font-semibold">${item.galleryTitle}</h4>
              <p class="text-sm text-gray-600 font-semibold"><span>Posted: </span>${timePosted}</p>
              
            </div>

            <div class="flex space-x-2">
              <button id="deleteGallery" class="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">
                <p class="hidden md:block">Delete</p>
                <i class="fas fa-trash md:hidden"></i>
              </button>
            </div>
          </div>
        `
      } else if (item.galleryType === "video") {

        content = `
          <div id="galleryIdDiv" class="flex items-center justify-between border rounded-lg shadow-md p-4" data-id="${deleteId}">
            <div id="galleryDisplayDiv" class="flex items-center space-x-4">
              <video controls class="w-16 h-16 object-cover rounded">
                <source src="../image/GalleryVideo/${item.galleryMedia}" type="video/mp4">
                Your browser does not support the video tag.
              </video>
            </div>

            <div>
              <h4 class="font-semibold">${item.galleryTitle}</h4>
              <p class="text-sm text-gray-600 font-semibold"><span>Posted: </span>${timePosted}</p>
              
            </div>

            <div class="flex space-x-2">
              <button id="deleteGallery" class="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">
                <p class="hidden md:block">Delete</p>
                <i class="fas fa-trash md:hidden"></i>
              </button>
            </div>
          </div>
        `

      }

      container.innerHTML += content

      const deleteGallery = document.querySelectorAll('#deleteGallery')

      deleteGallery.forEach((eachDelete) => {
        eachDelete.addEventListener('click', (e) => {
          const galleryDeleteId = e.target.closest('#galleryIdDiv').dataset.id
          deleteGalleryFunc(galleryDeleteId)
        })
      })

    });
  } catch (err) {
    console.error("Failed to fetch gallery items:", err); // Log the error
  }
}

// Call the function to fetch and display the gallery

async function deleteGalleryFunc(galleryDeleteId) {
  try {
    const response = await fetch(`${config.apiUrl}/galleryDisplay/deleteGallery/${galleryDeleteId}`, {
      method: 'DELETE'
    })

    alert('Item deleted successfully')
    fetchGallery()
  } catch (error) {
    console.log(error);

  }
}




// Function to create a new daily menu
const dailyMenuForm = document.getElementById('dailyMenuForm')

dailyMenuForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  let menuProductTarget = e.target

  const formData = new FormData(menuProductTarget)
  try {
    const response = await fetch(`${config.apiUrl}/dailyMenuDisplay/createDailyMenu`, {
      method: "POST",
      body: formData, // FormData should contain the image and price
    });

    if (response.ok) {
      return alert('Daily Menu added successfully')
    } else {
      return alert('Failed to create Daily Menu')
    }
    // const data = await response.json();
    // console.log("Menu Created:", data);

  } catch (error) {
    console.error("Error creating daily menu:", error);
  }
})

// Function to get all daily menus
async function getAllDailyMenus() {

  const dailyMenuProductList = document.getElementById('dailyMenuProductList')

  try {
    const response = await fetch(`${config.apiUrl}/dailyMenuDisplay/allDailyMenu`);
    const data = await response.json();

    dailyMenuProductList.innerHTML = ''
    data.forEach((eachData) => {

      const eachDailyMenuId = eachData._id

      const populateDailyMenu = `
            <div id="dailydisplayDivv" class="flex items-center justify-between border rounded-lg shadow-md p-4" data-id="${eachDailyMenuId}">
            <div class="flex items-center space-x-4">
              <img src="../image/dailyMenu/${eachData.menuImage}" alt="Chicken Suya" class="w-16 h-16 object-cover rounded">
              <div>
                <h4 class="font-semibold">${eachData.menuTitle}</h4>
                <p class="text-sm text-gray-600">₦${eachData.price}</p>
              </div>
            </div>
            
            <div class="flex space-x-2">
              <button id="updateDailydisplayDivv" class="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600">
                <p class="hidden md:block">Edit</p>
                <i class="fas fa-pencil-alt md:hidden"></i>
              </button>
              <button id="deleteDailydisplayDivv" class="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">
                <p class="hidden md:block">Delete</p>
                <i class="fas fa-trash md:hidden"></i>
              </button>
            </div>
          </div>
          `

      dailyMenuProductList.innerHTML += populateDailyMenu
      // dailydisplayDivv
      const deleteDailydisplayDivv = document.querySelectorAll('#deleteDailydisplayDivv')
      const updateDailydisplayDivv = document.querySelectorAll('#updateDailydisplayDivv')

      deleteDailydisplayDivv.forEach((eachDataDelete) => {
        eachDataDelete.addEventListener('click', (e) => {
          const deleteEachData = e.target.closest('#dailydisplayDivv').dataset.id
          deleteDailyMenu(deleteEachData)
        })
      })


      updateDailydisplayDivv.forEach((eachDataEdit) => {
        eachDataEdit.addEventListener('click', (e) => {
          const editEachData = e.target.closest('#dailydisplayDivv').dataset.id
          getSingleDailyMenu(editEachData)
        })
      })


    })
  } catch (error) {
    console.error("Error fetching daily menus:", error);
  }
}

// Function to get a single daily menu by ID
async function getSingleDailyMenu(editEachData) {
  const dailyMenuPopUpSection = document.getElementById('dailyMenuPopUpSection')
  dailyMenuPopUpSection.classList.remove('hidden')

  const dailyMenuPopUpDiv = document.getElementById('dailyMenuPopUpDiv')
  dailyMenuPopUpDiv.innerHTML = ''
  try {
    const response = await fetch(`${config.apiUrl}/dailyMenuDisplay/eachDailyMenu/${editEachData}`);
    const data = await response.json();
    console.log("Single Daily Menu:", data);

    const populateSingleDailyMenu = `
            <div id="closeDailyMenuPopUp" class="text-red-500 flex items-center font-bold">
          <div><i class="fas fa-times"></i></div>
          <p>close</p>
        </div>

        <h2 class="text-xl font-bold mb-4 text-center mt-[10px]">Edit Menu Products</h2>
  
        <form id="editDailyMenuForm" enctype="multipart/form-data" class="space-y-4 border-b pb-6 mb-6 text-black">
          <div class="eachEditMenuProductDiv">
            <label class="block text-sm font-medium ">Existing Daily Menu</label>
            <input
              type="text"
              name="menuTitle"
              value="${data.menuTitle}"
              class="mt-1 p-2 block w-full border border-gray-300 rounded"
              placeholder="Enter new product name"
            />
          </div>
      
          <div>
            <label class="block text-sm font-medium "> Existing Product Price (₦)</label>
            <input
              type="number"
              name="price"
              value="${data.price}"
              class="mt-1 p-2 block w-full border border-gray-300 rounded"
              placeholder="Enter new product price"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Daily Menu Image</label>
            <input
              type="file"
              name="menuImage"
              class="mt-1 p-2 block w-full border border-gray-300 rounded"
              accept="image/*"
            />
          </div>
      
          <button
            type="submit"
            class="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 w-full"
          >
            Upload Product
          </button>
          
        </form>
        `

    dailyMenuPopUpDiv.innerHTML = populateSingleDailyMenu

    const closeMenuPopUp = document.getElementById('closeDailyMenuPopUp')
    closeMenuPopUp.addEventListener('click', () => {
      dailyMenuPopUpSection.classList.add('hidden')
    })

    const editDailyMenuForm = document.getElementById('editDailyMenuForm')
    editDailyMenuForm.addEventListener('submit', (e) => {
      e.preventDefault()
      let menuProductTarget = e.target
      const formData = new FormData(menuProductTarget)
      updateDailyMenu(editEachData, formData)
    })
  } catch (error) {
    console.error("Error fetching daily menu:", error);
  }
}

// Function to update a daily menu by ID
async function updateDailyMenu(editEachData, formData) {
  try {
    const response = await fetch(`${config.apiUrl}/dailyMenuDisplay/updateDailyMenu/${editEachData}`, {
      method: "PATCH",
      body: formData, // FormData should contain updated image and price
    });
    const data = await response.json();
    console.log("Menu Updated:", data);
    alert('Item updated successfully')
    getAllDailyMenus()
  } catch (error) {
    console.error("Error updating daily menu:", error);
  }
}

// Function to delete a daily menu by ID
async function deleteDailyMenu(deleteEachData) {
  try {
    const response = await fetch(`${config.apiUrl}/dailyMenuDisplay/deleteDailyMenu/${deleteEachData}`, {
      method: "DELETE",
    });
    const data = await response.json();
    console.log("Menu Deleted:", data);
    alert('Daily Menu Item Deleted Successfully')
    getAllDailyMenus()
  } catch (error) {
    console.error("Error deleting daily menu:", error);
  }
}


// Manage Upcoming Event

document.getElementById('eventProductForm').addEventListener('submit', async (e) => {
  e.preventDefault()
  document.getElementById("preloader").classList.remove('hidden')
  const formData = new FormData(e.target)
  console.log(formData);


  try {
    const response = await fetch(`${config.apiUrl}/doveeysKitchen/eventapi/createEventMgt`, {
      method: 'POST',
      body: formData
    })

    console.log(response);

    alert('Upload successfully')
  } catch (error) {
    console.error(error)
  }
  document.getElementById("preloader").classList.add('hidden')
})

const triggerNoteRead = document.querySelectorAll('.triggerNoteRead')
const toggleTriggeredNote = document.getElementById('toggleTriggeredNote')

triggerNoteRead.forEach((eachTriggerBtn) => {
  eachTriggerBtn.addEventListener('click', (e) => {
    // console.log(e.target);

    toggleTriggeredNote.classList.toggle('hidden')
    // console.log(toggleTriggeredNote);

  })
})

// Fetch All  Event Product 
const eventMenuProductList = document.getElementById('eventMenuProductList')
const fetchEventProductFunc = async () => {
  eventMenuProductList.innerHTML = ''
  try {
    const response = await fetch(`${config.apiUrl}/doveeysKitchen/eventapi/getAllEventMgts`)

    console.log(response);

    const data = await response.json()
    console.log(data);

    data.forEach((eachData) => {
      const allEvent = `
      <div class="flex items-center justify-between border rounded-lg shadow-md p-4">
              <div class="flex items-center space-x-4">
                <img src="${eachData.eventImage}" alt="${eachData.eventTitle}" class="w-16 h-16 object-cover rounded">
                <div>
                  <h4 class="font-semibold">${eachData.eventTitle}</h4>
                  <p class="text-sm text-gray-600">₦${eachData.eventPrice}</p>
                </div>
              </div>
              <div class="flex space-x-2">
                <button class="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600" id="deleteEachEventBtn" data-id="${eachData._id}">
                  <p class="hidden md:block">Delete</p>
                  <i class="fas fa-trash md:hidden"></i>
                </button>
              </div>
            </div>
    
    `

      eventMenuProductList.innerHTML += allEvent

      const deleteEachEventBtn = document.querySelectorAll('#deleteEachEventBtn')

      deleteEachEventBtn.forEach((eachdeleteEachEventBtn) => {
        console.log(eachdeleteEachEventBtn);

        eachdeleteEachEventBtn.addEventListener('click', (e) => {
          // console.log('Event Target', e.target.closest('#deleteEachEventBtn').dataset.id);

          const eventId = e.target.closest('#deleteEachEventBtn').dataset.id
          deleteEventProductFunc(eventId)
        })

        // deleteEventProductFunc(eachData._id)
      })

    })



  } catch (error) {
    console.error(error)
  }
}

const deleteEventProductFunc = async (eventId) => {
  console.log('Hello World Delete');

  console.log(eventId);

  try {
    const response = await fetch(`${config.apiUrl}/doveeysKitchen/eventapi/deleteEventMgt/${eventId}`, {
      method: 'DELETE'
    })

    console.log(response);

    await fetchEventProductFunc()

  } catch (error) {
    console.error(error)
  }
}

document.getElementById('eventHeaderForm').addEventListener('submit', async (e) => {
  e.preventDefault()
  document.getElementById("preloader").classList.remove('hidden')
  const formData = {
    eventHeader: document.getElementById('eventHeader').value,
    eventHeaderDescription: document.getElementById('eventHeaderDescription').value
  }

  console.log(formData);


  try {
    const response = await fetch(`${config.apiUrl}/doveeysKitchen/eventHeader/createEventHeader`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })

    console.log(response);

    document.getElementById('eventHeader').value = '',
      document.getElementById('eventHeaderDescription').value = ''

  } catch (error) {
    console.error(error)
  }
  document.getElementById("preloader").classList.add('hidden')
})



const eventToggleStatus = document.getElementById('eventToggleStatus')
const eventToggleStatusDiv = document.getElementById('eventToggleStatusDiv')
const eventHeaderForm = document.getElementById('eventHeaderForm')
const uploadeventdivdisplay = document.getElementById('uploadeventdivdisplay')


const toggleEventFunc = async () => {
  document.getElementById("preloader").classList.remove('hidden')
  try {
    const response = await fetch(`${config.apiUrl}/doveeysKitchen/eventStatus/initiateToggle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log(response);

    const data = await response.json();
    console.log(data);

    await getToggleEventFunc(); // Wait for UI to update
  } catch (error) {
    console.error(error);
  }
  document.getElementById("preloader").classList.add('hidden')
};


eventToggleStatus.onchange = () => {
  console.log("Changes occurred");
  toggleEventFunc();
};


const getToggleEventFunc = async () => {
  document.getElementById("preloader").classList.remove('hidden')
  // eventToggleStatusDiv.innerHTML = ''; 

  try {
    const response = await fetch(`${config.apiUrl}/doveeysKitchen/eventStatus/getToggleStatus`);
    console.log(response);

    const data = await response.json();
    console.log(data);

    // if(data) {
    //   eventToggleStatusDiv.innerHTML = ''; 
    // }

    const toggleStatus = data.toggleEventStatus == "Checked" ? "checked" : "";
    const toggleStatusTrig = data.toggleEventStatus == "Checked" ? "active" : "inactive";

    data.toggleEventStatus == "Checked" ? eventHeaderForm.classList.remove('hidden') : eventHeaderForm.classList.add('hidden')

    data.toggleEventStatus == "Checked" ? uploadeventdivdisplay.classList.remove('hidden') : uploadeventdivdisplay.classList.add('hidden')

    eventToggleStatusDiv.innerHTML = `
      <input id="eventToggleStatus" type="checkbox" ${toggleStatus}>
      <div>
        <p class="font-bold text-[12px] ${data.toggleEventStatus == "Checked" ? "text-green-600" : "text-red-600"}">
          ${toggleStatusTrig}
        </p>
      </div>
    `;

    // **Reattach the event listener after updating the DOM**
    const eventToggleStatus = document.getElementById("eventToggleStatus");
    eventToggleStatus.onchange = () => {
      console.log("Changes occurred");
      toggleEventFunc();
    };
  } catch (error) {
    console.error(error);
  }
  document.getElementById("preloader").classList.add('hidden')
};


// const checkAdminAuth = async () => {
//   try {
//       const response = await fetch(`${config.apiUrl}/doveeysKitchen/safezone/verifyAdmin`, {

//         credentials: 'include', 
//           method: 'GET',

//       });

//       console.log(response);

//       const data = await response.json();

//       console.log(data);


//       if (!response.ok) {
//         console.log('log 1');

//           // window.location.href = "../htmlFolder/adminAuth.html";
//       }
//   } catch (error) {
//     console.log('log 2');

//       // window.location.href = "../htmlFolder/adminAuth.html";
//   }
// };


// Initialize the toggle status on page load

window.onload = () => {
  getToggleEventFunc();
  fetchEventProductFunc();
  document.getElementById("preloader").classList.remove('hidden')
  setTimeout(() => {
    document.getElementById("preloader").classList.add('hidden')
  }, 2000); // Adjust timing as needed
};
