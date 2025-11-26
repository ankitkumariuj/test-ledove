

const openQuickView = async (pid , type = null) => {
      let vid = 0;
     if(type == 'vid'){
         
          vid = pid;
          pid = 0;
          
    $("body").css("overflow", "hidden");

    const container = $("#h_quick_view_Container");
    let userId = localStorage.getItem("userId");

    
      }else{

    $("body").css("overflow", "hidden");

    const container = $("#h_quick_view_Container");
    let userId = localStorage.getItem("userId");

    await $.ajax({
        url: API_URL,
        method: 'POST',
        data: { type: 'loadSingalProduct', pid: pid, vid:vid,  userId: userId },
        success: function (response) {
            console.log(response);
            if (response && response.status !== false && response.data) {

                let product = response.data;
                let h_product_view_imgs = '';
                let productInfoHtml = '';

                // Wishlist handling
                let isWishlist, iconLabel;
                if (product.is_wishlisted == 1) {
                    isWishlist = 'active';
                    iconLabel = 'Remove From Wishlist';
                } else {
                    isWishlist = '';
                    iconLabel = 'Add To Wishlist';
                }

                // Handle images
                if (product.images && product.images.length > 0) {
                    product.images.forEach((item, index) => {
                        let isActive = (index === 0) ? 'active' : '';
                        h_product_view_imgs += `
                            <img class="${isActive}" src="${image_url + 'product/main/' + product.main_image}" onclick="quickViewChangeImg(this)" alt="">
                        `;
                    });
                } else {
                    h_product_view_imgs += `
                        <img class="active" src="${image_url + 'product/main/' + product.main_image}" onclick="quickViewChangeImg(this)" alt="">
                    `;
                }

                // Calculate discount
                let discount = ((product.mrp - product.selling_price) / product.mrp) * 100;

                // Ratings
                let averageRating = parseFloat(product.average_rating || 0).toFixed(1);
                let totalReviews = product.total_reviews || 0;

                // Create star rating
                let starHtml = '';
                for (let i = 1; i <= 5; i++) {
                    if (i <= Math.round(averageRating)) {
                        starHtml += '★';
                    } else {
                        starHtml += '☆';
                    }
                }

                // Build product info HTML
                productInfoHtml += `
                    <div class="h_product_desc">
                        <span class="h_product_discount">${parseInt(discount)}%</span>
                        <div class="h_product_view_top k_flex space-between">
                            <h2>${product.name}</h2>
                            <div class="icon-with-label h_icon_with_label ${isWishlist}" onclick="addToWishlist(${product.id})">
                                <span class="icon-label">${iconLabel}</span>
                                <i class="fas fa-heart"></i>
                            </div>
                        </div>
                        <div class="h_product_view_middle k_flex space-between">
                            <div class="h_product_price">
                                <h3 class="fake_price k_flex"><del>₹${product.mrp}</del><span class="price">₹${product.selling_price}</span></h3>
                            </div>
                            <div class="item-review-star" style="color: #f0c040; font-size: 16px; margin-top: 4px;">
                                ${starHtml} 
                                <span style="color: gray; font-size: 14px;">(${totalReviews} Reviews, Avg: ${averageRating})</span>
                            </div>
                        </div>
                        <div class="h_product_qty_input">
                            <div class="cart-item-quantity h_product_qty">
                                <div class="cart-quantity-input-box h_product_quantity_input">
                                    <button class="decrease">
                                        <i class="fa-solid fa-minus"></i>
                                    </button>
                                    <button class="increase">
                                        <i class="fa-solid fa-plus"></i>
                                    </button>
                                    <input type="number" class="quantity-input" value="1">
                                </div>
                                <button class="add-to-cart-btn" onclick="addToCartProcess(${product.id},null, this)">Add to cart</button>
                            </div>
                        </div>
                       
                        <div class="singal_product_option options">
                            <div class="k_add_rating k_flex k_gap_10" onclick="openRatingPopup(${pid})"><i class="bi bi-star"></i>Add
                                Ratings</div>
                        </div>
                        <div class="payment-logos">
                            <div class="payment-logos-img-container">
                                <div class="payment-logo-img-full">
                                    <img src="../assets/images/payment.png" alt="">
                                </div>
                            </div>
                            <div class="secure">Guaranteed safe &amp; secure checkout</div>
                        </div>
                    </div>
                `;

                // Final container HTML
                container.html(`
                    <div class="h_quick_view_overlay" id="h_quick_view_overlay" onclick="closeQuickView()"></div>
                    <div class="h_product_view">
                        <div class="h_product_view_img">
                            <div class="h_product_view_imgs">
                                ${h_product_view_imgs}
                            </div>
                            <div class="h_product_img_next k_flex" onclick="quickViewChangeImg(1)">
                                <i class="fa-solid fa-arrow-right"></i>
                            </div>
                            <div class="h_product_img_prev k_flex" onclick="quickViewChangeImg(1)">
                                <i class="fa-solid fa-arrow-left"></i>
                            </div>
                        </div>
                        <div class="close_h_product k_flex" onclick="closeQuickView()">
                            <i class="bi bi-x-lg" style="    position: absolute;
    left: 31%;"></i>
                        </div>
                        ${productInfoHtml}
                    </div>
                `);
            }
            $(".h_product_view_container").css("display", "flex");
            $(".h_quick_view_overlay").addClass('active');
        }
    });
      }
};




function closeQuickView() {
  $("body").css("overflow", "auto");

  const $productView = $(".h_product_view");
  const $container = $(".h_product_view_container");

  $productView.css({
    animation: "slideDown 0.6s ease-in-out forwards"
  });

  setTimeout(() => {
    $container.css("display", "none");
    $productView.css("animation", ""); 
  }, 600); 
}



