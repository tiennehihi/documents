// a. Xây dựng một lớp quản lý một dãy số (DaySo) bất kỳ có các phương thức sau:
// Nhập vào một dãy n số

// Sắp xếp dãy số bằng thuật toán sắp xếp HeapSort
// Tìm kiếm phần từ của dãy bằng thuật toán tìm kiếm nhị phân ở trên măng
// In dãy số lên màn hình
// b. Viết hàm main tạo một đối tượng của lớp DaySo, lần lượt gọi các phương thức của đối tượng này thực hiện.
// c Mô tả quá trình tạo màng biểu diễn cây heap của dãy số sau đây: 23, 54, 1, 53, 76, 123, 43, 87, 321, 43.


#include <iostream>
#include <vector>
using namespace std;

class DaySo {
private:
    vector<int> arr;

    void heapify(int n, int i) {
        int largest = i; // Khởi tạo largest là nút gốc
        int left = 2 * i + 1; // Chỉ số của nút con trái
        int right = 2 * i + 2; // Chỉ số của nút con phải

        // So sánh nút gốc với nút con trái
        if (left < n && arr[left] > arr[largest])
            largest = left;

        // So sánh nút gốc với nút con phải
        if (right < n && arr[right] > arr[largest])
            largest = right;

        // Nếu largest không phải là nút gốc, hoán đổi và tiếp tục heapify
        if (largest != i) {
            swap(arr[i], arr[largest]);
            heapify(n, largest);
        }
    }

public:
    void NhapDaySo() {
        int n;
        cout << "Nhap so luong phan tu: ";
        cin >> n;
        arr.resize(n);
        cout << "Nhap cac phan tu: ";
        for (int i = 0; i < n; i++) {
            cin >> arr[i];
        }
    }

    void HeapSort() {
        int n = arr.size();

        // Xây dựng heap (sắp xếp thành heap)
        for (int i = n / 2 - 1; i >= 0; i--)
            heapify(n, i);

        // Trích xuất từng phần tử từ heap và sắp xếp
        for (int i = n - 1; i >= 0; i--) {
            swap(arr[0], arr[i]); // Di chuyển nút gốc (lớn nhất) đến cuối mảng
            heapify(i, 0); // Gọi heapify để giảm kích thước heap và sắp xếp lại
        }
    }

    int TimKiemNhiPhan(int x) {
        int left = 0;
        int right = arr.size() - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (arr[mid] == x)
                return mid;
            if (arr[mid] < x)
                left = mid + 1;
            else
                right = mid - 1;
        }
        return -1; // Không tìm thấy x trong mảng
    }

    void InDaySo() {
        cout << "Day so: ";
        for (int i = 0; i < arr.size(); i++) {
            cout << arr[i] << " ";
        }
        cout << endl;
    }
};

int main() {
    DaySo d;
    d.NhapDaySo();

    cout << "Day so truoc khi sap xep: ";
    d.InDaySo();

    d.HeapSort();

    cout << "Day so sau khi sap xep: ";
    d.InDaySo();

    int x;
    cout << "Nhap phan tu can tim kiem: ";
    cin >> x;
    int result = d.TimKiemNhiPhan(x);
    if (result == -1)
        cout << "Khong tim thay " << x << " trong day so." << endl;
    else
        cout << "Tim thay " << x << " tai vi tri " << result << " trong day so." << endl;

    return 0;
}