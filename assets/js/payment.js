(() => {
  const infoStage = document.getElementById('infoStage');
  const paymentStage = document.getElementById('paymentStage');
  const stepInfo = document.getElementById('stepInfo');
  const stepPayment = document.getElementById('stepPayment');
  const stepFinish = document.getElementById('stepFinish');
  const invoiceCheckbox = document.getElementById('invoiceCheckbox');
  const invoiceFields = document.getElementById('invoiceFields');
  const couponInput = document.getElementById('couponInput');
  const paymentTotal = document.getElementById('paymentTotal');
  const successMessage = document.getElementById('successMessage');
  let applied = false;

  const customerName = document.getElementById('customerName');
  const customerPhone = document.getElementById('customerPhone');
  const city = document.getElementById('city');
  const district = document.getElementById('district');
  const ward = document.getElementById('ward');
  const street = document.getElementById('street');

  invoiceCheckbox.addEventListener('change', () => {
    invoiceFields.hidden = !invoiceCheckbox.checked;
  });

  document.getElementById('continuePayment').addEventListener('click', () => {
    if (!customerName.value.trim() || !customerPhone.value.trim() || !street.value.trim()) {
      alert('Fen nhập đầy đủ họ tên, số điện thoại và địa chỉ nha.');
      return;
    }

    document.getElementById('summaryName').textContent = customerName.value.trim();
    document.getElementById('summaryPhone').textContent = customerPhone.value.trim();
    document.getElementById('summaryAddress').textContent = [street.value, ward.value, district.value, city.value].join(', ');

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
      paymentTotal.textContent = '106.970.000đ';
      couponInput.value = 'MINHHUY - Giảm 1.000.000đ';
      applied = true;
    } else if (!code) {
      alert('Fen nhập mã giảm giá trước nha.');
    } else if (!applied) {
      alert('Mã giảm giá không hợp lệ. Thử mã MINHHUY.');
    }
  });

  document.getElementById('placeOrder').addEventListener('click', () => {
    stepPayment.classList.remove('is-active');
    stepPayment.classList.add('is-done');
    stepFinish.classList.add('is-active');
    successMessage.classList.add('show');
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
})();