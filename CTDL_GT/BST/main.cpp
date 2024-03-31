#include <bits/stdc++.h>
#include "bst.h"
using namespace std;
int main()
{
    BST<int> ds;
    ds.Add(3);
    ds.Add(2);
    ds.Add(5);
    ds.Add(7);
    ds.Add(4);
    ds.Add(1);
    ds.Add(9);
    cout<<ds.Search(2)<<endl;
    ds.Print();
}