#include<bits/stdc++.h>
#include "NumberArray.h"
using namespace std;
int main(){
    // NumberArray array(5);
    // array.set(1, 3.4);
    // array.set(2, 4.6);
    // for(int i=0; i<array.getKichThuoc(); i++)
    // {
    //     cout << array.get(i) << endl;
    // }
    // cout << endl;

    // cout << array.Max() << endl;
    // cout << array.Min() << endl;
    // cout << array.Average() << endl;
    NumberArray numbers(5);

    for (int i = 0; i < numbers.getKichThuoc(); i++) {
        numbers.set(i, i * 2.5);
    }

    cout << "Contents of the array:" << endl;
    for (int i = 0; i < numbers.getKichThuoc(); i++) {
        cout << numbers.get(i) << " ";
    }
    cout << endl;

    cout << "Min value: " << numbers.Min() << endl;
    cout << "Max value: " << numbers.Max() << endl;
    cout << "Average value: " << numbers.Average() << endl;

    return 0;
}