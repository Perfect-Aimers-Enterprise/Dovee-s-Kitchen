const config4 = {
  apiUrl: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : `${window.location.protocol}//${window.location.hostname}`
};


document.addEventListener('DOMContentLoaded', () => {

  getAllAdminSpecialProductsFunc()

})

const specialProductForm = document.getElementById('specialProductForm')
const specialProductList = document.getElementById('specialProductList')


// 

specialProductForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const specialProductTarget = e.target
    const formData = new FormData(specialProductTarget)

    try {
        const response = await fetch(`${config4.apiUrl}/doveeysKitchen/specialProduct/createSpecialProduct`, {
            method: 'POST',
            body: formData
        })

        console.log(response);
        
        if (response.ok) {
          alert('Special Product created successfully!');
          getAllAdminSpecialProductsFunc()
        } else {
          alert('Failed to create special product.');
        }

        const data = await response.json()
        console.log(data);
        
    } catch (error) {
        console.log(error);
        
    }
})

const getAllAdminSpecialProductsFunc = async (e) => {
    // e.preventDefault()

    try {
        const response = await fetch(`${config4.apiUrl}/doveeysKitchen/specialProduct/getSpecialProducts`)

        const data = await response.json()

        // console.log(data);
        
        specialProductList.innerHTML = ''

        data.forEach((eachData) => {

          console.log('special order line 43', eachData);
          

          const specialProductFormat = `
            <div class="flex items-center justify-between border rounded-lg shadow-md p-4 specialProductDiv" data-id="${eachData._id}">
            <div class="flex items-center space-x-4">
              <img src="../image/specialImage/${eachData.specialImage}" alt="Chicken Suya" class="w-16 h-16 object-cover rounded">
              <div>
                <h4 class="font-semibold">${eachData.specialProductName}</h4>
                <p class="text-sm text-gray-600">₦${eachData.specialPrice}</p>
              </div>
            </div>
            <div class="flex space-x-2">
              <button class="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 specialEditBtn">
                <p class="hidden md:block">Edit</p>
                <i class="fas fa-pencil-alt md:hidden"></i>
              </button>
              <button class="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 specialDeleteBtn">
                <p class="hidden md:block">Delete</p>
                <i class="fas fa-trash md:hidden"></i>
              </button>
            </div>
          </div>
        `

        specialProductList.innerHTML += specialProductFormat
        })

        attachEventListeners()
        
    } catch (error) {
      console.log(error);
      
    }
}

const attachEventListeners = async (e) => {


  const specialEditBtn = document.querySelectorAll('.specialEditBtn')
  console.log(specialEditBtn);
  

  specialEditBtn.forEach((button) => {
    button.addEventListener('click', (e) => {
      const specialProductId = e.target.closest('.specialProductDiv').dataset.id

      fetchSingleSpecialProduct(specialProductId)
    })
  })

  const specialDeleteBtn = document.querySelectorAll('.specialDeleteBtn')

  specialDeleteBtn.forEach((button) => {
    button.addEventListener('click', (e) => {
      const specialProductId = e.target.closest('.specialProductDiv').dataset.id

      deleteSpecialProduct(specialProductId)
    })
  })

}

