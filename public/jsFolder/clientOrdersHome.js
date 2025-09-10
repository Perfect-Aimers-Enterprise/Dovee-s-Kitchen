

const urls = {
    apiUrl: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000'
        : `${window.location.protocol}//${window.location.hostname}`
};

document.addEventListener('DOMContentLoaded', () => {
    getAllMenuProductFunc()
    // populateUserProceedOrder()

    // fetchUserGallery()


})

const menuGridClass = document.querySelector('.menuGridClassHome')
const loader = document.getElementById("preloaderOrder")

const getAllMenuProductFunc = async () => {
    loader.classList.remove('hidden')
    try {
        const getAllMenuProductResponse = await fetch(`${urls.apiUrl}/doveeysKitchen/product/getMenuProducts`);
        console.log(getAllMenuProductResponse);

        const data = await getAllMenuProductResponse.json();
        console.log(data);
        menuGridClass.innerHTML = '';

        // 🔀 Shuffle array
        const shuffledData = data.sort(() => Math.random() - 0.5);

        // 🎯 Limit to 10 items
        const limitedData = shuffledData.slice(0, 5);

        limitedData.forEach((eachData) => {
            const eachDataId = eachData._id;
            let productContent = '';

            if (eachData.menuPrice && (!eachData.variations || eachData.variations.length === 0 || isAllVariationsInvalid(eachData.variations))) {

                productContent = `
                    <div class="border rounded-lg shadow-lg p-4 bg-white text-black menu-item" data-id="${eachDataId}">
                        <img src="../image/menuImage/${eachData.menuImage}" alt="${eachData.menuProductName}" class="w-full h-48 object-cover rounded">
                        <h3 class="mt-4 text-xl font-semibold">${eachData.menuProductName}</h3>
                        <p class="text-gray-600">${eachData.menuDescription}</p>
                        <p class="mt-2 text-green-700 font-bold">₦${eachData.menuPrice}</p>
                        <button class="orderNowButton mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 w-full">Order Now</button>
                    </div>
                `;
            } else if (eachData.variations && eachData.variations.length > 0) {
                const firstVariationPrice = eachData.variations[0].price;

                productContent = `
                     <div class="border rounded-lg shadow-lg p-4 bg-white text-black menu-item" data-id="${eachDataId}">
                         <img src="../image/menuImage/${eachData.menuImage}" alt="${eachData.menuProductName}" class="w-full h-48 object-cover rounded">
                         <h3 class="mt-4 text-xl font-semibold">${eachData.menuProductName}</h3>
                         <p class="text-gray-600">${eachData.menuDescription}</p>
                         <p class="mt-2 text-green-700 font-bold">₦${firstVariationPrice}</p>
                         <button class="orderNowButton mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 w-full">Order Now</button>
                     </div>
                 `;
            }

            menuGridClass.innerHTML += productContent;
        });

        setTimeout(() => {
            const menuItems = document.querySelectorAll('.menu-item');
            menuItems.forEach((item) => {
                item.classList.add('visible');
            });
        }, 100);

        // ✅ Fix querySelectorAll to avoid duplicate IDs
        const orderNowButtons = document.querySelectorAll('.orderNowButton');

        orderNowButtons.forEach((eachOrderNowButton) => {
            eachOrderNowButton.addEventListener('click', (e) => {
                const token = localStorage.getItem('token');
                if (!token) {
                    return navigationPopUp.classList.remove('hidden')
                }
                const menuProductId = e.target.closest('.menu-item').dataset.id;
                fetchSingleProductFunc(menuProductId);
            });
        });

    } catch (error) {
        console.error(error);
    } finally {
        document.getElementById("preloaderOrder").classList.add('hidden')
    }
};



const fetchSingleProductFunc = async (menuProductId) => {


    try {
        const fetchSingleProductResponse = await fetch(`${urls.apiUrl}/doveeysKitchen/product/getSingleMenuProduct/${menuProductId}`)

        // console.log(fetchSingleProductResponse);

        const data = await fetchSingleProductResponse.json()
        console.log('Testing Data String', data);

        const menuProductOrderImage = data.menuImage
        const menuProductOrderName = data.menuProductName
        const menuProductOrderDescription = data.menuDescription
        const menuProductOrderPrice = data.menuPrice
        const menuProductVariations = data.variations || []; // Check if variations exist

        console.log(menuProductVariations);


        localStorage.setItem('menuProductOrderImage', menuProductOrderImage)
        localStorage.setItem('menuProductOrderName', menuProductOrderName)
        localStorage.setItem('menuProductOrderDescription', menuProductOrderDescription)
        localStorage.setItem('menuProductOrderPrice', menuProductOrderPrice)
        localStorage.setItem('menuProductVariations', JSON.stringify(menuProductVariations));

        window.location.href = '../htmlFolder/orderDetailsPage.html'

    } catch (error) {
        console.log(error);

    }
}


// Helper function to check if all variations are invalid
function isAllVariationsInvalid(variations) {
    return variations.every((variation) => !variation.size || variation.price === null);
}