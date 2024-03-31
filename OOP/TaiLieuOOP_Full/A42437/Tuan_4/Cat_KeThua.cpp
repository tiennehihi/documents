#include <bits/stdc++.h>

using namespace std;
class Cat
{
    protected:
        string ten;
        int tuoi;
        double canNang; 
    public:
        Cat(string n, int t, double c):ten(n), tuoi(t), canNang(c){}  // ham tao 3 tham so
        
        // Hàm thành viên: Hàm tạo mặc định, set cho 3 thuộc tính
        Cat()
        {
            ten = "";
            tuoi = 0;
            canNang = 0;
        }

        void set(string name, int age, double weight)
        {
            ten = name;
            tuoi = age;
            canNang = weight;
        }
        string getTen() const {return ten; }
        int getTuoi() const {return tuoi; }
        double getCanNang() const {return canNang; }

        // void print()
        // {
        //     cout << "Ten: " << ten << endl;
        //     cout << "Tuoi: " << tuoi << endl;
        //     cout << "Can nang: " << canNang << endl;
        // }
        void meow()
        {
            cout <<"Meow"<<endl;
        }
};

class ScottishFolad: public Cat
{
        string klong;
        
    public:
        ScottishFolad(string k):klong(k){}
        void setKlong(string);
        string getKlong() const {return klong; }
        void print()
        {
            cout << "Ten: " << ten << endl;
            cout << "Tuoi: " << tuoi << endl;
            cout << "Can nang: " << canNang << endl;
        }
        void doBuddhaPose()
        {
            cout <<"Purrr, I am doing a Buddha pose!"<<endl;
        }

};

int main()
{
    ScottishFolad meo("Ngan");
    meo.set("Tony Stark", 2, 4);
    // meo.setKlong("Ngan");
    meo.meow();
    meo.doBuddhaPose();
    meo.print();
    cout << "Long: " << meo.getKlong() << endl;
    return 0;
}