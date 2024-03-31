#include <iostream>
#include <string>
using namespace std;

// Khai báo cấu trúc Department
struct Department {
    string name;
    double quarterlySales[4];  // Doanh số bán hàng 4 quý
    double annualSales;        // Tổng doanh số hàng năm
    double averageQuarterlySales;  // Doanh số bán hàng trung bình quý
};

int main() {
    const int numDepartments = 2;
    Department departments[numDepartments];

    // Nhập thông tin cho từng bộ phận
    for (int i = 0; i < numDepartments; i++) {
        cout << "Nhap thong tin cho bo phan " << i + 1 << ":" << endl;
        cout << "Ten bo phan: ";
        cin >> departments[i].name;
        double totalSales = 0;
        for (int j = 0; j < 4; j++) {
            cout << "Nhap doanh so ban hang cho quy " << j + 1 << ": ";
            cin >> departments[i].quarterlySales[j];
            totalSales += departments[i].quarterlySales[j];
        }
        departments[i].annualSales = totalSales;
        departments[i].averageQuarterlySales = totalSales / 4;
    }

    // Hiển thị thông tin của các bộ phận
    for (int i = 0; i < numDepartments; i++) {
        cout << "Thong tin bo phan " << i + 1 << ":" << endl;
        cout << "Ten bo phan: " << departments[i].name << endl;
        cout << "Doanh so hang nam: " << departments[i].annualSales << endl;
        cout << "Doanh so ban hang trung binh quy: " << departments[i].averageQuarterlySales << endl;
    }

    return 0;
}
