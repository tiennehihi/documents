#include <iostream>
#include <string>
using namespace std;

const int n = 3;
// Định nghĩa cấu trúc ThoiTiet
struct ThoiTiet {
    double rain, highTemp, lowTemp, avgTemp;
};

// Hàm để nhập thông tin thời tiết của một tháng từ bàn phím
void inputAll(ThoiTiet a[], int n) {
    for(int i=0; i < n; i++){
        cout << "Thang " << i + 1 << ":\n";
        cin >> a[i].rain >> a[i].highTemp >> a[i].lowTemp;
        a[i].avgTemp = (a[i].lowTemp + a[i].highTemp) / 2;
    }
}

// Hàm để in thông tin thời tiết của một tháng
void outputAll(ThoiTiet a[], int n) {
    for (int i = 0; i < n; i++) {
        cout << "Thang " << i + 1 << ":\n";
        cout << a[i].rain << " " << a[i].highTemp << " " << a[i].lowTemp << " " << a[i].avgTemp << endl;
        cout << "--------------\n";
    }
}

int main() {
    ThoiTiet a1[] = {{3, 4, 5}, {3, 2, 5}, {3, 4, 6}};
    for(int i = 0; i < n; i++){
        a1[i].avgTemp = (a1[i].highTemp + a1[i].lowTemp) / 2;
    }
    // outputAll(a1, n);

    ThoiTiet a2[n];
    for(int i=0; i < n; i++){
        cout << "Thang " << i + 1 << ":\n";
        cin >> a2[i].rain >> a2[i].highTemp >> a2[i].lowTemp;
        a2[i].avgTemp = (a2[i].lowTemp + a2[i].highTemp) / 2;
    }
    for (int i = 0; i < n; i++) {
        cout << "Thang " << i + 1 << ":\n";
        cout << a2[i].rain << " " << a2[i].highTemp << " " << a2[i].lowTemp << " " << a2[i].avgTemp << endl;
        cout << "---------------\n";
    }

    ThoiTiet a3[n];
    inputAll(a3, n);
    outputAll(a3, n);

    return 0;
}
