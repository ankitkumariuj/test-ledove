

const successAlert = (msg) => {
  Swal.fire({
    title: "",
    text: msg,
    icon: "success",
    showConfirmButton: false,
    customClass: {
      icon: "swal-custom-icon",
      htmlContainer: "swal-custom-text",
      container: "my-swal-success-container",
    },
    timer: 1500,
  });
};

const warningAlert = (msg) => {
  Swal.fire({
    title: "",
    text: msg,
    icon: "warning",
    showConfirmButton: false,
    customClass: {
      icon: "swal-custom-icon",
      htmlContainer: "swal-custom-text",
      container: "my-swal-warning-container",
    },
    timer: 1000,
  });
};

const input = document.getElementById("animated-placeholder");
const placeholders = [
  "Search for products...",
  "Search for categories...",
  "Search for brands...",
  "Search for offers..."
];
let index = 0;
let charIndex = 0;
let currentText = "";
let typing = true;

function typeAnimation() {
  if (typing) {
    if (charIndex < placeholders[index].length) {
      currentText += placeholders[index].charAt(charIndex);
      input.setAttribute("placeholder", currentText);
      charIndex++;
      setTimeout(typeAnimation, 100);
    } else {
      typing = false;
      setTimeout(typeAnimation, 2000);
    }
  } else {
    if (charIndex > 0) {
      currentText = currentText.slice(0, -1);
      input.setAttribute("placeholder", currentText);
      charIndex--;
      setTimeout(typeAnimation, 50);
    } else {
      typing = true;
      index = (index + 1) % placeholders.length;
      setTimeout(typeAnimation, 500);
    }
  }
}

typeAnimation();


const btn = document.getElementById("toggleCategoriesBtn");
const categories = document.getElementById("fetchCategories");

function setCollapsedHeight() {
  const firstItem = categories.querySelector(".category-item");
  if (!firstItem) return;

  // include text height + margin
  const itemHeight = firstItem.offsetHeight;

  // add a little buffer for safety (e.g., 10px)
  const rowHeight = itemHeight + 45;

  // decide how many rows to show
  const rowsToShow = window.innerWidth < 600 ? 2 : 1;

  categories.style.maxHeight = rowHeight * rowsToShow + "px";
  categories.style.overflow = "hidden";
}

function expandAll() {
  categories.style.maxHeight = categories.scrollHeight + "px";
  categories.style.overflow = "visible";
}

btn.addEventListener("click", () => {
  if (categories.classList.contains("expanded")) {
    categories.classList.remove("expanded");
    btn.textContent = "Show More";
    setCollapsedHeight();
  } else {
    categories.classList.add("expanded");
    btn.textContent = "Show Less";
    expandAll();
  }
});

window.addEventListener("resize", () => {
  if (!categories.classList.contains("expanded")) {
    setCollapsedHeight();
  }
});

window.addEventListener("load", setCollapsedHeight);





document.addEventListener("click", function (e) {
  if (e.target.classList.contains("tab")) {
    // Remove 'active' from all tabs
    document
      .querySelectorAll(".tab")
      .forEach((t) => t.classList.remove("active"));

    // Add 'active' to clicked one
    e.target.classList.add("active");
  }
});

$(document).ready(function () {
  $("#main_banner_carousel").owlCarousel({
    loop: true,
    margin: 20,
    nav: true,
    dots: true,
    autoplay: true,
    autoplayTimeout: 4000,
    navText: ["<", ">"],
    responsive: {
      0: { items: 1 },
      600: { items: 2 },
      1000: { items: 3 }, // always show 3 when screen is wide enough
    },
  });
});


let lastScrollTop = 0;

window.addEventListener("scroll", function () {
  let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

  if (currentScroll > lastScrollTop) {
    // Scroll Down
    $(".page-scroll-up").removeClass("show");
    // $(".header").removeClass("fixed");
  } else {
    $(".page-scroll-up").addClass("show");
    // $(".header").addClass("fixed");
    // Scroll Up
  }

  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // For Safari
});

// view cart js

