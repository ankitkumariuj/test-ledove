

let currentData = [];

const loadProductCart = async () => {
  let userId = localStorage.getItem("userId");

  await $.ajax({
    url: API_URL,
    method: "POST",
    data: { type: "loadProductCart", userId: userId },
    success: function (response) {
      
      console.log(response)
      if (response.status !== false) {
        currentData = response;
        renderBestSellerProducts(response);
      }
    },
  });
};

// bestSellerFilterByCategory

const filterBycategory = (type, id) => {
  let data;
  if (type == "top-20") {
    data = currentData.slice(0, 20);
    renderBestSellerProducts(data);
  } else if (type == "cat_id") {
    data = currentData.filter((a) => a.category == id);
  }
  renderBestSellerProducts(data);
};

const renderBestSellerProducts = (data) => {
  const bestSellerProducts = $("#bestSellerProducts");

  if (data.status !== false) {
    let productHtml = "";
    let isWishlist = "";
    let iconLabel = "";
    data.map((item) => {
      if (item.is_wishlisted == 1) {
        isWishlist = "active";
        iconLabel = "Remove From Wishlist";
      } else {
        isWishlist = "";
        iconLabel = "Add To Wishlist";
      }
      let discount = ((item.mrp - item.selling_price) / item.mrp) * 100;

      productHtml += `
          
            <div class="product_card1" >
 <img src="${image_url + "/product/main/" + item.main_image}" alt="" onclick="window.location.href='singleproduct.html?pid=${item.id}'">
  <div class="product_info1">
    <h4>${item.description}</h4>
    <div class="price-con">
      <div class="price-box">
      <p class="selling-price">₹${parseInt(item.selling_price)}</p> 
<p class="mrp">₹${parseInt(item.mrp)}</p>

      <p class="discount">${((item.mrp - item.selling_price)/ item.mrp).toFixed(1) * 100}% OFF</p>
    </div>
    <div class="wishlist-icon" >
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_1_2906)">
<path d="M7.58114 2.6042L6.90167 1.90578C5.30677 0.266337 2.38231 0.832088 1.32662 2.89324C0.830994 3.86269 0.719171 5.26238 1.62418 7.04871C2.49602 8.7687 4.30984 10.8289 7.58114 13.073C10.8524 10.8289 12.6653 8.7687 13.5381 7.04871C14.4431 5.26143 14.3322 3.86269 13.8357 2.89324C12.78 0.832088 9.85552 0.26539 8.26061 1.90483L7.58114 2.6042ZM7.58114 14.2149C-6.94926 4.61323 3.10726 -2.88083 7.41436 1.08322C7.47122 1.13565 7.52681 1.18967 7.58114 1.24527C7.63452 1.18932 7.69017 1.13557 7.74793 1.08416C12.0541 -2.88272 22.1115 4.61228 7.58114 14.2149Z" fill="black"/>
</g>
<defs>
<clipPath id="clip0_1_2906">
<rect width="15.1625" height="15.1625" fill="white"/>
</clipPath>
</defs>
</svg>



  

    </div>
    </div>
  </div>
</div>
          `;
    });

    bestSellerProducts.html("");
    bestSellerProducts.html(productHtml);
  }
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
        loadProductCart();
        fetchTodayBestDeal();
        fetchCategoryPriority();
      } else {
        alert(response.msg);
      }
    },
  });
};

