const menuToggle = document.getElementById('menuToggle');
const closeMenu = document.getElementById('closeMenu');
const slidingNavbar = document.getElementById('slidingNavbar');

document.addEventListener('DOMContentLoaded', () => {
  activeNavBarFunc()
})

menuToggle.addEventListener('click', () => {
  slidingNavbar.classList.remove('translate-x-full');
});

closeMenu.addEventListener('click', () => {
  slidingNavbar.classList.add('translate-x-full');
});

// Optional: Close navbar when clicking outside
window.addEventListener('click', (e) => {
  if (!slidingNavbar.contains(e.target) && !menuToggle.contains(e.target)) {
    slidingNavbar.classList.add('translate-x-full');
  }
});


const activeNavBarFunc = () => {
  const currentPage = window.location.pathname.split('/').pop()
  const navLink = document.querySelectorAll('li a')
  
  console.log(navLink);
  
  navLink.forEach((link) => {
    console.log(link);
    let navColor = 'text-orange-400'
    if (link.getAttribute('href') === currentPage) {
      link.classList.add(navColor)
    }
  })
}


const menuOrderNow = document.querySelectorAll('.menuOrderNow')
menuOrderNow.forEach((eachMenuOrder) => {
  eachMenuOrder.addEventListener('click', () => {
    window.location.href = '../htmlFolder/menu2.html'
  })
})