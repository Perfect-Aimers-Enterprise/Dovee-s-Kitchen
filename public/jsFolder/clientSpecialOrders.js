const config = {
    apiUrl: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:3000'
      : `${window.location.protocol}//${window.location.hostname}`
  };

document.addEventListener('DOMContentLoaded', ()=> {
    getAllClientProductFunc()
    populateSpecialProductFunc()
})

const getAllClientProductFunc = async () => {
    const specialGridClass = document.querySelector('.specialGridClass')
    specialGridClass.innerHTML = ''

    try {
        const response = await fetch(`${config.apiUrl}/doveeysKitchen/specialProduct/getSpecialProducts`)

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
                    return alert('Please Register or Login an account')
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
        const response = await fetch(`${config.apiUrl}/doveeysKitchen/specialProduct/getSingleSpecialProduct/${specialProductId}`)

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
        
        window.location.href = '/public/htmlFolder/specialOrderDetails.html'
        
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
                <input type="text" id="specialAddress" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Enter your address">
            </div>

            <!-- Quantity Input -->
            <div class="mb-4">
                <label for="quantity" class="block text-gray-600 font-medium mb-1">Quantity</label>
                <input type="number" id="specialQuantity" min="1" value="1" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400">
            </div>

             <!-- Total Price -->
            <div class="mb-4">
                <p id="totalPrice" class="text-lg font-semibold text-gray-800">Total Price: <span class="text-green-500">&#8358 </span></p>
            </div>

            <!-- Terms and Conditions -->
            <div class="mb-6">
                <label class="inline-flex items-center">
                    <input type="checkbox" id="terms" class="form-checkbox h-5 w-5 text-green-600">
                    <span class="ml-2 text-gray-700">I agree to the <a href="#" class="text-blue-500">Terms and Conditions</a></span>
                </label>
            </div>

            <!-- Proceed Button -->
            <button id="proceedButton" class="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed" disabled>Proceed to Order</button>
        </div>
    `;

    specialOrderPage.innerHTML = populateSpecialVar

    const specialAddress = document.getElementById('specialAddress')

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

    proceedButton.addEventListener('click', () => {
        specialOrderPage.classList.add('hidden');
        // statusPage.classList.remove('hidden');
    });


    proceedButton.addEventListener('click', async (e) => {
        e.preventDefault()
        
        const token = localStorage.getItem('token')
        const userName = localStorage.getItem('userName')
        const userEmail = localStorage.getItem('userEmail')
        const userPhone = localStorage.getItem('userPhone')
        
        if (!token) {
            return alert('Please Register or Login an account')
        }

        const formData = {
            menuProductOrderImage: `../image/specialImage/${specialImage}`,
            menuProductOrderName: specialProductName,
            menuProductOrderPrice: specialPrice,
            menuTotalProductOrderPrice: specialPrice * specialQuantity.value,
            menuProductOrderAddress: specialAddress.value,
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
        const response = await fetch(`${config.apiUrl}/doveeysKitchen/order/createProceedOrder`, {
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