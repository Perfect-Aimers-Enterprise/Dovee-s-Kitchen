document.addEventListener('DOMContentLoaded', () => {
    getAllCartCountFunc()
})


const getAllCartCountFunc = async () => {

    const cartCount = document.querySelectorAll('.cartCount')

    cartCount.forEach( async (eachCartCount) => {
        eachCartCount.innerHTML = ''
    try {
        const getAllProceedDataCountResponse = await fetch('http://localhost:3000/doveeysKitchen/order/getAllProceedOrder', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })

        const data = await getAllProceedDataCountResponse.json()

        eachCartCount.textContent = data.count
    } catch (error) {
        
    }
    })
    
}