// config.js
const config = {
    apiUrl: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:3000'
      : `${window.location.protocol}//${window.location.hostname}`
  };
  

document.addEventListener('DOMContentLoaded', () => {
    // getAllUserMessageFunc()
})

const userMessageTitle = document.getElementById('userMessageTitle')

const userMessage = document.getElementById('userMessage')

const sendUserMessage = async () => {
    const userMessageTitle = document.getElementById('userMessageTitle')
    const userMessage = document.getElementById('userMessage')
    const userName = localStorage.getItem('userName')
    const userEmail = localStorage.getItem('userEmail')
    const userPhone = localStorage.getItem('userPhone')
    const token = localStorage.getItem('token')

    if (!userMessageTitle.value || !userMessage.value) {
        return alert('Fill Input Fields')
    }

    if (!token) {
        return alert('Please Register or Login your account')
    }

    const formData = {
        userMessageTitle: userMessageTitle.value,
        userMessage: userMessage.value,
        userName,
        userEmail,
        userPhone
    }
    try {
        const response = await fetch(`${config.apiUrl}/doveeysKitchen/message/sendUserMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })

        alert('Message Sent Successfully')

        userMessageTitle.value = ''
        userMessage.value = ''

        userMessageTitle.value.focus()
    } catch (error) {
        console.log(error);
        
    }
}

document.getElementById('sendMessageForm').addEventListener('submit', (e) => {
    e.preventDefault()
    sendUserMessage()
})