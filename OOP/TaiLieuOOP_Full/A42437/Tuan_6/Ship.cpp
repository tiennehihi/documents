#include <bits/stdc++.h>
using namespace std;
class Ship{
    private:
        string name;
        int year;
    public:
        Ship(string ten, int nam):name(ten), year(nam){}
        void setName(string n) { name = n; }
        void setYear(int y) { year = y; }
        string getName() const { return name; }
        int getYear() const { return year; }
        virtual void print() const {
            cout << "Name: "<< name <<endl;
            cout << "Nam xuat xuong: "<< year <<endl;
        }
};
class CruiseShip: public Ship{
        int soKhach;
    public:
        CruiseShip(string n, int y, int s): Ship(n, y), soKhach(s){}
        void setSoKhach(int s){ soKhach = s; }
        int getSoKhach() const { return soKhach; }
        void print() const {
            Ship::print();
            cout << "So hanh khach toi da: "<< soKhach <<endl;
        }
};
class CargoShip: public Ship{
        float weight;
    public:
        CargoShip(string n, int y, float w): Ship(n, y), weight(w){}
        void setWeight(float canNang){ weight = canNang;}
        float getWeight() const { return weight; }
        void print () const {
            Ship::print();
            cout<< "So tan hang: "<< weight <<endl;
        }

};
int main(){
    // CruiseShip a("Titanic", 2003, 1900);
    // a.print();
    // CargoShip b("ABCDEFGHI LOVE YOU", 2003, 192.003);
    // b.print();
    Ship *a = new CruiseShip("Titanic", 2003, 1900);
    Ship *b = new CargoShip("ABCDEFGHI LOVE YOU", 2003, 1900.009);
    a->print();
    b->print();
    return 0;
}