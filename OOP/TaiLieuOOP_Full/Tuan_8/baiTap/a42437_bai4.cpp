/*
4. Inventory 
Viết struct Inventory mô tả dữ liệu về hàng tồn kho như sau: 
• Mô tả món hàng
• Số lượng 
• Chi phí bán buôn
• Chi phí bán lẻ
• Ngày được thêm vào kho
Các thông tin Inventory sau sẽ được lưu vào tệp 
a. Viết chương trình hiển thị menu cho phép người dùng thực hiện các tác vụ sau:
• Thêm bản ghi Inventory mới vào tệp.
• Hiển thị bất kỳ bản ghi nào trong tệp.
• Thay đổi bất kỳ bản ghi nào trong tệp.
b. Viết chương trình đọc dữ liệu trong tệp Inventory từ đó tính toán và hiển thị các dữ liệu sau:
• Tổng giá trị bán buôn của hàng tồn kho
• Tổng giá trị bán lẻ của hàng tồn kho
• Tổng số lượng của tất cả các mặt hàng trong kho
*/
#include <iostream>
#include <fstream>
using namespace std;

struct Inventory
{
    char mota[50];
    int soluong;
    float banbuon, banle;
    char ngay[15];
};

void print(Inventory a[], int n)
{
    int tsl = 0, tbb = 0, tbl = 0;
    for (int i = 0; i < n; i++)
    {
        cout << "Mo ta: " << a[i].mota << endl;
        cout << "So luong: " << a[i].soluong << endl;
        cout << "Chi phi ban buon: " << a[i].banbuon << endl;
        cout << "Chi phi ban le: " << a[i].banle << endl;
        cout << "Ngay them vao kho: " << a[i].ngay << endl;
        tsl += a[i].soluong;
        tbb += a[i].banbuon * a[i].soluong;
        tbl += a[i].banle * a[i].soluong;
    }
    cout << "Tong so luong: " << tsl << endl;
    cout << "Tong ban buon: " << tbb << endl;
    cout << "Tong ban le: " << tbl << endl;
}

int main()
{
    int choice;
    Inventory a;

    cout << "1. Them ban ghi Inventory moi vao tep" << endl;
    cout << "2. Hien thi ban ghi trong tep" << endl;
    cout << "Nhap lua chon: ";
    cin >> choice;

    if (choice == 1)
    {
        cout << "Nhap thong tin cho ban ghi Inventory moi:" << endl;
        cin.ignore(); // Xóa bộ nhớ đệm bàn phím
        cout << "Mo ta: ";
        cin.getline(a.mota, sizeof(a.mota));
        cout << "So luong: ";
        cin >> a.soluong;
        cout << "Chi phi ban buon: ";
        cin >> a.banbuon;
        cout << "Chi phi ban le: ";
        cin >> a.banle;
        cin.ignore(); // Xóa bộ nhớ đệm bàn phím
        cout << "Ngay them vao kho: ";
        cin.getline(a.ngay, sizeof(a.ngay));

        ofstream out("Inventory.dat", ios::binary | ios::app);
        out.write(reinterpret_cast<char*>(&a), sizeof(Inventory));
        out.close();
    }
    else if (choice == 2)
    {
        ifstream in("Inventory.dat", ios::binary);
        if (!in)
        {
            cerr << "Khong the mo tep!" << endl;
            return 1;
        }

        while (in.read(reinterpret_cast<char*>(&a), sizeof(Inventory)))
        {
            cout << "Mo ta: " << a.mota << endl;
            cout << "So luong: " << a.soluong << endl;
            cout << "Chi phi ban buon: " << a.banbuon << endl;
            cout << "Chi phi ban le: " << a.banle << endl;
            cout << "Ngay them vao kho: " << a.ngay << endl;
        }

        in.close();
    }
    
    return 0;
}
