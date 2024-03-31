#include<bits/stdc++.h>
using namespace std;
class employees{
    private:
        string name;
        int idNumber;
        string department;
        string position;

    public:
        employees(){}
        employees(string n, int id, string d, string p):name(n), idNumber(id), department(d), position(p){}

        void setName(string ten){
            name = ten;
        }
        void setIdNumber(int i){
            idNumber = i;
        }
        void setDepartment(string de){
            department = de;
        }
        void setPosition(string po){
            position = po;
        }
        string getName() const { return name; }
        int getIdNumber() const { return idNumber; }
        string getDepartment() const { return department; }
        string getPosition() const { return position; }
};
int main(){
    employees e[3] = {employees("Sunsan Meyers", 47899, "Accounting", "Vice President"),
                      employees("Mark Jones", 39119, "IT", "Programmer"),
                      employees("Roy Roges", 81774, "Manufacturing", "Engineer")};
    cout<<left<<setw(17)<<"Name"<<setw(18)<<"ID Number"<<setw(18)<<"Department"<<setw(21)<<"Position"<<endl;
    cout<<"--------------------------------------------------------------------"<<endl;
    for(int i=0; i<3; i++){
        cout<<left<<setw(17)<<e[i].getName();
        cout<<setw(18)<<e[i].getIdNumber();
        cout<<setw(18)<<e[i].getDepartment();
        cout<<setw(21)<<e[i].getPosition()<<endl;
    }
    return 0;
}