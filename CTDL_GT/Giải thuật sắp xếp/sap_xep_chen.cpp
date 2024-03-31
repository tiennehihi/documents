#include<bits/stdc++.h>
using namespace std;
void insertionSort(int a[], int n){
    int index, value;
    for(int i = 1; i < n; i++){
        index = i;
        value = a[i];
        while(index > 0 && a[index-1] > value){
            a[index] = a[index-1];
            index--;
        }
        a[index] = value;
    }
}
void printArray(int a[], int n){
    for(int i=0; i<n; i++){
        cout << a[i] << " ";
    }
}

int main(){
    int a[100001];
    int n;
    cin >> n;
    for(int i=0; i < n; i++){
        cin >> a[i];
    }
    insertionSort(a, n);
    printArray(a, n);
}