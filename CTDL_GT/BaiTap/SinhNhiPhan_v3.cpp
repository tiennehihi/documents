#include <iostream>
using namespace std;

int a[100];
int n = 3;
void inKQ(int a[], int n)
{
    for(int i=1; i <= n; i++)
        cout << a[i];
    cout << endl;
}

void Binary(int i)
{
    for(int j=0; j <= 1; j++)  // duyệt tất cả các trường hợp có thể xảy ra
    {
        a[i] = j;
        if (i == n)
            inKQ(a, n);
        else    
            Binary(i+1);
    }
}

int main()
{
    Binary(1);
}