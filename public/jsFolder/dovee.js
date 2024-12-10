const doveeBackgroundImage = document.getElementById('doveeBackgroundImage')
const ceoImageId = document.getElementById('ceoImageId')
let index = 0
let ceoIndex = 0


const doveeHeroArray = [
    "Hero Image 1.jpg",
    "heroImage2.jpg",
    "heroImage3.jpg",
    "heroImage4.jpg"
]

const ceoImageArray = [
    "ceo1.jpg",
    "ceo2.jpg",
    "ceo3.jpg",
    "ceo4.jpg"
]

setInterval(() => {
    doveeBackgroundImage.style.backgroundImage = `url(../image/${doveeHeroArray[index]})`    
    index = (index + 1) % doveeHeroArray.length
    // console.log(index);
    
}, 3000);

setInterval(() => {
    ceoImageId.src = `../image/${ceoImageArray[ceoIndex]}`
    ceoIndex = (ceoIndex + 1) % ceoImageArray.length
}, 3000);