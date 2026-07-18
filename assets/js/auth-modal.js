
document.addEventListener('DOMContentLoaded', () => {
  if (!document.querySelector('link[href*="bootstrap-icons"]')) {
    const biLink = document.createElement('link');
    biLink.rel = 'stylesheet';
    biLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css';
    document.head.appendChild(biLink);
  }

  const modalHTML = `
    <div class="gvn-modal-overlay" id="gvnAuthModal">
      <div class="gvn-modal-box">
        <button class="gvn-modal-close" id="gvnCloseBtn" type="button">&times;</button>
        
        <!-- ================= TAB ĐĂNG NHẬP ================= -->
        <div id="gvnLoginTab" class="gvn-tab-content active">
          <h2 class="gvn-modal-title">ĐĂNG NHẬP HOẶC TẠO TÀI KHOẢN</h2>
          <div class="gvn-switch-mode">
            <a href="#">Đăng nhập bằng số điện thoại</a>
          </div>
          
          <form id="gvnLoginForm" onsubmit="event.preventDefault();">
            <div class="gvn-input-group">
              <input type="email" placeholder="Email" required>
            </div>
            <div class="gvn-input-group gvn-password-wrapper">
              <input type="password" placeholder="Mật khẩu" class="gvn-password-field" required>
              <i class="bi bi-eye gvn-toggle-pwd"></i>
            </div>
            <div class="gvn-forgot-pwd">
              <a href="#">Quên mật khẩu email?</a>
            </div>
            <button type="submit" class="gvn-btn-submit btn-red">ĐĂNG NHẬP</button>
          </form>
          
          <div class="gvn-separator">
            <span>hoặc đăng nhập bằng</span>
          </div>
          
          <div class="gvn-social-actions">
            <a href="#" class="gvn-btn-social btn-gg"><i class="bi bi-google"></i> Google</a>
            <a href="#" class="gvn-btn-social btn-fb"><i class="bi bi-facebook"></i> Facebook</a>
          </div>
          
          <div class="gvn-modal-footer">
            Bạn chưa có tài khoản? <a href="#" id="gvnGoToRegister">Đăng ký ngay!</a>
          </div>
        </div>

        <!-- ================= TAB ĐĂNG KÝ ================= -->
        <div id="gvnRegisterTab" class="gvn-tab-content">
          <h2 class="gvn-modal-title">ĐĂNG KÝ TÀI KHOẢN GEARVN</h2>
          <div class="gvn-switch-mode">
            <a href="#">Đăng ký bằng số điện thoại</a>
          </div>
          
          <form id="gvnRegisterForm" onsubmit="event.preventDefault();">
            <div class="gvn-input-group">
              <input type="email" placeholder="Email" required>
            </div>
            <div class="gvn-input-group">
              <input type="text" placeholder="Họ" required>
            </div>
            <div class="gvn-input-group">
              <input type="text" placeholder="Tên" required>
            </div>
            <div class="gvn-input-group gvn-password-wrapper">
              <input type="password" placeholder="Mật khẩu" class="gvn-password-field" required>
              <i class="bi bi-eye gvn-toggle-pwd"></i>
            </div>
            <button type="submit" class="gvn-btn-submit btn-red">TẠO TÀI KHOẢN</button>
          </form>
          
          <div class="gvn-separator">
            <span>hoặc đăng ký bằng</span>
          </div>
          
          <div class="gvn-social-actions">
            <a href="#" class="gvn-btn-social btn-gg"><i class="bi bi-google"></i> Google</a>
            <a href="#" class="gvn-btn-social btn-fb"><i class="bi bi-facebook"></i> Facebook</a>
          </div>
          
          <div class="gvn-modal-footer">
            Bạn đã có tài khoản? <a href="#" id="gvnGoToLogin">Đăng nhập!</a>
          </div>
        </div>
      </div>
    </div>

    <style>
      .gvn-modal-overlay {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.5) !important; z-index: 99999 !important;
        display: flex; align-items: center; justify-content: center;
        opacity: 0; pointer-events: none; transition: opacity 0.2s ease-in-out;
        font-family: system-ui, -apple-system, sans-serif;
      }
      .gvn-modal-overlay.active { opacity: 1 !important; pointer-events: auto !important; }
      .gvn-modal-box {
        background: #fff !important; border-radius: 20px !important; width: 100% !important; max-width: 440px !important;
        padding: 40px 35px 30px 35px !important; position: relative !important; box-shadow: 0 10px 30px rgba(0,0,0,0.15) !important;
        box-sizing: border-box !important; margin: 20px;
      }
      .gvn-modal-close {
        position: absolute !important; top: 16px !important; right: 20px !important; background: none !important; border: none !important;
        font-size: 26px !important; color: #666 !important; cursor: pointer !important; line-height: 1 !important;
      }
      .gvn-modal-close:hover { color: #000 !important; }
      .gvn-tab-content { display: none !important; }
      .gvn-tab-content.active { display: block !important; }
      
      .gvn-modal-title {
        font-size: 16px !important; font-weight: 700 !important; color: #222 !important; margin: 0 0 5px 0 !important;
        text-align: left !important; letter-spacing: 0.3px !important; border: none !important;
      }
      .gvn-switch-mode { text-align: right !important; margin-bottom: 20px !important; }
      .gvn-switch-mode a { color: #555 !important; font-size: 13px !important; text-decoration: underline !important; }
      
      .gvn-input-group { margin-bottom: 14px !important; position: relative !important; }
      .gvn-input-group input {
        width: 100% !important; padding: 13px 16px !important; border: 1px solid #ccc !important; border-radius: 6px !important;
        font-size: 14px !important; color: #333 !important; box-sizing: border-box !important; outline: none !important;
        background: #fff !important; text-transform: none !important;
      }
      .gvn-input-group input:focus { border-color: #666 !important; }
      .gvn-password-wrapper { position: relative !important; }
      .gvn-toggle-pwd {
        position: absolute !important; right: 16px !important; top: 50% !important; transform: translateY(-50%) !important;
        cursor: pointer !important; color: #444 !important; font-size: 16px !important; z-index: 10 !important;
      }
      
      .gvn-forgot-pwd { text-align: right !important; margin: 8px 0 20px 0 !important; }
      .gvn-forgot-pwd a { color: #555 !important; font-size: 13px !important; text-decoration: underline !important; }
      
      .gvn-btn-submit {
        width: 100% !important; padding: 14px !important; border: none !important; border-radius: 6px !important;
        font-size: 14px !important; font-weight: 700 !important; cursor: pointer !important; letter-spacing: 0.5px !important;
      }
      .gvn-btn-submit.btn-red { background: #e30016 !important; color: #fff !important; }
      .gvn-btn-submit.btn-red:hover { background: #c20013 !important; }
      
      .gvn-separator {
        text-align: center !important; margin: 25px 0 20px 0 !important; position: relative !important;
      }
      .gvn-separator::before {
        content: "" !important; position: absolute !important; left: 0 !important; top: 50% !important; width: 100% !important; height: 1px !important;
        background: #ddd !important; z-index: 1 !important;
      }
      .gvn-separator span {
        background: #fff !important; padding: 0 15px !important; position: relative !important; z-index: 2 !important;
        color: #666 !important; font-size: 13px !important;
      }
      
      .gvn-social-actions { display: flex !important; gap: 15px !important; margin-bottom: 25px !important; }
      .gvn-btn-social {
        flex: 1 !important; display: flex !important; align-items: center !important; justify-content: center !important; gap: 8px !important;
        padding: 12px !important; border: none !important; border-radius: 6px !important; font-size: 14px !important; font-weight: 600 !important;
        text-decoration: none !important; color: #fff !important; box-sizing: border-box !important; cursor: pointer !important;
      }
      .gvn-btn-social.btn-gg { background: #df4a32 !important; }
      .gvn-btn-social.btn-fb { background: #3b5998 !important; }
      
      .gvn-modal-footer { text-align: center !important; font-size: 14px !important; color: #444 !important; }
      .gvn-modal-footer a { color: #007bff !important; text-decoration: none !important; font-weight: 500 !important; }
      .gvn-modal-footer a:hover { text-decoration: underline !important; }
    </style>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const modal = document.getElementById('gvnAuthModal');
  const closeBtn = document.getElementById('gvnCloseBtn');
  const loginTab = document.getElementById('gvnLoginTab');
  const registerTab = document.getElementById('gvnRegisterTab');

  const openLoginBtn = document.getElementById('openLoginBtn');
  const dropdownLoginBtn = document.getElementById('dropdownLoginBtn');
  const dropdownRegisterBtn = document.getElementById('dropdownRegisterBtn');

  const goToRegister = document.getElementById('gvnGoToRegister');
  const goToLogin = document.getElementById('gvnGoToLogin');

  function showAuthModal(tabType) {
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

  function hideAuthModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (openLoginBtn) {
    openLoginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showAuthModal('login');
    });
  }
  if (dropdownLoginBtn) {
    dropdownLoginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showAuthModal('login');
    });
  }
  if (dropdownRegisterBtn) {
    dropdownRegisterBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showAuthModal('register');
    });
  }

  if (goToRegister) {
    goToRegister.addEventListener('click', (e) => {
      e.preventDefault();
      showAuthModal('register');
    });
  }
  if (goToLogin) {
    goToLogin.addEventListener('click', (e) => {
      e.preventDefault();
      showAuthModal('login');
    });
  }

  if (closeBtn) { closeBtn.addEventListener('click', hideAuthModal); }
  modal.addEventListener('click', (e) => { if (e.target === modal) hideAuthModal(); });

  document.querySelectorAll('.gvn-toggle-pwd').forEach(icon => {
    icon.addEventListener('click', function() {
      const inputField = this.parentElement.querySelector('.gvn-password-field');
      const isHidden = inputField.getAttribute('type') === 'password';
      inputField.setAttribute('type', isHidden ? 'text' : 'password');
      this.classList.toggle('bi-eye');
      this.classList.toggle('bi-eye-slash');
    });
  });
});
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('gvnAuthModal');
  const openLoginBtn = document.getElementById('openLoginBtn'); 
  const closeBtn = document.querySelector('.gvn-modal-close');
  const switchLinks = document.querySelectorAll('.gvn-switch-tab');
  const tabContents = document.querySelectorAll('.gvn-tab-content');
  const togglePwdButtons = document.querySelectorAll('.gvn-toggle-pwd');

  if (openLoginBtn && modal) {
    openLoginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  switchLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = link.getAttribute('data-tab');
      
      tabContents.forEach(tab => tab.classList.remove('active'));
      const activeTab = document.getElementById(targetTab);
      if (activeTab) activeTab.classList.add('active');
    });
  });

  togglePwdButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const wrapper = this.closest('.gvn-password-wrapper');
      const pwdInput = wrapper.querySelector('.gvn-password-field');
      
      if (pwdInput.type === 'password') {
        pwdInput.type = 'text';
        this.classList.remove('bi-eye-slash');
        this.classList.add('bi-eye');
      } else {
        pwdInput.type = 'password';
        this.classList.remove('bi-eye');
        this.classList.add('bi-eye-slash');
      }
    });
  });

  const loginForm = document.getElementById('gvnLoginForm');

  const validAccount = {
    email: 'kduy0211@gmail.com',
    password: '02112004@Duy'
  };

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const inputEmail = loginForm.querySelector('input[type="email"]').value.trim();
      const inputPassword = loginForm.querySelector('.gvn-password-field').value;

      if (inputEmail === validAccount.email && inputPassword === validAccount.password) {
        alert('Đăng nhập thành công!');
        localStorage.setItem('gvn_logged_in', 'true');
        localStorage.setItem('gvn_user_name', 'Khắc Duy');
        
        if (modal) modal.classList.remove('active');
        document.body.style.overflow = '';
        
        window.location.href = 'KhacDuy_2274802010106_Account.html'; 
      } else {
        alert('Sai tài khoản hoặc mật khẩu! Vui lòng kiểm tra lại.');
      }
    });
  }

  const sidebarInfoBtn = document.querySelector('.gvn-sidebar-menu .tab-info-btn');
  const sidebarOrderBtn = document.querySelector('.gvn-sidebar-menu .tab-order-btn');
  
  const sectionInfo = document.getElementById('gvnAccountInfoSection');
  const sectionOrders = document.getElementById('gvnOrderHistorySection');

  function switchAccountTab(targetTab) {
    if (targetTab === 'info') {
      if (sectionInfo) sectionInfo.style.display = 'block';
      if (sectionOrders) sectionOrders.style.display = 'none';
      if (sidebarInfoBtn) sidebarInfoBtn.classList.add('active');
      if (sidebarOrderBtn) sidebarOrderBtn.classList.remove('active');
    } else if (targetTab === 'orders') {
      if (sectionInfo) sectionInfo.style.display = 'none';
      if (sectionOrders) sectionOrders.style.display = 'block';
      if (sidebarInfoBtn) sidebarInfoBtn.classList.remove('active');
      if (sidebarOrderBtn) sidebarOrderBtn.classList.add('active');
    }
  }

  if (sidebarInfoBtn) {
    sidebarInfoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      switchAccountTab('info');
    });
  }

  if (sidebarOrderBtn) {
    sidebarOrderBtn.addEventListener('click', (e) => {
      e.preventDefault();
      switchAccountTab('orders');
    });
  }

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('tab') === 'orders') {
    switchAccountTab('orders');
  }

  const logoutButtons = document.querySelectorAll('.gvn-logout-trigger');
  
  logoutButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Bạn có chắc chắn muốn đăng xuất không?')) {

        localStorage.removeItem('gvn_logged_in');
        localStorage.removeItem('gvn_user_name');
        
        window.location.href = 'index.html';
      }
    });
  });
});
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('gvnAuthModal');
  const loginForm = document.getElementById('gvnLoginForm');
  

  const userHeaderBtn = document.getElementById('gvnUserHeaderBtn');
  const userHeaderText = document.getElementById('gvnUserHeaderText');
  const accountDropdown = document.getElementById('gvnAccountDropdown');

  const validAccount = { email: 'kduy0211@gmail.com', password: '02112004@Duy' };

  function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('gvn_logged_in') === 'true';
    
    if (isLoggedIn && userHeaderText) {
      userHeaderText.textContent = 'Xin chào Khắc Duy';
      
      if (userHeaderBtn && accountDropdown) {
        userHeaderBtn.parentElement.addEventListener('mouseenter', () => {
          accountDropdown.style.display = 'block';
        });
        userHeaderBtn.parentElement.addEventListener('mouseleave', () => {
          accountDropdown.style.display = 'none';
        });
      }
    } else if (userHeaderText) {
      userHeaderText.textContent = 'Đăng nhập / Đăng ký';
    }
  }
  checkLoginStatus();

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputEmail = loginForm.querySelector('input[type="email"]').value.trim();
      const inputPassword = loginForm.querySelector('.gvn-password-field').value;

      if (inputEmail === validAccount.email && inputPassword === validAccount.password) {
        alert('Đăng nhập thành công!');
        localStorage.setItem('gvn_logged_in', 'true');
        
        if (modal) modal.classList.remove('active');
        document.body.style.overflow = '';
        
        checkLoginStatus();
      } else {
        alert('Sai tài khoản hoặc mật khẩu!');
      }
    });
  }

  const sidebarInfoBtn = document.querySelector('.tab-info-btn');
  const sidebarOrderBtn = document.querySelector('.tab-order-btn');
  const sectionInfo = document.getElementById('gvnAccountInfoSection');
  const sectionOrders = document.getElementById('gvnOrderHistorySection');

  function switchTab(tabName) {
    if (tabName === 'info') {
      if (sectionInfo) sectionInfo.style.display = 'block';
      if (sectionOrders) sectionOrders.style.display = 'none';
      if (sidebarInfoBtn) sidebarInfoBtn.classList.add('active-tab-menu');
      if (sidebarOrderBtn) sidebarOrderBtn.classList.remove('active-tab-menu');
    } else if (tabName === 'orders') {
      if (sectionInfo) sectionInfo.style.display = 'none';
      if (sectionOrders) sectionOrders.style.display = 'block';
      if (sidebarInfoBtn) sidebarInfoBtn.classList.remove('active-tab-menu');
      if (sidebarOrderBtn) sidebarOrderBtn.classList.add('active-tab-menu');
    }
  }

  if (sidebarInfoBtn) sidebarInfoBtn.addEventListener('click', (e) => { e.preventDefault(); switchTab('info'); });
  if (sidebarOrderBtn) sidebarOrderBtn.addEventListener('click', (e) => { e.preventDefault(); switchTab('orders'); });

  const urlParams = new URLSearchParams(window.location.search);
  const currentTab = urlParams.get('tab');
  if (currentTab) {
    switchTab(currentTab);
  }

  document.querySelectorAll('.gvn-logout-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('gvn_logged_in');
      window.location.href = 'KhacDuy_2274802010106_Login.html';
    });
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("gvnAuthModal");
  const closeBtn = document.getElementById("gvnCloseBtn");
  const loginForm = document.getElementById("gvnLoginForm");
  const accountWrapper = document.getElementById("gvnAccountWrapper");


  const loggedInHTML = `
    <a class="login" href="KhacDuy_2274802010106_Account.html"><i class="bi bi-person" aria-hidden="true"></i><b>Xin chào<small>Khắc Duy</small></b></a>
    <div class="account-dropdown">
      <div class="dropdown-item welcome-line">
        <i class="bi bi-hand-index-thumb"></i> Xin chào, Khắc Duy
      </div>
      <a href="#" class="dropdown-item"><i class="bi bi-clipboard-check"></i> Đơn hàng của tôi</a>
      <a href="#" class="dropdown-item"><i class="bi bi-eye"></i> Đã xem gần đây</a>
      <a href="#" class="dropdown-item logout-action-trigger" style="color: #e30016;">
        <i class="bi bi-box-arrow-right" style="color: #e30016;"></i> Đăng xuất
      </a>
    </div>
  `;

  const loggedOutHTML = `
    <a class="login" href="#" id="openLoginBtn"><i class="bi bi-person" aria-hidden="true"></i><b>Tài khoản<small>Đăng nhập</small></b></a>
  `;

  function checkLoginState() {
    const isLogged = localStorage.getItem("gvn_logged_in");
    
    if (isLogged === "true") {
      accountWrapper.innerHTML = loggedInHTML;
    } else {
      accountWrapper.innerHTML = loggedOutHTML;
      
      const openBtn = document.getElementById("openLoginBtn");
      if (openBtn) {
        openBtn.addEventListener("click", function (e) {
          e.preventDefault();
          if (modal) modal.classList.add("active");
        });
      }
    }
  }


  checkLoginState();

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      
      localStorage.setItem("gvn_logged_in", "true");
      
      if (modal) modal.classList.remove("active");
      
      window.location.href = "KhacDuy_2274802010106_Account.html";
    });
  }

  document.addEventListener("click", function (e) {
    if (e.target.closest(".logout-action-trigger")) {
      e.preventDefault();
      
      localStorage.removeItem("gvn_logged_in");
      
      checkLoginState();
      
      window.location.href = "KhacDuy_2274802010106_Login.html";
    }
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => modal.classList.remove("active"));
  }
});