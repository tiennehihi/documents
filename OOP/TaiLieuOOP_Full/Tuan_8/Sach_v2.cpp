// Vẫn trên cấu trúc Sach, viết main tạo ra một mảng 10 cuốn sách, tự khởi
// tạo tuỳ ý
// a) Ghi cả mảng này vào file sach.dat kiểu nhị phân
// b) Lại mở sach.dat để đọc kiểu nhị phân, tạo một mảng Sach nữa cũng
// 10 phần tử, đọc file vào mảng đó, in ra thông tin mọi cuốn sách, kiểm
// tra có giống mảng ban đầu
// c) Nhập vào số n, tạo mảng n cuốn sách, nhập thông tin cho mảng từ
// bàn phím, ghi cả mảng vào file sach2.dat kiểu nhị phân
// d) Mở sach2.dat để đọc kiểu nhị phân, tạo một mảng Sach nữa có n
// phần tử, đọc file vào mảng đó, in ra mọi cuốn sách cùng số lượng
// sách xuất bản 2022

// #include <iostream>
// #include <fstream>
// using namespace std;

// struct Sach {
//     string tenSach;
//     int namXuatBan;
// };

// int main() {
//     Sach danhSachBanDau[10] = {
//         {"Sach 1", 2022},
//         {"Sach 2", 2022},
//         {"Sach 3", 2022},
//         {"Sach 4", 2022},
//         {"Sach 5", 2022},
//         {"Sach 6", 2022},
//         {"Sach 7", 2022},
//         {"Sach 8", 2022},
//         {"Sach 9", 2022},
//         {"Sach 10", 2022}
//     };

//     // Ghi danh sách sách vào file
//     ofstream outFile("sach.dat", ios::out | ios::binary);
//     if (!outFile) {
//         cout << "Loi mo file ghi." << endl;
//         return 1;
//     }
//     outFile.write(reinterpret_cast<char*>(&danhSachBanDau), sizeof(danhSachBanDau));
//     outFile.close();

//     // Đọc danh sách sách từ file
//     Sach danhSachDoc[10];
//     ifstream inFile("sach.dat", ios::in | ios::binary);
//     if (!inFile) {
//         cout << "Loi mo file doc." << endl;
//         return 1;
//     }
//     inFile.read(reinterpret_cast<char*>(&danhSachDoc), sizeof(danhSachDoc));
//     inFile.close();

//     cout << "Danh sach cuon sach sau khi doc tu file sach.dat:" << endl;
//     for (int i = 0; i < 10; i++) {
//         cout << "Ten sach: " << danhSachDoc[i].tenSach << ", Nam xuat ban: " << danhSachDoc[i].namXuatBan << endl;
//     }

//     int n;
//     cout << "Nhap so luong sach ban muon them: ";
//     cin >> n;

//     Sach danhSachNhap[n];
//     for (int i = 0; i < n; i++) {
//         cout << "Nhap thong tin cho sach thu " << i + 1 << ":" << endl;
//         cout << "Ten sach: ";
//         cin.ignore();
//         getline(cin, danhSachNhap[i].tenSach);
//         // cin >> danhSachNhap[i].tenSach;
//         cout << "Nam xuat ban: ";
//         cin >> danhSachNhap[i].namXuatBan;
//     }

//     // Ghi danh sách sách vào file sach2.dat
//     ofstream outFile2("sach2.dat", ios::out | ios::binary);
//     if (!outFile2) {
//         cout << "Loi mo file ghi." << endl;
//         return 1;
//     }
//     outFile2.write(reinterpret_cast<char*>(&danhSachNhap), sizeof(danhSachNhap));
//     outFile2.close();

//     // Đọc danh sách sách từ file sach2.dat
//     Sach danhSachSauNhap[n];
//     ifstream inFile2("sach2.dat", ios::in | ios::binary);
//     if (!inFile2) {
//         cout << "Loi mo file doc." << endl;
//         return 1;
//     }
//     inFile2.read(reinterpret_cast<char*>(&danhSachSauNhap), sizeof(danhSachSauNhap));
//     inFile2.close();

//     cout << "Danh sach cuon sach sau khi doc tu file sach2.dat:" << endl;
//     for (int i = 0; i < n; i++) {
//         cout << "Ten sach: " << danhSachSauNhap[i].tenSach << ", Nam xuat ban: " << danhSachSauNhap[i].namXuatBan << endl;
//     }

