#include<bits/stdc++.h>
using namespace std;

class employee{
    //khai báo biến
    private:
        string name;
        int idNumber;
        string department;
        string position;
    
    //hàm nguyên mẫu
    public:
        employee(){}   // hàm mặc định
        // employee(string n, int i, string d, string p){     // gán cách 1
        //     name = n;
        //     idNumber = i;
        //     department = d;
        //     position = p;
        // }
        employee(string n, int i, string d, string p):name(n), idNumber(i), department(d), position(p){}   // gán cách 2

        void setName(string);
        void setIdNumber(int);
        void setDepartment(string);
        void setPosition(string);
        string getName() {return name; }
        int getIdNumber() {return idNumber; }
        string getDepartment() {return department; }
        string getPosition() {return position; }
};

int main(){
    employee e[3] = {employee("Susan Meyers", 47899, "Accounting", "Vice President"),
                     employee("Mark Jones", 39119, "IT", "Programmer"),
                     employee("Roy Rogers", 81774, "Manufacturing", "Engineer"),};
    cout<<left<<setw(17)<<"Name"<<setw(18)<<"ID Number"<<setw(18)<<"Department"<<setw(21)<<"Position"<<endl;
    cout<<"--------------------------------------------------------------"<<endl;
    for(int i=0; i<3; i++){
        cout<<left<<setw(17)<<e[i].getName();
        cout<<setw(18)<<e[i].getIdNumber();
        cout<<setw(18)<<e[i].getDepartment();
        cout<<setw(21)<<e[i].getPosition()<<endl;
    }
    return 0;
} 