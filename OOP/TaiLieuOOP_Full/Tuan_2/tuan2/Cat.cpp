// Tao 1 lớp Cat có các biến và hàm thành viên sau
// Biến thành viên gồm có: tên, tuổi, cân nặng
// Hàm thành viên: Hàm tạo mặc định, set cho 3 thuộc tính
// Quá tải toán tử cộng (trả về tổng cân nặng 2 đt Cat)
// Quá tải toán tử cộng (trả về tổng cân nặng 2 đt Cat)
// Quá tải toán tử >> để nhập giá trị cho đối tượng Cat
// Quá tải toán tử << để in toàn bộ thông tin đt Cat

#include <iostream>
using namespace std;

#include "Cat.h"

int main()
{
    Cat a, b, c, d;
    a.set("Meo a", 2, 3.2);
    b.set("Meo b", 3, 2.1);
    // int so1 = 2, so2 = 3;
    // int so3 = so1 + so2;
    // Cat c = a + b;
    // Cat d = a - b;
    // c = a.operator + (b);
    // d = a.operator- (b);
    c = a;
    a.print();
    cout << "-------------\n";
    // b.print();
    // cout << "-------------\n";
    c.print();
    // cout << "-------------\n";
    // d.print();
    return 0;
}
