const cartData = {};
const cartDrawer = document.getElementById('bd-cartDrawer');
const cartOverlay = document.getElementById('bd-cartOverlay');
const cartBody = document.getElementById('bd-cartBody');
const subtotalEl = document.getElementById('bd-subtotal');
const totalEl = document.getElementById('bd-total');
const cartFooter = document.getElementById('bd-cartFooter');
const body = document.querySelector("body");
function openCart() {

  if (window.location.pathname.includes('checkout.html')) {
    window.location.href = "view-cart.html";
    return;
  }

  cartDrawer.classList.add('open');
  cartOverlay.style.display = 'block';
  body.style.overflow = 'hidden';
}

function closeCart() {
  cartDrawer.classList.remove('open');
  cartOverlay.style.display = 'none';
  body.style.overflow = 'auto';
}

document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', () => {
    const id = button.dataset.id;
    const title = button.dataset.title;
    const price = button.dataset.price;
    const img = button.dataset.img;

    if (cartData[id]) {
      cartData[id].qty += 1;
    } else {
      cartData[id] = { title, price, img, qty: 1 };
    }

    updateCartDrawer();
    openCart();
  });
});

function updateCartDrawer() {
  cartBody.innerHTML = '';

  if (Object.keys(cartData).length == 1) {
    cartBody.innerHTML = `
      <img src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png" alt="Empty Cart" class="bd-empty-cart-img" />
      <h3>Your cart is currently empty.</h3>
      <p>You may check out all the available products and buy some in the shop.</p>
      <button onclick="window.location.href='shop.html'" class="bd-cart-btn">Return to shop</button>
    `;
    cartFooter.style.display = 'none'; // Hide footer
    return;
  }

  let total = 0;  

  for (let id in cartData) {
    const item = cartData[id];
    const subtotal = item.qty * parseFloat(item.price);
    total += subtotal;

    cartBody.innerHTML += `
      <div class="bd-cart-item">
        <img src="${item.img}" alt="${item.title}" />
        <div>
          <h4>${item.title}</h4>
          <p>₹${item.price}</p>
          <div>
            <button onclick="changeQty('${id}', -1)">-</button>
            ${item.qty}
            <button onclick="changeQty('${id}', 1)">+</button>
            <a href="#" onclick="removeFromCart('${id}')">Remove</a>
          </div>
        </div>
      </div>
    `;
  }

  subtotalEl.textContent = `₹${total.toFixed(2)}`;
  totalEl.textContent = `₹${total.toFixed(2)}`;
  cartFooter.style.display = 'block'; // Show footer
}

function changeQty(id, delta) {
  cartData[id].qty += delta;
  if (cartData[id].qty <= 0) delete cartData[id];
  updateCartDrawer();
}

function removeFromCart(id) {
  delete cartData[id];
  updateCartDrawer();
}


$(document).on('click', '.increase', function () {
  const input = $(this).siblings('input[type="number"]');
  let currentValue = parseInt(input.val()) || 0;
  input.val(currentValue + 1);
});

$(document).on('click', '.decrease', function () {
  const input = $(this).siblings('input[type="number"]');
  let currentValue = parseInt(input.val()) || 1;
  if (currentValue > 1) {
    input.val(currentValue - 1);
  }
});




let Iduser = localStorage.getItem("userId");
let total = 0;






const addToCartProcess = (itemId, vid = null, btn = null) => {
  let qty = 1;

  if (btn && btn instanceof HTMLElement) {
    const qtyBox = btn.closest(".cart-item-quantity")?.querySelector(".quantity-input");
    if (qtyBox) {
      const parsedQty = parseInt(qtyBox.value, 10);
      qty = isNaN(parsedQty) ? 1 : parsedQty;
    }
  }

  if (login_status !== "true") {
    warningAlert("Login first");
    openModal();
    return;
  }

  setTimeout(() => openCart(), 100);

  let idfr = window.localStorage.getItem("idfr");
  if (!idfr) {
    idfr = Date.now();
    window.localStorage.setItem("idfr", idfr);
  }

  $.ajax({
    url: API_URL,
    method: "POST",
    data: {
      type: "addToCart",
      userId: Iduser,
      pid: itemId,
      vid: vid,
      idfr: idfr,
      qty: qty
    },
    success: function (response) {
      if (response?.status === true) {
        loadAddToCart();
      }
    }
  });
};




