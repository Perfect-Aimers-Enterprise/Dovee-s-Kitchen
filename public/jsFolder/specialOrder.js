document.addEventListener('DOMContentLoaded', () => {

  getAllAdminSpecialProductsFunc()

})

const specialProductForm = document.getElementById('specialProductForm')
const specialProductList = document.getElementById('specialProductList')


// http://localhost:3000

specialProductForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const specialProductTarget = e.target
    const formData = new FormData(specialProductTarget)

    try {
        const response = await fetch('/doveeysKitchen/specialProduct/createSpecialProduct', {
            method: 'POST',
            body: formData
        })

        console.log(response);
        
        const data = await response.json()
        console.log(data);
        
    } catch (error) {
        console.log(error);
        
    }
})

const getAllAdminSpecialProductsFunc = async (e) => {
    // e.preventDefault()

    try {
        const response = await fetch('/doveeysKitchen/specialProduct/getSpecialProducts')

        const data = await response.json()

        console.log(data);
        
        specialProductList.innerHTML = ''

        data.forEach((eachData) => {

          const specialProductFormat = `
            <div class="flex items-center justify-between border rounded-lg shadow-md p-4">
            <div class="flex items-center space-x-4">
              <img src="../image/specialImage/${eachData.specialImage}" alt="Chicken Suya" class="w-16 h-16 object-cover rounded">
              <div>
                <h4 class="font-semibold">${eachData.specialProductName}</h4>
                <p class="text-sm text-gray-600">₦${eachData.specialPrice}</p>
              </div>
            </div>
            <div class="flex space-x-2">
              <button class="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600">
                <p class="hidden md:block">Edit</p>
                <i class="fas fa-pencil-alt md:hidden"></i>
              </button>
              <button class="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">
                <p class="hidden md:block">Delete</p>
                <i class="fas fa-trash md:hidden"></i>
              </button>
            </div>
          </div>
        `

        specialProductList.innerHTML += specialProductFormat
        })

        
    } catch (error) {
      console.log(error);
      
    }
}