const fetchCategory = async () => {
  const fetchCategories = $("#fetchCategories");
  fetchCategories.html(" ");
  
  $.ajax({
    url: API_URL,
    method: "POST",
    data: { type: "fetchCategory" },
    success: function (response) {
      if (response.status !== false && Array.isArray(response)) {
        let categoryItemHtml = "";

      //  console.log(response);

        // ✅ Limit to only first 20 categories
        const limitedCategories = response.slice(0, 20);

        limitedCategories.forEach((item) => {
          categoryItemHtml += `
            <a href="category.html?cat_id=${item.id}" class="category-item">
              <img src="${image_url + item.image_url}" alt="${item.name}" />
              <p>${item.name}</p>
            </a>
          `;
        });

        fetchCategories.html(categoryItemHtml);
      } else {
        fetchCategories.html("<p>No categories found</p>");
      }
    },
    error: function () {
      fetchCategories.html("<p>Failed to load categories</p>");
    }
  });
};



const topfetchCategory = async () => {
  const topfetchCategories = $("#topcatebox");


  $.ajax({
    url: API_URL,
    method: "POST",
    data: { type: "fetchCategory" },
    success: function (response) {
      // console.log("Raw Response:", response);

      


    if (response.status !== false && Array.isArray(response)) {
        let categoryItemHtml = "";

        // ✅ Limit to only first 20 categories
        const categories = response;

        categories.forEach((item) => {
          categoryItemHtml += `
            <a href="category.html?cat_id=${item.id}" class="cate_box">
              <img src="${image_url + item.image_url}" alt="${item.name}" />
              <p>${item.name}</p>
            </a>
          `;
        });
        topfetchCategories.html(categoryItemHtml);
      } else {
        topfetchCategories.html("<p>No categories found</p>");
      }
    },
    error: function (xhr, status, error) {
      console.error("Error loading categories:", error);
      topfetchCategories.html("<p>Failed to load categories</p>");
    }
  });
};

// call function when page loads
$(document).ready(() => {
  topfetchCategory();
});


const fetchTodayBestDeal = () => {
  const todayBestDealProductContainer = $("#todayBestDeal");
  let userId = localStorage.getItem('userId')

  $.ajax({
    url: API_URL,
    method: "POST",
    data: { type: "fetchTodayBestDeal", userId: userId},
    success: function (response) {
      if (!response || response.status === false || response.length === 0) {
        $("#today-best-deal-section").hide();
        return;
      }

      let productHtml = "";

      response.forEach((item) => {
        const countdownId = `countdown-${item.id}`;

        // ✅ Wishlist logic (fixed)
         // Declare variables
          let isWishlist = "";
          let iconLabel = "";

          if (item.is_wishlisted == 1) {
            isWishlist = "active";
            iconLabel = "Remove From Wishlist";
          } else {
            isWishlist = "";
            iconLabel = "Add To Wishlist";
          }


        // ✅ Discount calculation (choose correct field)
        const discount = ((item.mrp - item.deal_price) / item.mrp) * 100;

        // ✅ HTML structure
        productHtml += `
          <div class="product">
            <a class="product-img" href="singleproduct.html?pid=${item.id}" onclick="saveProductName('${item.name}')">
              <img src="${image_url}product/main/${item.main_image}" alt="${item.name}">
            </a>

            <div class="product_info">
              <div class="discount-label" style="background: green;">
               ${((item.mrp - item.selling_price)/ item.mrp).toFixed(1) * 100}% OFF
              </div>

              <p>${item.name}</p>
              <h2>${item.description}</h2>

              <div id="${countdownId}" class="countdown"></div>

              <div class="price-container">
                <span class="old-price">₹${item.mrp}</span>
                <span class="new-price">₹${item.deal_price}</span>
              </div>

              <div class="icon-container">
                <!-- Eye Icon -->
                <div class="icon-with-label" onclick="openQuickView(${item.id})">
                  <span class="icon-label">View Product</span>
                  <i class="fas fa-eye"></i>
                </div>

                <!-- Heart Icon -->
               <div class="icon-with-label ${isWishlist}" onclick="addToWishlist(${item.id})">
                  <span class="icon-label">${iconLabel}</span>
                  <i class="fas fa-heart"></i>
                </div>
              </div>

              <button class="add-to-cart" onclick="addToCartProcess(${item.id})">
              <i class="fa-solid fa-cart-shopping"></i>  Add to Cart
              </button>
            </div>
          </div>
        `;

        // ✅ Start countdown for each product
        startCountdown(item.end_time, countdownId);
      });

      // ✅ Add final HTML
      todayBestDealProductContainer.html(productHtml);
    },
    error: function () {
      console.error("Error fetching best deals");
      $("#today-best-deal-section").hide();
    },
  });
};


