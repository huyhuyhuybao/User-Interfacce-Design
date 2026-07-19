(() => {
  const CART_KEY = 'gearvnCart';
  const ORDERS_KEY = 'gearvnOrders';
  const ORDER_PAGE = 'KhacDuy_2274802010106_Order.html';

  const infoStage = document.getElementById('infoStage');
  const paymentStage = document.getElementById('paymentStage');
  const stepInfo = document.getElementById('stepInfo');
  const stepPayment = document.getElementById('stepPayment');
  const stepFinish = document.getElementById('stepFinish');
  const invoiceCheckbox = document.getElementById('invoiceCheckbox');
  const invoiceFields = document.getElementById('invoiceFields');
  const couponInput = document.getElementById('couponInput');
  const paymentTotal = document.getElementById('paymentTotal');
  const infoTotal = document.getElementById('infoTotal');
  const summarySubtotal = document.getElementById('summarySubtotal');
  const successMessage = document.getElementById('successMessage');
  const placeOrderButton = document.getElementById('placeOrder');

  const customerName = document.getElementById('customerName');
  const customerPhone = document.getElementById('customerPhone');
  const city = document.getElementById('city');
  const district = document.getElementById('district');
  const ward = document.getElementById('ward');
  const street = document.getElementById('street');
  const orderNote = document.getElementById('orderNote');

  let applied = false;
  let discount = 0;

  const money = value =>
    `${new Intl.NumberFormat('vi-VN').format(Number(value) || 0)}đ`;

  const readArray = key => {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return Array.isArray(value) ? value : [];
    } catch (error) {
      return [];
    }
  };

  const cart = readArray(CART_KEY);
  const subtotal = cart.reduce((sum, product) => {
    return sum +
      (Number(product.price) || 0) *
      (Number(product.quantity) || 1);
  }, 0);

  const finalTotal = () => Math.max(0, subtotal - discount);

  function updateTotals() {
    if (infoTotal) infoTotal.textContent = money(subtotal);
    if (summarySubtotal) summarySubtotal.textContent = money(subtotal);
    if (paymentTotal) paymentTotal.textContent = money(finalTotal());
  }

  function createOrderId() {
    const timePart = String(Date.now()).slice(-7);
    const randomPart = String(Math.floor(Math.random() * 90) + 10);
    return `#${timePart}${randomPart}`;
  }

  function saveOrder(order) {
    const orders = readArray(ORDERS_KEY);
    orders.unshift(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }

  const isLoggedIn = localStorage.getItem('gvn_logged_in') === 'true';
  const userEmail = (localStorage.getItem('gvn_user_email') || '')
    .trim()
    .toLowerCase();

  if (!isLoggedIn || !userEmail) {
    localStorage.setItem('gvn_return_url', window.location.href);
    window.location.href = 'KhacDuy_2274802010106_Login.html';
    return;
  }

  if (cart.length === 0) {
    alert('Giỏ hàng đang trống. Vui lòng chọn sản phẩm trước khi thanh toán.');
    window.location.href = 'BaoHuy_2474802010133_ProductList.html';
    return;
  }

  customerName.value = localStorage.getItem('gvn_user_name') || '';
  customerPhone.value = localStorage.getItem('gvn_user_phone') || '';
  updateTotals();

  invoiceCheckbox.addEventListener('change', () => {
    invoiceFields.hidden = !invoiceCheckbox.checked;
  });

  document.getElementById('continuePayment').addEventListener('click', () => {
    const missingInformation =
      !customerName.value.trim() ||
      !customerPhone.value.trim() ||
      !city.value ||
      !district.value ||
      !ward.value.trim() ||
      !street.value.trim();

    if (missingInformation) {
      alert('Vui lòng nhập đầy đủ họ tên, số điện thoại và địa chỉ nhận hàng.');
      return;
    }

    document.getElementById('summaryName').textContent =
      customerName.value.trim();
    document.getElementById('summaryPhone').textContent =
      customerPhone.value.trim();
    document.getElementById('summaryAddress').textContent = [
      street.value.trim(),
      ward.value.trim(),
      district.value,
      city.value
    ].join(', ');

    infoStage.hidden = true;
    paymentStage.hidden = false;
    stepInfo.classList.remove('is-active');
    stepInfo.classList.add('is-done');
    stepPayment.classList.add('is-active');
    paymentStage.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  document.getElementById('backToInfo').addEventListener('click', () => {
    paymentStage.hidden = true;
    infoStage.hidden = false;
    stepPayment.classList.remove('is-active');
    stepInfo.classList.remove('is-done');
    stepInfo.classList.add('is-active');
    infoStage.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  document.getElementById('applyCoupon').addEventListener('click', () => {
    const code = couponInput.value.trim().toUpperCase();

    if (code === 'MINHHUY' && !applied) {
      discount = Math.min(1000000, subtotal);
      couponInput.value = 'MINHHUY - Giảm 1.000.000đ';
      applied = true;
      updateTotals();
    } else if (!code) {
      alert('Vui lòng nhập mã giảm giá trước.');
    } else if (!applied) {
      alert('Mã giảm giá không hợp lệ. Thử mã MINHHUY.');
    }
  });

  placeOrderButton.addEventListener('click', () => {
    if (placeOrderButton.disabled) return;

    const selectedPayment =
      document.querySelector('input[name="method"]:checked');

    const order = {
      id: createOrderId(),
      userEmail,
      createdAt: new Date().toISOString(),
      status: 'Mới',
      subtotal,
      discount,
      shippingFee: 0,
      total: finalTotal(),
      paymentMethod: selectedPayment?.value || 'COD',
      note: orderNote.value.trim(),
      customer: {
        name: customerName.value.trim(),
        phone: customerPhone.value.trim(),
        address: [
          street.value.trim(),
          ward.value.trim(),
          district.value,
          city.value
        ].join(', ')
      },
      items: cart.map(product => ({
        id: product.id,
        name: product.name,
        image: product.image,
        price: Number(product.price) || 0,
        quantity: Number(product.quantity) || 1
      }))
    };

    saveOrder(order);
    localStorage.removeItem(CART_KEY);

    stepPayment.classList.remove('is-active');
    stepPayment.classList.add('is-done');
    stepFinish.classList.add('is-active');
    placeOrderButton.disabled = true;
    placeOrderButton.textContent = 'ĐÃ ĐẶT HÀNG';

    successMessage.innerHTML = `
      Đặt hàng thành công! Mã đơn hàng của bạn là
      <strong>${order.id}</strong>.
      <a href="${ORDER_PAGE}">Tra cứu đơn hàng</a>
    `;
    successMessage.classList.add('show');
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
})();
