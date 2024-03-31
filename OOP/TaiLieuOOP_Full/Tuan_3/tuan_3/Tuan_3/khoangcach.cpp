#include <iostream>
using namespace std;
#include "khoangcach.h"

int main(){
    KhoangCach a, b, c, d;
    a.setCm(2);
    b.setCm(2);
    c.setMm(3);
    d.setMm(2);
//     cout << (a++).getMm() << endl;
//     cout << a.getMm() << endl;
//     cout << (++a).getMm() << endl;
    if (a==b)   cout<< true<<endl;
    else    cout<< false <<endl;

    if (c!=d)   cout<< true;
    else    cout<< false;
    return 0;
}