function startCountdown(apiEndTime, elementId) {
  const countdownElement = document.getElementById("countdown");
  if (!countdownElement) return;

  const endTime = new Date(apiEndTime.replace(" ", "T")).getTime();

  const timer = setInterval(() => {
    const now = new Date().getTime();
    const distance = endTime - now;

    if (distance <= 0) {
      clearInterval(timer);
      countdownElement.innerHTML = "⛔ Deal Expired";
      countdownElement.closest(".product").classList.add("expired");
      return;
    }

    const hours = String(Math.floor((distance / (1000 * 60 * 60)) % 24)).padStart(2, "0");
    const minutes = String(Math.floor((distance / (1000 * 60)) % 60)).padStart(2, "0");
    const seconds = String(Math.floor((distance / 1000) % 60)).padStart(2, "0");

    countdownElement.innerHTML = `${hours}h ${minutes}m ${seconds}s`;
  }, 1000);
}



const loadBanner = async () => {
  const mainBannerCarousel = $("#main_banner_carousel");
  const upperBanner = $("#upperBanner");
  const lowerBanner = $("#lowerBanner");
  const latestBanner = $("#latestBanner");
  const trendingbanner = $('#trendingBanner');
  const kidsbanner = $('#kidsBanner');

  await $.ajax({
    url: API_URL,
    type: "POST",
    data: { type: "loadBanner" },
    success: function (response) {
      if (response.status !== false) {
        let mainData = response.filter((item) => item.banner_type === "main");
        let upperData = response.filter((item) => item.banner_type === "upper");
        let lowerData = response.filter((item) => item.banner_type === "lower");
        let latestData = response.filter((item) => item.banner_type === 'Latest');
        let trendingData = response.filter((item) => item.banner_type === 'Trending');
                let kidsData = response.filter((item) => item.banner_type === 'Kids Collection');
        console.log(kidsData)

        let bannerData = "";
        let upperHtml = "";
        let lowerHtml = "";

        let latestHtml = "";
        let trendingHtml = "";
        let kidsHtml = "";

        mainBannerCarousel.trigger("destroy.owl.carousel");
        mainBannerCarousel.html("");
        mainData.map((item) => {


          bannerData += `
                    <div class="item">
                        <div class="card">
                            <img src="${
                              image_url + "banner/" + item.image_url
                            }" alt="${item.banner_type}">
                        </div>
                    </div>
                    `;
        });
        mainBannerCarousel.html(bannerData);


          latestBanner.trigger("destroy.owl.carousel");
        latestBanner.html("");
        latestData.map((item) => {


          latestHtml += `
                    <div class="item">
                        <div class="card">
                            <img src="${
                              image_url + "banner/" + item.image_url
                            }" alt="${item.banner_type}">
                        </div>
                    </div>
                    `;
        });
        latestBanner.html(latestHtml);


          trendingbanner.trigger("destroy.owl.carousel");
        trendingbanner.html("");
        trendingData.map((item) => {


          trendingHtml += `
                    <div class="item">
                        <div class="card">
                            <img src="${
                              image_url + "banner/" + item.image_url
                            }" alt="${item.banner_type}">
                        </div>
                    </div>
                    `;
        });
        trendingbanner.html(trendingHtml);



          kidsbanner.trigger("destroy.owl.carousel");
        kidsbanner.html("");
        kidsData.map((item) => {


          kidsHtml += `
                    <div class="item">
                        <div class="card">
                            <img src="${
                              image_url + "banner/" + item.image_url
                            }" alt="${item.banner_type}">
                        </div>
                    </div>
                    `;
        });
        kidsbanner.html(kidsHtml);


        let darkTheme = "";

        upperData = upperData.slice(0, 3);
        upperData.map((item, index) => {
          if (index % 2 == 0) {
            darkTheme = `dark`;
          } else {
            darkTheme = "";
          }
          const len = upperData.length;
          const gap = 30 * (len - 1);
          // let width = `calc(100% / ${len} - ${gap + 'px'} / ${len});`
          let width = ``;
          // min-width: calc(100% / 3 - 60px / 3);
          upperHtml += `
                    
                    <div class="shop2" style="width:${width};min-width:${width}">
                        <div class="shop2-content">
                            <div class="shop2-text ${darkTheme}">
                                <h1>${item.title}</h1>
                                <h2>From 399.00</h2>
                            </div>
                            <div class="img-text ${darkTheme}">
                                <a href="category.html?cat_id=${
                                  item.category_link
                                }">Shop Now</a>
                            </div>
                        </div>
                        <div class="shop2-img">
                            <img src="${
                              image_url + "/banner/" + item.image_url
                            }" alt="">
                        </div>
                    </div>
                    `;
        });
        upperBanner.html("");
        upperBanner.html(upperHtml);

        lowerData = lowerData.slice(0, 2);

        lowerData.map((item, index) => {
          const len = lowerData.length;

          lowerHtml += `
                    
                    <div class="custom-card">
                        <img src="${
                          image_url + "/banner/" + item.image_url
                        }" alt="Black Bottle" class="custom-card-img" />
                        <div class="custom-card-overlay">
                            <div class="custom-card-price">
                                ${
                                  item.title
                                } <span class="custom-card-old-price">$188.00</span>
                            </div>
                            <h2 class="custom-card-title">${
                              item.description
                            }</h2>
                            <a href="category.html?cat_id=${item.category_link}" class="custom-card-link k_underline_transition_2">Shop now</a>
                        </div>
                    </div>

                    `;
        });

        lowerBanner.html("");
        lowerBanner.html(lowerHtml);
      }


      



      mainBannerCarousel.owlCarousel({
        loop: true,
        margin: 20,
        nav: true,
        dots: true,
        autoplay: true,
        autoplayTimeout: 4000,
        navText: ["<", ">"],
        responsive: {
          0: { items: 1 },
          600: { items: 2 },
          1000: { items: 3 }, // always show 3 when screen is wide enough
        },
      });



        trendingbanner.owlCarousel({
        loop: true,
        margin: 2,
        nav: true,
        dots: true,
        autoplay: true,
        autoplayTimeout: 4000,
        navText: ["<", ">"],
        responsive: {
          0: { items: 1.3 },
          600: { items: 2.5 },
          1000: { items: 3 }, // always show 3 when screen is wide enough
        },
      });


       kidsbanner.owlCarousel({
        loop: true,
        margin: 2,
        nav: true,
        dots: true,
        autoplay: true,
        autoplayTimeout: 4000,
        navText: ["<", ">"],
        responsive: {
          0: { items: 1.3 },
          600: { items: 2.5 },
          1000: { items: 3 }, // always show 3 when screen is wide enough
        },
      });

       latestBanner.owlCarousel({
        loop: true,
        margin: 1,
        nav: true,
        dots: true,
        autoplay: true,
        autoplayTimeout: 4000,
        navText: ["<", ">"],
        responsive: {
          0: { items: 1.1 , margin: 4},
          600: { items: 2 , margin: 10},
          1000: { items: 3 , margin: 10}, // always show 3 when screen is wide enough
        },
      });
    },
  });
};


