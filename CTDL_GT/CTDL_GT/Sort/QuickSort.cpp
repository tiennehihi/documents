// // Chốt pivot


// #include <bits/stdc++.h>
// using namespace std;

// // Phân hoạch
// int partititon(int a[], int l, int r){
//     int piviot = a[r];   // phần tử bên phải cùng
//     int i = l-1;
//     for (int j = l; j < r; j++){
//         if(a[j] <= piviot){
//             ++i;
//             // swap(a[i], a[j]);
//             int temp = a[j];
//             a[j] = a[i];
//             a[i] = temp;
//         }
//     }
//     // dua chot ve giua
//     ++i;
//     // swap(a[i], a[r]);
//     int tmp = a[r];
//     a[r] = a[i];
//     a[i] = tmp;
//     return i;   // vi tri sau khi quy hoach
// }

// void quickSort(int a[], int l, int r){
//     if (l >= r)  return;
//     int p = partititon(a, l, r);
//     quickSort(a, l, p-1);
//     quickSort(a, p+1, r);

//     // int k;
//     // if(l < r){
//     //     k = partititon(a, l, r);
//     //     quickSort(a, l, k-1);
//     //     quickSort(a, k+1, r);
//     // }
// }

// int main(){
//     srand(time(0));
//     int size;
//     cout << "Nhap kich thuoc mang: ";
//     cin >> size;
//     int a[1000];
//     for(int i=0; i<size; i++){
//         a[i] = rand() % 100;
//         // cin >> a[i];
//     }
//     quickSort(a, 0, size-1);
//     for(int i=0; i < size; i++){
//         cout << a[i] << " ";
//     }
//     return 0;
// }

// #include <bits/stdc++.h>
// using namespace std;

// int partititon(int a[], int l, int r) {
//     int piviot = a[r];
//     int i = l-1;
//     for(int j = l; j < r; j++){
//         if(a[j] <= piviot){
//             ++i;
//             swap(a[i], a[j]);
//         }
//     }
//     ++i;
//     swap(a[i], a[r]);
//     return i;
// }

// void quickSort(int a[], int l, int r) {
//     if (l >= r) return;
//     int p = partititon(a, l, r);
//     quickSort(a, l, p-1);
//     quickSort(a, p+1, r);
// }

// int main()
// {
//     srand(time(0));
//     int n = 5 + rand() % 6;   // sinh ngẫu nhiên 5-10 số
//     int a[1000];
//     for(int i=0; i<n; i++){
//         a[i] = rand() % 100;
//     }
//     quickSort(a, 0, n-1);
//     for(int i=0; i<n; i++){
//         cout << a[i] << " ";
//     }
//     return 0;
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

int partition(int a[], int l, int r){
    int piviot = a[r];
    int i = l-1;
    for (int j=l; j < r; j++){
        if(a[j] <= piviot){
            ++i;
            swap(a[i], a[j]);
        }
    }
    ++i;
    swap(a[i], a[r]);
    return i;
}

void quickSort(int a[], int l, int r){
    if(l >= r)  return;
    int p = partition(a, l, r);
    quickSort(a, l, p-1);
    quickSort(a, p+1, r);
}

int main(){
    srand(time(0));
    int a[100000];
    int N;
    Init(a, N);
    Print(a, N);
    quickSort(a, 0, N-1);
    Print(a, N);
}


// 1. Hàm partition:

// Hàm partition được sử dụng để phân chia một mảng thành hai phần, sao cho các phần tử nhỏ hơn hoặc bằng pivot 
// đứng trước pivot và các phần tử lớn hơn pivot đứng sau pivot. Đồng thời, nó đặt pivot vào vị trí chính xác của nó trong mảng.

// Tham số đầu vào:

// a[]: Mảng cần được phân chia.
// l: Chỉ số của phần tử đầu tiên trong mảng.
// r: Chỉ số của phần tử cuối cùng trong mảng.
// Các bước thực hiện:

