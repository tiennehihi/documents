#include <iostream>
#include <string>

using namespace std;

// Khai báo cấu trúc ThongTinTaiKhoan
struct ThongTinTaiKhoan {
    string ten;
    string soDienThoai;
    double soDuTaiKhoan;
    string ngayThanhToanCuoiCung;
};

// Hàm nhập thông tin của một tài khoản
void NhapTaiKhoan(ThongTinTaiKhoan &taiKhoan) {
    cout << "Nhap ten: ";
    cin.ignore();
    getline(cin, taiKhoan.ten);

    cout << "Nhap so dien thoai: ";
    getline(cin, taiKhoan.soDienThoai);

    cout << "Nhap so du tai khoan: ";
    cin >> taiKhoan.soDuTaiKhoan;

    cout << "Nhap ngay thanh toan cuoi cung: ";
    cin.ignore();
    getline(cin, taiKhoan.ngayThanhToanCuoiCung);
}

// Hàm hiển thị thông tin của một tài khoản
void HienThiTaiKhoan(const ThongTinTaiKhoan &taiKhoan) {
    cout << "Ten: " << taiKhoan.ten << endl;
    cout << "So dien thoai: " << taiKhoan.soDienThoai << endl;
    cout << "So du tai khoan: " << taiKhoan.soDuTaiKhoan << endl;
    cout << "Ngay thanh toan cuoi cung: " << taiKhoan.ngayThanhToanCuoiCung << endl;
}

// Hàm tìm kiếm tài khoản theo tên và trả về chỉ số hoặc -1 nếu không tìm thấy
int TimKiemTaiKhoan(const ThongTinTaiKhoan danhSachTaiKhoan[], int soLuongTaiKhoan, const string &ten) {
    for (int i = 0; i < soLuongTaiKhoan; i++) {
        if (danhSachTaiKhoan[i].ten == ten) {
            return i;
        }
    }
    return -1;
}

// Hàm sửa đổi tài khoản


int main() {
    const int MAX_TAIKHOAN = 10;
    ThongTinTaiKhoan danhSachTaiKhoan[MAX_TAIKHOAN];
    int soLuongTaiKhoan = 0;

    while (true) {
        cout << "===== MENU =====" << endl;
        cout << "1. Nhap tai khoan" << endl;
        cout << "2. Hien thi danh sach tai khoan" << endl;
        cout << "3. Sua doi thong tin tai khoan" << endl;
        cout << "4. Tim kiem tai khoan" << endl;
        cout << "5. Thoat" << endl;
        cout << "Nhap lua chon: ";
        int luaChon;
        cin >> luaChon;

        switch (luaChon) {
            case 1: {
                if (soLuongTaiKhoan < MAX_TAIKHOAN) {
                    NhapTaiKhoan(danhSachTaiKhoan[soLuongTaiKhoan]);
                    soLuongTaiKhoan++;
                    cout << "Da them tai khoan thanh cong!" << endl;
                } else {
                    cout << "Danh sach tai khoan da day!" << endl;
                }
                break;
            }
            case 2: {
                for (int i = 0; i < soLuongTaiKhoan; i++) {
                    cout << "===== Tai khoan " << i + 1 << " =====" << endl;
                    HienThiTaiKhoan(danhSachTaiKhoan[i]);
                }
                break;
            }
            case 3: {
                cout << "Nhap ten tai khoan can sua: ";
                string tenSuaDoi;
                cin.ignore();
                getline(cin, tenSuaDoi);


                int viTriSuaDoi = TimKiemTaiKhoan(danhSachTaiKhoan, soLuongTaiKhoan, tenSuaDoi);
                if (viTriSuaDoi != -1) {
                    cout << "Thong tin tai khoan truoc khi sua doi: " << endl;
                    HienThiTaiKhoan(danhSachTaiKhoan[viTriSuaDoi]);
                    cout << "Nhap thong tin tai khoan moi: " << endl;
                    NhapTaiKhoan(danhSachTaiKhoan[viTriSuaDoi]);
                    cout << "Da sua doi tai khoan thanh cong!" << endl;
                } else {
                    cout << "Khong tim thay tai khoan can sua doi!" << endl;
                }
                break;
            }
            case 4: {
                cout << "Nhap ten tai khoan can tim kiem: ";
                string tenTimKiem;
                cin.ignore();
                getline(cin, tenTimKiem);

                int viTriTimKiem = TimKiemTaiKhoan(danhSachTaiKhoan, soLuongTaiKhoan, tenTimKiem);
                if (viTriTimKiem != -1) {
                    cout << "Tim thay tai khoan tai vi tri " << viTriTimKiem + 1 << " trong danh sach." << endl;
                    cout << "===== Thong tin tai khoan =====" << endl;
                    HienThiTaiKhoan(danhSachTaiKhoan[viTriTimKiem]);
                } else {
                    cout << "Khong tim thay tai khoan!" << endl;
                }
                break;
            }
            case 5: {
                return 0; // Thoat chuong trinh
            }
            default: {
                cout << "Lua chon khong hop le. Vui long chon lai!" << endl;
            }
        }
    }

    return 0;
}
/*
Hàm cin.ignore() trong C++ được sử dụng để xóa các ký tự còn lại trong bộ đệm (buffer) 
của đối tượng cin (chủ yếu là bộ đệm bàn phím) sau khi bạn đã nhập một chuỗi hoặc giá trị số và nhấn Enter.

Thường thì sau khi bạn nhập dữ liệu bằng cin, có ký tự Enter (\n) còn lại trong bộ đệm. 
Nếu bạn tiếp tục sử dụng cin để đọc một chuỗi hoặc ký tự sau đó mà không gọi cin.ignore(), 
thì cin sẽ đọc ký tự Enter còn lại trong bộ đệm và không cho bạn cơ hội nhập dữ liệu mới. 
Điều này có thể gây ra lỗi trong chương trình của bạn.

Do đó, bạn thường gọi cin.ignore() để xóa ký tự Enter còn lại trong bộ đệm và 
chuẩn bị cin cho việc đọc dữ liệu tiếp theo mà bạn muốn nhập từ bàn phím.

Ví dụ, sau khi bạn nhập một số nguyên bằng cin, bạn có thể gọi cin.ignore() trước khi nhập một chuỗi ký tự. 
Điều này sẽ giúp tránh việc ký tự Enter không mong muốn gây ra lỗi trong chương trình của bạn.
*/