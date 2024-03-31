#include <iostream>
#include <string>

using namespace std;

void SinhNhiPhan(int n, string s)
{
    if (n == 0)
    {
        cout << s << endl;
    }
    else
    {
        SinhNhiPhan(n - 1, s + "0");
        SinhNhiPhan(n - 1, s + "1");
    }
}

int main()
{
    int n;
    cout << "Nhap n: ";
    cin >> n;
    SinhNhiPhan(n, "");
    return 0;
}
