#include <iostream>
#include <ctime>
using namespace std;

void bubbleSort(int a[], int n) {
    for(int i=0; i < n-1; i++) {
        for(int j = i+1; j < n; j++) {
            if(a[i] > a[j]) {
                swap(a[i], a[j]);
            }
        }
    }
}


int main() {
    srand(time(0));
    int a[1000];
    int n=5;
    for(int i=0; i < n; i++) {
        a[i] = rand() % 10;
    }
    bubbleSort(a, n);
    for(int i=0; i<n; i++) {
        cout << a[i] << " ";
    }
}