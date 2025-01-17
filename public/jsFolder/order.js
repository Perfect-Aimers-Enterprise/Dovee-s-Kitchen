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
})

// All Api URL Testing
// 
const getMenuProductFuncUrl = `${config.apiUrl}/doveeysKitchen/product/getMenuProducts`
const menuProductFormUrl = `${config.apiUrl}/doveeysKitchen/product/createMenuProduct`

// All Api URL Development
// const menuProductFormUrl = '/doveeysKitchen/product/createMenuProduct'
// const getMenuProductFuncUrl = '/doveeysKitchen/product/getMenuProducts'

const menuProductForm = document.getElementById('menuProductForm')
const menuProductList = document.getElementById('menuProductList')

menuProductForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    let menuProductTarget = e.target

    const formData = new FormData(menuProductTarget)

    formData.forEach((value, key) => {
        console.log(key, value);
    });
    console.log(formData);
    
    try {
        const createMenuProduct = await fetch(`${config.apiUrl}/doveeysKitchen/product/createMenuProduct`, {
            method: 'POST',
            body: formData
        })

        console.log(createMenuProduct);
        
        if (createMenuProduct.ok) {
          alert('Product created successfully!');
          getMenuProductFunc(); // Refresh product list
        } else {
          alert('Failed to create product.');
        }

        const data = await createMenuProduct.json()
        console.log(data);
        
    } catch (error) {
        console.log(error);
        
    }
})

// getMenuProducts
// getMenuProducts
const getMenuProductFunc = async (e) => {
  try {
    const getMenuProductsResponse = await fetch(getMenuProductFuncUrl);

    console.log(getMenuProductsResponse);

    const data = await getMenuProductsResponse.json();
    console.log(data);

    menuProductList.innerHTML = '';

    data.forEach((eachData) => {
      console.log('Data eachdata',eachData);

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
    console.log(error);
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

  // console.log('fetch', eachData);
  console.log('id', menuProductId);

  try {
    const fetchSingleProductResponse = await fetch(`${config.apiUrl}/doveeysKitchen/product/getSingleMenuProduct/${menuProductId}`)

  // console.log(fetchSingleProductResponse);

    const data = await fetchSingleProductResponse.json()
    console.log(data);

    const menuPopUpSection = document.getElementById('menuPopUpSection')
    menuPopUpSection.classList.remove('hidden')

    // menuPopUpSection.addEventListener('click', () => {
    //   menuPopUpSection.classList.add('hidden')
    // })

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
    console.log(error);
    
  }}

  const updateMenuProductFunc = async (menuProductId, formData) => {

    console.log(formData);
    
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
      
    }
  }


  const deleteSingleProductFunc = async (menuProductId) => {
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

const ordersList = document.getElementById('ordersList')

const fetchAllOrders = async () => {
  ordersList.innerHTML = '';

  try {
    const response = await fetch(`${config.apiUrl}/doveeysKitchen/adminGetOrder/adminGetAllProceedOrder`);

    const data = await response.json();
    console.log('admin Data', data.orderProceed);

    const spreadData = data.orderProceed;

    spreadData.forEach((eachData) => {
      console.log(eachData.menuProductOrderVariation.size
      );
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
            <p><strong>Variation: </strong>{ Size ${eachData.menuProductOrderVariation.size} : Price ${eachData.menuProductOrderVariation.price} }</p>
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

      ordersList.innerHTML += ordersDisplay;

      // const cancleOrderBtn = document.getElementById('cancleOrderBtn');
      // cancleOrderBtn.addEventListener('click', (e) => {
      //   const deleteMenuOrderId = e.target.closest('.ordersIdClass').dataset.id;
      //   cancleUserOrders(deleteMenuOrderId);
      // });

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
    console.log(error);
  }
};


const cancleUserOrders = async (menuOrderId) => {
  try {
    const response = await fetch(`${config.apiUrl}/doveeysKitchen/order/adminCancleOrder/${menuOrderId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    

    const data = await response.json()
    fetchAllOrders()
    
  } catch (error) {
    console.log(error);
    
  }
}

const confirmUserOrders = async (menuOrderId) => {
  try {
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
    console.log(error);
    
  }
}

const fetTotalOrderIncome = async () => {
  try {
    const response = await fetch(`${config.apiUrl}/doveeysKitchen/adminGetOrder/adminGetAllConfirmedOrdersPrice`)

    console.log('Total Price',response);
    
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
    console.log('adminChart',data);
    
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
weeklyGrowthElem.className = `text-2xl font-bold ${
  growthPercentage >= 0 ? 'text-green-500' : 'text-red-500'
}`;


  } catch (error) {
    console.log(error);
    
  }
}


const getAllUserMessageFunc = async () => {
  try {
    const response = await fetch(`${config.apiUrl}/doveeysKitchen/message/getAllUserMessag`);

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
      });e
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
            <p><strong>Phone:</strong> <span id="popupPhone">tel: ${data.userPhone}</span></p>
            <p><strong>Email:</strong> <span id="popupEmail">Email: ${data.userEmail}</span></p>
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

  // Initially, the price section is visible, and variations section is hidden
  // toggleVariationOption();

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