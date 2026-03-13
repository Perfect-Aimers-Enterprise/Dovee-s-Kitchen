const urls = {
  apiUrl:
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? "http://localhost:3000"
      : `${window.location.protocol}//${window.location.hostname}`,
};

document.addEventListener("DOMContentLoaded", () => {
  getAllMenuProductFunc();
  // populateUserProceedOrder()

  // fetchUserGallery()
});

const menuGridClass = document.querySelector(".menuGridClassHome");
const loader = document.getElementById("preloaderOrder");

const getAllMenuProductFunc = async () => {
  loader.classList.remove("hidden");
  try {
    const getAllMenuProductResponse = await fetch(
      `${urls.apiUrl}/doveeysKitchen/product/getMenuProducts`,
    );
    console.log(getAllMenuProductResponse);

    const data = await getAllMenuProductResponse.json();
    console.log(data);
    menuGridClass.innerHTML = "";

    // 🔀 Shuffle array
    const shuffledData = data.sort(() => Math.random() - 0.5);

    // 🎯 Limit to 10 items
    const limitedData = shuffledData.slice(0, 5);

    limitedData.forEach((eachData) => {
      const eachDataId = eachData._id;
      let productContent = "";

      if (
        eachData.menuPrice &&
        (!eachData.variations ||
          eachData.variations.length === 0 ||
          isAllVariationsInvalid(eachData.variations))
      ) {
        productContent = `
                    <div
            class="group relative bg-[#111] border border-white/5 rounded-3xl p-4 transition-all duration-500 hover:border-green-500/50 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.7)]"
          >
            <div class="overflow-hidden rounded-2xl aspect-[4/3]">
              <img
                src="../image/grilledChicken.jpg"
                alt="Grilled Chicken"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div class="px-2 pb-2">
              <div class="flex justify-between items-start mt-6">
                <h4 class="text-xl font-bold tracking-tight">Grilled Chicken</h4>
                <span class="text-green-500 font-bold">₦4,500</span>
              </div>
              <p class="mt-2 text-gray-500 text-sm leading-relaxed">
                Deliciously seasoned grilled chicken, slow-roasted to juicy perfection with local
                spices.
              </p>
              <button
                class="mt-6 w-full py-3 bg-white text-black font-bold rounded-xl transition-all hover:bg-green-600 hover:text-white menuOrderNow active:scale-95"
              >
                Order Now
              </button>
            </div>
          </div>
                `;
      } else if (eachData.variations && eachData.variations.length > 0) {
        const firstVariationPrice = eachData.variations[0].price;

        productContent = `
                     <div data-id="${eachDataId}" class="menu-item group relative bg-[#111] border border-white/5 rounded-3xl p-4 transition-all duration-500 hover:border-green-500/50 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.7)] text-white">
    <div class="overflow-hidden rounded-2xl aspect-[4/3]">
        <img
            src="../image/menuImage/${eachData.menuImage}"
            alt="${eachData.menuProductName}"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
    </div>

    <div class="px-2 pb-2">
        <div class="flex justify-between items-start mt-6">
            <h4 class="text-xl font-bold tracking-tight text-white">${eachData.menuProductName}</h4>
            <span class="text-green-500 font-bold">₦${firstVariationPrice}</span>
        </div>
        
        <p class="mt-2 text-gray-500 text-sm leading-relaxed line-clamp-2">
            ${eachData.menuDescription}
        </p>

        <button
            class="orderNowButton mt-6 w-full py-3 bg-white text-black font-bold rounded-xl transition-all hover:bg-green-600 hover:text-white active:scale-95"
        >
            Order Now
        </button>
    </div>
</div>

                 `;
      }

      menuGridClass.innerHTML += productContent;
    });

    setTimeout(() => {
      const menuItems = document.querySelectorAll(".menu-item");
      menuItems.forEach((item) => {
        item.classList.add("visible");
      });
    }, 100);

    // ✅ Fix querySelectorAll to avoid duplicate IDs
    const orderNowButtons = document.querySelectorAll(".orderNowButton");

    orderNowButtons.forEach((eachOrderNowButton) => {
      eachOrderNowButton.addEventListener("click", (e) => {
        const token = localStorage.getItem("token");
        if (!token) {
          return navigationPopUp.classList.remove("hidden");
        }
        const menuProductId = e.target.closest(".menu-item").dataset.id;
        fetchSingleProductFunc(menuProductId);
      });
    });
  } catch (error) {
    console.error(error);
  } finally {
    document.getElementById("preloaderOrder").classList.add("hidden");
  }
};

const fetchSingleProductFunc = async (menuProductId) => {
  try {
    const fetchSingleProductResponse = await fetch(
      `${urls.apiUrl}/doveeysKitchen/product/getSingleMenuProduct/${menuProductId}`,
    );

    // console.log(fetchSingleProductResponse);

    const data = await fetchSingleProductResponse.json();
    console.log("Testing Data String", data);

    const menuProductOrderImage = data.menuImage;
    const menuProductOrderName = data.menuProductName;
    const menuProductOrderDescription = data.menuDescription;
    const menuProductOrderPrice = data.menuPrice;
    const menuProductVariations = data.variations || []; // Check if variations exist

    console.log(menuProductVariations);

    localStorage.setItem("menuProductOrderImage", menuProductOrderImage);
    localStorage.setItem("menuProductOrderName", menuProductOrderName);
    localStorage.setItem("menuProductOrderDescription", menuProductOrderDescription);
    localStorage.setItem("menuProductOrderPrice", menuProductOrderPrice);
    localStorage.setItem("menuProductVariations", JSON.stringify(menuProductVariations));

    window.location.href = "../htmlFolder/orderDetailsPage.html";
  } catch (error) {
    console.log(error);
  }
};

// Helper function to check if all variations are invalid
function isAllVariationsInvalid(variations) {
  return variations.every((variation) => !variation.size || variation.price === null);
}
