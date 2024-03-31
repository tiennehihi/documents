#include <bits/stdc++.h>
using namespace std;

int partititon(int a[], int l, int r) {
    int piviot = a[r];
    int i = l - 1;
    for(int j=l; j < r; j++){
        if(a[j] <= piviot){
            ++i;
            // swap(a[i], a[j]);
            int temp = a[j];
            a[j] = a[i];
            a[i] = temp;
        }
    }
    ++i;
    // swap(a[i], a[r]);
    int tmp = a[r];
    a[r] = a[i];
    a[i] = tmp;
    return i;
}

void quickSort(int a[], int l, int r) {
    if(l >= r)  return;
    int p = partititon(a, l, r);
    quickSort(a, l, p-1);
    quickSort(a, p+1, r);
}

int main(){
    srand(time(0));
    int n = 5 + rand() % 6;
    int a[1000];
    for(int i=0; i < n; i++){
        a[i] = rand() % 100;
    }
    quickSort(a, 0, n-1);
    for(int i=0; i < n; i++){
        cout << a[i] << " ";
    }
    return 0;
}