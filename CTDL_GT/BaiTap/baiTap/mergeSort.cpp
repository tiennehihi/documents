#include <bits/stdc++.h>
using namespace std;

void merge(int a[], int l, int m, int r)
{
    vector<int> x(a + l, a + m + 1);  // copy nửa mảng từ left đến middle+1 vào X
    vector<int> y(a + m + 1, a + r + 1);  // // copy nửa mảng từ middle+1 đến right vào Y
    int i=0, j=0;
    while(i < x.size() && j < y.size()){
        if(x[i] <= y[j]){
            a[l] = x[i]; ++l;  ++i;
        } else {
            a[l] = y[j];  ++l; ++j;
        }
    }
    while(i < x.size()){
        a[l] = x[i]; ++l;  ++i;
    }
    while(j < y.size()){
        a[l] = y[j]; ++l; ++j;
    }
}

void mergeSort(int a[], int l, int r)
{
    if (l >= r) return;
    int m = (l+r) / 2;
    mergeSort(a, l, m);
    mergeSort(a, m+1, r);
    merge(a, l, m, r);
}

int main()
{
    srand(time(0));
    int a[100000];
    int n = 5 + rand() % 6;
    for (int i = 0; i < n; i++)
        a[i] = rand() % 100;
    for (int i = 0; i < n; i++)
        cout << a[i] << " ";
    mergeSort(a, 0, n-1);
    cout << endl << "----------------------\n";
    for (int i = 0; i < n; i++)
        cout << a[i] << " ";
    return 0;
}