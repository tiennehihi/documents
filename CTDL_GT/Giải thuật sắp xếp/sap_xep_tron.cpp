#include<iostream>
 
using namespace std;

void merge(int arr[], int l, int m, int r){
    int i, j, k;
    int n1 = m - l + 1;
    int n2 =  r - m;
    int L[n1], R[n2];
    for (i = 0; i < n1; i++){
    	L[i] = arr[l + i];
	}  
    for (j = 0; j < n2; j++){
    	R[j] = arr[m + 1+ j];
	}
    i = 0;
    j = 0; 
    k = l; 
    while (i < n1 && j < n2){
        if (L[i] <= R[j]){
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
    while (i < n1){
        arr[k] = L[i];
        i++;
        k++;
    }
    while (j < n2){
        arr[k] = R[j];
        j++;
        k++;
    }
}
void mergeSort(int a[], int l, int r){
    if (l < r){
        int m = l+(r-l)/2;
        mergeSort(a, l, m);
        mergeSort(a, m+1, r);
        merge(a, l, m, r);
    }
}
 
void printArray(int a[], int n){
    for (int i = 0; i < n; i++){
    	cout << a[i] << " ";
	}
}
int a[100001];
int main(){
	int n;
	cin >> n;
	for (int i = 0; i < n; i++){
		cin >> a[i];
	}
    mergeSort(a, 0, n - 1);
    printArray(a, n);
    
    return 0;
}


// Hàm merge:
// Hàm này nhận vào một mảng arr, chỉ số bắt đầu l, chỉ số giữa m, và chỉ số kết thúc r.
// Đầu tiên, nó tính toán số lượng phần tử trong hai mảng con bằng cách tính n1 = m - l + 1 và n2 = r - m.
// Khởi tạo hai mảng con L và R với kích thước tương ứng là n1 và n2.
// Sao chép các phần tử từ mảng con gốc arr vào mảng con L và R.
// Tiếp theo, sử dụng các biến i, j, và k để duyệt qua các phần tử của L, R, và arr.
// Trong vòng lặp while, so sánh các phần tử tại L[i] và R[j].
// Nếu L[i] nhỏ hơn hoặc bằng R[j], gán arr[k] = L[i] và tăng i lên 1.
// Ngược lại, gán arr[k] = R[j] và tăng j lên 1.
// Sau đó, tăng k lên 1.
// Sau khi kết thúc vòng lặp while, kiểm tra xem có phần tử nào còn lại trong mảng con L không. Nếu có, sao chép các phần tử đó vào mảng arr.
// Tương tự, kiểm tra xem có phần tử nào còn lại trong mảng con R không. Nếu có, sao chép các phần tử đó vào mảng arr.


// Hàm mergeSort:
// Hàm này nhận vào một mảng a, chỉ số bắt đầu l, và chỉ số kết thúc r.
// Đầu tiên, kiểm tra điều kiện dừng. Nếu l nhỏ hơn r, tiếp tục thực hiện thuật toán Merge Sort.
// Tính chỉ số giữa m bằng cách tính l + (r - l) / 2.
// Tiếp theo, gọi đệ quy hàm mergeSort trên nửa đầu mảng từ l đến m.
// Sau đó, gọi đệ quy hàm mergeSort trên nửa sau mảng từ m + 1 đến r.
// Cuối cùng, gọi hàm merge để trộn hai nửa mảng đã sắp xếp thành một mảng đã sắp xếp.