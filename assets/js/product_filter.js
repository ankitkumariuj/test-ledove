function getPriceFromURL() {
    const searchonurl = new URLSearchParams(window.location.search);
    return searchonurl.get("price") ? parseInt(searchonurl.get("price")): "0";
}

    

function fetchProductsUnder(priceLimit) {
    $.ajax({
        url: API_URL,
        method: "POST",
        data: { type: "fetchallproducts" },
        success: function(response) {
            if(response.status = true ){
                const filterproduct = response.filter(p => parseInt(p.selling_price) <= priceLimit);
                console.log(`Products under ${priceLimit}:`, filterproduct);

                document.getElementById("desc_text").innerHTML = "Product Under : " + `${priceLimit} `;


                let html ='';
                 filterproduct.map((item) => {
          let discount = ((item.mrp - item.selling_price) / item.mrp) * 100;
// console.log(discount);
          html += `
          <div class="product">
            <a class="product-img" href="singleproduct.html?pid=${item.id}">
              <img src="${image_url + "product/main/" + item.main_image}" alt="">
            </a>
              <div class="product_info">
            <div class="discount-label">${((item.mrp - item.selling_price)/ item.mrp).toFixed(1) * 100}%</div>
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
                <div class="icon-with-label" onclick="addToWishlist(${item.id})">
                    <span class="icon-label">Add To Wishlist</span>
                    <i class="fas fa-heart"></i>
                </div>
            </div>

            <button class="add-to-cart" onclick="addToCartProcess(${item.id})">
              <i class="fa-solid fa-cart-shopping"></i> Add to Cart
            </button>
            </div>
          </div>`;
        });

       $("#product-container").html(html);
              

            }
        }
    });
}

const priceLimit = getPriceFromURL()
fetchProductsUnder(priceLimit);


