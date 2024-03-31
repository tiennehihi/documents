/*
Cho số nguyên dương n, tiếp theo là n số nguyên dương của một dãy a, cuối cùng là một số s.
Hãy đưa ra dãy con liên tiếp đầu tiên của dãy a sao cho tổng của dãy đó bằng s. 
In dãy đó ra màn hình, sau mỗi phần tử có một khoảng trắng. Nếu không tồn tại dãy đó thì in ra "-1".
*/

#include <bits/stdc++.h>
using namespace std;
int a[100001], b[100001];
int BinSearch(int a[], int n, int x){
    int l=0, r = n-1;
    while(l < r){
        int mid = (l+r)/2;
        if(a[mid] < x){
            l = mid+1;
        } else {
            r = mid;
        }
    }
    if(a[l] == x){
        return l;
    }
    return -1;
}
void printArray(int a[], int n, int l, int r){
    for(int i=l; i <= r; i++){
        cout << a[i] << " ";
    }
}
bool slove(int a[], int b[], int n, int s){
    b[0] = a[0];
    for(int i=1; i < n; i++){
        b[i] = b[i-1] + a[i];
    }
    for (int i=0; i < n; i++){
        if(b[i] == s){
            printArray(a, n, 0, i);
            return true;
        }
        if(b[i] > s){
            int l = BinSearch(b, n, b[i]-s);
            if (l != -1){
                printArray(a, n, l+1, i);
                return true;
            }
        }
    }
    return false;
}
int main(){
    int n, s;
    cin >> n;
    for(int i=0; i<n; i++){
        cin >> a[i];
    }
    cin >> s;
    bool k = slove(a, b, n, s);
    if(!k){
        cout << -1;
    }
    return 0;
}



// Đoạn mã trên là một hàm có tên `solve` nhận vào các tham số sau:
// - `a`: Một mảng số nguyên `a[]` có kích thước `n`, chứa các phần tử đầu vào.
// - `b`: Một mảng số nguyên `b[]` có kích thước `n`, dùng để tính tổng các phần tử của `a[]`.
// - `n`: Số lượng phần tử trong mảng `a[]` và `b[]`.
// - `s`: Một số nguyên `s` là giá trị mục tiêu.

// Mục đích của hàm là tìm một đoạn liên tiếp trong mảng `a[]` có tổng là `s`. 
// Nếu tìm thấy, hàm sẽ in ra đoạn đó và trả về giá trị `true`, ngược lại trả về giá trị `false`.

// Quá trình giải quyết bài toán được thực hiện như sau:

// 1. Gán `b[0] = a[0]`, tức là phần tử đầu tiên của `b[]` bằng phần tử đầu tiên của `a[]`.
// 2. Tiếp theo, với mỗi phần tử `a[i]` trong mảng `a[]` (bắt đầu từ vị trí thứ 1), ta tính `b[i]` bằng cách 
//    cộng phần tử `a[i]` với phần tử `b[i-1]` của `b[]`. Điều này có nghĩa là `b[i]` sẽ lưu tổng của các phần tử từ `a[0]` đến `a[i]`.
// 3. Tiếp theo, ta duyệt qua mỗi phần tử `b[i]` trong mảng `b[]` và kiểm tra các trường hợp sau:
//    - Nếu `b[i]` bằng `s`, tức là tổng của một đoạn liên tiếp trong mảng `a[]` là `s`, 
//    ta in ra đoạn đó bằng cách gọi hàm `printArray(a, n, 0, i)` (giả sử hàm này đã được định nghĩa ở đâu đó) và trả về `true`.
//    - Nếu `b[i] > s`, tức là tổng của một đoạn liên tiếp trong mảng `a[]` lớn hơn `s`, 
//    ta sử dụng tìm kiếm nhị phân (`BinSearch`) để tìm một phần tử `b[j]` trong khoảng từ 0 đến `i` sao cho `b[j]` bằng `b[i] - s`. 
//    Nếu tìm thấy, ta in ra đoạn từ `a[j+1]` đến `a[i]` bằng cách gọi hàm `printArray(a, n, l+1, i)` và trả về `true`.
// 4. Nếu không tìm thấy đoạn liên tiếp nào có tổng bằng `s`, ta trả về `false`.

// Tóm lại, hàm này được sử dụng để tìm một đoạn liên tiếp trong mảng có tổng bằng một giá trị mục tiêu `s`.