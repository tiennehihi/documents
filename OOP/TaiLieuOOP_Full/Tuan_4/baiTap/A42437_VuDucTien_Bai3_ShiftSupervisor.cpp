/*
3.ShiftSupervisor & Employee
Thiết kế lớp ShiftSupervisor kế thừa lớp Employee gồm: 
•Mức lương hàng năm của người giám sát ca
•Tiền thưởng hàng năm của người giám sát ca. 
•Một hoặc nhiều hàm cấu tử.
•Một hoặc nhiều setter, getter thích hợp. 
Demo các lớp trong hàm main sử dụng đối tượng ShiftSupervisor
*/
#include<bits/stdc++.h>
using namespace std;
class Employee{
    private:
        string name;
        int code;
        int hireDate;
    public:
        Employee(){}
        Employee(string name, int code, int hireDate) : name(name), code(code), hireDate(hireDate){}
        void setter(string ten, int co, int hi){
            name = ten;
            code = co; 
            hireDate = hi;
        }
        void setName(string);
        void setCode(int);
        void setHireDate(int);
        string getName() const { return name; }
        int getCode() const { return code; }
        int getHireDate() const { return hireDate; }
        void print(){
            cout<<"Name: "<<name<<endl;
            cout<<"Code: "<<code<<endl;
            cout<<"Hire Date: "<<hireDate<<endl;
        }
};
class ShiftSupervisor: public Employee {
        float luong;
        float thuong;
    public:
        ShiftSupervisor(float luo, float thu):luong(luo), thuong(thu){}
        void setAll(float lu, float th) { luong = lu; thuong = th; }
        void setLuong(float);
        void setThuong(float);
        float getLuong() const { return luong; }
        float getThuong() const { return thuong; }
        void display() {
            Employee::print();
            cout << "Luong: " << luong << endl;
            cout << "Thuong: " << thuong << endl;
        }
};
int main(){
    ShiftSupervisor tui(3.4, 5.6);
    tui.setter("Tien", 30, 19);
    tui.display();
    // cout<<"Luong: "<<tui.getLuong()<<endl;
    // cout<<"Thuong: "<<tui.getThuong()<<endl;

    return 0;
}