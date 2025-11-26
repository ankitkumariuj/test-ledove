function openActionImg(img) {
  document.querySelector(".pa-img-section").classList.add("active");
}

function changePaImgBtn(action) {
  if (action === undefined) {
    action = 2;
  }

  let activeImg = document.querySelectorAll(".pa-img");
  let activeIndex = -1;
  let imgAction;
  activeImg.forEach((img, i) => {
    if (img.classList.contains("active")) {
      activeIndex = i;
    }
  });
  console.log(activeIndex);
  if (activeIndex === -1) return;
  activeImg.forEach((img) => {
    img.classList.remove("active");
  });
  if (action == 1 && activeIndex > 0) {
    // prev
    activeImg[activeIndex - 1].classList.add("active");
  } else if (action == 2 && activeIndex < activeImg.length - 1) {
    // next
    activeImg[activeIndex + 1].classList.add("active");
  } else {
    activeImg[activeIndex].classList.add("active");
  }
}

$("#pa-share-icon").click(() => {
  $("#pa-dropdown").addClass("active");
});
$(".pa-img-body").click(() => {
  $("#pa-dropdown").removeClass("active");
});

// $("#pa-actual-size").click(() => {
//     var pa_Img = $(".pa-img.active");

//     if (pa_Img.hasClass("scaleUp")) {
//         pa_Img.removeClass("scaleUp");
//     } else {
//         pa_Img.addClass("scaleUp");
//     };
// })

$(document).ready(function () {
  let currentScale = 1;
  const scaleStep = 0.1;
  const minScale = 0.5;
  const maxScale = 3;
  function setScale(scale) {
    currentScale = scale;
    $(".pa-img").css("transform", `scale(${currentScale})`);
  }
  $("#pa-zoom-in").on("click", function () {
    if (currentScale < maxScale) {
      setScale(currentScale + scaleStep);
    }
  });
  $("#pa-zoom-out").on("click", function () {
    if (currentScale > minScale) {
      setScale(currentScale - scaleStep);
    }
  });
  $("#pa-actual-size").on("click", function () {
    setScale(currentScale + 0.22);
  });
});

function openFullscreen() {
  let elem = document.documentElement;

  if (!document.fullscreenElement) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE11 */
      elem.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      // Firefox
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      // Chrome, Safari and Opera
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      // IE/Edge
      document.msExitFullscreen();
    }
  }
}

let autoplay = false;
let interValId;

$("#pa-autoplay").click(function () {
  if ($(this).hasClass("active")) {
    autoplay = false;
    $(this).removeClass("active");
    clearInterval(interValId);
  } else {
    autoplay = true;
    $(this).addClass("active");

    interValId = setInterval(changePaImgBtn, 1000);

    setTimeout(() => {
      autoplay = false;
      clearInterval(interValId);
      $(this).removeClass("active");
    }, 5000);
  }
});

function close_pa_modal() {
  $(".pa-img-section").removeClass("active");
}