const loadAddToCart = async () => {
  const cartContainer = $("#cart-container");

  if (!Iduser) {
    cartContainer.html(`
      <div class="empty-cart-messages">
        <div class="empty-cart-icon"><img src="../assets/images/empty-wishlist-img.png" alt="Cart empty"></div>
        <h2 class="empty-cart-heading">Your cart is currently empty.</h2>
        <p class="empty-cart-text">You may check out all the available products and buy some in the shop.</p>
      </div>
      <p class="return-to-shop">
        <a class="button wc-backward" href="home.html">Return to shop</a>
      </p>
    `);
    $(".k-cart-footer").hide();
    return;
  }

  if (window.location.pathname.includes("checkout.html")) {
    return;
  }

  await $.ajax({
    url: API_URL,
    method: "POST",
    data: { type: "loadAddToCartItem", userId: Iduser },
    success: function (response) {

      let cartItems = Array.isArray(response) ? response : (response.data || []);

      if (cartItems.length > 0) {
        if ($(".k-cart-footer").is(":hidden")) {
          $(".k-cart-footer").show();
        }

        let cartHtml = "";
        let subTotal = 0;
        let total = 0;

        cartItems.map(item => {
          const priceEach = item.variant_id
            ? parseInt(item.varselleing_price || item.varselleing_price)
            : parseInt(item.selling_price);

          const price = (parseInt(item.quantity) * priceEach).toFixed(2);
          subTotal += parseFloat(price);
          total += parseFloat(price);

          const image = item.variant_id && item.variant_image
            ? image_url + "variant/main/" + item.variant_image
            : image_url + "product/main/" + item.product_image;

          let title = item.product_name;
          if (item.variant_id) {
            title += ` (${item.variant_size || ""} ${item.variant_color || ""})`;
          }

          cartHtml += `
         
            <div class="cart-content-box cart-box${item.cart_id}">
              <div class="cart-item-img">
               <a href = "singleproduct.html?pid=${item.product_id}">
                <img src="${image}" alt="">
                </a>
              </div>
              <div class="cart-item-info">
                <h3>${title}</h3>
                <h3 class="cartPrice${item.cart_id}">₹${price}</h3>
                <div class="cart-item-quantity">
                  <div class="cart-quantity-input-box">
                    <button class="decrease" onclick="cartDec(${item.cart_id}, ${priceEach})">
                      <i class="fa-solid fa-minus"></i>
                    </button>
                    <button class="increase" onclick="cartInc(${item.cart_id}, ${priceEach})">
                      <i class="fa-solid fa-plus"></i>
                    </button>
                    <input type="number" class="quantity-input cartNop${item.cart_id}" value="${item.quantity}" readonly>
                  </div>
                  <div class="cart-item-remove" onclick="deleteCartItem(${item.cart_id}, ${priceEach})">
                    <h3><i class="fa-solid fa-trash-can" style="color: #ff0000a6;"></i></h3>
                  </div>
                </div>
              </div>
            </div>
           
          `;
        });

        cartContainer.html(cartHtml);
        $(".k-cart-subtotal h4").html("₹" + subTotal.toFixed(2));
        $(".k-cart-total-price h4").html("₹" + total.toFixed(2));
        loadCartCount();

      } else {
        cartContainer.html(`
          <div class="empty-cart-messages">
            <div class="empty-cart-icon"><img src="../assets/images/empty-wishlist-img.png" alt="Cart empty"></div>
            <h2 class="empty-cart-heading">Your cart is currently empty.</h2>
            <p class="empty-cart-text">You may check out all the available products and buy some in the shop.</p>
          </div>
          <p class="return-to-shop">
            <a class="button wc-backward" href="home.html">Return to shop</a>
          </p>
        `);
        $(".k-cart-footer").hide();
      }
    }
  });
};



loadAddToCart();



