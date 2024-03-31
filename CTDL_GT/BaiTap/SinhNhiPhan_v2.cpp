#include <iostream>

using namespace std;

void Sinh(int i, int N, int a[])
{
    
    if (i > N)
    {
        for (int k = 0; k < N; k++)
        {
            cout << a[k];
        }
        cout << endl;
    }
    else
    {
        a[i-1]=0;
        Sinh(i+1,N,a);
        a[i-1]=1;
        Sinh(i+1,N,a);  
    }
}

int main()
{
    int a[100];
    Sinh(1, 4, a);
}