$(document).on("click", "#pa-download", function () {
  if (confirm("press ok to download")) {
    const imgUrl = $(".pa-img.active").attr("src");
    const a = document.createElement("a");

    a.href = imgUrl;
    a.download = "Image.jpg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
});



const paImageCon = (pa_img_body) => {

  return `
<div class="pa-img-section">
      <div class="pa-img-container">
        <div class="pa-img-header">
          <div class="pa-img-counter">
            <span id="pa-counter-current">1</span>
            /
            <span id="pa-counter-all">4</span>
          </div>
          <div class="pa-action-toolbar">
            <span class="pa-icon pa-share-icon bi bi-share" id="pa-share-icon" >
              <ul class="pa-dropdown" id="pa-dropdown">
                <li>
                  <a id="pa-share-facebook" target="_blank"
                    href="https://www.facebook.com/sharer/sharer.php?u=www.hdporn.com">
                    <span class="pa-icon pa-facebook-icon fa-brands fa-facebook-f">
                      <!-- <i class="fa-brands fa-facebook-f"></i> -->
                    </span>
                    <span class="pa-dropdown-text">Facebook</span>
                  </a>
                </li>
                <li>
                  <a id="lg-share-twitter" target="_blank"
                    href="https://twitter.com/intent/tweet?text=undefined&amp;url=https%3A%2F%2FStreet Pulse.com%2Fproduct%2Fmen-color-block-polo-t-shirt-2%2F">
                    <span class="pa-icon pa-2-icon bi bi-twitter"></span>
                    <span class="pa-dropdown-text">Twitter</span>
                  </a>
                </li>
                <li>
                  <a id="lg-share-googleplus" target="_blank"
                    href="https://plus.google.com/share?url=https%3A%2F%2FStreet Pulse.com%2Fproduct%2Fmen-color-block-polo-t-shirt-2%2F">
                    <span class="pa-icon pa-3-icon fa-brands fa-google-plus-g">

                    </span>
                    <span class="pa-dropdown-text">GooglePlus</span>
                  </a>
                </li>
                <li>
                  <a id="lg-share-pinterest" target="_blank"
                    href="http://www.pinterest.com/pin/create/button/?url=https%3A%2F%2FStreet Pulse.com%2Fproduct%2Fmen-color-block-polo-t-shirt-2%2F&amp;media=https%3A%2F%2FStreet Pulse.com%2Fwp-content%2Fuploads%2F2024%2F09%2FITMTS01279SS-Poseidon_02.webp&amp;description=undefined">
                    <span class="pa-icon pa-4-icon fa-brands fa-pinterest-p"></span>
                    <span class="pa-dropdown-text">Pinterest</span>
                  </a>
                </li>
              </ul>
            </span>
            <span class="pa-icon" id="pa-actual-size">
              <i class="bi bi-aspect-ratio"></i>
            </span>
            <span class="pa-icon" id="pa-zoom-out">
              <i class="bi bi-zoom-out"></i>
            </span>
            <span class="pa-icon" id="pa-zoom-in">
              <i class="bi bi-zoom-in"></i>
            </span>
            <span class="pa-icon" onclick="openFullscreen()">
              <i class="bi bi-arrows-fullscreen"></i>
            </span>
            <span class="pa-icon" id="pa-autoplay">
              <i class="bi bi-play-circle"></i>
            </span>
            <span class="pa-icon" id="pa-download">
              <i class="bi bi-download"></i>
            </span>
            <span class="pa-icon" onclick="close_pa_modal()">
              <i class="bi bi-x-lg"></i>
            </span>
          </div>

        </div>
        <div class="pa-img-body">
          ${pa_img_body}
        </div>
        <div class="pa-slider-btn-container">
          <div class="pa-slider-btn pa-prev-btn " onclick="changePaImgBtn(1)">
            <i class="fa-solid fa-arrow-left"></i>
          </div>
          <div class="pa-slider-btn pa-next-btn" onclick="changePaImgBtn(2)">
            <i class="fa-solid fa-arrow-right"></i>
          </div>
        </div>
      </div>
    </div>
`;
};

const urlParams = new URLSearchParams(window.location.search);
let pid = urlParams.get("pid");
const vid = urlParams.get("vid");

const fetchprodid = () => {
  $.ajax({
    url: API_URL,
    method: "POST",
    data: { type: "fetchprodid", vid: vid },
    success: function (res) {
      pid = res.product_id;
    }
  });
};

// now safe to call
if (vid > 0) {
  fetchprodid();
}


let cat_id;
let userId = localStorage.getItem("userId");

let highlights = [];

const loadSingalProduct = async () => {

  await $.ajax({
    url: API_URL,
    method: "POST",
    data: { type: "loadSingalProduct", pid: pid, vid: vid, userId: userId },
    success: function (response) {
      console.log(response);

      if (response && response.status !== false) {
        loadHighlight(response);
        renderSinglaProduct(response);
      }
    },
    error: function (xhr, status, error) {
      console.error("AJAX Error:", status, error, xhr.responseText);
    }
  });
};


const renderSinglaProduct = (response) => {
  const productWrapper = $("#productWrapper");
  const data = response.data;

  if (!data) {
    console.error("No product data found");
    return;
  }

  // common variables
  let thumbnailImgHtml = "";
  let mainImgHtml = "";
  let productInfoHtml = "";
  let pa_img_body = "";

  // wishlist status
  let isWishlist = data.is_wishlisted == 1 ? "active" : "";
  let iconLabel = data.is_wishlisted == 1 ? "Remove From Wishlist" : "Add To Wishlist";

  // highlights
  if (Array.isArray(data.title) && Array.isArray(data.title_descr)) {
    for (let i = 0; i < data.title.length; i++) {
      highlights.push({
        title: data.title[i],
        title_desc: data.title_descr[i],
      });
    }
  }

  // color + size options
  let colorOptionHtml = "";
  let sizeOptionHtml = "";
  let isSizeDisabled = "";

  if (Array.isArray(data.variants)) {
    data.variants.forEach((item, index) => {
      // color selector
      colorOptionHtml += `
        <div class="sp-color-circle" id="selectColor${index}" 
             onclick='loadVariantProduct(${JSON.stringify(item)},${index})' 
             style="background-color:${item.color};">
          <div class="sp-tooltip">${item.color}</div>
        </div>
      `;

      if (!item.size || item.size === "disabled") {
        isSizeDisabled = "disabled";
      }

      sizeOptionHtml += `<div class="sp-size-box">${item.size}</div>`;

      // variant images
      if (item.single_image) {
        thumbnailImgHtml += `
          <div class="mini-img-box">
            <img src="${image_url + "variant/main/" + item.single_image}" 
                 onclick="changeImage(this)" alt="">
          </div>`;
        pa_img_body += `
          <img class="pa-img" 
               src="${image_url + "variant/main/" + item.single_image}" 
               alt="">`;
      }

      if (Array.isArray(item.multiple_images)) {
        item.multiple_images.forEach((img) => {
          thumbnailImgHtml += `
            <div class="mini-img-box">
              <img src="${image_url + "variant/multiple/" + img}" 
                   onclick="changeImage(this)" alt="">
            </div>`;
          pa_img_body += `
            <img class="pa-img" 
                 src="${image_url + "variant/multiple/" + img}" 
                 alt="">`;
        });
      }
    });
  }

  // handle if product or variant view
  if (response.pid == true) {
    // === Product View ===
    cat_id = data.category;

    // product images (main + multiple)
    thumbnailImgHtml = `
      <div class="mini-img-box active">
        <img src="${image_url + "product/main/" + data.main_image}" 
             onclick="changeImage(this)" alt="">
      </div>`;
    pa_img_body = `
      <img class="pa-img active" 
           src="${image_url + "product/main/" + data.main_image}" 
           alt="">`;

    if (Array.isArray(data.images)) {
      data.images.forEach((item) => {
        thumbnailImgHtml += `
          <div class="mini-img-box">
            <img src="${image_url + "product/multiple/" + item}" 
                 onclick="changeImage(this)" alt="">
          </div>`;
        pa_img_body += `
          <img class="pa-img" 
               src="${image_url + "product/multiple/" + item}" 
               alt="">`;
      });
    }

    // main image
    mainImgHtml = `
      <div class="main-image" id="full-img">
        <img id="vrntimg" 
             src="${image_url + "product/main/" + data.main_image}" 
             onclick="openActionImg(this)" alt="Main Product Image">
        <div class="prev-btn" onclick="changeImgBtn(1)">
          <i class="fa-solid fa-arrow-left"></i>
        </div>
        <div class="next-btn" onclick="changeImgBtn(2)">
          <i class="fa-solid fa-arrow-right"></i>
        </div>
      </div>`;

    // ✅ Deal price logic
    let mrpPrice = data.mrp;
    let sellingPrice = data.selling_price;
    if (data.deal_price !== null && data.deal_price !== 0) {
      mrpPrice = data.selling_price;
      sellingPrice = data.deal_price;
    }

    // discount calculation
    let discount = ((mrpPrice - sellingPrice) / mrpPrice) * 100;

    // product info
    productInfoHtml = `
      <div class="product-info">
        <span class="discount">${Math.round(((data.mrp - data.selling_price) / data.mrp) * 100)}%</span>
        <div class="k_row">
          <h2>${data.name}</h2>
          <div class="icon-with-label ${isWishlist}" onclick="addToWishlist(${data.id})">
            <span class="icon-label">${iconLabel}</span>
            <i class="fas fa-heart"></i>
          </div>
        </div>
        <div class="price-star">
          <div class="price k_row">
            <del id="vrntmrp">₹${mrpPrice}</del>
            <span style="color: #8a1344;" id="vrntsellprice">₹${sellingPrice}</span>
          </div>
        </div>
        <div class="sp-section">
          <span class="sp-label">Color :</span>
          <div class="sp-color-options">${colorOptionHtml}</div>
        </div>
        <div class="sp-section ${isSizeDisabled}">
          <span class="sp-label">Size :</span>
          <div class="sp-size-options" id="colorwisesize">${sizeOptionHtml}</div>
        </div>
        <div class="cart-item-quantity singal-product-item-quantity">
          <div class="cart-quantity-input-box singal-product-quantity-input-box">
            <button class="decrease"><i class="fa-solid fa-minus"></i></button>
            <button class="increase"><i class="fa-solid fa-plus"></i></button>
            <input type="number" class="quantity-input" value="1">
          </div>
          <button id="addToCartBtn" class="add-to-cart-btn" 
                  data-product-id="${data.id}" 
                  data-variant-id="${data.variant_id || ''}" 
                  onclick="addToCartHandler(this)">Add to cart</button>
        </div>
     
        </div>
      </div>`;

  } else {
    // === Variant View ===
    const differ = data.single_image;
    cat_id = data.category_id;

    thumbnailImgHtml = `
      <div class="mini-img-box active">
        <img src="${image_url + "variant/main/" + data.single_image}" 
             onclick="changeImage(this)" alt="">
      </div>`;
    pa_img_body = `
      <img class="pa-img active" 
           src="${image_url + "variant/main/" + data.single_image}" 
           alt="">`;

    if (Array.isArray(data.images)) {
      data.images.forEach((item) => {
        thumbnailImgHtml += `
          <div class="mini-img-box">
            <img src="${image_url + "variant/multiple/" + item}" 
                 onclick="changeImage(this)" alt="">
          </div>`;
        pa_img_body += `
          <img class="pa-img" 
               src="${image_url + "variant/multiple/" + item}" 
               alt="">`;
      });
    }

    mainImgHtml = `
      <div class="main-image" id="full-img">
        <img id="vrntimg" 
             src="${image_url + "variant/main/" + differ}" 
             onclick="openActionImg(this)" alt="Main Product Image">
        <div class="prev-btn" onclick="changeImgBtn(1)">
          <i class="fa-solid fa-arrow-left"></i>
        </div>
        <div class="next-btn" onclick="changeImgBtn(2)">
          <i class="fa-solid fa-arrow-right"></i>
        </div>
      </div>`;

    // ✅ Deal price logic for variant
    let mrpPrice = data.mrp;
    let sellingPrice = data.selling_price;
    if (data.deal_price !== null && data.deal_price !== 0) {
      mrpPrice = data.selling_price;
      sellingPrice = data.deal_price;
    }

    let discount = ((mrpPrice - sellingPrice) / mrpPrice) * 100;

    productInfoHtml = `
      <div class="product-info">
     <span class="discount">${Math.round(((item.mrp - item.selling_price) / item.mrp) * 100)}%</span>
        <div class="k_row">
          <h2>${data.name}</h2>
          <div class="icon-with-label ${isWishlist}" onclick="addToWishlist(${data.id})">
            <span class="icon-label">${iconLabel}</span>
            <i class="fas fa-heart"></i>
          </div>
        </div>
        <div class="price-star">
          <div class="price k_row">
            <del id="vrntmrp">₹${data.mrp}</del>
            <span style="color: #8a1344;" id="vrntsellprice">₹${data.selling_price}</span>
          </div>
        </div>
        <div class="sp-section">
          <span class="sp-label">Color :</span>
          <div class="sp-color-options">${colorOptionHtml}</div>
        </div>
        <div class="sp-section ${isSizeDisabled}">
          <span class="sp-label">Size :</span>
          <div class="sp-size-options" id="colorwisesize">${sizeOptionHtml}</div>
        </div>
        <div class="cart-item-quantity singal-product-item-quantity">
          <div class="cart-quantity-input-box singal-product-quantity-input-box">
            <button class="decrease"><i class="fa-solid fa-minus"></i></button>
            <button class="increase"><i class="fa-solid fa-plus"></i></button>
            <input type="number" class="quantity-input" value="1">
          </div>
          <button id="addToCartBtn" class="add-to-cart-btn" 
                  data-product-id="${data.product_id}" 
                  data-variant-id="${data.id}" 
                  onclick="addToCartHandler(this)">Add to cart</button>
        </div>
        <div class="delivery">
          <i class="fa-solid fa-truck-fast"></i>
          <span><strong>Estimated Delivery:</strong> &nbsp; 17 - 24 Apr, 2025</span>
        </div>
     

        </div>
      </div>`;

     
  }

  // product description
  $("#singal-product-desc").html(`
    <div class="single-product-desc">
      <h4>Product Details :</h4>
      <p>${data.description}</p>
      <p>Size:  ${data.size}<p>
               <div class="sp-color" >Color:<span style="background: ${data.color}; 
      padding: 1px 10px;
    margin-left: 5px;
    border-radius: 27%;"></span></div>
  
    </div>`);
    

  // recently viewed
  updateRecentlyViewed(data.id);

  // render everything
  productWrapper.html(`
    <div class="all">
    <div class="thumbnails">${thumbnailImgHtml}</div>
    <div className="main">${mainImgHtml}</div>
    </div>
    ${paImageCon(pa_img_body)}
    ${productInfoHtml}
  `);
  
};




function addToCartHandler(btn) {
  const productId = $(btn).attr("data-product-id");
  const variantId = $(btn).attr("data-variant-id") || null;
  addToCartProcess(productId, variantId, btn);
}






function showTab(index) {
  console.log(index);
  const tabs = document.querySelectorAll(".tab");
  const contents = document.querySelectorAll(".tab-content");

  tabs.forEach((tab, i) => {
    tab.classList.toggle("active", i === index);
    contents[i].classList.toggle("active", i === index);
  });
}

const loadHighlight = (product) => {
  let prod_id = product?.data?.id;

  $.ajax({
    url: API_URL,
    method: "POST",
    data: { type: "foronlyhighlights", prod_id: prod_id },
    success: function (response) {
      if (response.status && response.data) {
        let product = response.data;

        // Convert comma-separated strings into arrays
        let titles = product.title ? product.title.split(",") : [];
        let descriptions = product.title_descr ? product.title_descr.split(",") : [];

        if (titles.length && descriptions.length) {
          let highlightHtml = "";

          titles.forEach((t, i) => {
            let desc = descriptions[i] || "";
            highlightHtml += `
              <div style="margin-bottom: 9px;" class="highlight-item">
                <strong>${t}:</strong>&nbsp;&nbsp;${desc}
              </div>
            `;
          });

          $("#product-highlight").html(highlightHtml);
        } else {
          console.log("Highlights not available in product");
        }
      } else {
        console.log("Invalid API response");
      }
    }
  });
};





const addToWishlist = async (pid) => {
  let userId = localStorage.getItem("userId");

  if (userId == null) {
    warningAlert("please login first");
    return;
  }

  await $.ajax({
    url: API_URL,
    method: "post",
    data: { type: "addToWishlist", userId: userId, pid: pid },
    success: function (response) {
      if (response.status == true) {
        loadWishlistCount();
        loadSingalProduct();
        loadRelativeProduct();
      } else {
        alert(response.msg);
      }
    },
  });
};

function loadWishlistCount() {
  const wishlistIconBadge = $(".wishlist-icon-badge");
  let userId = localStorage.getItem("userId");

  if (userId == null) return;

  $.ajax({
    url: API_URL,
    method: "POST",
    data: { type: "loadWishlistCount", userId: userId },
    success: function (response) {
      if (response.status != false) {
        let total_items = response.total_items;
        wishlistIconBadge.html(total_items);
      }
    },
  });
}

loadWishlistCount();

const loadRelativeProduct = async () => {
  const productRelative = $("#product-relative");
  console.log(cat_id);

  await $.ajax({
    url: API_URL,
    method: "POST",
    data: {
      type: "loadProductsByCategory",
      pid: pid,
      cat_id: cat_id,
      userId: userId,
    },
    success: function (response) {
      if (response.status !== false && Array.isArray(response) && response.length > 0) {
        let productHtml = "";

        const productName = localStorage.getItem("selectedProductName");
        if (productName) {
          document.getElementById("product-title").textContent = productName;
        }

        response.forEach((item) => {
          let isWishlist = item.is_wishlisted == 1 ? "active" : "";
          let iconLabel = item.is_wishlisted == 1 ? "Remove From Wishlist" : "Add To Wishlist";

          let discount = ((item.mrp - item.selling_price) / item.mrp) * 100;

          productHtml += `
            <div class="product">
              <a class="product-img" href="singleproduct.html?pid=${item.id}" onclick="saveProductName('${item.name}')">
                <img src="${image_url}product/main/${item.main_image}" alt="">
              </a>
              <div class="product_info">
                <div class="discount-label">${Math.round(((item.mrp - item.selling_price) / item.mrp) * 100)}%</div>
                <p>${item.cat_name}</p>
                <h2>${item.description}</h2>

                <div class="price-container">
                  <span class="old-price">₹${item.mrp}</span>
                  <span class="new-price">₹${item.selling_price}</span>
                </div>

                <div class="icon-container">
                  <div class="icon-with-label" onclick="openQuickView(${item.id})">
                    <span class="icon-label">View Product</span>
                    <i class="fas fa-eye"></i>
                  </div>

                  <div class="icon-with-label ${isWishlist}" onclick="addToWishlist(${item.id})">
                    <span class="icon-label">${iconLabel}</span>
                    <i class="fas fa-heart"></i>
                  </div>
                </div>

                <button class="add-to-cart" onclick="addToCartProcess(${item.id})">
                  <i class="fa-solid fa-cart-shopping"></i> Add to Cart
                </button>
              </div>
            </div>
          `;
        });

        productRelative.html(productHtml);
      } else {
        productRelative.html("<p class='no-products'>No related products found.</p>");
      }
    },
    error: function (xhr, status, error) {
      console.error("AJAX Error:", error);
      productRelative.html("<p class='error'>Failed to load products.</p>");
    },
  });
};




function saveProductName(name) {
  localStorage.setItem("selectedProductName", name);
}

const addRating = async () => {
  let rating = localStorage.getItem("product_rating");
  let comment = $(".star-modal-textarea-input").val();

  if (login_status != "true") {
    warningAlert("Please login first");
    openModal();
    return;
  }

  if (rating == null) {
    warningAlert("Please select at least one star");
    return;
  }

  await $.ajax({
    url: API_URL,
    method: "POST",
    data: {
      type: "addRating",
      userId: userId,
      pid: pid,
      rating: rating,
      comment: comment,
    },
    success: function (response) {
      if (response.status == true) {
        console.log(response);
        localStorage.removeItem("product_rating");
        location.reload();
      }
    },
  });
};

const fetchProductRating = async () => {
  let productAllRatings = $("#product-all-ratings");

  await $.ajax({
    url: API_URL,
    method: "POST",
    data: { type: "fetchProductRating", pid: pid },
    success: function (response) {
      console.log(response);
      if (response != false) {
        // <div class="item-review-star" style="color: #f0c040; font-size: 16px; margin-top: 4px;">
        //     ★★★★ <span style="color: gray; font-size: 14px;">(0 reviews)</span>
        // </div>

        let ratingCount = 0;
        let stars = "";
        let reviewStarContainer = $(".item-review-star");
        let len = response.length;
        let reviewHtml = "";

        response.map((item) => {
          ratingCount = ratingCount + parseInt(item.rating);
          let star = "";
          for (i = 1; i <= item.rating; i++) {
            star += '<i class="star">★</i>';
          }
          reviewHtml += `
                    
                    <div class="rating-wrapper">
                            <h2 class="rating-title">${item.fullname}</h2>

                            <div class="rating-review-section">
                                <div class="rating-left">
                                    <div class="stars" id="star-container">
                                        ${star} (${item.rating})
                                    </div>
                                </div>
                                <div class="rating-right">

                                </div>
                            </div>
                            <div>${item.comment}</div>
                            <hr class="rating-divider">
                    </div>
                    `;
        });

        ratingCount = ratingCount / response.length + 1;


        for (i = 1; i < parseInt(ratingCount); i++) {
          stars += `★`;
        }

        reviewStarContainer.html(`
                    ${stars} <span style="color: gray; font-size: 14px;">(${len} reviews)</span>
                    `);

        productAllRatings.html(reviewHtml);
        $("#show-review").html(`Reviews (${len})`);

      } else {
        productAllRatings.html("Not Any reviews");
      }
    },
  });
};

fetchProductRating();

function updateRecentlyViewed(currentProductId) {
  let viewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

  viewed = viewed.filter((id) => id !== currentProductId);
  viewed.unshift(currentProductId);

  if (viewed.length > 12) viewed.pop();

  localStorage.setItem("recentlyViewed", JSON.stringify(viewed));
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
        
        html += `
           <div class="product" style="margin-bottom: 51px;">
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





const loadVariantProduct = (variant, index) => {


  // 1. Update Price
  $("#vrntmrp").text("₹" + variant.mrp);
  $("#vrntsellprice").text("₹" + variant.selling_price);

  // 2. Update Main Image (always from single_image first)
  let mainImgSrc = image_url + "variant/main/" + variant.single_image;
  $("#vrntimg").attr("src", mainImgSrc);

  // 3. Clear old thumbnails + PA images
  $(".thumbnails").empty();
  $(".pa-img-body").empty();

  let counter = 0;

  // 4. Always add Main Image first
  $(".thumbnails").append(`
    <div class="mini-img-box active">
      <img src="${mainImgSrc}" 
           onclick="changeImage(this)" alt="Variant Main Image">
    </div>
  `);

  $(".pa-img-body").append(`
    <img class="pa-img active" 
         src="${mainImgSrc}" alt="Variant Main Image">
  `);

  counter++;

  // 5. Then add Multiple Images (if available)
  if (variant.images && variant.images.length > 0) {
    variant.images.forEach((img) => {
      $(".thumbnails").append(`
        <div class="mini-img-box">
          <img src="${image_url}variant/multiple/${img}" 
               onclick="changeImage(this)" alt="Variant Thumbnail">
        </div>
      `);

      $(".pa-img-body").append(`
        <img class="pa-img" 
             src="${image_url}variant/multiple/${img}" alt="Variant Image">
      `);

      counter++;
    });
  }

  // 6. Update counters
  $("#pa-counter-all").text(counter);
  $("#pa-counter-current").text(1);

  // 7. Update Size
  if (variant.size && variant.size !== "disabled" && variant.size !== "") {
    $("#colorwisesize").html(`<div class="sp-size-box">${variant.size}</div>`);
  } else {
    $("#colorwisesize").html(`<div class="sp-size-box disabled">N/A</div>`);
  }

  //   8.foraddtocart
  $("#addToCartBtn")
    .attr("data-product-id", variant.product_id)
    .attr("data-variant-id", variant.id);

};



function getsize(size) {
  $("#getsize").css("border", "1px solid red");
}

