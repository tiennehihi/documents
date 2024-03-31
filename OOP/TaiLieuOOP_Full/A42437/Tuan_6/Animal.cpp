#include<bits/stdc++.h>
using namespace std;
class Animal{
    private:
        string name;
    public:
        Animal(string ten=""):name(ten){}
        void setName(string n){ name = n; }
        // string getName() const {return name; }
        virtual void speak(){
            cout << "I am "<<name<<endl;
        }
};
class Cat: public Animal{
    public:
        Cat(string t=""):Animal(t){}
        // void speak(){
        //     cout << "Meow, I am "<< getName()<<endl;
        // }
        void speak(){
            cout << "Cat ";
            Animal::speak();
        }
};
class Dog: public Animal{
    public:
        Dog(string t=""):Animal(t){}
        // void speak(){
        //     cout << "Woff, woff, I am " << getName()<<endl;
        // }
        void speak(){
            cout << "Dog ";
            Animal::speak();
        }
};
class Duck: public Animal{
    public:
        Duck(string t=""):Animal(t){}
        // void speak(){
        //     cout << "Quack, quack, I am " << getName()<<endl;
        // }
        void speak(){
            cout << "Duck ";
            Animal::speak();
        }
};
void Introduce(Animal &animal){ 
    cout<<"What's your name? "<<endl;
    animal.speak();
}
int main(){
    // Animal *a = new Cat("Mun");
    // Animal *b = new Dog("Bun");
    // Animal *c = new Duck("Donald");
    // a->speak();
    // b->speak();
    // c->speak();

    // Cat a("Mun");
    // Dog b("Bun");
    // Duck c("Donald");
    // Introduce(a);
    // Introduce(b);
    // Introduce(c);


    Cat a("Mun");
    Dog b("Bun");
    Duck c("Donald");
    Animal *p[6]= {&a, &b, &c, new Cat("Mun Blue"), new Cat("Mun Red"), new Duck("Donald Trump")};
    for(int i=0; i<6; i++){
        p[i]->speak();
        cout << endl;
    }

    return 0;
}