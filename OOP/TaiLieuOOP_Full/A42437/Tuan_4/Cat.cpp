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
    Cat a, b;
    a.set("Meo a", 2, 3);
    b.set("Meo a", 2, 3);
    
    
    cout<<int(a)<<endl;
    cout<<string(b)<<endl;


    Dog c("ABC", 5);
    c.print();
    Cat b;
    c = (Dog)b;
    b.print();
    return 0;
}
