#include <iostream>
using namespace std;

#include "PersonalInfor.h"

int main()
{
    // PersonalInfor person;
    // person.print(); 
    // cout << endl;
    // PersonalInfor person_1("Kien", 23);
    // person_1.print();
    // cout << endl;
    PersonalInfor person_2("Nam", "Ha Noi", 18, "123545");
    cout << person_2.getTen() << endl;
    person_2.print();

    // person_2.print(); 
    // cout << endl;
    // person_1.setter("Kien", "Ha Noi", 23, "904745455");
    // person_1.print();
    // cout << endl;
    // person.setter("Nam", "Nguyen Trai", 18, "54564654");
    // person.print();



    return 0;
}