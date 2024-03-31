#include <bits/stdc++.h>
using namespace std;

void Init(int a[], int &n) {
    n = 10;
    for(int i=0; i < n; i++)
        a[i] = rand() % 100;
}

void Print(int a[], int n) {
    for(int i=0; i<n; i++) {
        cout << a[i] << " ";
    }
    cout << endl << "-------------------------------";
}

int partition(int a[], int l, int r) {
    int pivot = a[r];
    int i = l-1;
    for (int j = l; j <= r - 1; j++){
        if(a[j] <= pivot) {
            i++;
            swap(a[i], a[j]);
        }
    }
    i++;
    swap(a[i], a[r]);
    return i;
}

void quickSort(int a[], int l, int r) {
    if(l >= r)  return;
    int p = partition(a, l, r);
    quickSort(a, l, p-1);
    quickSort(a, p+1, r);
}