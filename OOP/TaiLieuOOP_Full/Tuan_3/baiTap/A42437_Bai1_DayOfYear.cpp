/*
1.DayOfYearGiảsửrằng một năm có 365 ngày. 
Thiết kếlớp DayOfYear lấy một số nguyên đại diện cho ngày trong năm và chuyển nó thành một chuỗi dạng tháng ngày.
Ví dụ:Ngày 2 sẽlà January 2.Ngày 32 sẽ là February 1. Ngày 365 sẽ là December 31.
Lớp gồm các thành viên:
•Một biến thành viên số nguyên để đại diện cho ngày 
•Biến tĩnh chứa các chuỗi có thể được sử dụng để hỗ trợ việc dịch từ định dạng số nguyên sang định dạng tháng ngày.
•Hàm tạo nhận tham số là một số nguyên đại diện cho ngày trong năm. 
•Hàm print()in ngày ở định dạng tháng ngày. 
Viết chương trình demo lớp trên. 
Chương trình yêu cầu  nhập  các  số nguyên  khác  nhau biểu thị ngày và in ra biểu diễn của chúng ở định dạng tháng ngày
*/

#include <iostream>
#include <string>
using namespace std;

class DayOfYear {
private:
    int day;
    static string months[];
    static int monthDays[];

public:
    DayOfYear(int d) : day(d) {}

    void print() const {
        if (day < 1 || day > 365) {
            cout << "Invalid day." << endl;
            return;
        }

        int month = 0;
        int remainingDays = day;
        while (remainingDays > monthDays[month]) {
            remainingDays -= monthDays[month];
            month++;
        }

        cout << months[month] << " " << remainingDays << endl;
    }
};

string DayOfYear::months[] = {"January", "February", "March", "April", "May", "June",
                              "July", "August", "September", "October", "November", "December"};

int DayOfYear::monthDays[] = {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};

int main() {
    int dayNumber;
    cout << "Nhap ngay: ";
    cin >> dayNumber;

    DayOfYear dayOfYear(dayNumber);
    dayOfYear.print();

    return 0;
}































// #include <bits/stdc++.h>
// using namespace std;
// class DayOfYear{
//     private:
//         int day;
//         static string month[];
//         static int monthInt[];
//         static int days[];
//     public:
//         DayOfYear(int);
//         DayOfYear(string, int);
//         void print();
// };
// DayOfYear::DayOfYear(int day){
//    if(day<0||day>365){
//     cout << "Error" << endl;
//    } else {
//     this -> day = day;
//    }
// }

// DayOfYear::DayOfYear(string month, int day){
//     this -> day = day;
// }
// void DayOfYear::print(){
//     if(day >=1 && day <= 31){
//         cout << "Ngay thu "<< day << " la: "<< month[0] << "  "<< day << endl;  // January 31
//     }
//     else if(day >= 32 && day <= 60){
//         cout << "Ngay thu "<< day << " la: "<< month[1] << "  "<< day - 31 << endl;  // February 29
//     }
//     else if (day >= 61 && day <= 91){
//         cout << "Ngay thu "<< day << " la: "<< month[2] << "  "<< day - 60 << endl; // March 31
//     }
//     else if (day >= 92 && day <= 121){
//         cout << "Ngay thu "<< day << " la: "<< month[3] << "  "<< day - 91 << endl;  // April 30
//     }
//     else if (day >= 122 && day <= 152){
//         cout << "Ngay thu "<< day << " la: "<< month[4] << "  "<< day - 121 << endl;  // May 31
//     }
//     else if (day >= 153 && day <= 182){
//         cout << "Ngay thu "<< day << " la: "<< month[5] << "  "<< day - 152 << endl;  // June 30
//     }
//     else if (day >= 183 && day <= 213){
//         cout << "Ngay thu "<< day << " la: "<< month[6] << "  "<< day - 182 << endl;  // July 31
//     }
//     else if (day >= 214 && day <= 244){
//         cout << "Ngay thu "<< day << " la: "<< month[7] << "  "<< day - 213 << endl;  // August 31
//     }
//     else if (day >= 245 && day <= 274){
//         cout << "Ngay thu "<< day << " la: "<< month[8] << "  "<< day - 244 << endl;  // September 30
//     }
//     else if (day >= 275 && day <= 305){
//         cout << "Ngay thu "<< day << " la: "<< month[9] << "  "<< day - 274 << endl;  // October 31
//     }
//     else if (day >= 306 && day <= 334){
//         cout << "Ngay thu "<< day << " la: "<< month[10] << "  "<< day - 305 << endl;  // November 30
//     }
//     else if (day >= 335 && day <= 365){
//         cout << "Ngay thu "<< day << " la: "<< month[11] << "  "<< day - 334 << endl;  // December 31
//     }
// }

// string DayOfYear::month[]={"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"};
// int DayOfYear::monthInt[]={1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12};
// int DayOfYear::days[]={1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31};

// int main(){
//     int number;
//     do {
//         cout << "Nhap ngay: "; cin>>number;
//         DayOfYear test(number);
//         if(number>=0 && number<=365){
//             test.print();
//         }
//         cout << endl;
//     } while (number!=-1);
// }