const config3 = {
    apiUrl: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:3000'
      : `${window.location.protocol}//${window.location.hostname}`
  };

document.addEventListener('DOMContentLoaded', () => {
    getAllCartCountFunc()
})


const getAllCartCountFunc = async () => {

    const cartCount = document.querySelectorAll('.cartCount')

    cartCount.forEach( async (eachCartCount) => {
        eachCartCount.innerHTML = ''
    try {
        const getAllProceedDataCountResponse = await fetch(`${config3.apiUrl}/doveeysKitchen/order/getAllProceedOrder`, {
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