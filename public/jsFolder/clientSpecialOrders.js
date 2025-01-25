const config4 = {
    apiUrl: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:3000'
      : `${window.location.protocol}//${window.location.hostname}`
  };

document.addEventListener('DOMContentLoaded', ()=> {
    getAllClientProductFunc()
    populateSpecialProductFunc()
})

const specialNavigationPopUp = document.getElementById('specialNavigationPopUp')

const getAllClientProductFunc = async () => {
    const specialGridClass = document.querySelector('.specialGridClass')
    specialGridClass.innerHTML = ''

    try {
        const response = await fetch(`${config4.apiUrl}/doveeysKitchen/specialProduct/getSpecialProducts`)

        const data = await response.json()

        // console.log(data);

        data.forEach((eachSpecialData) => {
            // console.log(eachSpecialData);

            const eachSpecialDataId = eachSpecialData._id
            const clientSpecialVar = `
            <div class="border rounded-lg shadow-lg p-4 bg-white text-black special-item" data-id="${eachSpecialDataId}">
            <img src="../image/specialImage/${eachSpecialData.specialImage}" alt="Jollof Rice" class="w-full h-48 object-cover rounded">
            <h3 class="mt-4 text-xl font-semibold">${eachSpecialData.specialProductName}</h3>
            <p class="text-gray-600">${eachSpecialData.specialDescription}</p>
            <p class="mt-2 text-green-700 font-bold">₦${eachSpecialData.specialPrice}</p>
            <button id="orderSpecialProductNow" class="mt-4 bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 w-full ">Order Now</button>
            </div>
            `;

            specialGridClass.innerHTML += clientSpecialVar
        })

        setTimeout(() => {
            const specialItems = document.querySelectorAll('.special-item');
            specialItems.forEach((item) => {
                item.classList.add('visible');
            });
        }, 100);
        
        const orderSpecialProductNow = document.querySelectorAll('#orderSpecialProductNow')

        console.log(orderSpecialProductNow);
        

        orderSpecialProductNow.forEach((eachOrderSpecialProductNow) => {
            eachOrderSpecialProductNow.addEventListener('click', (e) => {
                // alert('hello')
                const token = localStorage.getItem('token')
                console.log(token);
                
                if (!token) {
                   return specialNavigationPopUp.classList.remove('hidden')
                }
                const specialProductId = e.target.closest('.special-item').dataset.id
                getSingleClientProductFunc(specialProductId)
                
            })
        })

    } catch (error) {
        
    }
}

const getSingleClientProductFunc = async (specialProductId) => {

    try {
        const response = await fetch(`${config4.apiUrl}/doveeysKitchen/specialProduct/getSingleSpecialProduct/${specialProductId}`)

        console.log(response);

        const data = await response.json()

        console.log(data);

        const specialImageSingle = data.specialImage
        const specialProductNameSingle = data.specialProductName
        const specialDescriptionSingle = data.specialDescription
        const specialPriceSingle = data.specialPrice

        localStorage.setItem('specialImageSingle', specialImageSingle)
        localStorage.setItem('specialProductNameSingle', specialProductNameSingle)
        localStorage.setItem('specialDescriptionSingle', specialDescriptionSingle)
        localStorage.setItem('specialPriceSingle', specialPriceSingle)
        
        window.location.href = '../htmlFolder/specialOrderDetails.html'
        
    } catch (error) {
        console.log(error);
        
    }
}

