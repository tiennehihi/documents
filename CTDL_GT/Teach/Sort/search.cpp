#include <bits/stdc++.h>
using namespace std;

int linearSearch(int a[], int n, int x) {
    for(int i=0; i<n; i++) {
        if(a[i] == x) {
            return i;
        }
    }
    return -1;
}

void Init(int a[], int n) {
    for(int i=0; i<n; i++) {
        a[i] = rand() % 100;
    }
}

void Print(int a[], int n) {
    for(int i=0; i<n; i++) {
        cout << a[i] << " ";
    }
    cout << "\n------------------------" << endl;
}

int BinSearch(int a[], int n, int x) {
    int l=0, r=n-1;
    while(l <= r) {
        int mid = l + (r-l) / 2;
        if(a[mid] == x) {
            return mid;
        }
        if(a[mid] < x) {
            l = mid + 1;
        } else {
            r = mid - 1;
        }
    }
    return -1;
}


int main() {
    int a[1000];
    int n;
    cin >> n;
    int x;
    srand(time(0));
    for(int i=0; i < n; i++) {
        cin >> a[i];
    }
    // Init(a, n);
    // Print(a, n);
    cin >> x;
    // cout << linearSearch(a, n, x) << endl;
    cout << BinSearch(a, n, x) << endl;
}