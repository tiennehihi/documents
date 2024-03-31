#include <bits/stdc++.h>
using namespace std;

void Init(int a[], int &N){
    N=10;
    for(int i=0; i<N; i++){
        a[i] = rand() % 100;
    }
}

void Print(int a[], int N){
    for(int i=0; i<N; i++){
        cout << a[i] << " ";
    }
    cout << "\n----------------------------------------------\n";
}

int partition(int a[], int l, int r){
    int piviot = a[r];
    int i = l-1;
    for(int j=l; j < r; j++){
        if(a[j] <= piviot){
            ++i;
            swap(a[i], a[j]);
        }
    }
    ++i;
    swap(a[i], a[r]);
    return i;
}

void quickSort(int a[], int l, int r){
    if(l < r){
        int p = partition(a, l, r);
        quickSort(a, l, p-1);
        quickSort(a, p+1, r);
    }
}

int main(){
    srand(time(0));
    int a[100000];
    int N;
    Init(a, N);
    Print(a, N);
    quickSort(a, 0, N-1);
    Print(a, N);
    return 0;
}