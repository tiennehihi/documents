/*
Bài 2: Inventory
Viết struct Inventory mô tả dữ liệu về hàng tồn kho như sau:
•Mô tả món hàng
•Số lượng
•Chi phí bán buôn
•Chi phí bán lẻ
•Ngày được thêm vào kho Các thông tin Inventory sau sẽ được lưu vào tệp a.
a.Viết chương trình hiển thị menu cho phép người dùng thực hiện các tác vụ sau:
•Thêm bản ghi Inventory mới vào tệp.
•Hiển thị bất kỳ bản ghi nào trong tệp.

b.Viết chương trình đọc dữ liệu trong tệp Inventory từ đó tính toán và hiển thị các dữ liệu sau:
•Tổng giá trị bán buôn của hàng tồn kho
•Tổng giá trị bán lẻ của hàng tồn kho
•Tổng số lượng của tất cả các mặt hàng trong kho
*/
#include <bits/stdc++.h>
using namespace std;

struct Inventory{
    char mota[50];
    int soluong;
    float banbuon, banle;
    char ngay[25];
};
void print(){
    float tbb=0, tbl=0, tsl=0;
    for(int i=0; i<3; i++){
        cout << "Mo ta: "<< a[i].mota << endl;
        cout << "So luong: "<< a[i].soluong << endl;
        cout << "Ban buon: "<< a[i].banbuon << endl;
        cout << "Ban le: "<< a[i].banle << endl;
        tbb+=a[i].soluong;
        tbl=a[i].banle;
        
    }
}
int main(){
    Inventory a = {{"But bi", 10, 100, 2003, "27/10/2022"},
                   {"But chi", 18, 108, 2903, "27/10/2023"},
                   {"But muc", 90, 160, 2303, "29/11/2022"}};

    for(int i=0; i<3; i++){

    }

    return 0;
}