const populateSpecialProductFunc = () => {
    const specialOrderPage = document.getElementById('specialOrderPage')
    specialOrderPage.innerHTML = ''


        const specialImage = localStorage.getItem('specialImageSingle')
        console.log(specialImage);
        const specialProductName = localStorage.getItem('specialProductNameSingle')
        const specialDescription = localStorage.getItem('specialDescriptionSingle')
        const specialPrice = localStorage.getItem('specialPriceSingle')

        

    const populateSpecialVar = `
        <div class="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
            <h2 class="text-2xl font-bold text-gray-700 mb-4">Order Details</h2>

            <!-- Product Image -->
            <div class="mb-4">
                <img src="../image/specialImage/${specialImage}" alt="Product Image" class="rounded-lg w-full">
            </div>

            <!-- Product Name -->
            <div class="mb-4">
                <p class="text-lg font-semibold text-gray-800">Name: <span class="text-green-500">${specialProductName}</span></p>
            </div>

            <!-- Product Price -->
            <div class="mb-4">
                <p class="text-lg font-semibold text-gray-800">Price: <span class="text-green-500">&#8358 ${specialPrice}</span></p>
            </div>

            <!-- Address Input -->
            <div class="mb-4">
                <label for="address" class="block text-gray-600 font-medium mb-1">Delivery Address</label>
                <input type="text" id="specialAddress" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none inputProceed focus:ring-2 focus:ring-green-400" placeholder="Enter your address">
            </div>

            <!-- Delivery Contact Input -->
            <div class="mb-4">
                <label for="specialContact" class="block text-gray-600 font-medium mb-1">Delivery Contact</label>
                <input type="text" id="specialContact" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none inputProceed focus:ring-2 focus:ring-green-400" placeholder="Enter your Contact">
            </div>

            <!-- Quantity Input -->
            <div class="mb-4">
                <label for="quantity" class="block text-gray-600 font-medium mb-1">Quantity</label>
                <input type="number" id="specialQuantity" min="1" value="1" class="w-full inputProceed p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400">
            </div>

             <!-- Total Price -->
            <div class="mb-4">
                <p id="totalPrice" class="text-lg font-semibold text-gray-800">Total Price: <span class="text-green-500">&#8358 </span></p>
            </div>

            <!-- Terms and Conditions -->
            <div class="mb-6">
                <label class="inline-flex items-center">
                    <input type="checkbox" id="terms" class="form-checkbox h-5 w-5 text-green-600">
                    <span id="termsCondition2" class="ml-2 text-gray-700">I agree to the <a href="#" class="text-blue-500">Terms and Conditions</a></span>
                </label>
            </div>

            <!-- Proceed Button -->
            <button id="proceedButton" class="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed" disabled>Proceed to Order</button>
        </div>
    `;

    specialOrderPage.innerHTML = populateSpecialVar

    

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
                    <p>Thank you for choosing <span>Doveeys Kitchen!</span> We look forward to serving you. 🥳</p>
                    <p>By placing your order, you agree to these terms and conditions. ✅</p>
                </li>
                </ul>
            </div>
            </section>
            
        </div>
    `

    const termsCondition2 = document.getElementById('termsCondition2')

    termsCondition2.addEventListener('click', () => {
        specialOrderPage.innerHTML = terms_condition

        const goBack = document.querySelector('.goBack')
        goBackFunc(goBack)
    })

    
    
    const goBackFunc = (goBack) => {
        goBack.addEventListener('click', () => {
            specialOrderPage.innerHTML = populateSpecialVar
        })
    }


    const specialAddress = document.getElementById('specialAddress')
    const specialContact = document.getElementById('specialContact')
    const specialQuantity = document.getElementById('specialQuantity')


    // const quantityInput = document.getElementById('quantity');
    const totalPriceElement = document.getElementById('totalPrice');

    
    specialQuantity.addEventListener('input', () => {
        const quantity = parseInt(specialQuantity.value, 10) || 1; // Default to 1 if input is invalid
        const totalPrice = specialPrice * quantity;
        totalPriceElement.textContent = totalPrice.toFixed(2); // Update the displayed total price
    });

    const proceedButton = document.getElementById('proceedButton');
    const termsCheckbox = document.getElementById('terms');
    termsCheckbox.addEventListener('change', () => {
        proceedButton.disabled = !termsCheckbox.checked;
    });



    proceedButton.addEventListener('click', async (e) => {
        e.preventDefault()

        const validateInputProvision = document.querySelectorAll('.inputProceed')

        // Validate inputs and stop execution if any are empty
        const hasEmptyInput = Array.from(validateInputProvision).some((inputProvision) => {
            if (!inputProvision.value) {
                alert('Please provide all information');
                return true; // Stop further validation
            }
            return false;
        });

        if (hasEmptyInput) return;

        specialOrderPage.classList.add('hidden');
        
        const token = localStorage.getItem('token')
        const userName = localStorage.getItem('userName')
        const userEmail = localStorage.getItem('userEmail')
        const userPhone = localStorage.getItem('userPhone')
        
        if (!token) {
            return specialNavigationPopUp.classList.remove('hidden')
        }

        const formData = {
            menuProductOrderImage: `../image/specialImage/${specialImage}`,
            menuProductOrderName: specialProductName,
            menuProductOrderPrice: specialPrice,
            menuTotalProductOrderPrice: specialPrice * specialQuantity.value,
            menuProductOrderAddress: specialAddress.value,
            menuProductOrderContact: specialContact.value,
            menuProductOrderQuantity: specialQuantity.value,
            userName,
            userEmail,
            userPhone
        }

        await userProceedSpecialOrderFunc(formData)
    })
}

const userProceedSpecialOrderFunc = async (formData) => {
    try {
        const response = await fetch(`${config4.apiUrl}/doveeysKitchen/order/createProceedOrder`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })

        const specialOrderPopUpAlert = document.getElementById('specialOrderPopUpAlert')
        specialOrderPopUpAlert.classList.remove('hidden')
    } catch (error) {
        console.log(error);
        
    }
}