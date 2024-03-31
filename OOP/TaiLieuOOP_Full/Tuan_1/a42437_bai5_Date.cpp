/*
5.Date.
Thiết kếlớp Date
gồm các thành viên: month, day và year, hàm thành viên để in Date ở các dạng sau:
12/25/2014 
December 25, 2014 
25 December 2014
Viết một chương trình hoàn chỉnh đểdemo lớp trên
Xác thực đầu vào: Không chấp nhận day lớn hơn 31 hoặc nhỏ hơn 1. Không chấp nhận month lớn hơn 12 hoặc nhỏ hơn 1.
*/
// #include<bits/stdc++.h>
// using namespace std;
// class Date{
//     private:
//         int month;
//         int day;
//         int year;
//     public:
//         Date(int m, int d, int y){
//             month = m;
//             day = d;
//             year = y;
//         }
//         // void setMonth(int m){
//         //     month = m;
//         // }
//         // void setDay(int d){
//         //     day = d;
//         // }
//         // void setYear(int y){
//         //     year = y;
//         // }
//         int getMonth(){ return month; }
//         int getDay(){ return day; }
//         int getYear(){ return year; }

// };
// int main(){
//     int m, d, y;
//     cout<<"Nhap thang: ";
//     cin>>m;
//     while(m<1 || m>12){
//         cout<<"Nhap lai thang: ";
//         cin>>m;
//     }
//     cout<<"Nhap ngay: ";
//     cin>>d;
//     while(d<1 || d>31){
//         cout<<"Nhap lai ngay: ";
//         cin>>d;
//     }
//     cout<<"Nhap nam: ";
//     cin>>y;
//     while(y<0){
//         cout<<"Nhap lai nam: ";
//         cin>>m;
//     }
//     Date v1(m, d, y);
//     cout<<v1.getDay()<<"/"<<v1.getMonth()<<"/"<<v1.getYear()<<endl;
//     return 0;
// }


#include <iostream>
#include <string>
using namespace std;

class Date {
private:
    int month;
    int day;
    int year;

public:
    // Constructor
    Date(int m, int d, int y) : month(m), day(d), year(y) {}

    // Phương thức kiểm tra ngày hợp lệ
    bool isValidDate() {
        if (month < 1 || month > 12 || day < 1 || day > 31) {
            return false;
        }
        return true;
    }

    // Phương thức in ngày theo định dạng "12/25/2014"
    void printFormat1() {
        if (isValidDate()) {
            cout << month << "/" << day << "/" << year << endl;
        } else {
            cout << "Invalid Date!" << endl;
        }
    }

    // Phương thức in ngày theo định dạng "December 25, 2014"
    void printFormat2() {
        if (isValidDate()) {
            string monthNames[] = {"", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"};
            cout << monthNames[month] << " " << day << ", " << year << endl;
        } else {
            cout << "Invalid Date!" << endl;
        }
    }

    // Phương thức in ngày theo định dạng "25 December 2014"
    void printFormat3() {
        if (isValidDate()) {
            string monthNames[] = {"", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"};
            cout << day << " " << monthNames[month] << " " << year << endl;
        } else {
            cout << "Invalid Date!" << endl;
        }
    }
};

int main() {
    int m, d, y;

    cout << "Enter month, day, and year: ";
    cin >> m >> d >> y;

    Date date(m, d, y);

    cout << "Format 1: ";
    date.printFormat1();

    cout << "Format 2: ";
    date.printFormat2();

    cout << "Format 3: ";
    date.printFormat3();

    return 0;
}
