const fetchWishlist = async () => {
    let userId = localStorage.getItem("userId");
    const wishlistContainer = $("#wishlistContainer");

    // Case: user not logged in
    if (userId == null) {
        wishlistContainer.html(`
            <div class="empty-cart-messages">
                <div class="empty-cart-icon">
                    <img src="../assets/images/empty-wishlist-img.png" width="350" height="307" alt="Wishlist empty">
                </div>
            </div>
        `);
        return;
    }

    await $.ajax({
        url: API_URL,
        method: "POST",
        // 🚀 add a timestamp to prevent cache
        data: { type: "fetchWishlist", userId: userId, t: new Date().getTime()  },
        success: function (response) {
            wishlistContainer.empty(); // 🚀 always clear before appending

            if (response && response.status !== false && response.length > 0) {
                response.sort((a, b) => b.wishlist_id - a.wishlist_id);

                let wishlistHtml = "";

                response.forEach(item => {
                    let productId = item.product_id || item.id;
                    let variantId = item.variant_id || 0;
                    let name = item.name;

                    let imageSrc = "";
                    let price = "";
                    let mrp = "";
                    let variantInfo = "";

                    if (variantId && item.variant_id != 0) {
                        imageSrc = item.single_image
                            ? image_url + "variant/main/" + item.single_image
                            : image_url + "product/main/" + item.main_image;

                        price = item.variant_price || item.selling_price;
                        mrp = item.variant_mrp || item.mrp;

                        if (item.color || item.size) {
                            variantInfo = `<p class="wishlist-variant">Variant: ${item.color || ""} ${item.size || ""}</p>`;
                        }
                    } else {
                        imageSrc = image_url + "product/main/" + item.main_image;
                        price = item.selling_price;
                        mrp = item.mrp;
                    }

                    wishlistHtml += `
   
            
                        <div class="wishlist-cart-content k_flex k_gap_10 k_items_start">
                            <div class="wishlist-product-img">
                                     <a href="singleproduct.html?pid=${item.product_id}" >
                                <img src="${imageSrc}" alt="${name}">
                                   </a>
                            </div>

                            <div class="wishlist-product-desc k_flex_col k_gap_5">
                                <h3>${name}</h3>
                                ${variantInfo}
                                <h3 class="wishlist-price">₹${price} &nbsp;<del>₹${mrp}</del></h3>
                                <span id="off_remove">
                                <h4>22% Off</h4>
                                <span class="wishlist-remove" onclick="removeWishlist(event, ${item.wishlist_id})"><i class="fa-solid fa-trash-can" style="color: #ff0000a6;"></i></span>
                                </span>
                            </div>
                        </div>
                     
                    `;
                });

                wishlistContainer.html(wishlistHtml);
            } else {
                wishlistContainer.html(`
                    <div class="empty-cart-messages">
                        <div class="empty-cart-icon">
                            <img src="../assets/images/empty-wishlist-img.png" width="350" height="307" alt="Wishlist empty">
                        </div>
                    </div>
                `);
            }
        }
    });
};


function removeWishlist(event, wishlist_id) {
    event.preventDefault(); 

    $.ajax({
        url: API_URL,
        method: "POST",
        data: { type: "removeWishlist", wishlist_id: wishlist_id },
        success: function (response) {
            if (response.status === true) {
                fetchWishlist();     // refresh list immediately
                loadWishlistCount(); // refresh count
            }
        }
    });
}
