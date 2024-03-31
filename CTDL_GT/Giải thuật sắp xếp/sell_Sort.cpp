/*
Giới thiệu giải thuật shell Sort.
Shell Sort là một giải thuật sắp xếp mang lại hiệu quả cao dựa trên giải thuật sắp xếp chèn (Insertion Sort). 
Giải thuật này tránh các trường hợp phải tráo đổi vị trí của hai phần tử xa nhau trong giải thuật sắp xếp chọn 
(nếu như phần tử nhỏ hơn ở vị trí bên phải khá xa so với phần tử lớn hơn bên trái).
Đầu tiên, giải thuật này sử dụng giải thuật sắp xếp chọn trên các phần tử có khoảng cách xa nhau, sau đó sắp xếp các phần tử có khoảng cách hẹp hơn. 
Khoảng cách này còn được gọi là khoảng (interval).
interval sẽ nhận giá trị lần lượt là n/2, n/4, n/8 cho đến khi interval = 1.
Giải thuật này khá hiệu quả với các tập dữ liệu có kích cỡ trung bình khi mà độ phức tạp 
trường hợp xấu nhất và trường hợp trung bình là O(n), với n là số phần tử.
*/
#include<iostream>

using namespace std;

void printArray(int a[], int n){
    for (int i = 0; i < n; i++){
    	cout << a[i] << " ";
	}
	cout << endl;
}
void shellSort(int a[], int n){
	int interval, i, j, temp;
	for(interval = n/2; interval > 0; interval /= 2){
		for(i = interval; i < n; i++){
			temp = a[i];
			for(j = i; j >= interval && a[j - interval] > temp; j -= interval){
				a[j] = a[j - interval];				
			}
			a[j] = temp;
		}
    }
}
int a[100001];
int main()
{
	int n;
	cin >> n;
	for(int i = 0; i < n; i++){
		cin >> a[i];		
	}
	shellSort(a, n);
	printArray(a, n);
    return 0;
}