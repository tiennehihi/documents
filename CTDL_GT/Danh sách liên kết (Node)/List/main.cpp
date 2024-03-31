#include <bits/stdc++.h>
using namespace std;
#include "list.h"
int main()
{
    List<int> a;
    srand(time(NULL));
    int n;
    cout << "Nhap so Node: ";
    cin >> n;
    int value;
    for(int i = 0; i < n; i++) {
        value = rand() % 100;
        a.Add(value);
    }
    // a.Add(3);
    // a.Add(6);
    // a.Add(2);
    // a.Add(8);
    // a.Add(1);
    // a.Add(6);
    // a.Add(2);
    // a.Add(7);
    // a.Add(8);
    // a.Add(9);
    // a.printList();
    // cout << a.Count() << endl;
    // a.Delete(9);
    // a.Insert(4, 10);
    // a.printList();
    // cout << a.CountValue(8) << endl;
    // cout << a.FirstIndex(2) << endl;
    // cout << a.LastIndex(2) << endl;
    a.insertFirst(100);
    a.printList();
    a.sapXep();
    a.printList();
    return 0;
}