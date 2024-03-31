#include<bits/stdc++.h>
using namespace std;
#include "Cat.h"
int main(){
    Cat a, b;
    a.set("Meow a", 2, 3.2);
    b.set("Meow b", 3, 2.1);
    int so1=2, so2=3;
    int so3 = so1 + so2;
    Cat c = a + b;
    Cat d = a - b;
    a.print();
    b.print();
    c.print();
    d.print();
    return 0;
}