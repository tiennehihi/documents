/*
Một cửa hàng bán lẻ có chương trình ưu đãi cho khách hành được giảm giá mọi lần mua hàng. 
Phần trăm giảm giá xác định bằng số tiền mua hàng tích lũy của khách hàng đó tại cửa hàng.
    • Khách hàng đã chi 500 đô la sẽ được giảm giá 5%
    • Khách hàng đã chi 1.000 đô la sẽ được giảm giá 6% 
    • Khách hàng đã chi 1.500 đô la sẽ được giảm giá 7% 
    • Khách hàng chi từ 2.000 đô la trở lên sẽ được giảm giá 10% 
Thiết kế lớp PreferredCustomer kế thừa lớp CustomerData gồm các biến thành phần sau:
    • purchasesAmount(sốthực): lưu tổng số tiền mua hàng của khách hàng
    • discountLevel(sốthực): lưu tỷ lệ phần trăm giảm giá 
Viết các hàm thành viên thích hợp cho lớp này và demo lớp trong một chương trình đơn giản.
Xác thực đầu vào: Không chấp nhận purchasesAmount, discountLevel âm. 
*/

#include <bits/stdc++.h>
using namespace std;

// class PersonData
// {
//         string lastName, firstName, address, city, state, zip, phone;
//     public:
//         void setInfor(string l, string f, string a, string c, string s, string z, string p)
//         {
//             lastName = l;
//             firstName = f;
//             address = a;
//             city = c;
//             state = s;
//             zip = z;
//             phone = p;
//         }
//         string getLastName()const {return lastName;}
//         string getFirstName()const {return firstName;}
//         string getAddress()const {return address;}
//         string getCity()const {return city;}
//         string getState()const {return state;}
//         string getZip()const {return zip;}
//         string getPhone()const {return phone;}
//         void inFor()
//         {
//             cout << "Name: "<<lastName<< " "<< firstName << endl;
//             cout << "address: "<<address<<endl;
//             cout << "City: "<<city<<endl;
//             cout << "State: "<<state<<endl;
//             cout << "ZIP: "<<zip<<endl;
//             cout << "Phone: "<<phone<<endl;
//         }
// };

// class CustomerData: public PersonData
// {
//         int customerData;
//         bool mailingList;
//     public:
//         CustomerData(string l, string f, string a, string c, string s, string z, string p, int d)
//         {
//             setInfor(l, f, a, c, s, z, p);
//             customerData = d;
//         }
//         void setCustomerData(int c)
//         {
//             customerData = c;
//         }
//         int getCustomerData()const {return customerData;}
//         void setMailingLIst()
//         {
//             mailingList = rand() % 2 ;
//         }
//         bool getMailingList()const 
//         {
//             return mailingList;
//         }
//         void print()
//         {
//             if (getMailingList()) cout << "Co trong danh sach gui thu" << endl;
//             else cout << "Khong co trong danh sach gui thu" <<endl;
//         }
// };

class PreferredCustomer
{
        float purchasesAmount, discountLevel;
        float checkAmount(float p)
        {
            if (p < 0) throw "LOI!";
            return p;
        }
        float checkLevel(float l)
        {
            if (l < 0) throw "LOI!";
            return l;
        }
    public:
        PreferredCustomer(float amount=0):purchasesAmount(checkAmount(amount))
        {
            setAmount(amount);
            setLevel();
        }
        void setAmount(float p)
        {
            purchasesAmount = checkAmount(p);
        }
        void setLevel()
        {
            if (purchasesAmount >= 500 && purchasesAmount < 1000) discountLevel = 5;
            else if (purchasesAmount >= 1000 && purchasesAmount < 1500) discountLevel = 6;
            else if (purchasesAmount >= 1500 && purchasesAmount < 2000) discountLevel = 7;
            else discountLevel = 10;
        }
        float getAmount()const {return purchasesAmount;}
        int getLevel()const {return discountLevel;}

};

int main()
{
    try
    {
        float amount;   
        cin>>amount;
        PreferredCustomer giam(amount);
        cout<<"Khach hang da mua: "<<giam.getAmount()<<"k VND"<<endl;
        cout<<"Khach hang duoc giam: "<<giam.getLevel()<<"%"<<endl;
    }
    catch(const char * s)
    {
        cout << s <<endl;
    }
    
    return 0;
}