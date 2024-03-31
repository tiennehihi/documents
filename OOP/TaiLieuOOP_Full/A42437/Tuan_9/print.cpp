#include <iostream>
using namespace std;
template <class V>
void print(int n, const V &m)
{
    while(n--){
        cout << m << endl;
    }
}
int main()
{
    int a, b;
    cin >> a >> b;
    print (a, b);
    return 0;
}