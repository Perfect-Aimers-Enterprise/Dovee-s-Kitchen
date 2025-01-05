document.addEventListener('DOMContentLoaded', () => {
    getAllProceedSubTotalFunc()
    getAllProceedDataCountFunc()
    getAllProceedOrderFunc()
})

// http://localhost:3000

const getAllProceedSubTotalFunc = async () => {
    const subtotalDiv = document.getElementById('subtotalDiv');

    try {
        const getAllProceedDataCountResponse = await fetch('http://localhost:3000/doveeysKitchen/order/getAllProceedOrder', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const data = await getAllProceedDataCountResponse.json();

        const getTotalPrice = data.orderProceed;

        // Calculate the sum of menuProductOrderPrice
        const totalAmount = getTotalPrice.reduce((sum, item) => {
            return sum + Number(item.menuTotalProductOrderPrice);
        }, 0); // Initial value of sum is 0

        // Update the DOM with the calculated total amount
        const subTotalVar = `
            <div>
                <h1>SubTotal</h1>
            </div>
            <div>
                <p>&#8358; ${totalAmount.toLocaleString()}</p> <!-- Format for readability -->
            </div>
        `;
        subtotalDiv.innerHTML = subTotalVar;

    } catch (error) {
        console.error("An error occurred while fetching subtotal:", error);
    }
};

const getAllProceedDataCountFunc = async () => {

    const totalOrders = document.getElementById('totalOrders')
    totalOrders.innerHTML = ''
    try {
        const getAllProceedDataCountResponse = await fetch('http://localhost:3000/doveeysKitchen/order/getAllProceedOrder', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })

        const data = await getAllProceedDataCountResponse.json()
        

        const totalOrdersVar = `
            <h1>Total Orders (${data.count})</h1>
        `

        totalOrders.innerHTML = totalOrdersVar
    } catch (error) {
        
    }
}

const getAllProceedOrderFunc = async () => {
    try {
        const getAllProceedResponse = await fetch('http://localhost:3000/doveeysKitchen/order/getAllProceedOrder', {
            method: 'GET',
            headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        })

        console.log(getAllProceedResponse);

        const data = await getAllProceedResponse.json()
        console.log(data);
        
        const orderData = data.orderProceed

        const shoppingCartDiv = document.getElementById('shoppingCartDiv')

        shoppingCartDiv.innerHTML = ''

       orderData.forEach((eachOrderData) => {
        console.log(eachOrderData);

        const statusClass = eachOrderData.menuProductOrderStatus === "Confirmed" 
                ? "bg-green-400"
                : "bg-yellow-400";
        
        const populateCartOrder = `
            <div class="flex items-center p-4 border rounded-lg bg-gray-50">
            <img src="${eachOrderData.menuProductOrderImage}" alt="Product" class="w-20 h-20 rounded-lg object-cover">
            <div class="ml-4 flex-1">
            <h2 class="text-lg font-bold text-gray-800">${eachOrderData.menuProductOrderName}</h2>
            <p class="text-gray-600">Price: &#8358 ${eachOrderData.menuTotalProductOrderPrice}</p>
            <p class="text-gray-600">Quantity: ${eachOrderData.menuProductOrderQuantity}</p>
            </div>
            <div>
            <span class="px-3 py-1 ${statusClass} text-white text-sm rounded-lg">${eachOrderData.menuProductOrderStatus}</span>
            </div>
        </div>
        `

        shoppingCartDiv.innerHTML += populateCartOrder
})

        

        
    } catch (error) {
        console.log(error);
    }
}

// Add an event listener to the back button
const backButton = document.getElementById('backButton');
backButton.addEventListener('click', () => {
    window.history.back(); // Navigate to the previous page
});