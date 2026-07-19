(() => {
  const cartList = document.getElementById('cartList');
  const totalNode = document.getElementById('cartTotal');
  const emptyCart = document.getElementById('emptyCart');
  const checkoutButton = document.getElementById('checkoutButton');
  const continueEmptyButton = document.getElementById('continueEmptyButton');

  const money = value => `${new Intl.NumberFormat('vi-VN').format(value)}đ`;

  function updateCart() {
    const items = [...cartList.querySelectorAll('.cart-item')];
    let total = 0;
    items.forEach(item => {
      const qty = Number(item.querySelector('.qty-value').textContent);
      const unit = Number(item.dataset.unitPrice);
      const old = Number(item.dataset.oldPrice);
      item.querySelector('.current-price').textContent = money(unit * qty);
      item.querySelector('.old-price').textContent = money(old * qty);
      total += unit * qty;
    });
    totalNode.textContent = money(total);
    const isEmpty = items.length === 0;
    cartList.hidden = isEmpty;
    document.querySelector('.cart-summary').hidden = isEmpty;
    emptyCart.hidden = !isEmpty;
  }

  cartList.addEventListener('click', event => {
    const item = event.target.closest('.cart-item');
    if (!item) return;
    const qtyNode = item.querySelector('.qty-value');
    let qty = Number(qtyNode.textContent);
    if (event.target.closest('.plus')) qty += 1;
    if (event.target.closest('.minus')) {
      if (qty === 1) item.remove();
      else qty -= 1;
    }
    if (event.target.closest('.remove-button')) item.remove();
    if (item.isConnected) qtyNode.textContent = qty;
    updateCart();
  });

  checkoutButton.addEventListener('click', () => {
    window.location.href = 'MinhHuy_2474802016546_Payment.html';
  });
  continueEmptyButton.addEventListener('click', () => {
    window.location.href = 'MinhHuy_2474802016546_Product.html';
  });
  updateCart();
})();
