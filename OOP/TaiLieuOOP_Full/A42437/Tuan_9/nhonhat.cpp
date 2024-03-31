#include <iostream>
using namespace std;
template <class T>
T nhonhat(const T &a, const T &b, const T &c)
{
    T min = a;
    if(min > b) min = b;
    if(min > c) min = c;
    return min;
}
int main()
{
    int x, y, z;
    cin>>x>>y>>z;
    cout << nhonhat(x, y, z) << endl;
    return 0;
}