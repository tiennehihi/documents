#include <iostream>
using namespace std;

class Cat {
private:
    string name;
    int age;
    float weight;
    static int count;

public:
    Cat(string n, int a, float w) {
        name = n;
        age = a;
        weight = w;
        count++;
    }

    Cat() {
        name = "";
        age = 0;
        weight = 0;
    }

    void setInfo(string n, int a, float w) {
        name = n;
        age = a;
        weight = w;
    }

    string getName() const {
        return name;
    }

    int getAge() const {
        return age;
    }

    float getWeight() const {
        return weight;
    }

    static int getCount() {
        return count;
    }

    Cat operator+(const Cat &b) {
        Cat c;
        c.setInfo(name + b.name, age + b.age, weight + b.weight);
        return c;
    }

    void print() const {
        cout << "Name: " << name << endl;
        cout << "Age: " << age << endl;
        cout << "Weight: " << weight << endl;
    }
};

int Cat::count = 0;

int main() {
    Cat meo1("Halo", 2, 4.5);
    Cat meo2(meo1);
    meo1.print();
    meo2.print();

    return 0;
}
