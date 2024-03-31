// #include <bits/stdc++.h>
// using namespace std;

// void Init(int a[], int &n) 
// {
//     n = 10;
//     for(int i=0; i < n; i++)
//         a[i] = rand() % 100;
// }

// void Print(int a[], int n)
// {
//     for(int i=0; i<n; i++)
//         cout << a[i] << " ";
//     cout << endl << "-------------------------------\n";
// }

// void Merge(int a[], int l, int m, int r)
// {
//     vector<int> x(a + l, a + m + 1);  //  copy mảng con bên trái bắt đầu từ left kết thúc ở middle
//     vector<int> y(a + m + 1, a + r + 1);  //  copy mảng con bên phải bắt đầu từ middle+1 kết thúc ở right
//     int i = 0, j = 0;
//     while(i < x.size() && j < y.size()) {  // chạy cho tới khi nào i và j vẫn nhỏ hơn kchs thước của x và y
//         if (x[i] <= y[j]){  // nếu phần tử ở mảng x nhỏ hơn phần tử ở mảng y thì
//             a[l] = x[i];       // copy x[i] ra mảng a vị trí l
//             ++l;        
//             ++i;
//         } else {
//             a[l] = y[j];
//             ++l;
//             ++j;
//         }
//     }
//     while(i < x.size()) {
//         a[l] = x[i]; ++l; ++i;
//     }
//     while(j < y.size()) {
//         a[l] = y[j]; ++l; ++j;
//     }
// }

// void MergeSort(int a[], int l, int r)
// {
//     if(l<r)
//     {
//         int m = (l + r) / 2;
//         MergeSort(a, l, m);
//         MergeSort(a, m+1, r);
//         Merge(a, l, m, r);
//     }
// }

// int main()
// {
//     srand(time(0));
//     int a[100000];
//     int N;
//     Init(a, N);
//     Print(a, N);
//     MergeSort(a, 0, N-1);
//     Print(a, N);
// }


#include <bits/stdc++.h>
using namespace std;

void Init(int a[], int &N){
    N = 10;
    for(int i=0; i < N; i++)
        a[i] = rand() % 100;
}

void Print(int a[], int N){
    for(int i = 0; i < N; i++)
        cout << a[i] << " ";
    cout << endl << "-------------------------------\n";
}


// Tron 2 day con: day 1 (l, m); day 2 (m+1, r)
void Merge(int a[], int l, int m, int r){
    vector<int> x(a + l, a + m + 1);    // Là mảng con bên trái bắt đầu từ left kết thúc ở middle (đầu mút ko lấy nên phải +1)
    vector<int> y(a + m + 1, a + r + 1);    // Là mảng con bên trái bắt đầu từ right kết thúc ở right (đầu mút ko lấy nên phải +1)
    int i=0, j=0;
    while(i < x.size() && j < y.size()){
        if(x[i] <= y[j]){   // Nếu phần dử dãy 1 nhỏ hơn ptu dãy 2
            a[l] = x[i];    // Coppy phần tử hiện tại của vector X và mảng A
            ++i;
            ++l;
        } else {
            a[l] = y[j];
            ++j;
            ++l;
        }
    }
    while(i < x.size()){
        a[l] = x[i];
        ++i;
        ++l;
    
    while(j < y.size()){
        a[l] = y[j];
        ++j;
        ++l;
    }
}

void MergeSort(int a[], int l, int r){
    if(l < r){
        int m = (l+r) / 2;
        MergeSort(a, l, m);
        MergeSort(a, m+1, r);
        Merge(a, l, m, r);
    }
}

int main(){
    srand(time(NULL));
    int a[100000];
    int N;
    Init(a, N);
    Print(a, N);
    MergeSort(a, 0, N-1);
    Print(a, N);
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