/*
2.Employee & ProductionWorker 
Lớp Employee gồm các thành viên sau:
•name: tên nhân viên
•code: Mã định danh nhân viên
•hireDate: Ngày bắt đầu thuê nhân viên
•Một hoặc nhiều hàm cấu tử
•Một hoặc nhiều setter, getter thích hợp.
Lớp ProductionWorker kế thừa lớp Employee gồm các thành viên sau:
•shift: Số nguyên lưu ca làm việc, chia làm 2 ca: ngày là 1, đêm là 2
•hourlyPay: Số thực lưu mức lương theo giờ
•Một hoặc nhiều hàm cấu tử
•Một hoặc nhiều setter, getter thích hợp.
Demo các lớp trong một chương trình sử dụng đối tượng ProductionWorker.
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
        void setName(string);
        void setCode(int);
        void setHireDate(int);
        void setAll(string n, int id, int hi){
            name = n; 
            code = id;
            hireDate = hi;
        }
        string getName() const { return name; }
        int getCode() const { return code; }
        int getHireDate() const { return hireDate; }
        void print(){
            cout<<"Name: "<<name<<endl;
            cout<<"Code: "<<code<<endl;
            cout<<"Hire Date: "<<hireDate<<endl;
        }
};
class ProductionWorker: public Employee{
        int shift;
        float hourlyPay;
    public:
        ProductionWorker(int sh, float ho):shift(sh), hourlyPay(ho){}
        void setter(int s, float h){
            shift = s;
            hourlyPay = h;
        }
        void setShift(int);
        void setHourlyPay(float);
        int getShift() const { return shift; }
        float getHourlyPay() const { return hourlyPay; }
        void display(){
            print();
            cout <<"Shift: " << shift << endl;
            cout <<"Hourly Pay: " << hourlyPay << endl;
        }
};
int main(){
    ProductionWorker iem(3, 9.1);
    iem.setAll("ABCDEFUCK", 30, 90);
    iem.display();
    cout <<"Shift: " << iem.getShift() << endl;
    cout <<"Hourly Pay: " << iem.getHourlyPay() << endl;
    return 0;

}