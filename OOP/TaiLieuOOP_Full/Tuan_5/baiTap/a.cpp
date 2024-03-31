// #include<bits/stdc++.h>
// using namespace std;
// class GradeActivity {
//     float score;
//     float checkScore(float sc) {
//         if(sc < 0 || sc > 100)  throw "ERROR";
//         return sc;
//     }

//     public:
//         // GradedActivity(){};
//         GradeActivity(float sc=0):score(checkScore(sc)){}
//         void setScore(float s){ score = checkScore(s); }
//         float getScore() const { return score; }
//         char getDiemChu() const {
//             char diem;
//             if(score <= 60) diem = 'F';
//             else if(score > 60 && score <= 70)  diem = 'D';
//             else if(score > 70 && score <= 80)  diem = 'C';
//             else if(score > 80 && score <= 90)  diem = 'B';
//             else if(score > 90 && score <=100)  diem = 'A';
//             return diem;
//         }
// };
// int main() {
//     try{
//         float diem;
//         cin>>diem;
//         GradeActivity a(diem);
//         cout << a.getDiemChu() << endl;

//     } 
//     catch(const char * s) {
//         cout << s << endl;
//     }
//     return 0;
// }



/*
2.PersonData & CustomerData 
Thiết kế lớp PersonData với các biến thành viên sau:
• lastName
• firstName
• address
• city 
• state
• zip
• phone
Chọn kiểu dữ liệu phù hợp và viết hàm setter, getter thích hợp cho các biến.
Lớp CustomerData kế thừa lớp PersonData gồm các biến thành viên sau:
• customerNumber: một số nguyên lưu ID mỗi khách hàng
• mailingList: một biến bool: true nếu khách hàng muốn có trong danh sách gửi thư hoặc false nếu khách hàng không muốn có trong danh sách gửi thư
Viết hàm setter, getter thích hợp cho các biến.
Demo lớp CustomerData trong một chương trình đơn giản.
*/

#include<bits/stdc++.h>
using namespace std;
class PersonData {
    string lastName;
    string firstName;
    string address;
    string city;
    string state;//tinh trang hon nhan
    string zip;//mathue
    string phone;
    public:
    PersonData(string l="", string f="", string a="", string c="" , string s="", string z="", string p=""){
        lastName=l;
        firstName=f;
        address =a ;
        city   =c ;
        state     =s ;//thanhpho ho nhan
        zip       =z ; //mathe
        phone      =p ;
    }
    void setLastName (string l) {lastName=l;}
    void setFirstName (string f ) {firstName=f;}
    void setAddress (string a ){address=a;}
    void setCity (string c ){city=c;}
    void setState (string st)//set thanhpho ho nhan
    {state=st;}
    void setZip (string z ){zip=z;}
    void setPhone (string p ){phone=p;}

    string getLastName () const {return lastName;}
    string getFirstName()const { return firstName;}
    string getAddress()const {return address;}
    string getCity()const {return city;}
    string getState()const {//get thanhpho ho nhan
    return state;}
    string getZip()const {return zip;}
    string getPhone()const {return phone;}


};
class CustomerData : public PersonData {   
    int customerNumber;
    string mailingList;
    public:
        CustomerData(int cus=0, string m=""):customerNumber(cus), mailingList(m) {}
        void setCustomerNumber(int c){
            customerNumber=c;
        }
        void setmailingList(string m){
            mailingList=m;
        }
        int getCustomerNumber() const{ return customerNumber;}
        bool checkmailingList()const {
            if (mailingList=="toimuon"){
                cout<<"True"<<endl;
                return true;
            }
            else{cout<< "False" << endl;
            return false;}
        }
        string getmailingList(){return mailingList;}
        void print(){
            cout<<"HO: "<<getLastName()<<endl;
            cout<<"TEN: "<<getFirstName()<<endl;
            cout<<"DIA CHI:  "<<getAddress()<<endl;
            cout<<"Tinh trang:  "<<getState()<<endl;
            cout<<"Ma Thue: "<<getZip()<<endl;
            cout<<"So dien thoai lien he:" <<getPhone()<<endl;
            cout<<"ma ID"<<getCustomerNumber()<<endl;
            cout<<"Y kien: "<<getmailingList()<<endl;
        }
};
int main()
{
    CustomerData a(4521, "khong dong y");
    a.setLastName("Tien");
    a.setFirstName("Nguyen");
    a.setAddress("Ha Noi");
    a.setState("Doc than"); // empty state is allowed in this case as it's not required for customers
    a.setZip("98765");
    a.setPhone("+358-123456789");
    a.print();

    return 0;
}