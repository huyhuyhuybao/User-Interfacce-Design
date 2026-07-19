// assets/js/account.js

document.addEventListener("DOMContentLoaded", function () {
  // 1. Lấy thông tin người dùng từ localStorage
  const isLoggedIn = localStorage.getItem('gvn_logged_in') === 'true';
  const userName = localStorage.getItem('gvn_user_name') || '';
  const userEmail = localStorage.getItem('gvn_user_email') || '';
  
  // Lấy thông tin bổ sung đã lưu (nếu có)
  const userPhone = localStorage.getItem('gvn_user_phone') || '';
  const userBirthDay = localStorage.getItem('gvn_user_birth_day') || '';
  const userBirthMonth = localStorage.getItem('gvn_user_birth_month') || '';
  const userBirthYear = localStorage.getItem('gvn_user_birth_year') || '';

  // 2. Cập nhật UI
  if (isLoggedIn) {
    // Cập nhật tên trên sidebar
    const sidebarName = document.getElementById('sidebarUserName');
    if (sidebarName && userName) {
      sidebarName.textContent = userName;
    }

    // Cập nhật form
    const txtFullName = document.getElementById('txtFullName');
    const txtEmail = document.getElementById('txtEmail');
    const txtPhone = document.getElementById('txtPhone');

    if (txtFullName && userName) txtFullName.value = userName;
    if (txtEmail && userEmail) txtEmail.value = userEmail;
    if (txtPhone && userPhone) txtPhone.value = userPhone;

    // Cập nhật ngày sinh nếu có dữ liệu
    if (userBirthDay) {
      const daySelect = document.getElementById('birthDay');
      if (daySelect) daySelect.value = userBirthDay;
    }
    if (userBirthMonth) {
      const monthSelect = document.getElementById('birthMonth');
      if (monthSelect) monthSelect.value = userBirthMonth;
    }
    if (userBirthYear) {
      const yearSelect = document.getElementById('birthYear');
      if (yearSelect) yearSelect.value = userBirthYear;
    }
  }

  // 3. Xử lý lưu thông tin khi bấm nút "Lưu thay đổi"
  const accountForm = document.getElementById('accountProfileForm');
  if (accountForm) {
    accountForm.addEventListener('submit', function (e) {
      e.preventDefault();
      
      // Lấy dữ liệu từ form
      const name = document.getElementById('txtFullName').value.trim();
      const phone = document.getElementById('txtPhone').value.trim();
      const email = document.getElementById('txtEmail').value.trim();
      const day = document.getElementById('birthDay').value;
      const month = document.getElementById('birthMonth').value;
      const year = document.getElementById('birthYear').value;

      // Lưu vào localStorage
      if (name) localStorage.setItem('gvn_user_name', name);
      if (phone) localStorage.setItem('gvn_user_phone', phone);
      if (email) localStorage.setItem('gvn_user_email', email);
      if (day) localStorage.setItem('gvn_user_birth_day', day);
      if (month) localStorage.setItem('gvn_user_birth_month', month);
      if (year) localStorage.setItem('gvn_user_birth_year', year);

      // Cập nhật lại tên trên sidebar (nếu thay đổi tên)
      const sidebarName = document.getElementById('sidebarUserName');
      if (sidebarName && name) sidebarName.textContent = name;

      alert('Lưu thông tin thành công!');
    });
  }
});