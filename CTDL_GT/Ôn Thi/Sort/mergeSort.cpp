#include <bits/stdc++.h>
using namespace std;

void Init(int a[], int &N){
    N = 10;
    for(int i=0; i < N; i++){
        a[i] = rand() % 100;
    }
}

void Print(int a[], int N){
    for(int i=0; i < N; i++){
        cout << a[i] << " ";
    }
    cout << endl;
    cout << "---------------------------\n";
}

void merge(int a[], int l, int m, int r){
    vector<int> x(a + l, a + m + 1);
    vector<int> y(a + m + 1, a + r + 1);
    int i=0, j=0;
    while(i < x.size() && j < y.size()){
        if(x[i] <= y[j]){
            a[l] = x[i];
            ++i;
            ++l;
        } else {
            a[l] = y[j];
            ++j;
            ++l;
        }
    }
    while(i < x.size()){
        a[l] = x[i];
        ++i;
        ++l;
    }
    while(j < y.size()){
        a[l] = y[j];
        ++j;
        ++l;
    }
}
void mergeSort(int a[], int l, int r){
    if(l < r){
        int m = (l+r) / 2;
        mergeSort(a, l, m);
        mergeSort(a, m+1, r);
        merge(a, l, m, r);
    }
}


int main(){
    srand(time(0));
    int a[100000];
    int N;
    Init(a, N);
    Print(a, N);
    mergeSort(a, 0, N-1);
    Print(a, N);
    return 0;
}