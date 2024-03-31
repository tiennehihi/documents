#include <iostream>
using namespace std;
class Cat{
    private:
        string name;
        int age;
        double weight;
    public:
        Cat(string n=" ", int a=0, double w=0){
            name = n;
            age = a;
            weight = w;
        }
        void setName(string na) { name = na; }
        void setAge(int ag) { age = ag; }
        void setWeight(double we) { weight = we; }

        string getName() { return name; }
        int getAge() const { return age; }
        double getWeight() const { return weight; }

        friend istream & operator>>(istream &in, Cat &a){
            in >> a.name;
            a.age = 1;
            a.weight = 2;
            return in;
        }

        friend ostream & operator<<(ostream &out, Cat a){
            out << a.name << " " << a.age << " " << a.weight << endl;
            return out;
        }
};

int main(){
    Cat b;
    cin >> b;
    cout << b << endl;

    return 0;
}