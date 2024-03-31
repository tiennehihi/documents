#include <iostream>
#include <cmath>
using namespace std;

class PhuongTrinhBac2 {
private:
    double a, b, c;

public:
    // Hàm tạo với các tham số mặc định
    PhuongTrinhBac2(double _a = 0, double _b = 0, double _c = 0) : a(_a), b(_b), c(_c) {}

    // Hàm toán tử in ra các hệ số của phương trình
    friend ostream& operator<<(ostream& os, const PhuongTrinhBac2& pt) {
        os << "Phuong trinh: " << pt.a << "x^2 + " << pt.b << "x + " << pt.c;
        return os;
    }

    // Toán tử nhập >>
    friend istream& operator>>(istream& is, PhuongTrinhBac2& pt) {
        // cout << "Nhap a, b, c cua phuong trinh: ";
        is >> pt.a >> pt.b >> pt.c;
        return is;
    }

    // Hàm giải phương trình bậc 2
    void giaiPhuongTrinh() {
        double delta = b * b - 4 * a * c;
        if (delta < 0) {
            cout << "Phuong trinh vo nghiem" << endl;
        } else if (delta == 0) {
            double x = -b / (2 * a);
            cout << "Phuong trinh co nghiem kep x = " << x << endl;
        } else {
            double x1 = (-b + sqrt(delta)) / (2 * a);
            double x2 = (-b - sqrt(delta)) / (2 * a);
            cout << "Phuong trinh co 2 nghiem phan biet x1 = " << x1 << ", x2 = " << x2 << endl;
        }
    }

    // Tính tổng nghiệm của 3 phương trình
    static double tongNghiem(const PhuongTrinhBac2& pt1, const PhuongTrinhBac2& pt2, const PhuongTrinhBac2& pt3) {
        double tong = 0;
        tong += pt1.giaiVaTraVeNghiem();
        tong += pt2.giaiVaTraVeNghiem();
        tong += pt3.giaiVaTraVeNghiem();
        return tong;
    }

    // Hàm giải phương trình và trả về nghiệm
    double giaiVaTraVeNghiem() const {
        double delta = b * b - 4 * a * c;
        if (delta < 0) {
            return 0; // Phương trình vô nghiệm
        } else if (delta == 0) {
            return -b / (2 * a); // Phương trình có nghiệm kép
        } else {
            double x1 = (-b + sqrt(delta)) / (2 * a);
            double x2 = (-b - sqrt(delta)) / (2 * a);
            return x1 + x2; // Phương trình có 2 nghiệm phân biệt
        }
    }
};

int main() {
    // Nhập các phương trình
    PhuongTrinhBac2 p1, p2, p3;
    cout << "Nhap phuong trinh 1 (a, b, c): ";
    cin >> p1;
    cout << "Nhap phuong trinh 2 (a, b, c): ";
    cin >> p2;
    cout << "Nhap phuong trinh 3 (a, b, c): ";
    cin >> p3;

    // In các phương trình
    cout << "Cac phuong trinh nhap vao:" << endl;
    cout << p1 << endl;
    cout << p2 << endl;
    cout << p3 << endl;

    // Giải các phương trình và in ra nghiệm
    cout << "Nghiem cua phuong trinh 1: ";
    p1.giaiPhuongTrinh();
    cout << "Nghiem cua phuong trinh 2: ";
    p2.giaiPhuongTrinh();
    cout << "Nghiem cua phuong trinh 3: ";
    p3.giaiPhuongTrinh();

    // Giải các phương trình và tính tổng nghiệm
    double tongNghiem = PhuongTrinhBac2::tongNghiem(p1, p2, p3);
    cout << "Tong nghiem cua 3 phuong trinh la: " << tongNghiem << endl;

    return 0;
}
