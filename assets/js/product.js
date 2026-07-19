(() => {
  const SELECTED_PRODUCT_KEY = 'selectedProduct';
  const CART_KEY = 'gearvnCart';

  const defaultProduct = {
    id: 'pc-gvn-i7-14700f-rtx-5070ti',
    name: 'PC GVN Intel i7-14700F / VGA RTX 5070Ti (DDR5)',
    image: 'assets/images/product-pc.png',
    price: 67890000,
    oldPrice: 68820000,
    quantity: 1,
    category: 'PC',
    cpu: 'Intel Core i7-14700F',
    mainboard: 'Z790 (DDR5)',
    ram: '16GB',
    ssd: '1TB',
    vga: 'RTX 5070 Ti'
  };

  const params = new URLSearchParams(window.location.search);
  const isSelectedProduct = params.get('selected') === '1';

  function getSelectedProduct() {
    if (!isSelectedProduct) {
      return defaultProduct;
    }

    try {
      const savedProduct = JSON.parse(
        localStorage.getItem(SELECTED_PRODUCT_KEY)
      );

      if (!savedProduct || !savedProduct.id) {
        return defaultProduct;
      }

      return {
        ...savedProduct,
        quantity: 1
      };
    } catch (error) {
      return defaultProduct;
    }
  }

  const currentProduct = getSelectedProduct();

  const cpuNames = {
    'intel-i5': 'Intel Core i5',
    'intel-i7': 'Intel Core i7',
    'amd-r5': 'AMD Ryzen 5'
  };

  const vgaNames = {
    'rtx-3050': 'NVIDIA GeForce RTX 3050',
    'rtx-4050': 'NVIDIA GeForce RTX 4050',
    'rtx-5050': 'NVIDIA GeForce RTX 5050'
  };

  function money(value) {
    return `${new Intl.NumberFormat('vi-VN').format(value)}đ`;
  }

  function displayCpu(value) {
    return cpuNames[value] || value || 'Đang cập nhật';
  }

  function displayVga(value) {
    return vgaNames[value] || value || 'Đang cập nhật';
  }

  function displayRam(value) {
    if (!value) return 'Đang cập nhật';
    return String(value).includes('GB') ? value : `${value}GB`;
  }

  function displaySsd(value) {
    if (!value) return 'Đang cập nhật';
    return String(value).includes('GB') ||
      String(value).includes('TB')
      ? value
      : `${value}GB`;
  }

  function displayScreen(value) {
    if (!value) return 'Đang cập nhật';
    return `${value} inch`;
  }

  function calculateDiscount(price, oldPrice) {
    if (!oldPrice || oldPrice <= price) return 0;

    return Math.round(
      ((oldPrice - price) / oldPrice) * 100
    );
  }

  function updateBasicInformation() {
    const title = document.querySelector('.product-summary h1');
    const breadcrumb = document.querySelector('.breadcrumb');
    const mainImage = document.getElementById('mainProductImage');
    const currentPrice = document.querySelector(
      '.main-price strong'
    );
    const oldPrice = document.querySelector('.main-price del');
    const discount = document.querySelector('.discount');

    document.title =
      `${currentProduct.name} - GEARVN`;

    title.textContent = currentProduct.name;

    breadcrumb.textContent =
      `⌂ Trang Chủ / ${currentProduct.category || 'Sản phẩm'} / ${currentProduct.name}`;

    mainImage.src = currentProduct.image;
    mainImage.alt = currentProduct.name;

    document.querySelectorAll('.thumb img').forEach(image => {
      image.src = currentProduct.image;
      image.alt = currentProduct.name;
    });

    currentPrice.textContent = money(currentProduct.price);
    oldPrice.textContent = money(currentProduct.oldPrice);

    const discountValue = calculateDiscount(
      currentProduct.price,
      currentProduct.oldPrice
    );

    discount.textContent =
      discountValue > 0 ? `-${discountValue}%` : '0%';
  }

  function updateLaptopInformation() {
    const isLaptop =
      currentProduct.category === 'Laptop';

    if (!isLaptop) return;

    const dealList = document.querySelector('.deal-list');
    const note = document.querySelector('.note');

    dealList.innerHTML = `
      <div class="deal">
        Ưu đãi trả góp với thủ tục đơn giản.
      </div>

      <div class="deal">
        Giảm giá khi mua kèm chuột gaming.
      </div>

      <div class="deal">
        Giảm giá khi mua kèm balo laptop.
      </div>

      <div class="deal">
        Hỗ trợ giao hàng tận nơi.
      </div>
    `;

    note.textContent =
      'Sản phẩm laptop chính hãng, hỗ trợ giao hàng tận nơi hoặc nhận tại cửa hàng.';
  }

  function updateHighlightSpecs() {
    const isLaptop =
      currentProduct.category === 'Laptop';

    const miniSpecs = document.querySelector('.spec-mini dl');
    const technicalSpecs = document.querySelector(
      '.tech-box dl'
    );

    let specs;

    if (isLaptop) {
      specs = [
        ['CPU', displayCpu(currentProduct.cpu)],
        ['Màn hình', displayScreen(currentProduct.screen)],
        ['RAM', displayRam(currentProduct.ram)],
        ['SSD', displaySsd(currentProduct.ssd)],
        ['VGA', displayVga(currentProduct.vga)]
      ];
    } else {
      specs = [
        ['CPU', currentProduct.cpu],
        ['Mainboard', currentProduct.mainboard],
        ['RAM', currentProduct.ram],
        ['SSD', currentProduct.ssd],
        ['VGA', currentProduct.vga]
      ];
    }

    const specsHtml = specs.map(spec => `
      <div>
        <dt>${spec[0]}</dt>
        <dd>${spec[1]}</dd>
      </div>
    `).join('');

    miniSpecs.innerHTML = specsHtml;
    technicalSpecs.innerHTML = specsHtml;
  }

  function updateProductTable() {
    const isLaptop =
      currentProduct.category === 'Laptop';

    if (!isLaptop) return;

    const table = document.querySelector('.spec-table');

    table.innerHTML = `
      <tr>
        <th>Sản phẩm</th>
        <td>${currentProduct.name}</td>
      </tr>

      <tr>
        <th>CPU</th>
        <td>${displayCpu(currentProduct.cpu)}</td>
      </tr>

      <tr>
        <th>Màn hình</th>
        <td>${displayScreen(currentProduct.screen)}</td>
      </tr>

      <tr>
        <th>RAM</th>
        <td>${displayRam(currentProduct.ram)}</td>
      </tr>

      <tr>
        <th>SSD</th>
        <td>${displaySsd(currentProduct.ssd)}</td>
      </tr>

      <tr>
        <th>VGA</th>
        <td>${displayVga(currentProduct.vga)}</td>
      </tr>
    `;
  }

  function setupThumbnails() {
    const mainImage = document.getElementById(
      'mainProductImage'
    );

    const thumbs = document.querySelectorAll('.thumb');

    thumbs.forEach(button => {
      button.addEventListener('click', () => {
        thumbs.forEach(item => {
          item.classList.remove('is-active');
        });

        button.classList.add('is-active');

        const image = button.querySelector('img');

        if (image) {
          mainImage.src = image.src;
        }
      });
    });
  }

  function setupBuyButton() {
  const buyButton = document.getElementById('buyNow');

  buyButton.addEventListener('click', () => {
    const isLoggedIn =
      localStorage.getItem('gvn_logged_in') === 'true';

    if (!isLoggedIn) {
      localStorage.setItem(
        'gvn_return_url',
        window.location.href
      );

      const loginButton =
        document.getElementById('openLoginBtn');

      if (loginButton) {
        loginButton.click();
      } else {
        window.location.href =
          'KhacDuy_2274802010106_Login.html';
      }

      return;
    }

    let cart = [];

    try {
      const savedCart = JSON.parse(
        localStorage.getItem(CART_KEY)
      );

      cart = Array.isArray(savedCart) ? savedCart : [];
    } catch (error) {
      cart = [];
    }

    const existingProduct = cart.find(
      product => product.id === currentProduct.id
    );

    if (existingProduct) {
      existingProduct.quantity =
        (Number(existingProduct.quantity) || 1) + 1;
    } else {
      cart.push({
        ...currentProduct,
        quantity: 1
      });
    }

    localStorage.setItem(
      CART_KEY,
      JSON.stringify(cart)
    );

    window.location.href =
      'MinhHuy_2474802016546_Shopping.html';
  });
}

  updateBasicInformation();
  updateLaptopInformation();
  updateHighlightSpecs();
  updateProductTable();
  setupThumbnails();
  setupBuyButton();
})();