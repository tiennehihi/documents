/*
• Tên khoa, 3 bộ môn 
• Hàm tạo mặc định sinh ra khoa có tên khoa, tên 3 bộ môn và số giảng viên 3 bộ môn đều null 
• Hàm tạo nhập đủ tên khoa, tên các bộ môn và số lượng giảng viên các bộ môn để tạo ra khoa với tên và 3 bộ môn như vậy. 
• Hàm tính tổng số giáo viên của khoa 
• Hàm in ra tên khoa, thông tin mỗi bộ môn, và tổng số giáo viên trong khoa 
• Hàm huỷ in ra đang huỷ khoa nào 
*/
#ifndef FALCULTY_H
#define FALCULTY_H
#include "Department.h"
const int n=3;
class Falculty
{
        string tenKhoa; 
        int a[n];
    public:
        // Faculty(){}
        Falculty(string tenKhoa) : tenKhoa(tenKhoa) {}
        Faculty(string tenMon[], int soGV[])
        {
            for(int i = 0; i < 3; i++)
                a[i].setter(tenMon[i], soGV[i]); 
        }
        float getSoGV()const{
            float soGV = 0; 
            for (int i = 0; i<n; i++) 
                soGV +=a[i].getSoGV(); 
            return soGV;
        }
        void display(){
            cout<<"Ten khoa: "<< tenKhoa <<endl;
            cout << "Mon: " << tenMon << endl;
            cout << "So GV: " << soGV << endl;
        }


};


#endif