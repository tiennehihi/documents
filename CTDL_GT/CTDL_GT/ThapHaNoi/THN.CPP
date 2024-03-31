#include <bits/stdc++.h>
using namespace std;
int i = 0;
void THN(int N, char c1, char c2, char c3)
{
    if (N == 1)
    {
        i++;
        cout<<i<<": "<< c1 <<" --> "<< c3 <<endl;
    }
    else
    {
        THN(N-1, c1, c3, c2);
        THN(1, c1, c2, c3);
        THN(N-1, c2, c1, c3);
    }
}
int main() 
{
    THN(6, '1', '2', '3');
}