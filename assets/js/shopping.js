(() => {
  const CART_KEY = 'gearvnCart';

  const cartList = document.getElementById('cartList');
  const totalNode = document.getElementById('cartTotal');
  const emptyCart = document.getElementById('emptyCart');
  const checkoutButton = document.getElementById('checkoutButton');
  const continueEmptyButton = document.getElementById('continueEmptyButton');
  const cartSummary = document.querySelector('.cart-summary');

  const money = value =>
    `${new Intl.NumberFormat('vi-VN').format(value)}đ`;

  function loadCart() {
    try {
      const savedCart = JSON.parse(localStorage.getItem(CART_KEY));
      return Array.isArray(savedCart) ? savedCart : [];
    } catch (error) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  function renderCart() {
    const cart = loadCart();

    cartList.innerHTML = '';

    if (cart.length === 0) {
      cartList.hidden = true;
      cartSummary.hidden = true;
      emptyCart.hidden = false;
      totalNode.textContent = '0đ';
      return;
    }

    cartList.hidden = false;
    cartSummary.hidden = false;
    emptyCart.hidden = true;

    cart.forEach(product => {
      const quantity = Number(product.quantity) || 1;
      const price = Number(product.price) || 0;
      const oldPrice = Number(product.oldPrice) || price;

      const item = document.createElement('article');

      item.className = 'cart-item';
      item.dataset.id = product.id;
      item.dataset.unitPrice = price;
      item.dataset.oldPrice = oldPrice;

      item.innerHTML = `
        <div class="product-visual">
          <img
            src="${product.image}"
            alt="${product.name}"
          >

          <button class="remove-button" type="button">
            <svg viewBox="0 0 24 24">
              <path d="M4 7h16M9 7V4h6v3m-8 0 1 14h8l1-14M10 11v6m4-6v6"/>
            </svg>
            <span>Xóa</span>
          </button>
        </div>

        <div class="product-info">
          <h2>${product.name}</h2>
        </div>

        <div class="product-side">
          <div class="prices">
            <strong class="current-price">
              ${money(price * quantity)}
            </strong>

            <del class="old-price">
              ${money(oldPrice * quantity)}
            </del>
          </div>

          <div class="quantity-control">
            <button class="qty-btn minus" type="button">−</button>
            <span class="qty-value">${quantity}</span>
            <button class="qty-btn plus" type="button">+</button>
          </div>
        </div>
      `;

      cartList.appendChild(item);
    });

    updateTotal();
  }

  function updateTotal() {
    const cart = loadCart();

    const total = cart.reduce((sum, product) => {
      const price = Number(product.price) || 0;
      const quantity = Number(product.quantity) || 1;

      return sum + price * quantity;
    }, 0);

    totalNode.textContent = money(total);
  }

  cartList.addEventListener('click', event => {
    const item = event.target.closest('.cart-item');

    if (!item) return;

    const productId = item.dataset.id;
    const cart = loadCart();

    const productIndex = cart.findIndex(
      product => product.id === productId
    );

    if (productIndex === -1) return;

    if (event.target.closest('.plus')) {
      cart[productIndex].quantity =
        (Number(cart[productIndex].quantity) || 1) + 1;
    }

    if (event.target.closest('.minus')) {
      const currentQuantity =
        Number(cart[productIndex].quantity) || 1;

      if (currentQuantity <= 1) {
        cart.splice(productIndex, 1);
      } else {
        cart[productIndex].quantity = currentQuantity - 1;
      }
    }

    if (event.target.closest('.remove-button')) {
      cart.splice(productIndex, 1);
    }

    saveCart(cart);
    renderCart();
  });

  checkoutButton.addEventListener('click', () => {
    window.location.href =
      'MinhHuy_2474802016546_Payment.html';
  });

  continueEmptyButton.addEventListener('click', () => {
    window.location.href =
      'BaoHuy_2474802010133_ProductList.html';
  });

  renderCart();
})();