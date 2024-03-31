// #include <bits/stdc++.h>
// using namespace std;
// class NhanVien{
//         string maNV;
//         float luong;
//         virtual float tinhLuong() = 0;
//     protected:
//         void setInfor(string id) { 
//             maNV = id; 
//             luong = tinhLuong();
//         }
//     public:
//         NhanVien(string ma=""):maNV(ma){}
//         virtual void print() const {
//             cout << "Ma nhan vien: "<< maNV << endl;
//             cout << "Luong: "<<luong<<endl;
//         }
//         virtual ~NhanVien(){}
// };
// class NhanVienSanXuat: public NhanVien{
//     int soSP;
//     float tienCong;
//     public:
//         NhanVienSanXuat(string m="", int sp=0, float tc=0):soSP(sp), tienCong(tc){}
//         void setInfor(string m, int ssp, float tCong){
//             NhanVien::setInfor(m);
//             soSP = ssp;
//         }
//         float tinhLuong(){
//             return soSP*tienCong;
//         }
//         void print(){
//             cout << "So san pham: "<<soSP<<endl;
//             cout << "Tien cong 1 san pham: "<<tienCong<<endl;
//         }
// };
// class NhanVienVanPhong: public NhanVien{
//     int soNgayCong;
//     float luongCB;
//     public:
//         NhanVienVanPhong(string m, int sNC, float lCB):soNgayCong(sNC), luongCB(lCB){}
//         void setInfor(string m, int s, float l){
//             NhanVien::setInfor(m);
//             soNgayCong = s;
//             luongCB = l;
//         }
//         float tienLuong(){
//             return soNgayCong*luongCB/30;
//         }

// };











#include <iostream>
#include <string>
using namespace std;

class NhanVien {
private:
    string maNhanVien;
    double luong;

public:
    NhanVien(string ma, double l) : maNhanVien(ma), luong(l) {}

    virtual long long int tinhLuong() = 0;

    void setInfor(string ma, double l) {
        maNhanVien = ma;
        luong = l;
    }

    virtual void print() {
        cout << "Ma nhan vien: " << maNhanVien << ", Luong: " << luong << endl;
    }
};

class NhanVienSanXuat : public NhanVien {
private:
    int soSanPham;
    double tienCongMotSanPham;

public:
    NhanVienSanXuat(string ma, double l, int sp, double tc) : NhanVien(ma, l), soSanPham(sp), tienCongMotSanPham(tc) {}

    long long int tinhLuong() override {
        return soSanPham * tienCongMotSanPham;
    }

    void setInfor(string ma, double l, int sp, double tc) {
        NhanVien::setInfor(ma, l);
        soSanPham = sp;
        tienCongMotSanPham = tc;
    }

    void print() override {
        NhanVien::print();
        cout << "So san pham: " << soSanPham << ", Tien cong 1 san pham: " << tienCongMotSanPham << endl;
    }
};

class NhanVienVanPhong : public NhanVien {
private:
    int soNgayCong;
    long long int luongCoBan;

public:
    NhanVienVanPhong(string ma, double l, int ngay, long long int lb) : NhanVien(ma, l), soNgayCong(ngay), luongCoBan(lb) {}

    long long int tinhLuong() override {
        return soNgayCong * (luongCoBan / 30);
    }

    void setInfor(string ma, double l, int ngay, long long int lb) {
        NhanVien::setInfor(ma, l);
        soNgayCong = ngay;
        luongCoBan = lb;
    }

    void print() override {
        NhanVien::print();
        cout << "So ngay cong: " << soNgayCong << ", Luong co ban: " << luongCoBan << endl;
    }
};

int main() {
    NhanVien* nhanViens[5];

    nhanViens[0] = new NhanVienSanXuat("NV001", 0, 100, 5000);
    nhanViens[1] = new NhanVienSanXuat("NV002", 0, 150, 4500);
    nhanViens[2] = new NhanVienVanPhong("NV101", 0, 25, 5000000);
    nhanViens[3] = new NhanVienVanPhong("NV102", 0, 22, 5500000);
    nhanViens[4] = new NhanVienSanXuat("NV003", 0, 120, 4800);

    for (int i = 0; i < 5; i++) {
        nhanViens[i]->print();
        cout << "Luong: " << nhanViens[i]->tinhLuong() << endl;
        cout << "-----------------------" << endl;
    }

    // Giải phóng bộ nhớ
    for (int i = 0; i < 5; i++) {
        delete nhanViens[i];
    }

    return 0;
}
