/*
1. Tail Program 
Viết chương trình yêu cầu người dùng nhập tên tệp. 
Chương trình sẽ hiển thị 10 dòng cuối cùng của tệp trên màn hình (“đuôi” của tệp). 
Nếu tệp có ít hơn 10 dòng, toàn bộ tệp sẽ được hiển thị, với thông báo cho biết toàn bộ tệp đã được hiển thị. 
Sau đó tạo một tệp văn bản đơn giản có thể dùng để kiểm tra chương trình này
Gợi ý: dùng hàm seekg, seekp
*/
#include <iostream>
#include <fstream>
#include <string>
using namespace std;

int main() {
    string filename;
    cout << "Nhap ten tep: ";
    cin >> filename;

    ifstream file(filename.c_str());

    if (!file) {
        cout << "Khong the mo tep!" << endl;
        return 1;
    }

    file.seekg(0, ios::end); // Đặt con trỏ tại cuối tệp
    int fileSize = file.tellg(); // Lấy kích thước tệp

    int linesToRead = 10; // Số dòng cuối cùng cần đọc
    int linesRead = 0; // Số dòng đã đọc

    // Bắt đầu từ cuối tệp và di chuyển ngược lên
    for (int i = fileSize - 1; i >= 0 && linesRead < linesToRead; --i) {
        file.seekg(i, ios::beg); // Di chuyển con trỏ tới vị trí i
        char c;
        file.get(c); // Đọc ký tự tại vị trí i
        if (c == '\n') {
            ++linesRead; // Nếu gặp dấu xuống dòng, đếm dòng
        }
        cout << c; // In ký tự ra màn hình
    }

    file.close();

    return 0;
}