function showResults() {
  document.getElementById("search-results").style.display = "block";
}


    
document.addEventListener('click', function(event) {
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-popup');

  if (event.target === input) {
    // If clicked on the input → show popup
    results.style.display = 'block';
    input.focus();
  } else {
    // If clicked anywhere else → hide popup
    results.style.display = 'none';
  }
});




const multiaddress = () => {
  let userid = localStorage.getItem("userId");

  $.ajax({
    url: API_URL,
    method: "POST",
    data: {
      type: "fetchmultipleaddress",
      userid: userid,
    },
    success: function (res) {
      if (res && Array.isArray(res) && res.length > 0) {
        renderAddressList(res); 
      } else {
        $("#addressContainer").html("<p>No addresses found.</p>");
      }
    },
    error: function () {
      console.log("Error fetching addresses.");
    },
  });
};

// 🧩 Helper function to render address list
function renderAddressList(addresses) {
  let userid = localStorage.getItem("userId");

  // 🏠 Default address — first one or the one with is_default == 1
  let defaultAddress = addresses.find((a) => a.is_default == 0);

  // Show in header
  document.getElementById("userloaction").textContent =
    "Delivery to : " +
    `${defaultAddress.address_line}, ${defaultAddress.city}, ${defaultAddress.state}, ${defaultAddress.pincode}`;

  // Sort list — default first
  addresses.sort((a, b) => (a.id === defaultAddress.id ? -1 : 1));

  // Create address HTML
  let html = "";
  addresses.forEach((item) => {
    const selectedClass = item.id === defaultAddress.id ? "selected-address" : "";
    html += `
      <div class="address-card ${selectedClass}" data-id="${item.id}">
        <h4>${item.full_name}</h4>
        <p>${item.address_line}, ${item.city}, ${item.state}, ${item.pincode}</p>
      </div>
    `;
  });

  $("#addressContainer").html(html);


  $(".address-card").on("click", function () {
    const addressId = $(this).data("id");


    $(".address-card").removeClass("selected-address");
    $(this).addClass("selected-address");

    const selectedAddress = addresses.find((a) => a.id == addressId);
    if (selectedAddress) {
    
      document.getElementById("userloaction").textContent =
        "Delivery to : " +
        `${selectedAddress.address_line}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.pincode}`;
    }

    // Update in database
    $.ajax({
      url: API_URL,
      method: "POST",
      data: {
        type: "setdefaultaddress",
        userid: userid,
        addressid: addressId,
      },
      success: function () {
        console.log("Default address updated successfully");
      },
      error: function () {
        console.log("Error updating default address");
      },
    });
  });
}