// Chọn một phần tử làm pivot. Trong trường hợp này, pivot được chọn là a[r], tức là phần tử cuối cùng của mảng.
// Khởi tạo biến i với giá trị l - 1. Biến i sẽ được sử dụng để theo dõi vị trí đúng của pivot trong mảng.
// Tiến hành duyệt qua các phần tử từ l đến r-1 trong mảng:
// Nếu a[j] (phần tử hiện tại) nhỏ hơn hoặc bằng pivot, ta tăng giá trị của i lên 1 và hoán đổi chỗ a[i] với a[j]. 
// Điều này đảm bảo rằng các phần tử nhỏ hơn hoặc bằng pivot sẽ đứng trước pivot trong mảng.
// Sau khi kết thúc vòng lặp, ta có thể đặt pivot vào vị trí chính xác trong mảng bằng cách hoán đổi chỗ a[i+1] và a[r].
// Trả về giá trị i+1, đó chính là vị trí của pivot trong mảng đã phân chia.


// 2. Hàm quickSort:

// Hàm quickSort triển khai thuật toán QuickSort bằng cách sử dụng đệ quy.

// Tham số đầu vào:

// a[]: Mảng cần được sắp xếp.
// l: Chỉ số của phần tử đầu tiên trong mảng.
// r: Chỉ số của phần tử cuối cùng trong mảng.
// Các bước thực hiện:

// Nếu l >= r, tức là mảng chỉ có một phần tử hoặc không có phần tử nào, ta kết thúc đệ quy.
// Gọi hàm partition để phân chia mảng a từ l đến r. Hàm partition trả về vị trí của pivot sau khi phân chia.
// Áp dụng đệ quy cho hai mảng con:
// Gọi quickSort(a, l, p-1) để sắp xếp mảng con trước pivot.
// Gọi quickSort(a, p+1, r) để sắp xếp mảng con sau pivot.









// Thuật toán QuickSort là một thuật toán sắp xếp đệ quy dựa trên phân chia và chế độ hóa.
//  Nó hoạt động bằng cách chọn một phần tử được gọi là "pivot" từ mảng và phân chia các phần tử trong mảng thành hai phần, 
// sao cho các phần tử nhỏ hơn pivot đứng trước pivot và các phần tử lớn hơn pivot đứng sau pivot. 
// Sau đó, thuật toán được áp dụng đệ quy để sắp xếp các phần tử trước và sau pivot.

// Dưới đây là cách thuật toán QuickSort hoạt động:

// Chọn một phần tử từ mảng, được gọi là pivot. Thông thường, chúng ta chọn phần tử cuối cùng của mảng làm pivot.
// Phân chia mảng thành hai phần, sao cho các phần tử nhỏ hơn pivot đứng trước pivot và các phần tử lớn hơn pivot đứng sau pivot. 
// Đồng thời, đặt pivot vào vị trí chính xác của nó trong mảng.
// Đặt pivot vào vị trí chính xác trong mảng. Điều này đảm bảo rằng pivot đã được sắp xếp đúng vị trí của nó.
// Đặt pivot vào vị trí chính xác trong mảng. Điều này đảm bảo rằng pivot đã được sắp xếp đúng vị trí của nó.
// Áp dụng thuật toán QuickSort đệ quy cho các mảng con trước và sau pivot.
// Lặp lại các bước 1-5 cho đến khi tất cả các phần tử được sắp xếp.
// Dưới đây là một ví dụ về cách QuickSort hoạt động:

// Giả sử chúng ta có một mảng chưa sắp xếp: [7, 2, 1, 6, 8, 5, 3, 4]

// Bước 1: Chọn pivot là 4 (phần tử cuối cùng).

// Bước 2: Phân chia mảng thành hai phần. Sau khi phân chia, mảng trở thành: [2, 1, 3, 4, 8, 5, 7, 6]. 
// Phần tử 4 đã được đặt vào vị trí chính xác của nó.

// Bước 3: Áp dụng QuickSort đệ quy cho mảng con trước pivot (2, 1, 3) và mảng con sau pivot (8, 5, 7, 6).

// Bước 4: Chọn pivot là 3 (phần tử cuối cùng của mảng con trước pivot).

// Bước 5: Phân chia mảng con trước pivot thành hai phần. Mảng con trước pivot trở thành: [2, 1, 3]. 
// Phần tử 3 đã được đặt vào vị trí chính xác của nó.

// Bước 6: Áp dụng QuickSort đệ quy cho mảng con trước pivot (2, 1) và mảng con sau pivot (5, 7, 6).

// Bước 7: Tiếp tục áp dụng các bước 4-6 cho các mảng con cho đến khi tất cả các phần tử được sắp xếp.

// Bước 8: Kết thúc khi tất cả các phần tử đã được sắp xếp: [1, 2, 3, 4, 5, 6, 7, 8].