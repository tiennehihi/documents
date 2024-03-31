#include <iostream>
#include <fstream>
#include <string>

using namespace std;

struct Sach {
    char tenSach[30];
    int namXuatBan;
};

int main() {
    // ifstream inFile("sach2.dat", ios::in | ios::binary);
    // if (!inFile) {
    //     cout << "Khong the mo file sach2.dat." << endl;
    //     return 1;
    // }

    // int n;
    // inFile.read(reinterpret_cast<char*>(&n), sizeof(n)); // Đọc số lượng sách n

    // Sach danhSachSauNhap[n];

    // for (int i = 0; i < n; i++) {
    //     char buffer[100]; // Dùng để đọc chuỗi "tenSach"
    //     inFile.read(buffer, sizeof(buffer));
    //     danhSachSauNhap[i].tenSach = string(buffer);

    //     inFile.read(reinterpret_cast<char*>(&danhSachSauNhap[i].namXuatBan), sizeof(int));
    // }

    // inFile.close();
    int n=10;
    Sach danhSachSauNhap[n];
    ifstream inFile2("sach2.dat", ios::in | ios::binary);
    if (!inFile2) {
        cout << "Loi mo file doc." << endl;
        return 1;
    }
    inFile2.read(reinterpret_cast<char*>(&danhSachSauNhap), sizeof(danhSachSauNhap));
    inFile2.close();

    cout << "Danh sach cuon sach sau khi doc tu file sach2.dat:" << endl;
    for (int i = 0; i <= n; i++) {
        cout << "Ten sach: " << danhSachSauNhap[i].tenSach << ", Nam xuat ban: " << danhSachSauNhap[i].namXuatBan << endl;
    }

    return 0;
}
