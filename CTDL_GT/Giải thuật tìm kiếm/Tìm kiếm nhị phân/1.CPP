#include<iostream>

using namespace std;

int BinSearch(int a[], int n, int x){
	int l = 0, r = n - 1;
    while (l <= r) {  // Thay đổi điều kiện dừng thành l <= r
        int mid = l + (r - l) / 2;  // Sử dụng công thức tránh tràn số
        if (a[mid] == x) {
            return mid;
        }
        if (a[mid] < x) {
            l = mid + 1;
        } else {
            r = mid - 1;
        }
    }
    return -1;
	// int l = 0, r = n-1;
	// while (l < r){
	// 	int mid = (l+r)/2;
	// 	if (a[mid] < x){
	// 		l = mid+1;
	// 	}
	// 	else{
	// 		r = mid;
	// 	}
	// }
	// if (a[l] == x){
	// 	return l;
	// }
	// return -1;
}

int a[100001];
int main(){
	int n, x;
	cin >> n;
	for (int i = 0; i < n; i++){
		cin >> a[i];
	}
	cin >> x;
	cout << BinSearch(a, n, x);
	
	return 0;
}