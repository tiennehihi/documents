 /*
3.PreferredCustomer
Một cửa hàng bán lẻ có chương trình ưu đãi cho khách hàng được giảm giá mọi lần mua hàng. 
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
class PersonData
{
    private:
        string lastName, firstName, address, city, state, phone;
        int zip;
    public:
        PersonData(string lN="", string fN="", string add="", string ci="", string st="", string ph="", int zi=0):lastName(lN), firstName(fN), address(add), city(ci), state(st), phone(ph), zip(zi) {}
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
class PreferredCustomer: public CustomerData
{
        float purchasesAmount, discountLevel;
        float checkPurchasesAmount(int pur)
        {
            if (pur<0)    throw "LOI:";
            return pur;
        }
        float checkDiscountLevel(int dis)
        {
            if (dis<0) throw "LOI:";
            return dis;
        }
    public:
        PreferredCustomer(float purchases=0):purchasesAmount(checkPurchasesAmount(purchases)){}
        void setters(float pu, float di)
        {
            purchasesAmount = checkPurchasesAmount(pu); 
            discountLevel = di;
        }
        float getPurchasesAmount() const { return purchasesAmount; }
        float getDiscountLevel() const { return discountLevel; }
        float checkDiscountLevel()
        {
            
            if (purchasesAmount>=500 && purchasesAmount<1000)   discountLevel = 5;
            else if (purchasesAmount>=1000 && purchasesAmount<1500) discountLevel = 6;
            else if (purchasesAmount>=1500 && purchasesAmount<2000) discountLevel = 7;
            else if (purchasesAmount>=2000) discountLevel = 10;
            return discountLevel;
        }

};
int main()
{
    try
    {
        float hi;
        cin>>hi;
        PreferredCustomer a(hi);
        cout << a.checkDiscountLevel()<<endl;

    }
    catch (const char *s)
    {
        cout << s <<endl;
    }

    return 0;
}