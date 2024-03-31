/*
Viết lớp TaiKhoan gồm các thành viên:
• Mã tài khoản, số tiền trong tài khoản
• Một biến static đếm số tài khoản 
• Một setter cập nhật cho mọi biến 
• Hàm tạo mặc định, hàm tạo 2 tham số, hàm tạo sao chép 
• Getter cho tất cả các biến 
Viết  hàm  main,  in  ra  tổng  số tài  khoản  từng  tạo, 
sau đó tạo  một  tài khoản  mặc định, một tài khoản có mã và số tiền, 
một tài khoản là copy của tài khoản thứ hai, cuối cùng in ra tổng số tài khoản đã tạo
*/

#include <iostream>
#include <string>
using namespace std;
class TaiKhoan {
private:
    string maTaiKhoan;
    double soTien;
    static int soTaiKhoan;

public:
    TaiKhoan() : maTaiKhoan(""), soTien(0) {
        soTaiKhoan++;
    }

    TaiKhoan(string ma, double tien) : maTaiKhoan(ma), soTien(tien) {
        soTaiKhoan++;
    }

    TaiKhoan(const TaiKhoan &other) : maTaiKhoan(other.maTaiKhoan), soTien(other.soTien) {
        soTaiKhoan++;
    }

    void set(string ma, double tien) {
        maTaiKhoan = ma;
        soTien = tien;
        soTaiKhoan++;
    }

    string getMaTaiKhoan() const {
        return maTaiKhoan;
    }

    double getSoTien() const {
        return soTien;
    }

    static int getSoTaiKhoan() {
        return soTaiKhoan;
    }
};

int TaiKhoan::soTaiKhoan = 0;

int main() {
    cout << "Tong so tai khoan da tao: " << TaiKhoan::getSoTaiKhoan() << endl;

    TaiKhoan tk1;
    TaiKhoan tk2("TK123", 1000);
    TaiKhoan tk3 = tk2;

    cout << "Tong so tai khoan da tao: " << TaiKhoan::getSoTaiKhoan() << endl;

    return 0;
}




































// #include <iostream>
// using namespace std;
// class TaiKhoan{
//     private:
//         int maTaiKhoan;
//         double soDu;
//         static int count;
//     public:
//         TaiKhoan()
//         {
//             count++;
//         }
//         TaiKhoan(int ID, double sdu = 0) : maTaiKhoan(ID), soDu(sdu) 
//         {
//             count++;
//         }
//         void setter(int mtk, double sd)
//         {
//             maTaiKhoan = mtk; 
//             soDu = sd;
//         }

//         // hàm sao chép
//         TaiKhoan (TaiKhoan const &t)
//         {
//             maTaiKhoan = t.maTaiKhoan;
//             soDu = t.soDu;
//             count++;
//         }
//         static int tongSTK()
//         {
//             return count;
//         }
//         int getMaTaiKhoan() const { return maTaiKhoan; }
//         double getSoDu() const { return soDu; }

// };
// int TaiKhoan::count = 0;  

// int main()
// {
//     TaiKhoan tkMacDinh;

//     return 0;
// }