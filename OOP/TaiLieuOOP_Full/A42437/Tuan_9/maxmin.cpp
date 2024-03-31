#include <iostream>
using namespace std;
template <class T>
T Min(const T &a, const T &b)
{
    if(a<b) return a;
    else return b;
}
template <class V>
V Max(const V &a, const V &b)
{
    return (a>b) ? a : b;
}
int main()
{
    int c, d;
    cin >> c >> d;
    cout << Min(c, d) << endl;
    cout << Max(c, d) << endl;

    return 0;
}

