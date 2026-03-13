const urlss = {
  apiUrl:
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? "http://localhost:3000"
      : `${window.location.protocol}//${window.location.hostname}`,
};

document.addEventListener("DOMContentLoaded", () => {
  getAllClientProductFunc();
  // populateSpecialProductFunc()
});

const specialNavigationPopUp = document.getElementById("specialNavigationPopUp");
const preloaderSpecial = document.getElementById("preloaderOrder");
const specialGridClass = document.querySelector(".specialGridClassHome");

const getAllClientProductFunc = async () => {
  preloaderSpecial.classList.remove("hidden");
  specialGridClass.innerHTML = "";

  try {
    const response = await fetch(
      `${urlss.apiUrl}/doveeysKitchen/specialProduct/getSpecialProducts`,
    );
    const data = await response.json();

    // 🔀 Shuffle array
    const shuffledData = data.sort(() => Math.random() - 0.5);

    // 🎯 Limit to 10 items
    const limitedData = shuffledData.slice(0, 5);

    limitedData.forEach((eachSpecialData) => {
      const eachSpecialDataId = eachSpecialData._id;
      let productContent = "";

      if (
        eachSpecialData.specialPrice &&
        (!eachSpecialData.variations ||
          eachSpecialData.variations.length === 0 ||
          isAllVariationsInvalid(eachSpecialData.variations))
      ) {
        productContent = `<div data-id="${eachSpecialDataId}" class="special-item group relative bg-[#111] border border-white/5 rounded-3xl p-4 transition-all duration-500 hover:border-orange-500/50 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.7)] text-white">
    <div class="overflow-hidden rounded-2xl aspect-[4/3] relative">
        <img
            src="../image/specialImage/${eachSpecialData.specialImage}"
            alt="${eachSpecialData.specialProductName}"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div class="absolute top-4 left-4 bg-orange-600/90 backdrop-blur-md text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
            Special Offer
        </div>
    </div>

    <div class="px-2 pb-2">
        <div class="flex flex-col mt-6">
            <h4 class="text-xl font-bold tracking-tight text-white group-hover:text-orange-400 transition-colors">
                ${eachSpecialData.specialProductName}
            </h4>
            <span class="text-orange-500 font-bold mt-1">₦${eachSpecialData.specialPrice}</span>
        </div>
        
        <p class="mt-3 text-gray-500 text-sm leading-relaxed line-clamp-2">
            ${eachSpecialData.specialDescription}
        </p>

        <button
            class="orderSpecialProductNow mt-8 w-full py-3 bg-white text-black font-bold rounded-xl transition-all hover:bg-orange-600 hover:text-white active:scale-95 shadow-lg"
        >
            Order Now
        </button>
    </div>
</div>`;
      } else if (eachSpecialData.variations && eachSpecialData.variations.length > 0) {
        const firstSpecialVariationPrice = eachSpecialData.variations[0].price;

        productContent = `<div data-id="${eachSpecialDataId}" class="special-item group relative bg-[#111] border border-white/5 rounded-3xl p-4 transition-all duration-500 hover:border-orange-500/50 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.7)] text-white">
    <div class="overflow-hidden rounded-2xl aspect-[4/3] relative">
        <img
            src="../image/specialImage/${eachSpecialData.specialImage}"
            alt="${eachSpecialData.specialProductName}"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div class="absolute top-4 left-4 bg-orange-600/90 backdrop-blur-md text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
            Limited Offer
        </div>
    </div>

    <div class="px-2 pb-2">
        <div class="flex flex-col mt-6">
            <h4 class="text-xl font-bold tracking-tight text-white group-hover:text-orange-400 transition-colors">
                ${eachSpecialData.specialProductName}
            </h4>
            <span class="text-orange-500 font-bold mt-1">₦${firstSpecialVariationPrice}</span>
        </div>
        
        <p class="mt-3 text-gray-500 text-sm leading-relaxed line-clamp-2">
            ${eachSpecialData.specialDescription}
        </p>

        <button
            class="orderSpecialProductNow mt-8 w-full py-3 bg-white text-black font-bold rounded-xl transition-all hover:bg-orange-600 hover:text-white active:scale-95 shadow-lg"
        >
            Order Now
        </button>
    </div>
</div>`;
      }

      specialGridClass.innerHTML += productContent;
    });

    setTimeout(() => {
      const specialItems = document.querySelectorAll(".special-item");
      specialItems.forEach((item) => {
        item.classList.add("visible");
      });
    }, 100);

    // ✅ Use class instead of duplicate ID
    const orderSpecialProductButtons = document.querySelectorAll(".orderSpecialProductNow");

    orderSpecialProductButtons.forEach((eachOrderSpecialProductNow) => {
      eachOrderSpecialProductNow.addEventListener("click", (e) => {
        const token = localStorage.getItem("token");
        if (!token) {
          return specialNavigationPopUp.classList.remove("hidden");
        }
        const specialProductId = e.target.closest(".special-item").dataset.id;
        getSingleClientProductFunc(specialProductId);
      });
    });
  } catch (error) {
    console.error(error);
  } finally {
    document.getElementById("preloaderSpecial").classList.add("hidden");
  }
};

const getSingleClientProductFunc = async (specialProductId) => {
  try {
    const response = await fetch(
      `${urlss.apiUrl}/doveeysKitchen/specialProduct/getSingleSpecialProduct/${specialProductId}`,
    );

    console.log(response);

    const data = await response.json();

    console.log(data);

    const specialImageSingle = data.specialImage;
    const specialProductNameSingle = data.specialProductName;
    const specialDescriptionSingle = data.specialDescription;
    const specialPriceSingle = data.specialPrice;
    const specialProductVariations = data.variations || []; // Check if

    localStorage.setItem("specialImageSingle", specialImageSingle);
    localStorage.setItem("specialProductNameSingle", specialProductNameSingle);
    localStorage.setItem("specialDescriptionSingle", specialDescriptionSingle);
    localStorage.setItem("specialPriceSingle", specialPriceSingle);
    localStorage.setItem("specialProductVariations", JSON.stringify(specialProductVariations));

    window.location.href = "../htmlFolder/specialOrderDetails.html";
  } catch (error) {
    console.log(error);
  }
};

// Helper function to check if all variations are invalid
function isAllVariationsInvalid(variations) {
  return variations.every((variation) => !variation.size || variation.price === null);
}