multiaddress();


    // ✅ Automatically call when the home page loads
    // $(document).ready(function () {
    //   fetchUserData();
    // });

function modalshow(){
  const manageAddressBtn = document.getElementById("manageAddressBtn");
  const addressListModal = document.getElementById("addressListModal");
  const addAddressModal = document.getElementById("addAddressModal");
  const closeAddressList = document.getElementById("closeAddressList");
  const closeAddAddress = document.getElementById("closeAddAddress");
  const addNewAddressBtn = document.getElementById("addNewAddressBtn");

  manageAddressBtn.onclick = () => addressListModal.style.display = "flex";
  closeAddressList.onclick = () => addressListModal.style.display = "none";

  addNewAddressBtn.onclick = () => {
    addressListModal.style.display = "none";
    addAddressModal.style.display = "flex";
  };
  closeAddAddress.onclick = () => addAddressModal.style.display = "none";

  window.onclick = (e) => {
    if (e.target === addressListModal) addressListModal.style.display = "none";
    if (e.target === addAddressModal) addAddressModal.style.display = "none";
  };
}
function addnewaddress(event) {
  event.preventDefault(); // prevent form reload

  const uid = localStorage.getItem("userId");
  const fullname = $("#fullname").val().trim();
  const address = $("#address").val().trim();
  const city = $("#city").val().trim();
  const landmark = $("#landmark").val().trim();
  const state = $("#state").val().trim();
  const pincode = $("#pincode").val().trim();
  const phone = $("#phone").val().trim();

  // ✅ Check for empty fields
  if (!fullname) return warningAlert("Please enter your full name!");
  if (!address) return warningAlert("Please enter your address!");
  if (!city) return warningAlert("Please enter your city!");
  if (!landmark) return warningAlert("Please enter a landmark!");
  if (!state) return warningAlert("Please enter your state!");
  if (!pincode) return warningAlert("Please enter your pincode!");
  if (!phone) return warningAlert("Please enter your phone number!");


  // const phonePattern = /^[6-9]\d{9}$/;
  // if (!phonePattern.test(phone)) {
  //   return warningAlert("Please enter a valid 10-digit phone number!");
  // }

  // ✅ Validate pincode (6 digits)
  const pincodePattern = /^\d{6}$/;
  if (!pincodePattern.test(pincode)) {
    return warningAlert("Please enter a valid 6-digit pincode!");
  }


$.ajax({
  url: API_URL,
  method: "POST",
  data: {
    type: "savenewaddress",
    userid: uid,            
    full_name: fullname,    
    phone_no: phone,         
    address_line: address,  
    city: city,
    landmark: landmark,
    state: state,
    pincode: pincode
  },
  success: function (response) {
    console.log("Response:", response);
    const res = typeof response === "string" ? JSON.parse(response) : response;
    if (res.status === true) {
      successAlert("Address added successfully!");
      addAddressModal.style.display="none";
window.location.reload();
      console.log(uid);
      
    } else {
      warningAlert("Invalid " + res.msg);
    }
  },
  error: function (xhr, status, error) {
    console.error("AJAX Error:", xhr.responseText);
    console.log("⚠️ Backend error: " + xhr.status + " " + xhr.statusText);
  }
});

}




