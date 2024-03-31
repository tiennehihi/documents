#include <bits/stdc++.h>
using namespace std;

// tìm vị trí của min
int searchMin(int a[], int n){
    int k=0;
    for(int i=0; i<n; i++){
        if(a[k] > a[i]){
            k = i;
        }
    }
    return k;
}

// tìm vị trí của max
int searchMax(int a[], int n){
    int k=0;
    for(int i=0; i<n; i++){
        if(a[k] <= a[i]){
            k = i;
        }
    }
    return k;
}
void printArray(int a[], int n){
    for(int i=0; i<n; i++){
        cout << a[i] << " ";
    }
}

int a[10001];
int main(){
    int n, x;
    cin >> n;
    for(int i=0; i < n; i++){
        cin >> a[i];
    }
    int csMin = searchMin(a, n);
    int csMax = searchMax(a, n);
    cout << csMax << " " << csMin << endl;
    // swap(a[csMin], a[csMax]);
    printArray(a, n);
}