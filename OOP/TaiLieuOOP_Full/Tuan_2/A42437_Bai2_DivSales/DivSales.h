// DivSales 
// Một công ty có sáu bộ phận, mỗi bộ phận chịu trách nhiệm bán hàng cho các vị trí địa lý 
// khác nhau. Thiết kế một lớp DivSales lưu giữ dữ liệu bán hàng cho một bộ phận, với các 
// thành viên sau:
// • Một mảng có 4 phần tử lưu trữ doanh số bán hàng cho 4 quý.
// • Một biến tĩnh riêng để lưu tổng doanh số bán hàng của công ty (tất cả các bộ phận) 
// trong cả năm.
// • Một hàm cập nhật nhận 4 đối số để gán vào mảng chứa dữ liệu bán hàng trong 4 quý. 
// Ngoài ra cần tính tổng doanh thu hàng năm của công ty.
// • Một hàm nhận đối số nguyên trong phạm vi 0–3 là chỉ số trong mảng doanh số bán 
// hàng. Hàm sẽ trả về doanh số quý theo chỉ số đó. Báo lỗi nếu phạm vi không hợp lệ.
// Viết chương trình tạo một mảng 6 đối tượng DivSales. Chương trình sẽ yêu cầu người 
// dùng nhập doanh số bán hàng trong 4 quý cho mỗi bộ phận. Sau đó chương trình sẽ hiển thị một bảng hiển thị doanh số bộ phận cho mỗi quý và tổng doanh số bán hàng của công ty 
// trong năm.
// Xác thực đầu vào: Chỉ chấp nhận số liệu bán hàng mỗi quý dương 

#ifndef DIVSALES_H
#define DIVSALES_H

class DivSales
{
    private:
        double quy[4];
        static double tongDoanhThu;
    public:
        void setSoLieu(double q1, double q2, double q3, double q4)
        {
            quy[0] = q1;
            quy[1] = q2;
            quy[2] = q3;
            quy[3] = q4;
            for(int i=0; i<4; i++)
            {
                tongDoanhThu+=quy[i];
            }
        }

        double getSoLieu(int chiso)
        {
            if (chiso < 0 || chiso > 3)
                throw "Chi so khong hop le";
            else
                return quy[chiso];
        }
        int getTongDoanhThu()const
        {
            return tongDoanhThu;
        }
};

double DivSales::tongDoanhThu = 0;

#endif