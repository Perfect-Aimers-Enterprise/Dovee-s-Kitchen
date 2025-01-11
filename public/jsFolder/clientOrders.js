// config.js
const config2 = {
    apiUrl: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:3000'
      : `${window.location.protocol}//${window.location.hostname}`
  };

document.addEventListener('DOMContentLoaded', ()=> {
    getAllMenuProductFunc()
    populateUserProceedOrder()
})

// 

const menuGridClass = document.querySelector('.menuGridClass')

const getAllMenuProductFunc = async () => {
    // e.preventDefault()

    

    try {
        const getAllMenuProductResponse = await fetch(`${config2.apiUrl}/doveeysKitchen/product/getMenuProducts`)
        console.log(getAllMenuProductResponse);
        
        const data = await getAllMenuProductResponse.json()
        console.log(data);
        menuGridClass.innerHTML = ''        

        data.forEach((eachData) => {
            // console.log(eachData._id);
            
            const eachDataId = eachData._id
            
            const allMenuGridProduct = `
            <div class="border rounded-lg shadow-lg p-4 bg-white text-black menu-item" data-id="${eachDataId}">
                <img src="/image/menuImage/${eachData.menuImage}" alt="Jollof Rice" class="w-full h-48 object-cover rounded">
                <h3 class="mt-4 text-xl font-semibold">${eachData.menuProductName}</h3>
                <p class="text-gray-600">${eachData.menuDescription}</p>
                <p class="mt-2 text-green-700 font-bold">₦${eachData.menuPrice}</p>
                <button id="orderNowButton" class="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 w-full">Order Now</button>
            </div>
        `

        // console.log(allMenuGridProduct);
        
        menuGridClass.innerHTML += allMenuGridProduct
        // menuGridClass.append(allMenuGridProduct)

        // console.log(menuGridClass);
        })

        setTimeout(() => {
            const menuItems = document.querySelectorAll('.menu-item');
            menuItems.forEach((item) => {
                item.classList.add('visible');
            });
        }, 100);
        
        const orderNowButton = document.querySelectorAll('#orderNowButton')
        // console.log(orderNowButton);
        
        orderNowButton.forEach((eachOrderNowButton) => {
            eachOrderNowButton.addEventListener('click', (e) => {
                const token = localStorage.getItem('token')
                if (!token) {
                    return alert('Please Register or Login an account')
                }
                const menuProductId = e.target.closest('.menu-item').dataset.id
                fetchSingleProductFunc(menuProductId)
                
            })
        })


    } catch (error) {
        
    }
}

const fetchSingleProductFunc = async (menuProductId) => {

    // console.log('fetch', eachData);
    // console.log('id', menuProductId);
  
    try {
      const fetchSingleProductResponse = await fetch(`${config2.apiUrl}/doveeysKitchen/product/getSingleMenuProduct/${menuProductId}`)
  
    // console.log(fetchSingleProductResponse);
  
      const data = await fetchSingleProductResponse.json()
    //   console.log(data);

      const menuProductOrderImage = data.menuImage
      const menuProductOrderName = data.menuProductName
      const menuProductOrderDescription = data.menuDescription
      const menuProductOrderPrice = data.menuPrice

      localStorage.setItem('menuProductOrderImage', menuProductOrderImage)
      localStorage.setItem('menuProductOrderName', menuProductOrderName)
      localStorage.setItem('menuProductOrderDescription', menuProductOrderDescription)
      localStorage.setItem('menuProductOrderPrice', menuProductOrderPrice)

      window.location.href = '../htmlFolder/orderDetailsPage.html'

    } catch (error) {
      console.log(error);
      
    }}

    // console.log(fetchSingleProductFunc);

const orderPage = document.getElementById('orderPage')

