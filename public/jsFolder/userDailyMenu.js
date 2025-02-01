const configuration = {
    apiUrl: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:3000'
      : `${window.location.protocol}//${window.location.hostname}`
  };

document.addEventListener('DOMContentLoaded', () => {
    getAllDailyMenus()
    populateUserProceedOrderFunc()
})

// Function to get all daily menus
async function getAllDailyMenus() {

    const dailyMenuDishCards = document.getElementById('dailyMenuDishCards')
  
      try {
          const response = await fetch(`${configuration.apiUrl}/dailyMenuDisplay/allDailyMenu`);
          const data = await response.json();
  
          dailyMenuDishCards.innerHTML = ''
          data.forEach((eachData) => {
  
            const eachDailyMenuId = eachData._id

            const populateMenuDish = `
                <div id="dailyMenuEachData" class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg" data-id="${eachDailyMenuId}">
                    <img src="../image/dailyMenu/${eachData.menuImage}" alt="Grilled Chicken" class="rounded-lg w-full h-80 object-cover">
                    <h4 class="mt-4 text-xl font-semibold">${eachData.menuTitle}</h4>
                    <p class="mt-2 text-gray-600">₦${eachData.price}</p>
                    
                    <button class="mt-6 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 w-full dailyMenuDishOrder">Order Now</button>
                </div>
            `
  
            dailyMenuDishCards.innerHTML += populateMenuDish
  
            const dailyMenuDishOrder = document.querySelectorAll('.dailyMenuDishOrder')
  
            dailyMenuDishOrder.forEach((eachDailyMenuDishOrder) => {
                eachDailyMenuDishOrder.addEventListener('click', (e) => {
                const eachDailyMenuData = e.target.closest('#dailyMenuEachData').dataset.id
                getSingleDailyMenu(eachDailyMenuData)
              })
            })
            
  
          })
      } catch (error) {
          console.error("Error fetching daily menus:", error);
      }
  }

  // Function to get a single daily menu by ID
async function getSingleDailyMenu(eachDailyMenuData) {

      try {
          const response = await fetch(`${configuration.apiUrl}/dailyMenuDisplay/eachDailyMenu/${eachDailyMenuData}`);
          const data = await response.json();
          console.log("Single Daily Menu:", data);
          
          localStorage.setItem('menuImage', data.menuImage)
          localStorage.setItem('menuTitle', data.menuTitle)
          localStorage.setItem('price', data.price)

          window.location.href = '../htmlFolder/orderDetailsPage.html'

      } catch (error) {
          console.error("Error fetching daily menu:", error);
      }
  }
  
  const populateUserProceedOrderFunc = () => {
    const menuProductOrderImage = localStorage.getItem('menuImage')
    const menuProductOrderName = localStorage.getItem('menuTitle')
    const menuProductOrderPrice = localStorage.getItem('price')
    const token = localStorage.getItem('token')
    const userName = localStorage.getItem('userName')
    const userEmail = localStorage.getItem('userEmail')
    const userPhone = localStorage.getItem('userPhone')
    const orderPage = document.getElementById('orderPage')

    const userProceedOrder2 = `
            <form id="userProceedDailyMenuOrderId" class="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
            <h2 class="text-2xl font-bold text-gray-700 mb-4">Order Details</h2>

            <!-- Product Image -->
            <div class="mb-4 h-[400px] items-center justify-center overflow-hidden">
                <img id="orderProceedImage" src="../image/dailyMenu/${menuProductOrderImage}" alt="Product Image" class="rounded-lg w-full h-[400px]">
            </div>

            <!-- Product Name -->
            <div class="mb-4">
                <p id="orderProceedName" class="text-lg font-semibold text-gray-800">Name: <span class="text-green-500">${menuProductOrderName}</span></p>
            </div>

            <div class="mb-4">
                <p id="orderProceedPrice" class="text-lg font-semibold text-gray-800">Price: <span class="text-green-500">&#8358;${menuProductOrderPrice}</span></p>
            </div>

             <!-- Product Price -->
            

            <!-- Address Input -->
            <div class="mb-4">
                <label for="address" class="block text-gray-600 font-medium mb-1">Delivery Address</label>
                <input id="dailyMenuOrderProceedAddress" type="text" id="address" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 inputProceed" placeholder="Enter your address">
            </div>

            <!-- Delivery Contact Input -->
            <div class="mb-4">
                <label for="dailyMenuDeliveryContact" class="block text-gray-600 font-medium mb-1">Delivery Contact</label>
                <input type="tel" id="dailyMenuDeliveryContact" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 inputProceed" placeholder="Enter your contact">
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

        const terms_condition = `
                <div class="fixed inset-0 z-50 bg-white text-black">
            <section class="w-[90%] mx-auto md:w-[80%] lg:w-[70%] bg-white p-4 rounded-lg shadow-lg">
            <h1 class="font-bold text-lg">📝 Terms and Conditions for Placing Orders</h1>

            <p class="text-black goBack2"><i class="fas fa-arrow-left"></i> back </p>
            
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

        orderPage.innerHTML = userProceedOrder2
        const quantity = document.getElementById('quantity')
        const termsCheckbox = document.getElementById('terms');
        const termsCondition = document.getElementById('termsCondition')
        const dailyMenuOrderProceedAddress = document.getElementById('dailyMenuOrderProceedAddress')
        const dailyMenuDeliveryContact = document.getElementById('dailyMenuDeliveryContact')


        termsCondition.addEventListener('click', () => {
            orderPage.innerHTML = terms_condition

            const goBack2 = document.querySelector('.goBack2')
            goBackFunc(goBack2)
        })

        
        
        const goBackFunc = (goBack2) => {
            goBack2.addEventListener('click', () => {
                orderPage.innerHTML = userProceedOrder2
                populateUserProceedOrderFunc()
            })
        }

        termsCheckbox.addEventListener('change', () => {
            proceedButton.disabled = !termsCheckbox.checked;
        });

        quantity.addEventListener('input', () => {
            const totalPrice = menuProductOrderPrice * parseInt(quantity.value || 1, 10);
            document.getElementById('totalPrice').innerHTML = `Total Price: <span class="text-green-500">&#8358;${totalPrice.toFixed(2)}</span>`;
        });

        const proceedButton = document.getElementById('proceedButton')

        proceedButton.addEventListener('click', async (e) => {

            e.preventDefault()
            // if(!token) {
            //     return alert('Please Register an Account')
            // }

            const formData = {
                menuProductOrderImage: `../image/menuImage/${menuProductOrderImage}`,
                menuProductOrderName,
                menuProductOrderPrice,
                menuTotalProductOrderPrice: menuProductOrderPrice * quantity.value,
                menuProductOrderAddress: dailyMenuOrderProceedAddress.value,
                menuProductOrderContact: dailyMenuDeliveryContact.value,
                menuProductOrderQuantity: quantity.value,
                userName,
                userEmail,
                userPhone,
               
            }

            console.log(formData);
            await dailyMenuUserProceedOrderFunc(formData)
            
        })
   
  }

  const dailyMenuUserProceedOrderFunc = async (formData) => {
    const orderPopUpAlert = document.getElementById('orderPopUpAlert')
    try {
        const userProceedResponse = await fetch(`${configuration.apiUrl}/doveeysKitchen/order/createProceedOrder`, {
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
