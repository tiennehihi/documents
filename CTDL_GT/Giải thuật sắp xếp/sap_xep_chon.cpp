#include <iostream>
using namespace std;
void selectionSort(int a[], int n){
    int Min;
    for(int i=0; i < n-1; i++){
        Min = i;
        for(int j = i+1; j < n; j++){
            if(a[Min] > a[j]){
                Min = j;
            }
        }
        if (i != Min){
            int temp = a[i];
            a[i] = a[Min];
            a[Min] = temp;
        }
    }
}
int main(){
    int a[10001];
    int n;
    cin >> n;
    for(int i=0; i<n; i++){
        cin >> a[i];
    }
    selectionSort(a, n);
    for(int i=0; i<n; i++){
        cout << a[i] << " ";
    }
    return 0;
}