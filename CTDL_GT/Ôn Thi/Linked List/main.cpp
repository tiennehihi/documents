#include <bits/stdc++.h>
#include "list.h"
using namespace std;
int main(){
    List<int> ds;
    ds.Add(3);
    ds.Add(7);
    ds.Add(2);
    ds.Add(3);
    ds.Add(5);
    ds.Add(9);
    ds.Add(2);
    ds.Add(3);
    ds.Add(3);
    ds.Add(2);
    ds.Add(1);
    ds.Add(3);
    ds.PrintAll();
    cout << endl;
    // ds.Delete(2);
    // ds.InsertFirst(9);
    // ds.PrintAll();
    // cout << ds.Size() << endl;
    // cout << ds.CountValue(3) << endl;
    cout << ds.FirstIndex(2) << endl;
    cout << ds.LastIndex(2) << endl;
    return 0;
}
