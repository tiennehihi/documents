#include <iostream>
using namespace std;

#include "NumberArray.h"

int main()
{
    NumberArray array(5);

    array.set(1, 2.1);
    array.set(4, 6.3);

    for (int i = 0; i < array.getKichThuoc(); i++)
    {
        cout << array.get(i) << " ";
    }
    cout << endl;

    cout << array.Max() << endl;
    cout << array.Min() << endl;
    cout << array.Average() << endl;

    return 0;
}