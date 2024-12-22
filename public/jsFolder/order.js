document.addEventListener('DOMContentLoaded', () => {
    getMenuProductFunc()
    fetchAllOrders()
})

// All Api URL Testing
// http://localhost:3000
const getMenuProductFuncUrl = '/doveeysKitchen/product/getMenuProducts'
const menuProductFormUrl = '/doveeysKitchen/product/createMenuProduct'

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
        const createMenuProduct = await fetch('/doveeysKitchen/product/createMenuProduct', {
            method: 'post',
            body: formData
        })

        console.log(createMenuProduct);
        

        const data = await createMenuProduct.json()
        console.log(data);
        
    } catch (error) {
        console.log(error);
        
    }
})

// getMenuProducts
const getMenuProductFunc = async (e) => {
  

    try {
        const getMenuProductsResponse = await fetch(getMenuProductFuncUrl)

        console.log(getMenuProductsResponse);

        const data = await getMenuProductsResponse.json()
        console.log(data);
        menuProductList.innerHTML = ''
        
        data.forEach((eachData) => {
            console.log(eachData);
            // console.log(eachData._id);
            
            const menuProductId = eachData._id
            console.log(menuProductId);
            

            const menuProductEach = `
                <div class="flex items-center justify-between border rounded-lg shadow-md p-4 menuProductEach" data-id="${menuProductId}">
            <div class="flex items-center space-x-4">
              <img src="../image/menuImage/${eachData.menuImage}" alt="Chicken Suya" class="w-16 h-16 object-cover rounded">
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
            `

            // console.log(e.target.closest('.flex'));
            
            menuProductList.innerHTML += menuProductEach
        })

        attachEditEventListeners()
        
    } catch (error) {
        console.log(error);
        
    }
    
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
    const fetchSingleProductResponse = await fetch(`/doveeysKitchen/product/getSingleMenuProduct/${menuProductId}`)

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
      const updateMenuProductResponse = await fetch(`/doveeysKitchen/product/updateMenuProduct/${menuProductId}`, {
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
      const deleteSingleProductResponse = await fetch(`/doveeysKitchen/product/deleteMenuProduct/${menuProductId}`, {
        method: 'DELETE',
      })

      console.log(deleteSingleProductResponse);

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

  ordersList.innerHTML = ''

  try {
    const response = await fetch('/doveeysKitchen/adminGetOrder/adminGetAllProceedOrder')

    console.log(response);
    
    const data = await response.json()
    console.log('admin Data',data.orderProceed);

    const spreadData = data.orderProceed

    spreadData.forEach((eachData) => {
      console.log(eachData);
      const menuOrderId = eachData._id

      const ordersDisplay = `
      <div class="border rounded-lg shadow-md p-4 ordersIdClass" data-id="${menuOrderId}">
            <div class="flex items-center justify-between">
              <!-- Product Info -->
              <div class="flex items-center space-x-4">
                <img src="../image/menuImage/${eachData.
                  menuProductOrderImage}" alt="Chicken Suya" class="w-16 h-16 object-cover rounded">
                <div>
                  <h4 class="font-semibold">${eachData.menuProductOrderName
                  }</h4>
                  <p class="text-sm text-gray-600">₦${eachData.menuProductOrderPrice
                  }</p>
                </div>
              </div>
              <!-- Order Time -->
              <div class="text-sm text-gray-500">
                <p>Ordered At:</p>
                <p>10:45 AM, 7 Dec 2024</p>
              </div>
            </div>
      
            <!-- Client Info -->
            <div class="mt-4 space-y-2">
              <p><strong>Client Name:</strong> ${eachData.userName}</p>
              <p><strong>Email:</strong> ${eachData.userEmail}</p>
              <p><strong>Phone:</strong> ${eachData.userPhone}</p>
              <p><strong>Address:</strong> ${eachData.menuProductOrderAddress}</p>
              <p><strong>Quantity:</strong> ${eachData.
                menuProductOrderQuantity}</p>
              <p><strong>Total Price:</strong> ₦${eachData.
                menuTotalProductOrderPrice}</p>
            </div>
      
            <!-- Actions -->
            <div class="mt-4 md:flex md:space-x-4 space-y-1 md:space-y-0">
              <button id="cancleOrderBtn" class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 w-full">
                Cancle Order
              </button>
              
              <button id="confirmOrderBtn" class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 w-full">
                Confirm/Delivered
              </button>
            </div>

          </div>
    `

    ordersList.innerHTML += ordersDisplay
    
    
    const cancleOrderBtn = document.getElementById('cancleOrderBtn')

    cancleOrderBtn.addEventListener('click', (e) => {
      // console.log(e.target.closest('.ordersIdClass').dataset.id);
      
      const deleteMenuOrderId = e.target.closest('.ordersIdClass').dataset.id
      cancleUserOrders(deleteMenuOrderId)
    })

    const confirmOrderBtn = document.getElementById('confirmOrderBtn')

    confirmOrderBtn.addEventListener('click', (e) => {
      const confirmMenuOrderId = e.target.closest('.ordersIdClass').dataset.id
      confirmUserOrders(confirmMenuOrderId)
    })
    

    })

    
    
  } catch (error) {
    console.log(error);
  }
}

const cancleUserOrders = async (menuOrderId) => {
  try {
    const response = await fetch(`/doveeysKitchen/order/adminCancleOrder/${menuOrderId}`, {
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
    const response = await fetch(`/doveeysKitchen/order/adminConfirmOrder/${menuOrderId}`, {
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