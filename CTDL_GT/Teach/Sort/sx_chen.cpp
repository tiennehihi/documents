#include <bits/stdc++.h>
using namespace std;

void insertSort(int a[], int n){
    int index, value;
    for(int i = 1; i < n; i++) {
        index = i;
        value = a[i];
        while(index > 0 && a[index-1] > value) {
            a[index] = a[index-1];
            index--;
        }
        a[index] = value;
    }
}

void selectionSort(int a[], int n) {
    int Min;
    for(int i=0; i<n-1; i++){
        Min = i;
        for(int j=i+1;j<n;j++){
            if(a[Min] > a[j]){
                Min = j;
            }
        }
        if(i != Min) {
            swap(a[i], a[Min]);
        }
    }
}



int main() {
    int n = 10;
    srand(time(0));
    int a[10000];
    for(int i=0; i<n; i++) {
        a[i] = rand() % 100;
    }
    for(int i=0; i<n; i++){
        cout << a[i] << " ";
    }
    cout << endl;
    selectionSort(a, n);
    for(int i=0; i<n; i++){
        cout << a[i] << " ";
    }
}