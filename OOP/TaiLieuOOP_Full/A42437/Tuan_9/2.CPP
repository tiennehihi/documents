#include <iostream>
// algorithm
using namespace std;
template <class T>
T abs(const T &a)
{
    if(a<0) return -a;
    return a;
}

int main()
{
    int x = -5;
    float y = -2.5;
    cout << abs<int>(x) << endl;
    cout << abs(x) << endl;
    cout << abs(y) << endl;
    return 0;
}