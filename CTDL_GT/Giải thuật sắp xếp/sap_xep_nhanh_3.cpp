/*
Nhập và một số nguyên dương n, tiếp theo là n số nguyên lần lượt là các phần tử của một dãy số, 
hãy đếm tần số (số lần xuất hiện) của các số trong dãy và in nó ra màn hình dưới dạng sau: 
"a1 t1; a2 t2; ... an tn; ", 
trong đó t1 là số lần xuất hiện của số a1, t2 là số lần xuất hiện của a2, ... a1, a2, .. an 
không trùng nhau và được sắp xếp tăng dần.
*/

#include<iostream>

using namespace std;

void quickSort(int a[], int l, int r){
	int p = a[(l+r)/2];
	int i = l, j = r;
	while (i < j){
		while (a[i] < p){
			i++;
		}
		while (a[j] > p){
			j--;
		}
		if (i <= j){
			int temp = a[i];
			a[i] = a[j];
			a[j] = temp;
			i++;
			j--;
		}
	}
	if (i < r){
		quickSort(a, i, r);
	}
	if (l < j){
		quickSort(a, l, j);
	}
}
int a[100001];
int main(){
    int n;
    cin >> n;
    for (int i = 0; i < n; i++){
        cin >> a[i];
    }
    quickSort(a, 0, n-1);
    int count = 1;
    for (int i = 1; i < n; i++){
        if (a[i] == a[i-1]){
            count++;
        } else {
            cout << a[i-1] << " " << count << "; ";
            count = 1;
        }
    }
    cout << a[n-1] << " " << count << "; ";
    return 0;
}