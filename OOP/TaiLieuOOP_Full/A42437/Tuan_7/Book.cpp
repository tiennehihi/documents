// Tạo struct Book mô tả một cuốn sách, có các thành viên:
// Tên, tác giả, năm xuất bản, nhà xuất bản
// Tạo cuốn sách tên là “Lord of the rings”, tác giả J.R.R. Tolkien, xuất  bản năm 1954, nhà xuất bản Allen & Unwin
// Tạo cuốn sách tên là “Truyền kỳ mạn lục”, tác giả Nguyễn Dữ, xuất  bản năm không rõ, nhà xuất bản không rõ.


#include <bits/stdc++.h>
using namespace std;
struct Book{
    string nameBook, nameTacGia, nhaXuatBan;
};
struct Book1{
    string year;
    Book pData; 
};
// Là một cách để định dạng xuất dữ liệu số thập phân trong C++.

// fixed là một cờ (flag) để xác định rằng bạn muốn hiển thị các số thập phân với số lẻ hoặc số chẵn số chữ số thập phân (không bị cắt bớt). 
// Nếu bạn không sử dụng fixed, thì một số như 3.50 sẽ được hiển thị là 3.5 (tức là số 0 sau dấu thập phân sẽ không được hiển thị).

// showpoint là một cờ khác, nó thông báo rằng bạn muốn hiển thị cả các số 0 sau dấu thập phân. 
// Nếu bạn không sử dụng showpoint, thì các số sau dấu thập phân không cần thiết sẽ bị cắt bỏ (ví dụ: 3.50 sẽ trở thành 3.5).

// setprecision(2) là một hàm để xác định số chữ số thập phân bạn muốn hiển thị sau dấu thập phân. 
// Trong ví dụ này, setprecision(2) đặt số chữ số thập phân là 2, nghĩa là sẽ hiển thị hai chữ số sau dấu thập phân.

void print(const Book1 &m){
    cout << fixed << showpoint << setprecision(2);
    cout << m.year << endl << m.pData.nameBook << endl << m.pData.nameTacGia << endl << m.pData.nhaXuatBan << endl;
}
int main(){
    Book1 a;
    a.pData.nameBook = "Lord of the rings";
    a.pData.nameTacGia = "J.R.R. Tolkien";
    a.pData.nhaXuatBan = "Allen & Unwin";
    a.year = "1954";
    Book1 b;
    b.pData.nameBook = "Truyen ky man luc";
    b.pData.nameTacGia = "Nguyen Du";
    b.pData.nhaXuatBan = "khong ro";
    b.year = "khong ro";

    // cout << a.pData.nameBook << endl;
    // cout << a.pData.nameTacGia << endl;
    // cout << a.pData.nhaXuatBan << endl;
    // cout << a.year << endl;
    // cout << endl;
    // cout << b.pData.nameBook << endl;
    // cout << b.pData.nameTacGia << endl;
    // cout << b.pData.nhaXuatBan << endl;
    // cout << b.year << endl;
    print(a);
    print(b);
    return 0;
}