/*
Viết lớp Duration mô tả một lượng thời gian, gồm có các thành viên:
• Giờ,  phút,  giây,  biết rằng các biến luôn được chuẩn hoá để số giây  trong  khoảng [0.59], 
số phút trong khoảng [0,59], số giờ thì không giới hạn. 
Vd nếu nhập lượng thời gian là 7 tiếng 59 phút 70 giây thì nó sẽ được chuẩn hoá lại thành 8 tiếng 0 phút 10 giây. 
• Hàm simplify() cho sẵn sẽ chuẩn hoá dữ liệu thời gian 
• Một hàm setter thiết lập giá trị cho cả giờ, phút giây 
• Hàm tạo 3 tham số với 3 đối mặc định là 0, khởi tạo cho giờ, phút, giây
• Một toán tử== giúp gán một lượng thời gian bằng một lượng thời gian 
• Một toán tử-- giúp giảm một lượng thời gian đi một số nguyên n phút nào đó. 
• Một toán tử++ kiểu hậu tố giúp tăng số phút thêm 5 đơn vị và số giây thêm 20 đơn vị.
*/

#include <iostream>
using namespace std;
class Duration {
private:
    int hour;
    int minute;
    int second;

public:
    Duration(int h = 0, int m = 0, int s = 0) : hour(h), minute(m), second(s) {
        simplify();
    }

    void set(int h, int m, int s) {
        hour = h;
        minute = m;
        second = s;
        simplify();
    }

    void simplify() {
        if (second > 59) {
            int minToAdd = second / 60;
            minute += minToAdd;
            second %= 60;
        } else if (second < 0) {
            int minToSubtract = (abs(second) / 60) + 1;
            minute -= minToSubtract;
            second = 60 - (abs(second) % 60);
        }

        if (minute > 59) {
            int hourToAdd = minute / 60;
            hour += hourToAdd;
            minute %= 60;
        } else if (minute < 0) {
            int hourToSubtract = (abs(minute) / 60) + 1;
            hour -= hourToSubtract;
            minute = 60 - (abs(minute) % 60);
        }
    }
    // void simplify(){    // hàm chuẩn hoá
    //     int minute;   
    //     if(second > 59){
    //         minute = minute + (second/60);
    //         second = second%60; 
    //     }else if(second < 0){
    //         minute -= abs(second) / 60+ 1;
    //         second = 60-abs(second) % 60;
    //     }
    //     if(minute > 59){
    //         hour += minute/60;
    //         minute %= 60; 
    //     }else if(minute < 0) {
    //         hour -= abs(minute) / 60+ 1;
    //         minute = 60-abs(minute) % 60;
    //     }
    // }
        

    Duration operator--(int n) {
        Duration tmp(*this);
        minute -= n;
        simplify();
        return tmp;
    }

    Duration operator++(int) {
        Duration tmp(*this);
        minute += 5;
        second += 20;
        simplify();
        return tmp;
    }

    bool operator==(const Duration &other) const {
        return (hour == other.hour) && (minute == other.minute) && (second == other.second);
    }

    void print() {
        cout << "Hour: " << hour << ", Minute: " << minute << ", Second: " << second << endl;
    }
};

int main() {
    Duration d1(7, 59, 70);
    Duration d2 = d1;

    d1.print();
    d2.print();

    d1--;
    d1.print();

    d2++;
    d2.print();

    if (d1 == d2) {
        cout << "d1 = d2" << endl;
    } else {
        cout << "d1 != d2" << endl;
    }

    return 0;
}






































// #include <bits/stdc++.h>
// using namespace std;
// class Duration{
//     private:
//         int sec;
//         int min;
//         int hour;
//     public:
//         Duration(int s=0, int m=0, int h=0){
//             sec = s;
//             min = m;
//             hour = h;
//         }
//         void setter(int giay, int phut, int gio){
//             sec = giay;
//             min = phut;
//             hour = gio;
//         }
//         int getSec() const { return sec; }
//         int getMin() const { return min; }
//         int getHour() const { return hour; }

//         void simplify(){    // hàm chuẩn hoá
//             int min;   
//             if(sec > 59){
//                 min = min + (sec/60);
//                 sec = sec%60; 
//             }else if(sec < 0){
//                 min -= abs(sec) / 60+ 1;
//                 sec = 60-abs(sec) % 60;
//             }
//             if(min > 59){
//                 hour += min/60;
//                 min %= 60; 
//             }else if(min < 0) {
//                 hour -= abs(min) / 60+ 1;
//                 min = 60-abs(min) % 60;
//             }
//         }
//         void print(){
//             cout << "So giay la: "<< sec << endl;
//             cout << "So phut la: "<< min << endl;
//             cout << "So gio la: "<< hour << endl;
//         }
//         Duration operator--(){
//             int n;
//             sec -= n;
//             min -= n;
//             hour -= n;
//             return *this;
//         }
//         Duration operator++(){
//             Duration tmp = *this;
//             sec = sec+20;
//             min = min+5;
//             return tmp;
//         }

// };

// int main(){
//     Duration a(70, 61, 1);
//     a.simplify();
//     a.print();
//     return 0;
// }