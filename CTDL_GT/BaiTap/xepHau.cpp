#include <iostream>
using namespace std;

void KhoiTaoBanCo(int N, char bc[][20])
{
    for (int i = 0; i < N; i++)
        for (int j = 0; j < N; j++)
            bc[i][j] = '-';
}

void InBanCo(int N, char bc[][20])
{
    for (int i = 0; i < N; i++)
    {
        for (int j = 0; j < N; j++)
        {
            cout << bc[i][j] << "   ";
        }
        cout << endl;
    }
}

bool XepDuoc(int d, int c, int N, char bc[][20])
{
    for (int x = 0; x < c; x++)
    {
        if (bc[d][x] == 'H')
            return false;
    }
    for (int i = d, j = c; i >= 0 && j >= 0; i--, j--)
    {
        if (bc[i][j] == 'H')
            return false;
    }
    for (int i = d, j = c; i < N && j >= 0; i++, j--)
    {
        if (bc[i][j] == 'H')
            return false;
    }
    return true;
}

void XepHau(int c, int N, char bc[][20])
{
    if (c == N)
    {
        InBanCo(N, bc);
        cout << "************************" << endl;
    }
    else
    {
        for (int d = 0; d < N; d++)
        {
            if (XepDuoc(d, c, N, bc))
            {
                bc[d][c] = 'H';
                XepHau(c + 1, N, bc);
                bc[d][c] = '-';
            }
        }
    }
}

int main()
{
    int N = 8;
    char bc[20][20];
    KhoiTaoBanCo(N, bc);
    XepHau(0, N, bc);
    return 0;
}