#include <bits/stdc++.h>
using namespace std;
#include "Month.h"

int main(){
    Month m1(1), m2(12), m3("February");
    cout << m1 << m2 << m3;
    m2++;
    cout << m2;
    return 0;
}