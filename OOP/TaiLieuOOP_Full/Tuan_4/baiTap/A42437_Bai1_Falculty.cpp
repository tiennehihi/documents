/*
1.Falculty & Department 
Viết lớp Faculty và lớp Department lần lượt mô phỏng một khoa và một bộ môn trong trường. 
Lớp Department cần có: 
• Thông tin tên bộ môn, số giáo viên của bộ môn, 
• Hàm tạo mặc định sinh ra bộ môn có tên và số giáo viên đều null 
• Hàm tạo đủ tham số để khởi tạo các biến thành viên
• Setter tổng và các hàm getter 
• Hàm print in ra toàn bộ thông tin bộ môn 
• Hàm huỷ in ra thông tin đang huỷ bộ môn nào
Lớp Faculty cần có: 
• Tên khoa, 3 bộ môn 
• Hàm tạo mặc định sinh ra khoa có tên khoa, tên 3 bộ môn và số giảng viên 3 bộ môn đều null 
• Hàm tạo nhập đủ tên khoa, tên các bộ môn và số lượng giảng viên các bộ môn đểtạo ra khoa với tên và 3 bộ môn như vậy. 
• Hàm tính tổng số giáo viên của khoa 
• Hàm in ra tên khoa, thông tin mỗi bộ môn, và tổng số giáo viên trong khoa 
• Hàm huỷ in ra đang huỷ khoa nào 
a. Quan hệ giữa Faculty và Department là kiểu gì: liên kết, kết tập, hay hợp thành? 
b. Nên cài 3 bộ môn trong khoa như mảng biến thường, mảng con trỏ, hay mảng tham chiếu? 
c. Hãy cài đặt 2 lớp trên và tạo chương trình demo sinh ra một khoa với 3 bộ môn rồi in ra thông tin khoa đó
*/


// quan hệ: liên kết
// 
#include <bits/stdc++.h>
using namespace std;
#include "Falculty.h"


int main()
{
    string tenMon[]={"OOP", "C1","Front-end"};
    int soGV[]={3, 5, 3};
    Faculty t1(tenMon, soGV);
    t1.display();
    // Department a[]={Department("OOP", 3),
    //                 Department("C1", 5),
    //                 Department("Front-end", 4),};
    // cout << a.getTenMon() << endl;
    // cout << a.getSoGV() << endl;


    return 0;
}