//     return 0;
// }


// Vẫn trên cấu trúc Sach, viết main tạo ra một mảng 10 cuốn sách, tự khởi
// tạo tuỳ ý
// a) Ghi cả mảng này vào file sach.dat kiểu nhị phân
// b) Lại mở sach.dat để đọc kiểu nhị phân, tạo một mảng Sach nữa cũng
// 10 phần tử, đọc file vào mảng đó, in ra thông tin mọi cuốn sách, kiểm
// tra có giống mảng ban đầu
// c) Nhập vào số n, tạo mảng n cuốn sách, nhập thông tin cho mảng từ
// bàn phím, ghi cả mảng vào file sach2.dat kiểu nhị phân
// d) Mở sach2.dat để đọc kiểu nhị phân, tạo một mảng Sach nữa có n
// phần tử, đọc file vào mảng đó, in ra mọi cuốn sách cùng số lượng
// sách xuất bản 2022

#include <bits/stdc++.h>
using namespace std;
struct Sach {
    char tenSach[30];
    int namXB;
};

int main() {
    // Sach dsBanDau[10] = {
    //     {"C++ Co Ban", 2019},
    //     {"Java Core", 2018},
    //     {"Python Programming", 2024},
    //     {"Javascript: The Good Parts", 2017} ,
    //     {"Effective Java", 2015},
    //     {"Clean Code", 2016},
    //     {"The Pragmatic Programmer", 2018 },
    //     {"Design Patterns", 2017},
    //     {"Head First Design Patterns", 2022},
    //     {"C++ Programing", 2003}
    // };

    // // a) Ghi cả mảng này vào file sach.dat kiểu nhị phân
    // ofstream outFile("sach.dat", ios::out | ios::binary);
    // if(!outFile) {
    //     cout << "File is not default." << endl;
    //     return 1;
    // }
    // outFile.write(reinterpret_cast<const char*>(&dsBanDau), sizeof(dsBanDau));
    // outFile.close();

    // // b) Lại mở sach.dat để đọc kiểu nhị phân
    // // 10 phần tử, đọc file vào mảng đó, in ra thông tin mọi cuốn sách, kiểm
    // // tra có giống mảng ban đầu
    // Sach dsDoc[10];
    // ifstream inFile("sach.dat", ios::binary);
    // if (!inFile){
    //     cout<<"Khong the mo file!"<<endl;
    //     return 1;
    // }
    // inFile.read(reinterpret_cast<char*>(&dsDoc), sizeof(dsDoc));
    // for(int i=0; i < 10; i++){
    //     cout << "Ten sach: " << dsDoc[i].tenSach << "\nNam XB: " << dsDoc[i].namXB << endl;
    // }

    // c) Nhập vào số n, tạo mảng n cuốn sách, nhập thông tin cho mảng từ
    // bàn phím, ghi cả mảng vào file sach2.dat kiểu nhị phân
    int n;
    cout <<"Nhap so luong sach can them: " ; 
    cin >> n;
    Sach dsNhap[n];
    for(int i=0; i < n; i++) {
        cout << "Nhap thong tin sach thu " << i + 1 << ": \n";
        cout << "Ten sach: ";
        cin.ignore();
        cin.getline(dsNhap[i].tenSach, 30);
        cout << "Nam XB: ";
        cin >> dsNhap[i].namXB;
    }
    // Ghi mảng vào file sach2.dat
    ofstream outFile2 ("sach2.dat", ios::binary | ios::app);
    if(!outFile2) {
        cout << "Loi mo ghi file.";
        return 1;
    }
    outFile2.write(reinterpret_cast<char*>(&dsNhap), sizeof(dsNhap));
    outFile2.close();

    // d) Mở sach2.dat để đọc kiểu nhị phân, tạo một mảng Sach nữa có n
    // phần tử, đọc file vào mảng đó
    Sach dsSauNhap[n];
    ifstream inFile2("sach2.dat", ios::binary);
    inFile2.read(reinterpret_cast<char*>(&dsSauNhap), sizeof(dsSauNhap));
    inFile2.close();
    cout << "Danh sach sau khi them vao file sach2.dat: ";
    for(int i = 0; i < n; i++) {
        cout << "Ten sach: " << dsSauNhap[i].tenSach << endl;
        cout << "Nam XB: " << dsSauNhap[i].namXB << endl;
    }

    return 0;
}