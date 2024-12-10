const registrationSection = document.getElementById('registrationSection')
const loginSection = document.getElementById('loginSection')
const existingUser = document.getElementById('existingUser')
const newUser = document.getElementById('newUser')
const exploreApp = document.getElementById('exploreApp')
const generalSection = document.getElementById('generalSection')

existingUser.onclick = () => {
    generalSection.classList.add('hidden')
    registrationSection.classList.remove('hidden')
}

newUser.onclick = () => {
    generalSection.classList.add('hidden')
    loginSection.classList.remove('hidden')
}

exploreApp.onclick = () => {
    generalSection.classList.add('hidden')
    window.location.href = '../htmlFolder/Doviee.html'
}