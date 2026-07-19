// assets/js/order.js (Phiên bản Logic - Phân biệt tài khoản demo và tài khoản mới)

// Hàm hiển thị chi tiết đơn hàng
function showOrder(id) {
    // 1. Ẩn tất cả các phần nội dung
    document.getElementById('order-list').classList.remove('active');
    document.getElementById('detail-225338').classList.remove('active');
    document.getElementById('detail-223319').classList.remove('active');
    document.getElementById('detail-218626').classList.remove('active');

    // 2. Hiện đúng chi tiết được chọn
    document.getElementById(id).classList.add('active');

    // 3. Cuộn trang lên đầu khu vực nội dung
    document.querySelector('.account-main-content').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Hàm quay lại danh sách
function backToList() {
    // 1. Ẩn chi tiết
    document.getElementById('detail-225338').classList.remove('active');
    document.getElementById('detail-223319').classList.remove('active');
    document.getElementById('detail-218626').classList.remove('active');

    // 2. Hiện danh sách
    document.getElementById('order-list').classList.add('active');

    // 3. Cuộn lên đầu khu vực nội dung
    document.querySelector('.account-main-content').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Xử lý load trang: Kiểm tra user và hiển thị đơn hàng
document.addEventListener("DOMContentLoaded", function () {
    const orderListBody = document.querySelector('.order-table tbody');
    if (!orderListBody) return;

    // 1. Kiểm tra trạng thái đăng nhập và email
    const isLoggedIn = localStorage.getItem('gvn_logged_in') === 'true';
    const userEmail = localStorage.getItem('gvn_user_email') || '';

    // 2. Nếu chưa đăng nhập, chuyển hướng về Login (bảo mật)
    if (!isLoggedIn) {
        window.location.href = 'KhacDuy_2274802010106_Login.html';
        return;
    }

    // 3. Nếu đã đăng nhập
    if (userEmail === 'kduy0211@gmail.com') {
        // Tài khoản Demo: Hiển thị 3 đơn hàng mẫu
        orderListBody.innerHTML = `
            <tr>
                <td><a href="javascript:void(0)" onclick="showOrder('detail-225338')" class="clickable-order">#225338</a></td>
                <td>Thg 3 10, 2025</td>
                <td>Huỷ</td>
                <td>1,705,000đ</td>
            </tr>
            <tr>
                <td><a href="javascript:void(0)" onclick="showOrder('detail-223319')" class="clickable-order">#223319</a></td>
                <td>Thg 2 15, 2025</td>
                <td>Huỷ</td>
                <td>415,000đ</td>
            </tr>
            <tr>
                <td><a href="javascript:void(0)" onclick="showOrder('detail-218626')" class="clickable-order">#218626</a></td>
                <td>Thg 1 10, 2025</td>
                <td>Huỷ</td>
                <td>3,403,000đ</td>
            </tr>
        `;
        // Hiện lại tab HUỶ (3)
        const cancelTab = document.querySelector('.order-tab-item:last-child');
        if (cancelTab) cancelTab.style.display = 'block';
        
    } else {
        // Tài khoản mới đăng ký: Hiển thị thông báo trống
        orderListBody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 40px 0; color: #888; font-size: 15px;">
                    <i class="bi bi-inbox" style="font-size: 28px; display: block; margin-bottom: 10px;"></i>
                    Bạn chưa có đơn hàng nào.
                </td>
            </tr>
        `;
        // Ẩn tab HUỶ (3) vì không có đơn hàng
        const cancelTab = document.querySelector('.order-tab-item:last-child');
        if (cancelTab) cancelTab.style.display = 'none';
    }
});