async function GetSubCategory(subId) {
  let formdata = new FormData();
  formdata.append("type", "SubcaregoryList");
  formdata.append("subId", subId);

  let req = await fetch(API_URL, {
    method: "POST",
    body: formdata
  });

  let res = await req.json();

  console.log("Sub Category Response:", res);


  let output = "";

  if (res.length > 0) {
    res.forEach(item => {
      output += `
      <div class="Category-box">
      
            <a href="category.html?subCat_id=${item.id}&cate_id=${item.category_id}">
        <img src="${scatei}${item.image_url}" width="80" />
        <b style="width: max-content;     margin-top: 5px;">${item.name}</b>
        <hr>
        </a>
        </div>
      `;
    });
  } else {
    output = "<p>No Sub Category Found</p>";
  }

  document.getElementById("PrintSubCate").innerHTML = output;
}

GetSubCategory("all"); // yaha 5 ki jagah subId pass karo


async function GetMainCategory() {
  let formdata = new FormData();
  formdata.append("type", "MainaregoryList");

  let req = await fetch(API_URL, { 
    method: "POST", 
    body: formdata 
  });

  let res = await req.json();
  return res;
}




function fetchRecentlyViewedProducts() {
  const viewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

  if (viewed.length === 0) {
    console.log("No recently viewed products");
    return;
  }

  $.ajax({
    url: API_URL,
    method: "POST",
    data: {
      type: "getProductsByIds",
      ids: JSON.stringify(viewed)
    },
    success: function (response) {

      console.log("Fetched Products:", response);
      if (!response.status) {
        console.error("Error:", response.message);
        return;
      }

      let html = "";
      let products = response.data;


      products.forEach((item) => {
        // console.log(item.main_image)

        let discount = ((item.mrp - item.selling_price) / item.mrp) * 100;

          let isWishlist = item.is_wishlisted == 1 ? "active" : "";
          let iconLabel = item.is_wishlisted == 1 ? "Remove From Wishlist" : "Add To Wishlist";
        // Declare variables
        // let isWishlist = "";
        // let iconLabel = "";

        // if (item.is_wishlisted == 1) {
        //   isWishlist = "active";
        //   iconLabel = "Remove From Wishlist";
        // } else {
        //   isWishlist = "";
        //   iconLabel = "Add To Wishlist";
        // }
        html += `
           <div class="product">
            <a class="product-img" href="singleproduct.html?pid=${item.id}"onclick="saveProductName('${item.name}')" >
              <img src="${image_url + "/product/main/" + item.main_image}" alt="">
            </a>
              <div class="product_info">
            <div class="discount-label">${Math.round(((item.mrp - item.selling_price) / item.mrp) * 100)}%</div>
            <p>${item.name}</p>
            <h2>${item.description}</h2>
           
            <div class="price-container">
                <span class="old-price">₹${item.mrp}</span>
                <span class="new-price">₹${item.selling_price}</span>
            </div>

            <div class="icon-container">
                <!-- Eye Icon with Label -->
                <div class="icon-with-label" onclick="openQuickView(${item.id})">
                    <span class="icon-label">View Product</span>
                    <i class="fas fa-eye"></i>
                </div>

                <!-- Heart Icon with Label -->
                <div class="icon-with-label ${isWishlist}" onclick="addToWishlist(${item.id})">
                    <span class="icon-label">${iconLabel}</span>
                    <i class="fas fa-heart"></i>
                </div>
            </div>

 <button class="add-to-cart" onclick="addToCartProcess(${item.id
          })"> <i class="fa-solid fa-cart-shopping"></i>Add to Cart</button>         </div> </div>`;

      });

      $("#recent-product").html(html);
    },
    error: function (xhr, status, error) {
      console.error("Error fetching products:", error);
    }
  });
}

fetchRecentlyViewedProducts();


