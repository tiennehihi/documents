#include<iostream>
using namespace std;
void printArray(int a[], int n){
	for (int i = 0; i < n; i++){
		cout << a[i] << " ";
	}
}
void bubbleSort(int a[], int n){
    for(int i = n-1; i >= 0; i--){
        bool swapped = true;
        for(int j = 0; j < i; j++){
            if (a[j] > a[j+1]){
				int temp = a[j];
				a[j] = a[j+1];
				a[j+1] = temp;
				swapped = false;
			}
        }
        if(swapped){
            break;
        }
    }
}
void nhap(int a[], int n) {
    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }
}
int main(){
    int a[100001];
    int n;
    cin >> n;
    nhap(a, n);
    bubbleSort(a, n);
    cout << "Gia tri sau khi sap xep: ";
    printArray(a, n);
    // for(int i=0; i < n; i++){
    //     cin >> a[i];
    // }
    // for (int i=0; i < n-1; i++) {
    //     for(int j=i+1; j < n; j++) {
    //         if(a[i] > a[j]) {
    //             int t = a[i];
    //             a[i] = a[j];
    //             a[j] = t;
    //         }
    //     }
    // }
    // for(int i = 0; i < n; i++) {
    //     cout << a[i] << " ";
    // }
    // bubbleSort(a, n);
    // printArray(a, n);
}