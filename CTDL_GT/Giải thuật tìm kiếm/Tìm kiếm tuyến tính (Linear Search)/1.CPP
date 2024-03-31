#include <bits/stdc++.h>
using namespace std;

// duyệt mảng xuôi
int search(int a[], int n, int x){
    for(int i=0; i < n; i++){
        if(a[i] == x){
            return i;
        }
    }
    return -1;
}

// duyệt mảng ngược
int search1(int a[], int n, int x){
    for(int i = n-1; i >= 0; i--){
        if(a[i] == x){
            return i;
        }
    }
    return -1;
}

// cách 3
int search2(int a[], int n, int x){
	int k = -1;
	for (int i = 0; i < n; i++){
		if (a[i] == x){
			k = i;
		}
	}
	return k;
}


int a[10001];
int main(){
    int n, x;
    cin >> n;
    for(int i=0; i<n; i++){
        cin >> a[i];
    }
    cin >> x;
    cout << search(a, n, x);
    return 0;
}