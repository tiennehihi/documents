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
#include <bits/stdc++.h>
using namespace std;
class PersonData
{
    private:
        string lastName, firstName, address, city, state, phone;
        int zip;
    public:
        PersonData(string lN="", string fN="", string add="", string ci="", string st="", string ph="", int zi=0):lastName(lN), firstName(fN), address(add), city(ci), state(st), phone(ph), zip(zi) {}
        void setLastName(string l){ lastName=l; }
        void setFirstName(string f){ firstName=f; }
        void setCity(string c){ city=c; }
        void setState(string s){ state=s; }
        void setPhone(string p){ phone=p; }
        void setZip(int z){ zip=z; }
        void setAll(string a, string b, string c, string d, string e, string f, int n)
        {
            lastName=a; 
            firstName=b;
            address=c;
            city=d;
            state=e;
            phone=f;
            zip=n;
        }
        string getLastName() const { return lastName; }
        string getFirstName() const { return firstName; }
        string getAddress() const { return address; }
        string getCity() const { return city; }
        string getState() const { return state; }
        string getPhone() const { return phone; }
        int getZip() const { return zip; }
        void display()
        {
            cout << "Last name: " << getLastName() << endl;
            cout << "First name: " << getFirstName() << endl;
            cout << "Address: " << getAddress() << endl;
            cout << "City: " << getCity() << endl;
            cout << "State: " << getState() << endl;
            cout << "Phone: " << getPhone() << endl;
            cout << "Zip: " << getZip() << endl;
        }
};
class CustomerData : public PersonData
{
        int customerNumber; 
        string mailingList;
    public:
        CustomerData(int cus=0, string mail=""):customerNumber(cus), mailingList(mail) {}
        void setCustomerNumber(int c) { customerNumber = c; }
        void setMailingList(string m) { mailingList = m; }
        int getCustomerNumber() const { return customerNumber; }
        string getMailingList() const { return mailingList; }
        bool checkMailingList()
        {
            if (mailingList == "yes"){
                display();
                cout << "Mailing List: Success!" << endl;
                return true;
            }
                
            else if (mailingList == "no")
                cout << "Goodbye!" << endl;
                return false;
        }
};


int main()
{
    int c;
    string d;
    cout <<"Nhap ID: ";
    cin>> c;
    cout <<"Mailing List: ";
    cin>> d;
    CustomerData a(c, d);
    a.setAll("a", "b", "c", "d", "e", "f", 2003);
    a.checkMailingList();
    // a.display();
    return 0;
}