const fetchSingleSpecialProduct = async (specialProductId) => {
  const specialPopUpSection = document.getElementById('specialPopUpSection')

  specialPopUpSection.classList.remove('hidden')
  specialPopUpSection.innerHTML = ''

  try {
    const response = await fetch(`${config4.apiUrl}/doveeysKitchen/specialProduct/getSingleSpecialProduct/${specialProductId}`)

    console.log('single special res',response);

    const data = await response.json()
    console.log(data);
    
    const populateEachSpecialProduct = `
      <div id="specialPopUpDiv" class="w-[95%] md:w-[650px] mx-auto bg-black text-white border-white border-[1px] px-[10px] rounded-md">

          <div id="closeSpecialPopUp" class="text-red-500 flex items-center font-bold">
            <div><i class="fas fa-times"></i></div>
            <p>close</p>
          </div>

          <h2 class="text-xl font-bold mb-4 text-center mt-[10px]">Edit special Products</h2>
    
      <!-- Upload Product Form -->
          <form id="editSpecialProductForm" class="space-y-4 border-b pb-6 mb-6 text-black">
            <div class="eachEditspecialProductDiv">
              <label class="block text-sm font-medium ">${data.specialProductName}</label>
              <input
                type="text"
                id="specialProductName2"
                value="${data.specialProductName}"
                class="mt-1 p-2 block w-full border border-gray-300 rounded"
                placeholder="Enter new product name"
              />
            </div>
        
            <div>
              <label class="block text-sm font-medium ">${data.specialDescription}</label>
              <textarea
                id="specialDescription2"
                class="mt-1 p-2 block w-full border border-gray-300 rounded"
                rows="3"
                placeholder="Enter new product description"
              >${data.specialDescription}</textarea>
            </div>
        
            <div>
              <label class="block text-sm font-medium ">${data.specialPrice}</label>
              <input
                type="number"
                id="specialPrice2"
                value="${data.specialPrice}"
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
        </div>
    `;

    
    specialPopUpSection.innerHTML = populateEachSpecialProduct
    
    const closeSpecialPopUp = document.getElementById('closeSpecialPopUp')

    closeSpecialPopUp.addEventListener('click', () => {
      specialPopUpSection.classList.add('hidden')
    })

    const editSpecialProductForm = document.getElementById('editSpecialProductForm')
   
    editSpecialProductForm.addEventListener('submit', async (e) => {
      e.preventDefault()

      const specialProductName = document.getElementById('specialProductName2').value
      // console.log('Special Product Name', specialProductName);
      
      const specialDescription = document.getElementById('specialDescription2').value
      const specialPrice = document.getElementById('specialPrice2').value

      console.log('specialProductName', specialProductName);
      console.log('specialDescription', specialDescription);
      console.log('specialPrice', specialPrice);
      
      
      const formData = {
        specialProductName: specialProductName,
        specialDescription: specialDescription,
        specialPrice: specialPrice
  
      }

      console.log('Special FormData', formData);
      
      await updateSpecialProduct(specialProductId, formData)
      specialPopUpSection.classList.add('hidden')

    })
    

  } catch (error) {
    console.log(error);
    
  }
}

const updateSpecialProduct = async (specialProductId, formData) => {

  console.log(formData);
  
  try {
    const response = await fetch(`${config4.apiUrl}/doveeysKitchen/specialProduct/updateSpecialProduct/${specialProductId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })

    console.log('Update Response', response);
    
    if (response.ok) {
      alert('Special Product updated successfully!');
      getAllAdminSpecialProductsFunc()
    } else {
      alert('Failed to update special product.');
    }


    // const data = await response.json()
  } catch (error) {

    console.log(error);
    
    
  }
}

const deleteSpecialProduct = async (specialProductId) => {

  try {
    const response = await fetch(`${config4.apiUrl}/doveeysKitchen/specialProduct/deleteSpecialProduct/${specialProductId}`, {method: 'DELETE'})

    // alert('Special product deleted successfully!!!')

    if (response.ok) {
      alert('Special Product Deleted successfully!');
      getAllAdminSpecialProductsFunc()
    } else {
      alert('Failed to delete special product.');
    }
  } catch (error) {
    
  }
}

// SPECIAL VARIATION SECTION 
const specialVariationsContainer = document.getElementById('specialVariationsContainer')
const addSpecialVariationBtn = document.getElementById('addSpecialVariationBtn')
const showSpecialVariationBtn = document.getElementById('showSpecialVariationBtn')
const specialPriceSection = document.getElementById('specialPriceSection')

  // Toggle between Price or Variation form
  function toggleVariationOption() {
    if (specialVariationsContainer.classList.contains('hidden')) {
      specialPriceSection.classList.add('hidden');
      showSpecialVariationBtn.textContent = 'Close Variation'
      showSpecialVariationBtn.classList.add('bg-red-500')
      showSpecialVariationBtn.classList.remove('bg-blue-500')
      specialVariationsContainer.classList.remove('hidden');
      addSpecialVariationBtn.classList.remove('hidden');

      
    } else {
      specialPriceSection.classList.remove('hidden');
      showSpecialVariationBtn.classList.remove('hidden')
      showSpecialVariationBtn.classList.remove('bg-red-500')
      showSpecialVariationBtn.classList.add('bg-blue-500')
      showSpecialVariationBtn.textContent = 'Show Variation'
      specialVariationsContainer.classList.add('hidden');
      addSpecialVariationBtn.classList.add('hidden');
    }
  }

  // Add Variation Button Clicked
  showSpecialVariationBtn.addEventListener('click', () => {
    // variationAdded = false;
    toggleVariationOption();
  });


addSpecialVariationBtn.addEventListener("click", () => {
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
  
  specialVariationsContainer.appendChild(newVariation);
});