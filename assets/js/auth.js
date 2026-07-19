// assets/js/auth.js

document.addEventListener("DOMContentLoaded", function () {
  // ==================== 1. KHỞI TẠO MODAL (POPUP) ====================
  // Nếu trang chưa có Modal, tự động thêm HTML vào cuối body
  if (!document.getElementById('gvnAuthModal')) {
    const modalHTML = `
      <div class="gvn-modal-overlay" id="gvnAuthModal">
        <div class="gvn-modal-box">
          <button class="gvn-modal-close" id="gvnCloseBtn" type="button">&times;</button>
          
          <div id="gvnLoginTab" class="gvn-tab-content active">
            <h2 class="gvn-modal-title">ĐĂNG NHẬP HOẶC TẠO TÀI KHOẢN</h2>
            <div class="gvn-switch-mode"><a href="#">Đăng nhập bằng số điện thoại</a></div>
            <form id="gvnLoginForm">
              <div class="gvn-input-group"><input type="email" placeholder="Email" required></div>
              <div class="gvn-input-group gvn-password-wrapper">
                <input type="password" placeholder="Mật khẩu" class="gvn-password-field" required>
                <i class="bi bi-eye gvn-toggle-pwd"></i>
              </div>
              <div class="gvn-forgot-pwd"><a href="#">Quên mật khẩu email?</a></div>
              <button type="submit" class="gvn-btn-submit btn-red">ĐĂNG NHẬP</button>
            </form>
            <div class="gvn-separator"><span>hoặc đăng nhập bằng</span></div>
            <div class="gvn-social-actions">
              <a href="#" class="gvn-btn-social btn-gg"><i class="bi bi-google"></i> Google</a>
              <a href="#" class="gvn-btn-social btn-fb"><i class="bi bi-facebook"></i> Facebook</a>
            </div>
            <div class="gvn-modal-footer">Bạn chưa có tài khoản? <a href="#" id="gvnGoToRegister">Đăng ký ngay!</a></div>
          </div>

          <div id="gvnRegisterTab" class="gvn-tab-content">
            <h2 class="gvn-modal-title">ĐĂNG KÝ TÀI KHOẢN GEARVN</h2>
            <div class="gvn-switch-mode"><a href="#">Đăng ký bằng số điện thoại</a></div>
            <form id="gvnRegisterForm">
              <div class="gvn-input-group"><input type="email" placeholder="Email" required></div>
              <div class="gvn-input-group"><input type="text" placeholder="Họ" required></div>
              <div class="gvn-input-group"><input type="text" placeholder="Tên" required></div>
              <div class="gvn-input-group gvn-password-wrapper">
                <input type="password" placeholder="Mật khẩu" class="gvn-password-field" required>
                <i class="bi bi-eye gvn-toggle-pwd"></i>
              </div>
              <button type="submit" class="gvn-btn-submit btn-red">TẠO TÀI KHOẢN</button>
            </form>
            <div class="gvn-separator"><span>hoặc đăng ký bằng</span></div>
            <div class="gvn-social-actions">
              <a href="#" class="gvn-btn-social btn-gg"><i class="bi bi-google"></i> Google</a>
              <a href="#" class="gvn-btn-social btn-fb"><i class="bi bi-facebook"></i> Facebook</a>
            </div>
            <div class="gvn-modal-footer">Đã có tài khoản? <a href="#" id="gvnGoToLogin">Đăng nhập!</a></div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  // Lấy các phần tử DOM cần thiết
  const modal = document.getElementById('gvnAuthModal');
  const closeBtn = document.getElementById('gvnCloseBtn');
  const loginForm = document.getElementById('gvnLoginForm');
  const registerForm = document.getElementById('gvnRegisterForm');
  const loginTab = document.getElementById('gvnLoginTab');
  const registerTab = document.getElementById('gvnRegisterTab');
  const goToRegister = document.getElementById('gvnGoToRegister');
  const goToLogin = document.getElementById('gvnGoToLogin');

  // ==================== 2. CÁC HÀM XỬ LÝ UI ====================
  function openModal(tabType) {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (tabType === 'login') {
      loginTab.classList.add('active');
      registerTab.classList.remove('active');
    } else {
      registerTab.classList.add('active');
      loginTab.classList.remove('active');
    }
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // ==================== 3. XỬ LÝ SỰ KIỆN CHUYỂN TAB ====================
  if (goToRegister) {
    goToRegister.addEventListener('click', (e) => { e.preventDefault(); openModal('register'); });
  }
  if (goToLogin) {
    goToLogin.addEventListener('click', (e) => { e.preventDefault(); openModal('login'); });
  }
  if (closeBtn) { closeBtn.addEventListener('click', closeModal); }
  if (modal) {
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  }

  // ==================== 4. XỬ LÝ ẨN/HIỆN MẬT KHẨU ====================
  document.querySelectorAll('.gvn-toggle-pwd').forEach(icon => {
    icon.addEventListener('click', function() {
      const input = this.parentElement.querySelector('.gvn-password-field');
      if (input.type === 'password') {
        input.type = 'text';
        this.classList.replace('bi-eye', 'bi-eye-slash');
      } else {
        input.type = 'password';
        this.classList.replace('bi-eye-slash', 'bi-eye');
      }
    });
  });

  // ==================== 5. LOGIC AUTHENTICATION (CỐT LÕI) ====================
  
  // Hàm cập nhật Header UI (Tạo Dropdown đẹp như Hình 1)
  function updateHeaderUI() {
    const isLoggedIn = localStorage.getItem('gvn_logged_in') === 'true';
    const userName = localStorage.getItem('gvn_user_name') || 'Khắc Duy';
    const accountWrapper = document.getElementById('gvnAccountWrapper');

    if (!accountWrapper) return; 

    if (isLoggedIn) {
      // Trạng thái Đã đăng nhập
      accountWrapper.innerHTML = `
        <a class="login" href="KhacDuy_2274802010106_Account.html">
          <i class="bi bi-person" aria-hidden="true"></i>
          <b>Xin chào<small>${userName}</small></b>
        </a>
        <div class="account-dropdown">
          <div class="dropdown-item welcome-line">
            <i class="bi bi-check-circle-fill" style="color: green;"></i> ${userName} (Đã đăng nhập)
          </div>
          <a href="KhacDuy_2274802010106_Account.html" class="dropdown-item"><i class="bi bi-person-bounding-box"></i> Trang cá nhân</a>
          <a href="KhacDuy_2274802010106_Order.html" class="dropdown-item"><i class="bi bi-clipboard-check"></i> Đơn hàng của tôi</a>
          <a href="#" class="dropdown-item gvn-logout-trigger" style="color: #e30016; font-weight: bold;">
            <i class="bi bi-box-arrow-right"></i> Đăng xuất
          </a>
        </div>
      `;
      document.querySelector('.gvn-logout-trigger')?.addEventListener('click', handleLogout);
    } else {
      // Trạng thái Chưa đăng nhập (Yêu cầu Dropdown 2 nút to - Hình 1)
      accountWrapper.innerHTML = `
        <a class="login" href="#" id="openLoginBtn">
          <i class="bi bi-person" aria-hidden="true"></i><b>Đăng nhập</b>
        </a>
        <div class="account-dropdown">
          <div class="dropdown-item welcome-line">
            <i class="bi bi-hand-thumbs-up"></i> Xin chào, vui lòng đăng nhập
          </div>
          <div class="btn-actions">
            <button type="button" class="btn-login-now" id="dropdownLoginBtn">ĐĂNG NHẬP</button>
            <button type="button" class="btn-register-now" id="dropdownRegisterBtn">ĐĂNG KÝ</button>
          </div>
          <a href="#support" class="help-link"><i class="bi bi-question-circle"></i> Trợ giúp</a>
        </div>
      `;
      
      // Gắn sự kiện cho các nút mới tạo
      document.getElementById('openLoginBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('login');
      });
      document.getElementById('dropdownLoginBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('login');
      });
      document.getElementById('dropdownRegisterBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('register'); // Mở thẳng tab Đăng ký
      });
    }
  }

  // Hàm xử lý Đăng xuất
  function handleLogout(e) {
    e.preventDefault();
    if (confirm('Bạn có chắc chắn muốn đăng xuất không?')) {
      localStorage.removeItem('gvn_logged_in');
      localStorage.removeItem('gvn_user_name');
      updateHeaderUI(); 
      window.location.href = 'BaoHuy_2474802010133_Home.html';
    }
  }

  // ==================== 6. XỬ LÝ FORM ĐĂNG NHẬP & ĐĂNG KÝ ====================
  
  // ĐĂNG NHẬP
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const email = this.querySelector('input[type="email"]').value.trim();
      const password = this.querySelector('.gvn-password-field').value;

      const users = JSON.parse(localStorage.getItem('gvn_users') || '[]');
      const foundUser = users.find(user => user.email === email && user.password === password);

      // Tài khoản mặc định demo (để tương thích)
      const validAccount = { email: 'kduy0211@gmail.com', password: '02112004@Duy' };

      if (foundUser || (email === validAccount.email && password === validAccount.password)) {
        const name = foundUser ? foundUser.fullName : 'Khắc Duy';
        
        // 🟢 QUAN TRỌNG: Lưu email và tên đã đăng nhập vào localStorage
        localStorage.setItem('gvn_logged_in', 'true');
        localStorage.setItem('gvn_user_name', name);
        localStorage.setItem('gvn_user_email', email); // <-- Dòng này quan trọng nhất

        closeModal();
        updateHeaderUI();
        window.location.href = 'KhacDuy_2274802010106_Account.html';
      } else {
        alert('Sai tài khoản hoặc mật khẩu! Vui lòng kiểm tra lại.');
      }
    });
  }

  // ĐĂNG KÝ
  if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const email = this.querySelector('input[type="email"]').value.trim();
      const lastName = this.querySelector('input[placeholder="Họ"]').value.trim();
      const firstName = this.querySelector('input[placeholder="Tên"]').value.trim();
      const password = this.querySelector('.gvn-password-field').value;

      if (!email || !lastName || !firstName || !password) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
      }

      const users = JSON.parse(localStorage.getItem('gvn_users') || '[]');
      if (users.find(user => user.email === email)) {
        alert('Email này đã được đăng ký. Vui lòng sử dụng email khác!');
        return;
      }

      const newUser = { email: email, fullName: `${lastName} ${firstName}`, password: password };
      users.push(newUser);
      localStorage.setItem('gvn_users', JSON.stringify(users));
      
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      openModal('login'); // Tự động chuyển sang tab đăng nhập
    });
  }

  // ==================== 7. KHỞI CHẠY HỆ THỐNG KHI TRANG LOAD ====================
  updateHeaderUI();

  // Check trang Account/Order
  const currentPage = window.location.pathname.split('/').pop();
  const isLoggedIn = localStorage.getItem('gvn_logged_in') === 'true';

  if (!isLoggedIn && (currentPage === 'KhacDuy_2274802010106_Account.html' || currentPage === 'KhacDuy_2274802010106_Order.html')) {
    window.location.href = 'KhacDuy_2274802010106_Login.html';
  }

  // Đăng xuất ở Sidebar nếu có
  document.querySelectorAll('.sidebar-logout-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      handleLogout(e);
    });
  });
});