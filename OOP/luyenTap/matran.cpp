// #include <iostream>
// #include <vector>
// using namespace std;

// class MaTran {
// private:
//     int n;
//     vector<vector<int>> matrix;

// public:
//     MaTran(int size) {
//         n = size;
//         matrix.resize(n, vector<int>(n, 0));
//     }

//     void nhapMatran() {
//         cout << "Nhap cac phan tu cua ma tran:\n";
//         for (int i = 0; i < n; i++) {
//             for (int j = 0; j < n; j++) {
//                 cout << "Nhap phan tu thu [" << i << "][" << j << "]: ";
//                 cin >> matrix[i][j];
//             }
//         }
//     }

//     void xuatMatran() {
//         cout << "Ma tran:\n";
//         for (int i = 0; i < n; i++) {
//             for (int j = 0; j < n; j++) {
//                 cout << matrix[i][j] << " ";
//             }
//             cout << endl;
//         }
//     }

//     int tinhTong() {
//         int sum = 0;
//         for (int i = 0; i < n; i++) {
//             for (int j = 0; j < n; j++) {
//                 sum += matrix[i][j];
//             }
//         }
//         return sum;
//     }

//     int timMin() {
//         int minElement = matrix[0][0];
//         for (int i = 0; i < n; i++) {
//             for (int j = 0; j < n; j++) {
//                 if (matrix[i][j] < minElement) {
//                     minElement = matrix[i][j];
//                 }
//             }
//         }
//         return minElement;
//     }

//     int timMax() {
//         int maxElement = matrix[0][0];
//         for (int i = 0; i < n; i++) {
//             for (int j = 0; j < n; j++) {
//                 if (matrix[i][j] > maxElement) {
//                     maxElement = matrix[i][j];
//                 }
//             }
//         }
//         return maxElement;
//     }

//     void timPhanTuLonHonTrungBinhCheo() {
//         int sumDiagonal = 0;
//         int countDiagonal = 0;
//         for (int i = 0; i < n; i++) {
//             sumDiagonal += matrix[i][i];
//             countDiagonal++;
//         }
//         double averageDiagonal = static_cast<double>(sumDiagonal) / countDiagonal;

//         cout << "Cac phan tu lon hon trung binh duong cheo:\n";
//         for (int i = 0; i < n; i++) {
//             if (matrix[i][i] > averageDiagonal) {
//                 cout << matrix[i][i] << " ";
//             }
//         }
//         cout << endl;
//     }
// };

// int main() {
//     int size;
//     cout << "Nhap kich thuoc: ";
//     cin >> size;

//     MaTran matran(size);
//     matran.nhapMatran();
//     matran.xuatMatran();

//     int sum = matran.tinhTong();
//     cout << "Tong cac phan tu cua ma tran: " << sum << endl;

//     int minElement = matran.timMin();
//     cout << "Phan tu nho nhat trong ma tran: " << minElement << endl;

//     int maxElement = matran.timMax();
//     cout << "Phan tu lon nhat trong ma tran: " << maxElement << endl;

//     matran.timPhanTuLonHonTrungBinhCheo();

//     return 0;
// }


#include <iostream>
#include <vector>
using namespace std;

class Matran {
private:
    int m, n; // Số hàng và số cột của ma trận
    vector<vector<int>> matrix; // Ma trận
public:
    // Hàm khởi tạo
    Matran(int m, int n) : m(m), n(n) {
        matrix.resize(m, vector<int>(n, 0));
    }

    // Hàm nhập ma trận
    void Nhap() {
        cout << "Nhap cac phan tu cua ma tran:\n";
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                cout << "Nhap phan tu [" << i << "][" << j << "]: ";
                cin >> matrix[i][j];
            }
        }
    }

    // Hàm xuất ma trận
    void Xuat() {
        cout << "Ma tran:\n";
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                cout << matrix[i][j] << " ";
            }
            cout << endl;
        }
    }

    // Hàm cộng hai ma trận
    Matran operator+(const Matran& other) {
        Matran result(m, n);
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                result.matrix[i][j] = matrix[i][j] + other.matrix[i][j];
            }
        }
        return result;
    }

    // Hàm nhân ma trận với một số nguyên
    Matran operator*(int k) {
        Matran result(m, n);
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                result.matrix[i][j] = matrix[i][j] * k;
            }
        }
        return result;
    }

    // Hàm nhân hai ma trận
    Matran operator*(const Matran& other) {
        Matran result(m, other.n);
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < other.n; ++j) {
                for (int k = 0; k < n; ++k) {
                    result.matrix[i][j] += matrix[i][k] * other.matrix[k][j];
                }
            }
        }
        return result;
    }

    // Hàm tính tổng các phần tử của ma trận
    int TongPhanTu() const {
        int sum = 0;
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                sum += matrix[i][j];
            }
        }
        return sum;
    }

    // Hàm tính giá trị lớn nhất của ma trận
    int MaxValue() {
        int maxVal = matrix[0][0];
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                if (matrix[i][j] > maxVal) {
                    maxVal = matrix[i][j];
                }
            }
        }
        return maxVal;
    }

    // Hàm bạn tính tổng hai ma trận
    friend int TongHaiMaTran(const Matran& A, const Matran& B) {
        return A.TongPhanTu() + B.TongPhanTu();
    }
};

int main() {
    int m, n;
    cout << "Nhap so hang cua ma tran: ";
    cin >> m;
    cout << "Nhap so cot cua ma tran: ";
    cin >> n;

    Matran A(m, n);
    cout << "Nhap ma tran A:\n";
    A.Nhap();

    Matran B(m, n);
    cout << "Nhap ma tran B:\n";
    B.Nhap();

    Matran C = A + B;
    cout << "Tong cua hai ma tran:\n";
    C.Xuat();

    Matran D = A * B;
    cout << "Tich cua hai ma tran:\n";
    D.Xuat();

    int S1 = A.TongPhanTu();
    int S2 = B.TongPhanTu();
    int M1 = A.MaxValue();
    int M2 = B.MaxValue();

    double result = (double)(S1 + S2) / (M1 - M2);
    cout << "Ket qua: " << result << endl;

    return 0;
}
