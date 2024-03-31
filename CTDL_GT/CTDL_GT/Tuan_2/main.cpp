#include <iostream>
using namespace std;

#include "list.h"

int main()
{
    List<int> b;
    b.Add(1);
    b.Add(8);
    b.Add(2);
    b.Add(10);
    b.Add(2);
    b.Add(2);
    b.Add(2);


    // cout << b.Count() << endl;
    // b.PrintAll();
    // b.Delete(2);
    // cout << endl;
    // cout << b.Count() << endl;
    // b.PrintAll();

    // b.Insert(100, 2);
    // cout << b.Count() << endl;
    // b.PrintAll();
    // b.Insert(200, 2);
    // cout << b.Count() << endl;
    // b.PrintAll();

    // b.PrintFromTo(2, 4);

    // b.Instate(300, 3);
    // b.PrintAll();
    // b.PrintAll();
    // b.DaoNguoc();
    // b.PrintAll();

    // for(int i = 0; i < b.Count(); i++)
    // {
    //     cout << b.Get(i) << " ";
    // }

    b.DeleteByValue(2);
    b.PrintAll();
    // b.DaoNguoc();
    // b.PrintAll();
    // b.Instate(6, 2);
    b.Insert(6, 2);
    b.PrintAll();
    

    return 0;
}