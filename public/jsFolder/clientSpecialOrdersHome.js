const urlss = {
    apiUrl: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000'
        : `${window.location.protocol}//${window.location.hostname}`
};

document.addEventListener('DOMContentLoaded', () => {
    getAllClientProductFunc()
    // populateSpecialProductFunc()
})

const specialNavigationPopUp = document.getElementById('specialNavigationPopUp')
const preloaderSpecial = document.getElementById("preloaderOrder")
const specialGridClass = document.querySelector('.specialGridClassHome')

const getAllClientProductFunc = async () => {
    preloaderSpecial.classList.remove('hidden')
    specialGridClass.innerHTML = ''

    try {
        const response = await fetch(`${urlss.apiUrl}/doveeysKitchen/specialProduct/getSpecialProducts`)
        const data = await response.json()

        // 🔀 Shuffle array
        const shuffledData = data.sort(() => Math.random() - 0.5);

        // 🎯 Limit to 10 items
        const limitedData = shuffledData.slice(0, 5);

        limitedData.forEach((eachSpecialData) => {
            const eachSpecialDataId = eachSpecialData._id
            let productContent = ''

            if (eachSpecialData.specialPrice && (!eachSpecialData.variations || eachSpecialData.variations.length === 0 || isAllVariationsInvalid(eachSpecialData.variations))) {
                productContent = `
                    <div class="border rounded-lg shadow-lg p-4 bg-white text-black special-item" data-id="${eachSpecialDataId}">
                        <img src="../image/specialImage/${eachSpecialData.specialImage}" alt="${eachSpecialData.specialProductName}" class="w-full h-48 object-cover rounded">
                        <h3 class="mt-4 text-xl font-semibold">${eachSpecialData.specialProductName}</h3>
                        <p class="text-gray-600">${eachSpecialData.specialDescription}</p>
                        <p class="mt-2 text-green-700 font-bold">₦${eachSpecialData.specialPrice}</p>
                        <button class="orderSpecialProductNow mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 w-full">Order Now</button>
                    </div>
                `
            } else if (eachSpecialData.variations && eachSpecialData.variations.length > 0) {
                const firstSpecialVariationPrice = eachSpecialData.variations[0].price;

                productContent = `
                     <div class="border rounded-lg shadow-lg p-4 bg-white text-black special-item" data-id="${eachSpecialDataId}">
                         <img src="../image/specialImage/${eachSpecialData.specialImage}" alt="${eachSpecialData.specialProductName}" class="w-full h-48 object-cover rounded">
                         <h3 class="mt-4 text-xl font-semibold">${eachSpecialData.specialProductName}</h3>
                         <p class="text-gray-600">${eachSpecialData.specialDescription}</p>
                         <p class="mt-2 text-green-700 font-bold">₦${firstSpecialVariationPrice}</p>
                         <button class="orderSpecialProductNow mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 w-full">Order Now</button>
                     </div>
                 `
            }

            specialGridClass.innerHTML += productContent
        })

        setTimeout(() => {
            const specialItems = document.querySelectorAll('.special-item');
            specialItems.forEach((item) => {
                item.classList.add('visible');
            });
        }, 100);

        // ✅ Use class instead of duplicate ID
        const orderSpecialProductButtons = document.querySelectorAll('.orderSpecialProductNow')

        orderSpecialProductButtons.forEach((eachOrderSpecialProductNow) => {
            eachOrderSpecialProductNow.addEventListener('click', (e) => {
                const token = localStorage.getItem('token')
                if (!token) {
                    return specialNavigationPopUp.classList.remove('hidden')
                }
                const specialProductId = e.target.closest('.special-item').dataset.id
                getSingleClientProductFunc(specialProductId)
            })
        })

    } catch (error) {
        console.error(error);
    } finally {
        document.getElementById("preloaderSpecial").classList.add('hidden')
    }
}


const getSingleClientProductFunc = async (specialProductId) => {

    try {
        const response = await fetch(`${urlss.apiUrl}/doveeysKitchen/specialProduct/getSingleSpecialProduct/${specialProductId}`)

        console.log(response);

        const data = await response.json()

        console.log(data);

        const specialImageSingle = data.specialImage
        const specialProductNameSingle = data.specialProductName
        const specialDescriptionSingle = data.specialDescription
        const specialPriceSingle = data.specialPrice
        const specialProductVariations = data.variations || []; // Check if 

        localStorage.setItem('specialImageSingle', specialImageSingle)
        localStorage.setItem('specialProductNameSingle', specialProductNameSingle)
        localStorage.setItem('specialDescriptionSingle', specialDescriptionSingle)
        localStorage.setItem('specialPriceSingle', specialPriceSingle)
        localStorage.setItem('specialProductVariations', JSON.stringify(specialProductVariations))

        window.location.href = '../htmlFolder/specialOrderDetails.html'

    } catch (error) {
        console.log(error);

    }
}

// Helper function to check if all variations are invalid
function isAllVariationsInvalid(variations) {
    return variations.every((variation) => !variation.size || variation.price === null);
}