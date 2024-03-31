// #include <bits/stdc++.h>

// using namespace std;
// struct Sach
// {
//     char tensach[30], tentg[30];
//     int nxb, trang;
// };

// int main()
// {
//     Sach b1 = {"Doraemon","Fujo",2000, 200}, b2;
//     ofstream out ("sinhvien.dat", ios::binary);
//     out.write(reinterpret_cast<char*>(&b1), sizeof(b1));
//     out.close(); 

//     ifstream in ("sinhvien.dat", ios::binary);
//     in.read(reinterpret_cast<char*>(&b2), sizeof(b2));
//     in.close();

//     cout << "Ten sach: " << b2.tensach << endl;
//     cout << "Ten tac gia: " << b2.tentg << endl;
//     cout << "Nam xuat ban: " << b2.nxb << endl;
//     cout << "So trang: " << b2.trang << endl;
    

//     return 0;
// }


// Viết cấu trúc Sach chứa các thông tin:
// ❑ Tên sách, tên tác giả, năm xuất bản, số trang
// ◼ Main tạo ra một cuốn sách b1 với thông tin tự chọn, mở file
// sinhvien.dat dạng ghi ở chế độ nhị phân, ghi b1 vào file,
// ◼ Sau đó lại mở file này dạng đọc ở chế độ nhị phân, tạo một cuốn sách
// b2 khác, đọc từ file vào biến này, rồi in ra mọi thông tin biến đó, kiểm
// tra có trùng b1.

#include <bits/stdc++.h>
using namespace std;

struct Sach{
    char tenSach[30], tenTG[30];
    int namXB, soTrang;
};

int main() {
    Sach b1 = {"Lam di", "Vu Trong Phung", 1990, 200}, b2;
    ofstream fout("sinhVien.dat", ios::binary);
    fout.write(reinterpret_cast<char*>(&b1), sizeof(b1));
    fout.close();

    ifstream fin;
    fin.open("sinhvien.dat", ios::binary);
    fin.read(reinterpret_cast<char*>(&b2), sizeof(b2));
    cout << "Ten tac pham: " << b2.tenSach << "\nTen tac gia: " << b2.tenTG << "\nNam XB: " << b2.namXB << "\nSo trang: " << b2.soTrang << endl;
    fin.close();

    return 0;
}