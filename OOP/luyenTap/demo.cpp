#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

using namespace std;

class Diem {
private:
    string hoTen;
    const char* soBaoDanh;
    float diem;

public:
    Diem(string hoTen, const char* soBaoDanh, float diem) : hoTen(hoTen), diem(diem) {
        this->soBaoDanh = soBaoDanh;
    }

    // Hàm so sánh điểm của 2 sinh viên
    friend bool operator<(const Diem& a, const Diem& b) {
        return a.diem > b.diem; // Sắp xếp giảm dần theo điểm
    }

    // Hàm in thông tin sinh viên
    friend ostream& operator<<(ostream& os, const Diem& sv) {
        os << "Ho ten: " << sv.hoTen << ", So bao danh: " << sv.soBaoDanh << ", Diem: " << sv.diem;
        return os;
    }

    // Hàm trả về điểm
    float getDiem() const {
        return diem;
    }
};

class BangDiem {
private:
    vector<Diem> danhSachDiem;

public:
    // Hàm thêm sinh viên vào bảng điểm
    void ThemSinhVien(const Diem& sv) {
        danhSachDiem.push_back(sv);
    }

    // Hàm in danh sách điểm theo thứ tự giảm dần của điểm thi
    void InDanhSachDiem() {
        sort(danhSachDiem.begin(), danhSachDiem.end()); // Sắp xếp danh sách giảm dần theo điểm
        for (const auto& sv : danhSachDiem) {
            cout << sv << endl;
        }
    }

    // Hàm đếm số sinh viên đạt điểm A và in danh sách sinh viên đó
    void SinhVienDatDiemA() {
        int countA = 0;
        for (const auto& sv : danhSachDiem) {
            if (sv.getDiem() >= 8.5) { // Điểm A là từ 8.5 trở lên
                cout << sv << endl;
                countA++;
            }
        }
        cout << "So sinh vien dat diem A: " << countA << endl;
    }
};

int main() {
    BangDiem bangDiem;
    // Nhập bảng điểm
    // bangDiem.ThemSinhVien(Diem("Nguyen Van A", "001", 9.5));
    // bangDiem.ThemSinhVien(Diem("Tran Thi B", "002", 8.0));
    // bangDiem.ThemSinhVien(Diem("Le Van C", "003", 7.0));
    // bangDiem.ThemSinhVien(Diem("Pham Van D", "004", 8.5));
    // bangDiem.ThemSinhVien(Diem("Hoang Thi E", "005", 6.5));
    // bangDiem.ThemSinhVien(Diem("Nguyen Thi F", "006", 9.0));

    // Nhập thông tin sinh viên từ bàn phím
    int n;
    cout << "Nhap so sinh vien: ";
    cin >> n;
    cin.ignore();

    cout << "Nhap thong tin sinh vien:" << endl;
    for (int i = 0; i < n; ++i) {
        string hoTen;
        const char* soBaoDanh;
        float diem;

        cout << "Nhap ho ten: ";
        getline(cin, hoTen);

        cout << "Nhap so bao danh: ";
        char soBaoDanhBuf[50];
        cin.getline(soBaoDanhBuf, sizeof(soBaoDanhBuf));
        soBaoDanh = soBaoDanhBuf;

        cout << "Nhap diem: ";
        cin >> diem;

        // Xóa bộ nhớ đệm cho dòng tiếp theo
        cin.ignore();

        bangDiem.ThemSinhVien(Diem(hoTen, soBaoDanh, diem));
    }

    // In danh sách điểm theo thứ tự giảm dần của điểm thi
    cout << "Danh sach diem theo thu tu giam dan: " << endl;
    bangDiem.InDanhSachDiem();

    // In danh sách sinh viên đạt điểm A
    cout << "Danh sach sinh vien dat diem A: " << endl;
    bangDiem.SinhVienDatDiemA();

    return 0;
}