const addRating = async (pid) => {
    
    let userId = localStorage.getItem("userId");
    
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



function quickViewChangeImg(action) {
  if (action === undefined) {
    action = 2;
  }

  let activeImg = document.querySelectorAll(".h_product_view_imgs img");
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

// fetch category_priority

const fetchCategoryPriority = async () => {
  await $.ajax({
    url: API_URL,
    method: "POST",
    data: { type: "fetchCategoryPriority" },
    success: function (response) {
      // console.log(response)
      if (response.status !== false) {
        let sub_name_data = [];

        response.forEach((item, index) => {
          // sub_name और sub_id को comma से अलग array में बदलते हैं
          const subNames = item.sub_name ? item.sub_name.split(",") : [];
          const subIds = item.sub_id ? item.sub_id.split(",") : [];

          sub_name_data.push({
            cat_id: item.cat_id,
            cat_name: item.cat_name,
            sub_id: subIds,
            sub_name: subNames,
          });
        });



        // 👉 अब इस data को UI में render कर सकते हो:
        renderPriorityCategories(sub_name_data);
      }
    },
  });
};

// ✨ Render करने का example function:
function renderPriorityCategories(data) {
  data.forEach((item, index) => {
    // Container ID is 1-based, index is 0-based
    const containerId = `#tab-container-${index + 1}`;

    // Subcategory HTML – reset for every category
    let subHtml = "";

    if (item.sub_id.length > 0 && item.sub_name.length > 0) {
      item.sub_id.forEach((id, subIndex) => {
        const subName = item.sub_name[subIndex];
        subHtml += `
          <div onclick="filterBySubcategory('${id}','${item.cat_id}','product${
          index + 1
        }')" class="tab">${subName}</div>
        `;
      });
    }

    // Inject HTML into respective container
    $(containerId).html(`
      <h2>${item.cat_name}</h2>
      <div class="tabs">
      <div onclick="topProductsByCategory('${item.cat_id}' , 'product${
      index + 1
    }')" class="tab active">Top 20</div>
      ${subHtml}
      </div>
    `);
    topProductsByCategory(item.cat_id, `product${index + 1}`);
  });
}

// 👉 Subcategory पर क्लिक होने पर filter call
function filterBySubcategory(subId, catId, showContainer) {
  console.log("Filtering with sub_id:", subId);

  let userId = localStorage.getItem("userId");
  $.ajax({
    url: API_URL,
    method: "POST",
    data: {
      type: "fetchProductBySubCat",
      subCat_id: subId,
      cat_id: catId,
      userId: userId,
    },
    success: function (response) {
      if (response.status != false) {
        let productHtml = "";

        response.map((item) => {
          let discount = ((item.mrp - item.selling_price) / item.mrp) * 100;
  let isWishlist = item.is_wishlisted == 1 ? "active" : "";
          let iconLabel =
            item.is_wishlisted == 1
              ? "Remove From Wishlist"
              : "Add To Wishlist";

          productHtml += `
          
          <div class="product">
            <a class="product-img" href="singleproduct.html?pid=${
              item.id
            }" onclick="saveProductName('${item.name}')"><img src="${
            image_url + "/product/main/" + item.main_image
          }" alt=""></a>
            <div class="product_info">
            <div class="discount-label">${Math.round(((item.mrp - item.selling_price) / item.mrp) * 100)}%</div>
            <p>${item.name}</p>
            <h2>${item.description}</h2>
           
            <div class="price-container">
            <div class="price">
                <span class="old-price">₹${item.mrp}</span>
                <span class="new-price">₹${item.selling_price}</span>
                </div>
                 <div class="icon-with-label ${isWishlist}" onclick="addToWishlist(${
            item.id
          })">
                    <span class="icon-label">${iconLabel}</span>
                    <i class="fas fa-heart" style="box-shadow: unset  "></i>
                </div>
            </div>


            <div class="icon-container">
                <!-- Eye Icon with Label -->
                <div class="icon-with-label" onclick="openQuickView(${
                  item.id
                })">
                    <span class="icon-label">View Product</span>
                    <i class="fas fa-eye"></i>
                </div>

                <!-- Heart Icon with Label -->
               
            </div>


            
       <button class="add-to-cart" onclick="addToCartProcess(${ item.id })"> <i class="fa-solid fa-cart-shopping"></i>Add to Cart</button>
</div>
        </div>
          `;
        });

        $(`#${showContainer}`).html(productHtml);
      } else {
        $(`#${showContainer}`).html(emptyHtml);
      }
    },
  });
}

const topProductsByCategory = (cat_id, showContainer) => {


  let data = currentData.filter((a) => a.category == cat_id);
  let productHtml = "";



  if (data.length > 0) {
    data.map((item) => {
      let discount = ((item.mrp - item.selling_price) / item.mrp) * 100;

      if (item.is_wishlisted == 1) {
        isWishlist = "active";
        iconLabel = "Remove From Wishlist";
      } else {
        isWishlist = "";
        iconLabel = "Add To Wishlist";
      }

      productHtml += `
            
            <div class="product">
              <a class="product-img" href="singleproduct.html?pid=${
                item.id
              }" onclick="saveProductName('${item.name}')"><img src="${
        image_url + "/product/main/" + item.main_image
      }" alt=""></a>
        <div class="product_info">
              <div class="discount-label">${Math.round(((item.mrp - item.selling_price) / item.mrp) * 100)}%
</div>
              <p>${item.name}</p>
              <h2>${item.description}</h2>
             
              <div class="price-container">
              <div class="price">
                  <span class="old-price">₹${item.mrp}</span>
                  <span class="new-price">₹${item.selling_price}</span>
              </div>
                  <!-- Heart Icon with Label -->
                  <div class="icon-with-label ${isWishlist}" onclick="addToWishlist(${
        item.id
      })">
                      <span class="icon-label">${iconLabel}</span>
                      <i class="fas fa-heart" style="box-shadow: unset"></i>
                  </div>
                     </div>
  
  
              <div class="icon-container">
                  <!-- Eye Icon with Label -->
                  <div class="icon-with-label" onclick="openQuickView(${
                    item.id
                  })">
                      <span class="icon-label">View Product</span>
                      <i class="fas fa-eye"></i>
                  </div>
  
              
              </div>
  
  
             
              <button class="add-to-cart" onclick="addToCartProcess(${ item.id })"> <i class="fa-solid fa-cart-shopping"></i>Add to Cart</button>
  </div>
          </div>
            `;
    });

    $(`#${showContainer}`).html(productHtml);
  } else {
    $(`#${showContainer}`).html(emptyHtml);
  }
};


// 1
const fetchprodaccordtotittle = () => {
  $.ajax({
    url: API_URL, 
    type: "POST",
    data: { type: "fetchprodaccordtotittle1" }, 
    dataType: "json",
    success: function (response) {
      console.log(response);

      if (response && response.length > 0) {

        // Set the title dynamically
        $(".title-section h2").text(response[0].title_name);

        let html = "";

        response.map((item) => {
          let discount = ((item.mrp - item.selling_price) / item.mrp) * 100;

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

          html += `          
           <div class="product">
            <a class="product-img" href="singleproduct.html?pid=${item.id}" onclick="saveProductName('${item.name}')">
              <img src="${image_url + "/product/main/" + item.main_image}" alt="">
            </a>
              <div class="product_info">
              <p>${item.name}</p>
           
              
              <div class="price-container">
              <div class="price">
              <span class="new-pricebpcs">₹${parseInt(item.selling_price)}/Pcs</span>
              </div>
              <span class="old-pricepcs">MRP ₹${parseInt(item.mrp)} | MOQ: ${item.stock}Pcs</span>
              <div class="discount-label">${Math.round(((item.mrp - item.selling_price) / item.mrp) * 100)}% Margin
  </div>
               <!-- Heart Icon with Label -->
               
                </div>

            <div class="icon-container">
                <!-- Eye Icon with Label -->
                <div class="icon-with-label" ${isWishlist}" onclick="addToWishlist(${item.id})">
                    <span class="icon-label">${iconLabel}</span>
                    <i class="fas fa-heart" ></i>
                </div>

             
            </div>

 <button class="add-to-cart" onclick="addToCartProcess(${
                              item.id
                            })"> <i class="fa-solid fa-cart-shopping"></i>Add to Cart</button>         </div> </div>`;
        });

        // Render products
        $("#fetchprodaccordtotittles").html(html);
      } else {
        $("#fetchprodaccordtotittles").html("<p>No products found.</p>");
      }
    },
    error: function (xhr, status, error) {
      console.error("AJAX Error:", error);
      $("#fetchprodaccordtotittles").html("<p>Something went wrong.</p>");
    },
  });
};

// 2
const Productfetchaccodtotiitles2 = () => {
  $.ajax({
    url: API_URL, 
    type: "POST",
    data: { type: "fetchprodaccordtotittle2" }, 
    dataType: "json",
    success: function (response) {

      if (response && response.length > 0) {

        // Set the title dynamically
        $(".section_tittle_2 h2").text(response[0].title_name);

        let html = "";

        response.map((item) => {
          let discount = ((item.mrp - item.selling_price) / item.mrp) * 100;

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

          html += `          
          <div class="product">
            <a class="product-img" href="singleproduct.html?pid=${item.id}" onclick="saveProductName('${item.name}')">
              <img src="${image_url + "/product/main/" + item.main_image}" alt="">
            </a>
              <div class="product_info">
              <p>${item.name}</p>
           
              
              <div class="price-container">
              <div class="price">
              <span class="new-pricebpcs">₹${parseInt(item.selling_price)}/Pcs</span>
              </div>
              <span class="old-pricepcs">MRP ₹${parseInt(item.mrp)} | MOQ: ${item.stock}Pcs</span>
              <div class="discount-label">${Math.round(((item.mrp - item.selling_price) / item.mrp) * 100)}% Margin
  </div>
               <!-- Heart Icon with Label -->
               
                </div>

            <div class="icon-container">
                <!-- Eye Icon with Label -->
                <div class="icon-with-label" ${isWishlist}" onclick="addToWishlist(${item.id})">
                    <span class="icon-label">${iconLabel}</span>
                    <i class="fas fa-heart" ></i>
                </div>

             
            </div>

 <button class="add-to-cart" onclick="addToCartProcess(${
                              item.id
                            })"> <i class="fa-solid fa-cart-shopping"></i>Add to Cart</button>         </div> </div>`;
        });

        // Render products
        $("#Productfetchaccodtotiitles2").html(html);
      } else {
        $("#Productfetchaccodtotiitles2").html("<p>No products found.</p>");
      }
    },
    error: function (xhr, status, error) {
      console.error("AJAX Error:", error);
      $("#Productfetchaccodtotiitles2").html("<p>Something went wrong.</p>");
    },
  });
};

// 3
const fetchnothreeprodsaccordtotittle = () => {
  $.ajax({
    url: API_URL, 
    type: "POST",
    data: { type: "fetchprodaccordtotittle3" }, 
    dataType: "json",
    success: function (response) {

      if (response && response.length > 0) {

        // Set the title dynamically
  $(".section_tittle_3 h2").text(response[0].title_name);
// console.log(name)
        let html = "";

        response.map((item) => {
          let discount = ((item.mrp - item.selling_price) / item.mrp) * 100;

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

          html += `          
          <div class="product">
            <a class="product-img" href="singleproduct.html?pid=${item.id}" onclick="saveProductName('${item.name}')">
              <img src="${image_url + "/product/main/" + item.main_image}" alt="">
            </a>
              <div class="product_info">
              <p>${item.name}</p>
           
              
              <div class="price-container">
              <div class="price">
              <span class="new-pricebpcs">₹${parseInt(item.selling_price)}/Pcs</span>
              </div>
              <span class="old-pricepcs">MRP ₹${parseInt(item.mrp)} | MOQ: ${item.stock}Pcs</span>
              <div class="discount-label">${Math.round(((item.mrp - item.selling_price) / item.mrp) * 100)}% Margin
  </div>
               <!-- Heart Icon with Label -->
               
                </div>

            <div class="icon-container">
                <!-- Eye Icon with Label -->
                <div class="icon-with-label" ${isWishlist}" onclick="addToWishlist(${item.id})">
                    <span class="icon-label">${iconLabel}</span>
                    <i class="fas fa-heart" ></i>
                </div>

             
            </div>

 <button class="add-to-cart" onclick="addToCartProcess(${
                              item.id
                            })"> <i class="fa-solid fa-cart-shopping"></i>Add to Cart</button>         </div> </div>`;
        });

        // Render products
        $("#fetchnothreeprodsaccordtotittle").html(html);
      } else {
        $("#fetchnothreeprodsaccordtotittle").html("<p>No products found.</p>");
      }
    },
    error: function (xhr, status, error) {
      console.error("AJAX Error:", error);
      $("#fetchnothreeprodsaccordtotittle").html("<p>Something went wrong.</p>");
    },
  });
};



// helper function to render star ratings
function renderStars(rating) {
  let html = "";
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;

  for (let i = 0; i < fullStars; i++) html += `<i class="fas fa-star"></i>`;
  if (halfStar) html += `<i class="fas fa-star-half-alt"></i>`;
  for (let i = fullStars + (halfStar ? 1 : 0); i < 5; i++)
    html += `<i class="far fa-star"></i>`;

  return html;
}

fetchprodaccordtotittle();
Productfetchaccodtotiitles2();
fetchnothreeprodsaccordtotittle();
















