#include <bits/stdc++.h>
using namespace std;
int main()
{
    srand(time(0));
    string array[] = {"AC", "2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "10C", "JC", "QC", "KC",
                      "AR", "2R", "3R", "4R", "5R", "6R", "7R", "8R", "9R", "10R", "JR", "QR", "KR",
                      "AT", "2T", "3T", "4T", "5T", "6T", "7T", "8T", "9T", "10T", "JT", "QT", "KT",
                      "AB", "2B", "3B", "4B", "5B", "6B", "7B", "8B", "9B", "10B", "JB", "QB", "KB"};
    // int r = rand() % 52;
    for (int i = 0; i < 52; i++)
    {
        int vt = 0;
        int r = rand() % 52;
        cout << array[r] << " ";

    }
}