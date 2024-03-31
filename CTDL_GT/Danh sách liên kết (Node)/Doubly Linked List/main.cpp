#include <bits/stdc++.h>
using namespace std;
#include "list.h"
int main()
{
    List<int> a;
    a.Add(5);
    a.Add(5);
    a.Add(5);
    a.Add(5);

    a.printList();
    a.Delete(0);
    a.printList();

}
// https://replit.com/@tung2052003/test-1