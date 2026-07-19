(() => {
  const ORDERS_KEY = 'gearvnOrders';
  const DEMO_EMAIL = 'kduy0211@gmail.com';
  const CANCELABLE_STATUSES = ['Mới', 'Đang xử lý'];

  const orderListSection = document.getElementById('order-list');
  const orderDetailSection = document.getElementById('orderDetail');
  const orderListBody = document.getElementById('ordersTableBody');
  const tabs = [...document.querySelectorAll('.order-tab-item')];
  const searchInput = document.getElementById('orderSearchInput');
  const searchButton = document.getElementById('orderSearchButton');
  const cancelCount = document.getElementById('cancelCount');

  let activeStatus = 'Tất cả';
  let searchTerm = '';

  const demoOrders = [
    {
      id: '#225338',
      createdAt: '2025-03-10T19:54:00',
      status: 'Hủy',
      subtotal: 1680000,
      shippingFee: 25000,
      total: 1705000,
      paymentMethod: 'Thanh toán khi giao hàng (COD)',
      customer: {
        name: 'Khắc Duy',
        phone: '0981178753',
        address: '45/3, đường 19, KP4'
      },
      items: [],
      isDemo: true
    },
    {
      id: '#223319',
      createdAt: '2025-02-15T22:07:00',
      status: 'Hủy',
      subtotal: 390000,
      shippingFee: 25000,
      total: 415000,
      paymentMethod: 'Thanh toán khi giao hàng (COD)',
      customer: {
        name: 'Khắc Duy',
        phone: '0981178753',
        address: '45/3, đường 19, KP4'
      },
      items: [],
      isDemo: true
    },
    {
      id: '#218626',
      createdAt: '2025-01-10T20:39:00',
      status: 'Hủy',
      subtotal: 3378000,
      shippingFee: 25000,
      total: 3403000,
      paymentMethod: 'Thanh toán khi giao hàng (COD)',
      customer: {
        name: 'Khắc Duy',
        phone: '0981178753',
        address: '45/3, đường 19, KP4'
      },
      items: [],
      isDemo: true
    }
  ];

  const money = value =>
    `${new Intl.NumberFormat('vi-VN').format(Number(value) || 0)}đ`;

  const escapeHtml = value => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  function readOrders() {
    try {
      const orders = JSON.parse(localStorage.getItem(ORDERS_KEY));
      return Array.isArray(orders) ? orders : [];
    } catch (error) {
      return [];
    }
  }

  function saveOrders(orders) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }

  const isLoggedIn = localStorage.getItem('gvn_logged_in') === 'true';
  const userEmail = (localStorage.getItem('gvn_user_email') || '')
    .trim()
    .toLowerCase();

  if (!isLoggedIn || !userEmail) {
    window.location.href = 'KhacDuy_2274802010106_Login.html';
    return;
  }

  const sidebarName = document.getElementById('sidebarUserName');
  if (sidebarName) {
    sidebarName.textContent =
      localStorage.getItem('gvn_user_name') || 'Khách hàng';
  }

  function getUserOrders() {
    const savedOrders = readOrders().filter(order => {
      return String(order.userEmail || '').toLowerCase() === userEmail;
    });

    const orders = userEmail === DEMO_EMAIL
      ? [...savedOrders, ...demoOrders]
      : savedOrders;

    return orders.sort((a, b) => {
      return new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime();
    });
  }

  function formatDate(value, detailed = false) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Không xác định';

    return new Intl.DateTimeFormat('vi-VN', detailed
      ? {
          hour: '2-digit',
          minute: '2-digit',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }
      : {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }
    ).format(date);
  }

  function canCancel(order) {
    return !order.isDemo &&
      CANCELABLE_STATUSES.includes(order.status);
  }

  function statusClass(status) {
    const classes = {
      'Mới': 'status-new',
      'Đang xử lý': 'status-processing',
      'Đang vận chuyển': 'status-shipping',
      'Hoàn thành': 'status-completed',
      'Hủy': 'status-cancelled'
    };

    return classes[status] || 'status-default';
  }

  function filteredOrders() {
    return getUserOrders().filter(order => {
      const matchesStatus = activeStatus === 'Tất cả' ||
        order.status === activeStatus;
      const normalizedId = String(order.id || '').toLowerCase();
      const matchesSearch = !searchTerm ||
        normalizedId.includes(searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }

  function updateTabs() {
    const orders = getUserOrders();
    const cancelledOrders = orders.filter(order => order.status === 'Hủy');
    cancelCount.textContent = String(cancelledOrders.length);

    tabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.status === activeStatus);
    });
  }

  function renderOrders() {
    const orders = filteredOrders();
    updateTabs();

    if (orders.length === 0) {
      orderListBody.innerHTML = `
        <tr>
          <td colspan="5" class="empty-order-cell">
            <i class="bi bi-inbox"></i>
            Không tìm thấy đơn hàng phù hợp.
          </td>
        </tr>
      `;
      return;
    }

    orderListBody.innerHTML = orders.map(order => `
      <tr>
        <td>
          <button
            class="clickable-order"
            type="button"
            data-action="detail"
            data-order-id="${escapeHtml(order.id)}"
          >${escapeHtml(order.id)}</button>
        </td>
        <td>${formatDate(order.createdAt)}</td>
        <td>
          <span class="order-status ${statusClass(order.status)}">
            ${escapeHtml(order.status)}
          </span>
        </td>
        <td>${money(order.total)}</td>
        <td>
          ${canCancel(order) ? `
            <button
              class="cancel-order-button"
              type="button"
              data-action="cancel"
              data-order-id="${escapeHtml(order.id)}"
            >Hủy đơn</button>
          ` : '<span class="no-action">—</span>'}
        </td>
      </tr>
    `).join('');
  }

  function renderItems(order) {
    const items = Array.isArray(order.items) ? order.items : [];

    if (items.length === 0) {
      return '<p class="legacy-order-note">Đơn hàng mẫu không lưu chi tiết sản phẩm.</p>';
    }

    return `
      <div class="order-product-list">
        ${items.map(item => `
          <article class="order-product-item">
            <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}">
            <div>
              <strong>${escapeHtml(item.name)}</strong>
              <span>Số lượng: ${Number(item.quantity) || 1}</span>
            </div>
            <b>${money((Number(item.price) || 0) * (Number(item.quantity) || 1))}</b>
          </article>
        `).join('')}
      </div>
    `;
  }

  function showOrder(orderId) {
    const order = getUserOrders().find(item => item.id === orderId);
    if (!order) return;

    orderListSection.classList.remove('active');
    orderDetailSection.classList.add('active');

    orderDetailSection.innerHTML = `
      <div class="order-detail-header">
        <div>
          <h2>Chi tiết đơn hàng ${escapeHtml(order.id)}</h2>
          <span class="order-status ${statusClass(order.status)}">
            ${escapeHtml(order.status)}
          </span>
        </div>
        <div class="order-date">
          Đặt lúc: <span>${formatDate(order.createdAt, true)}</span>
        </div>
      </div>

      <div class="detail-info-row">
        <div class="detail-info-box">
          <h4><i class="bi bi-file-text-fill"></i> Thông tin khách hàng</h4>
          <p><span class="label-gray">Người nhận:</span>
            ${escapeHtml(order.customer?.name || 'Không có')} -
            ${escapeHtml(order.customer?.phone || 'Không có')}
          </p>
          <p><span class="label-gray">Địa chỉ nhận hàng:</span>
            ${escapeHtml(order.customer?.address || 'Không có')}
          </p>
        </div>

        <div class="detail-info-box">
          <h4><i class="bi bi-credit-card-fill"></i> Hình thức thanh toán</h4>
          <p>${escapeHtml(order.paymentMethod || 'Thanh toán khi giao hàng (COD)')}</p>
        </div>
      </div>

      <div class="detail-product-box">
        <h4><i class="bi bi-box-seam-fill"></i> Thông tin sản phẩm</h4>
        ${renderItems(order)}
        <div class="price-row">
          <span class="label">Tạm tính:</span>
          <span class="value">${money(order.subtotal)}</span>
        </div>
        ${Number(order.discount) > 0 ? `
          <div class="price-row">
            <span class="label">Giảm giá:</span>
            <span class="value">-${money(order.discount)}</span>
          </div>
        ` : ''}
        <div class="price-row">
          <span class="label">Phí vận chuyển:</span>
          <span class="value">${money(order.shippingFee)}</span>
        </div>
        <div class="total-row">
          <span class="label">Tổng tiền:</span>
          <span class="value">${money(order.total)}</span>
        </div>
      </div>

      <div class="order-detail-actions">
        <button class="btn-back-list" type="button" data-action="back">
          Quay lại danh sách đơn hàng
        </button>
        ${canCancel(order) ? `
          <button
            class="cancel-order-button cancel-order-button-large"
            type="button"
            data-action="cancel"
            data-order-id="${escapeHtml(order.id)}"
          >Hủy đơn hàng</button>
        ` : ''}
      </div>
    `;

    document.querySelector('.account-main-content')
      .scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function backToList() {
    orderDetailSection.classList.remove('active');
    orderListSection.classList.add('active');
    renderOrders();
  }

  function cancelOrder(orderId) {
    const order = getUserOrders().find(item => item.id === orderId);
    if (!order || !canCancel(order)) return;

    if (!confirm(`Bạn có chắc chắn muốn hủy đơn hàng ${orderId} không?`)) {
      return;
    }

    const orders = readOrders();
    const storedOrder = orders.find(item => {
      return item.id === orderId &&
        String(item.userEmail || '').toLowerCase() === userEmail;
    });

    if (!storedOrder) return;

    storedOrder.status = 'Hủy';
    storedOrder.cancelledAt = new Date().toISOString();
    saveOrders(orders);

    activeStatus = 'Hủy';
    searchTerm = '';
    searchInput.value = '';
    backToList();
  }

  orderListBody.addEventListener('click', event => {
    const button = event.target.closest('[data-action]');
    if (!button) return;

    if (button.dataset.action === 'detail') {
      showOrder(button.dataset.orderId);
    }

    if (button.dataset.action === 'cancel') {
      cancelOrder(button.dataset.orderId);
    }
  });

  orderDetailSection.addEventListener('click', event => {
    const button = event.target.closest('[data-action]');
    if (!button) return;

    if (button.dataset.action === 'back') backToList();
    if (button.dataset.action === 'cancel') {
      cancelOrder(button.dataset.orderId);
    }
  });

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      activeStatus = tab.dataset.status;
      orderListSection.classList.add('active');
      orderDetailSection.classList.remove('active');
      renderOrders();
    });
  });

  function applySearch() {
    searchTerm = searchInput.value.trim();
    renderOrders();
  }

  searchButton.addEventListener('click', applySearch);
  searchInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') applySearch();
  });
  searchInput.addEventListener('input', () => {
    if (!searchInput.value.trim()) {
      searchTerm = '';
      renderOrders();
    }
  });

  renderOrders();
})();
