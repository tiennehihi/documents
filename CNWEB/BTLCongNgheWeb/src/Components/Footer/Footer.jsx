import React from 'react'
import './Footer.css'

const Footer = () => {
  return (
    <div className='Footer sm1:hidden sm:hidden'>
        <div className="footer-info flex mx-5 my-4">
            <div className="footer-info-support flex-1 ml-5">
                <h2><b>Hỗ trợ khách hàng</b></h2>
                <div className="support">
                    <p>Hotline: <b>1900-6035</b> (1000đ/phút, 8-21h kể cả T7, CN)</p>
                    <p>Các câu hỏi thường gặp</p>
                    <p>Gửi yêu cầu hỗ trợ</p>
                    <p>Hướng dẫn đặt hàng</p>
                    <p>Phương thức vận chuyển</p>
                    <p>Chính sách đổi trả</p>
                    <p>Hướng dẫn trả góp</p>
                    <p>Hỗ trợ khách hàng: hotro@tiki.vn</p>
                    <p>Báo lỗi bảo mật: security@tiki.vn</p>
                </div>
            </div>
            <div className="footer-tiki flex-2 ml-2">
                <h2><b>Về Tiki</b></h2>
                <div className="tiki">
                    <p>Giới thiệu Tiki</p>
                    <p>Tiki Blog</p>
                    <p>Tuyển dụng</p>
                    <p>Chính sách bảo mật thanh toán</p>
                    <p>Chính sách bảo mật thông tin cá nhân</p>
                    <p>Chính sách giải quyết khiếu nại</p>
                    <p>Điều khoản sử dụng</p>
                    <p>Giới thiệu Tiki Xu</p>
                    <p>Gói hội viên VIP</p>
                    <p>Tiếp thị liên kết cùng Tiki</p>
                    <p>Bán hàng doanh nghiệp</p>
                    <p>Điều kiện vận chuyển</p>
                </div>
            </div>
            <div className="footer-cooperate flex-1">
                <h2><b>Hợp tác và liên kết</b></h2>
                <div className="cooperate">
                    <p>Quy chế hoạt động Sàn GDTMĐT</p>
                    <p>Bán hàng cùng Tiki</p>
                </div>
                <h2>Chứng nhận bởi</h2>
            </div>
            <div className="footer-pay flex-1">
                <h2><b>Phương thức thanh toán</b></h2>
                <h2><b>Dịch vụ giao hàng</b></h2>
            </div>
            <div className="footer-contact flex-1">
                <h2><b>Kết nối với chúng tôi</b></h2>
                <div className="contact">
                    <i className="fa-brands fa-facebook mr-3" style={{color: "blue"}}></i>
                    <i className="fa-brands fa-youtube" style={{color: "red"}}></i>
                </div>
                <h2><b>Tải ứng dụng trên điện thoại</b></h2>
            </div>
        </div>
        <hr />
        <div className="footer-company my-5 ml-5">
            <h1><b>Công ty TNHH TIKI</b></h1>
            <p>Địa chỉ trụ sở: Tòa nhà Viettel, số 285, Đường Cách Mạng tháng 8, Phường 12, Quận 10, Thành phố Hồ Chí Minh</p>
            <p>Giấy chứng nhận đăng ký doanh nghiệp số 0309532909 do Sở Kế Hoạch và Đầu Tư Thành phố Hồ Chí Minh cấp lần đầu vào ngày 06/01/2010.</p>
            <p>Hotline: <a href="" style={{ textDecoration: "none" }}>1900 6035</a></p>
        </div>
    </div>
  )
}

export default Footer