const populateUserProceedOrder = () => {
    // e.preventDefault()

    orderPage.innerHTML = ''

    const proceedOrderImg = localStorage.getItem('menuProductOrderImage')
    const proceedOrderName = localStorage.getItem('menuProductOrderName')
    const proceedOrderPrice = parseFloat(localStorage.getItem('menuProductOrderPrice'));
    

    const userProceedOrder = `
            <form id="userProceedOrderId" class="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
            <h2 class="text-2xl font-bold text-gray-700 mb-4">Order Details</h2>

            <!-- Product Image -->
            <div class="mb-4">
                <img id="orderProceedImage" src="../image/menuImage/${proceedOrderImg}" alt="Product Image" class="rounded-lg w-full">
            </div>

            <!-- Product Name -->
            <div class="mb-4">
                <p id="orderProceedName" class="text-lg font-semibold text-gray-800">Name: <span class="text-green-500">${proceedOrderName}</span></p>
            </div>

            <!-- Product Price -->
            <div class="mb-4">
                <p id="orderProceedPrice" class="text-lg font-semibold text-gray-800">Price: <span class="text-green-500">&#8358 ${proceedOrderPrice}</span></p>
            </div>

            <!-- Address Input -->
            <div class="mb-4">
                <label for="address" class="block text-gray-600 font-medium mb-1">Delivery Address</label>
                <input id="orderProceedAddress" type="text" id="address" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 inputProceed" placeholder="Enter your address">
            </div>

            <!-- Delivery Contact Input -->
            <div class="mb-4">
                <label for="deliveryContact" class="block text-gray-600 font-medium mb-1">Delivery Contact</label>
                <input type="tel" id="deliveryContact" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 inputProceed" placeholder="Enter your contact">
            </div>

            <!-- Quantity Input -->
            <div class="mb-4">
                <label for="quantity" class="block text-gray-600 font-medium mb-1">Quantity</label>
                <input type="number" id="quantity" min="1" value="1" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 inputProceed">
            </div>

            <!-- Total Price -->
            <div class="mb-4">
                <p id="totalPrice" class="text-lg font-semibold text-gray-800">Total Price: <span class="text-green-500">&#8358 </span></p>
            </div>

            <!-- Terms and Conditions -->
            <div class="mb-6">
                <label class="inline-flex items-center">
                    <input type="checkbox" id="terms" class="form-checkbox h-5 w-5 text-green-600">
                    <span id="termsCondition" class="ml-2 text-gray-700">I agree to the <a href="#" class="text-blue-500">Terms and Conditions</a></span>
                </label>
            </div>

            <!-- Proceed Button -->
            <button id="proceedButton" class="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed" disabled>Proceed to Order</button>
        </form>
        `

        orderPage.innerHTML = userProceedOrder

    const terms_condition = `
                <div class="fixed inset-0 z-50 bg-white text-black">
            <section class="w-[90%] mx-auto md:w-[80%] lg:w-[70%] bg-white p-4 rounded-lg shadow-lg">
            <h1 class="font-bold text-lg">📝 Terms and Conditions for Placing Orders</h1>

            <p class="text-black goBack"><i class="fas fa-arrow-left"></i> back </p>
            
            <!-- Scrollable container -->
            <div class="mt-4 max-h-64 overflow-y-scroll relative border-t border-gray-300 pt-4">
                <ul class="list-disc list-inside space-y-6"> 
                <li>
                    <h2 class="font-semibold text-gray-800">🚚 Payment on Delivery</h2>
                    <p>💳 Payment will only be accepted upon delivery of your order.</p>
                    <p>🚪 Please ensure someone is available at your delivery address to make the payment.</p>
                    <p>💵 Accepted payment methods include cash or mobile transfer at the time of delivery.</p>
                </li>
            
                <li>
                    <h2 class="font-semibold text-gray-800">⚠️ Important Notes</h2>
                    <p>📍 Delivery Address: Ensure the address provided is correct to avoid delays.</p>
                    <p>⏱️ Delivery Time: Deliveries will be made within the estimated timeframe provided when you place your order.</p>
                    <p>🚫 Cancellations: Orders cannot be canceled once they are en route for delivery.</p>
                    <p>🤝 Acceptance Policy: By placing an order, you agree to our payment-on-delivery policy.</p>
                </li>
            
                <li>
                    <h2 class="font-semibold text-gray-800">📦 Order Verification</h2>
                    <p>📝 Upon delivery, please inspect your order for accuracy. If there are any issues, notify the delivery personnel immediately.</p>
                    <p>👍 Once payment is made, it indicates acceptance of the order as delivered.</p>
                </li>
            
                <li>
                    <h2 class="font-semibold text-gray-800">🛠️ Support and Assistance</h2>
                    <p>📞 For any questions or issues, please contact our support team at <span class="font-bold">+234 803 096 2601</span> before completing your order.</p>
                </li>
            
                <li>
                    <h2 class="font-semibold text-gray-800">💡 Why Payment on Delivery?</h2>
                    <p>
                    We want to ensure your satisfaction and trust by letting you inspect your order before payment. This policy is
                    designed for your convenience and peace of mind.
                    </p>
                    <p>Thank you for choosing <span class="font-bold">Doveeys Kitchen!</span> We look forward to serving you. 🥳</p>
                    <p>By placing your order, you agree to these terms and conditions. ✅</p>
                </li>
                </ul>
            </div>
            </section>
            
        </div>
    `

    const proceedButton = document.getElementById('proceedButton');
    const termsCheckbox = document.getElementById('terms');
            // const orderPage = document.getElementById('orderPage');
    termsCheckbox.addEventListener('change', () => {
        proceedButton.disabled = !termsCheckbox.checked;
    });

 
    const termsCondition = document.getElementById('termsCondition')

    termsCondition.addEventListener('click', () => {
        orderPage.innerHTML = terms_condition

        const goBack = document.querySelector('.goBack')
        goBackFunc(goBack)
    })

    
    
const goBackFunc = (goBack) => {
    goBack.addEventListener('click', () => {
        orderPage.innerHTML = userProceedOrder
    })
}
    


    const orderProceedAddress = document.getElementById('orderProceedAddress')
    const quantityInput = document.getElementById('quantity');
    const totalPriceElement = document.getElementById('totalPrice');
    const deliveryContact = document.getElementById('deliveryContact')

    
    quantityInput.addEventListener('input', () => {
        const quantity = parseInt(quantityInput.value, 10) || 1; // Default to 1 if input is invalid
        const totalPrice = proceedOrderPrice * quantity;
        totalPriceElement.textContent = totalPrice.toFixed(2); // Update the displayed total price
    });

    

    proceedButton.addEventListener('click', async (e) => {
        e.preventDefault()

        const validateInputProvision = document.querySelectorAll('#userProceedOrderId .inputProceed')

        // Validate inputs and stop execution if any are empty
        const hasEmptyInput = Array.from(validateInputProvision).some((inputProvision) => {
            if (!inputProvision.value) {
                alert('Please provide all information');
                return true; // Stop further validation
            }
            return false;
        });

        if (hasEmptyInput) return;


        
        orderPage.classList.add('hidden');

        const token = localStorage.getItem('token')
        const userName = localStorage.getItem('userName')
        const userEmail = localStorage.getItem('userEmail')
        const userPhone = localStorage.getItem('userPhone')
        
        if (!token) {
            return alert('Please Register or Login an account')
        }

        const formData = {
            menuProductOrderImage: `../image/menuImage/${proceedOrderImg}`,
            menuProductOrderName: proceedOrderName,
            menuProductOrderPrice: proceedOrderPrice,
            menuTotalProductOrderPrice: proceedOrderPrice * quantity.value,
            menuProductOrderAddress: orderProceedAddress.value,
            menuProductOrderContact: deliveryContact.value,
            menuProductOrderQuantity: quantity.value,
            userName,
            userEmail,
            userPhone
        }

        await userProceedOrderFunc(formData)
    })
}

const userProceedOrderFunc = async (formData) => {
    const orderPopUpAlert = document.getElementById('orderPopUpAlert')
    try {
        const userProceedResponse = await fetch(`${config2.apiUrl}/doveeysKitchen/order/createProceedOrder`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })


        console.log(userProceedResponse);
        
        const data = await userProceedResponse.json()
        // console.log(data);
        // alert('orderPlaced Successfully')
        orderPopUpAlert.classList.remove('hidden')
        
    } catch (error) {
        console.log(error);
        
    }
}