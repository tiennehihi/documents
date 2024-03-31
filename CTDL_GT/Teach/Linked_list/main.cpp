#include <bits/stdc++.h>
#include "list.h"
using namespace std;
int main() {
    List<int> a;
    int n = 5;
    int value;
    for(int i=0; i<n; i++) {
        cin >> value;
        a.Add(value);
    }
    a.PrintList();
    // cout << a.Get(2);
    a.Insert(100, 2);
    a.PrintList();
    
}

