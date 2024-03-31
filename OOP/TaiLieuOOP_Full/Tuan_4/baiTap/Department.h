/*
Viết lớp Faculty và lớp Department lần lượt mô phỏng một khoa và một bộ môn trong trường. 
Lớp Department cần có: 
• Thông tin tên bộ môn, số giáo viên của bộ môn, 
• Hàm tạo mặc định sinh ra bộ môn có tên và số giáo viên đều null 
• Hàm tạo đủ tham số để khởi tạo các biến thành viên
• Setter tổng và các hàm getter 
• Hàm print in ra toàn bộ thông tin bộ môn 
• Hàm huỷ in ra thông tin đang huỷ bộ môn nào
*/

#ifndef DEPARTMENT_H
#define DEPARTMENT_H
class Department
{
    private:
        string tenMon;
        int soGV;
    public:
        Department(){}
        Department(string tenMon=" ", int soGV=0){ setter(tenMon, soGV); }
        void setter(string nameMon, int sGV)
        {
            tenMon = nameMon;
            soGV = sGV;
        }
        string getTenMon() { return tenMon;}
        int getSoGV() { return soGV;}
        void print()
        {
            cout << "Mon: " << tenMon << endl;
            cout << "So GV: " << soGV << endl;
        }
        ~Department(){ cout <<"Chay ham huy Derpartment" << endl; }


};


#endif