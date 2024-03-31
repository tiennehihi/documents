#include <iostream>
using namespace std;

class Cat
{
    private:
        string ten="";
        int tuoi=0;
        double canNang=0;
    public:
        Cat(){}
        Cat(string n , int a , double w ):ten(n), tuoi(a), canNang(w){}
        void set(string name, int age, double weight)
        {
            ten = name;
            tuoi = age;
            canNang = weight;
        }
        void setTen(string);
        void setTuoi(int);
        void setCanNang(double);
        string getTen()const {return ten;}
        int getTuoi()const {return tuoi;}
        double getCanNang()const {return canNang;}
        void meow()
        {
            cout<<"Meow"<<endl;
        }
        void print()
        {
            cout<<"Ten: "<<ten<<endl;
            cout<<"Tuoi: "<<tuoi<<endl;
            cout<<"Can nang: "<<canNang<<endl;
        }
};

class ScottishFold: public Cat
{
        string klong;
    public:
        // ScottishFold(): Cat("Bi Bi", 1, 2), klong("ngan"){}
        // ScottishFold(): Cat("Tom", 1, 2), klong("vua"){}
        // ScottishFold(): Cat("Tony", 2, 2), klong("dai"){}
        // ScottishFold(string k): Cat("Clark Kent", 2, 2), klong(k){}
        // ScottishFold(string n, string k): Cat(n, 1, 2), klong(k){}
        // ScottishFold(string n, string k, int a, double w): Cat(n, a, w), klong(k){}
        ScottishFold(string k){}
        void setKlong(string);
        string getKlong()const {return klong;}
        void doBuddhaPose()
        {
            cout<<"Purr, I am doing a Buddha pose!"<<endl;
        }


};

int main()
{
    ScottishFold meo("Ngan");
    meo.set("Tony Stark", 2, 4);
    meo.print();
    cout<<"Long: "<<meo.getKlong()<<endl;
    meo.meow();
    meo.doBuddhaPose();

    return 0;
}