const loadCartCount = async () => {
  let userId = localStorage.getItem('userId');
  const cartContainer = $("#cart-container");

  if (userId) {
    await $.ajax({
      url: API_URL,
      type: 'POST',
      data: { type: 'loadCartCount', userId: userId },
      success: function (response) {
        if (response.status !== false) {
          let totalItems = response.total_items;

          if (totalItems == 0) {
            cartContainer.html(`
              <div class="empty-cart-messages">
                <div class="empty-cart-icon"><img src="../assets/images/empty-wishlist-img.png" alt="Cart empty"></div>
                <h2 class="empty-cart-heading">Your cart is currently empty.</h2>
                <p class="empty-cart-text">You may check out all the available products and buy some in the shop.</p>
              </div>
              <p class="return-to-shop">
                <a class="button wc-backward" href="home.html">Return to shop</a>
              </p>
            `);

            $(".k-cart-footer").hide();
            $(".check_btn").hide();
          } else {
            // When cart has items
            $(".bd-icon-badge").html(totalItems);
            $(".mini-cart-badge").html(totalItems);

            $(".k-cart-footer").show();
            $(".check_btn").show();
          }
        }
      },
      error: function () {
        console.error("Failed to load cart count");
      }
    });
  }
};

loadCartCount();




const cartInc = async (cart_id, selling_price) => {

  let nop = $(`.cartNop${cart_id}`).val();
  nop = parseInt(nop);
  nop++;

  // return;

  $.ajax({
    url: API_URL,
    type: 'POST',
    data: { type: 'cartInc', cart_id: cart_id, nop: nop },
    success: function (response) {
      if (response.status === true) {
        $(`.cartPrice${cart_id}`).html(`₹${(selling_price * nop).toFixed(2)}`);
        $(`.cartNop${cart_id}`).val(nop);

        total = total + parseInt(selling_price);

        $(".k-cart-subtotal h4").html('₹' + parseInt(total).toFixed(2));
        $(".k-cart-total-price h4").html('₹' + parseInt(total).toFixed(2));
      }
    }
  })



}

const cartDec = async (cart_id, selling_price) => {

  let nop = $(`.cartNop${cart_id}`).val();
  nop = parseInt(nop);
  nop--;


  // return;

  if (nop >= 1) {
    $.ajax({
      url: API_URL,
      type: 'POST',
      data: { type: 'cartInc', cart_id: cart_id, nop: nop },
      success: function (response) {
        if (response.status === true) {
          $(`.cartPrice${cart_id}`).html(`₹${(selling_price * nop).toFixed(2)}`);
          $(`.cartNop${cart_id}`).val(nop);

          total = total - parseInt(selling_price);

          $(".k-cart-subtotal h4").html('₹' + parseInt(total).toFixed(2));
          $(".k-cart-total-price h4").html('₹' + parseInt(total).toFixed(2));
        }
      }
    })
  } else {
    $.ajax({
      url: API_URL,
      type: 'POST',
      data: { type: 'cartDelete', cart_id: cart_id },
      success: function (response) {
        if (response.status === true) {
          $(`.cart-box${cart_id}`).hide();
          total = total - parseInt(selling_price);
          $(".k-cart-subtotal h4").html('₹' + parseInt(total).toFixed(2));
          $(".k-cart-total-price h4").html('₹' + parseInt(total).toFixed(2));

          loadCartCount();
        }
      }
    })
  }


}

const deleteCartItem = async (cart_id, selling_price) => {

  let nop = $(`.cartNop${cart_id}`).val();
  let cartPrice = selling_price * nop;
  console.log(cartPrice);



  await $.ajax({
    url: API_URL,
    type: 'POST',
    data: { type: 'cartDelete', cart_id: cart_id },
    success: function (response) {
      if (response.status === true) {
        $(`.cart-box${cart_id}`).hide();
        total = total - parseInt(cartPrice);
        $(".k-cart-subtotal h4").html('₹' + parseInt(total).toFixed(2));
        $(".k-cart-total-price h4").html('₹' + parseInt(total).toFixed(2));
        loadCartCount();
      }
    }
  })

}



window.addEventListener("DOMContentLoaded", () => {
    const price = localStorage.getItem("total_price");

    if (price) {
      document.getElementById("t_price").textContent = `Checkout `;
    } else {
      document.getElementById("t_price").textContent = "Checkout";
      console.log("No price found in localStorage");
    }
  });
