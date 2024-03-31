#include <iostream>
#include <string>
#include <chrono>
#include <thread>
#include <cstdlib>
using namespace std;

int main() {
    string str = "Mot vi phap su nguoi Viet Nam da tung noi: \nOi gioi, cac anh hoc Cong Nghe Thong Tin (IT) ma khong biet choi co bac online la vut :33\n";
    string str2 = "\n\t\tCHUONG TRINH CHIA BAI ONLINE\n\n";

    // Duyệt từng kí tự trong chuỗi và in ra màn hình sau mỗi 50 milli giây
    for (int i = 0; i < str.length(); i++) {
        cout << str[i];
        // Dừng chương trình 0.05 giây
        this_thread::sleep_for(chrono::milliseconds(50));
    }

    for (int i = 0; i < str2.length(); i++) {
        cout << str2[i];\
        this_thread::sleep_for(chrono::milliseconds(50));
    }

    return 0;
}
