/*
Falculty& Department Viết lớp Faculty và lớp Department lần lượt mô phỏng một khoa và một bộ môn trong trường. Lớp Department cần có: 
    • Thông tin tên bộ môn, số  giáo viên của bộ môn, 
    • Hàm tạo mặc định sinh ra bộ môn có tên và số giáo viên đều null 
    • Hàm tạo đủ tham số để khởi tạo các biến thành viên
    • Setter tổng và các hàm getter
    • Hàm print in ra toàn bộ thông tin bộ môn 
    • Hàm huỷ in ra thông tin đang huỷ bộ môn nào
    Lớp Faculty cần có: 
    • Tên khoa, 3 bộ môn
    • Hàm tạo mặc định sinh ra khoa có tên khoa, tên 3 bộ môn và số giảng viên 3 bộ môn đều null 
    • Hàm tạo nhập đủ tên khoa, tên các bộ môn và số lượng giảng viên các bộ môn để tạo ra khoa với tên và 3 bộ môn như vậy. 
    • Hàm tính tổng số giáo viên của khoa 
    • Hàm in ra tên khoa, thông tin mỗi bộ môn, và tổng số giáo viên trong khoa 
    • Hàm huỷ in ra đang huỷ khoa nào
    a. Quan hệ giữa Faculty và Department là kiểu gì: liên kết, kết tập, hay hợp thành? 
    b. Nên cài 3 bộ môn trong khoa như mảng biến thường, mảng con trỏ, hay mảng tham chiếu? 
    c. Hãy cài đặt 2 lớp trên và tạo chương trình demo sinh ra một khoa với 3 bộ môn rồi in ra thông tin khoa đó 
*/




// Mối quan hệ liên kết
// Nên cài 3 bộ môn trong khoa như mảng biến thường
#include <iostream>
using namespace std;

class Department
{
        string tenmon;
        int sogiaovien;
    public:
        Department(): tenmon(""), sogiaovien(){}
        Department(string t, int s): tenmon(t), sogiaovien(s){}
        void setTemon(string t){tenmon = t;}
        void setSogiaovien(int s){sogiaovien = s;}
        string getTenmon()const {return tenmon;}
        int getSogiaovien()const {return sogiaovien;}
        void print()
        {
            cout<<"Mon: "<<tenmon<<", So giao vien: "<<sogiaovien<<endl;
        }
        ~Department() {cout<<"Dang huy bo mon "<<tenmon<<endl;}
};

class Falculty
{
        string khoa;
        Department mon1, mon2, mon3;
    public: 
        Falculty(): khoa(""), mon1("", 0), mon2("", 0), mon3("", 0) {}
        Falculty(string k, Department &m1, Department &m2, Department &m3): khoa(k), mon1(m1), mon2(m2), mon3(m3){}
        int tong(){return (mon1.getSogiaovien()+mon2.getSogiaovien()+mon3.getSogiaovien());}
        void boMon()
        {
            cout<<"Ten khoa: "<<khoa<<endl;
            mon1.print();
            mon2.print();
            mon3.print();
        }
        ~Falculty(){cout<<"Dang huy khoa "<<khoa<<endl;}
};

int main()
{
    //a. Quan hệ hợp thành 
    //b. Nên cài bằng biến thường
    
    Department m1("Ngon ngu lap trinh", 5), m2("Lap trinh huong doi tuong", 6), m3("Giai tich", 7);
    Falculty a("CONG NGHE THONG TIN", m1, m2, m3);
    a.boMon();
    cout<<"Tong so giao vien: "<<a.tong()<<endl;

    return 0;
}