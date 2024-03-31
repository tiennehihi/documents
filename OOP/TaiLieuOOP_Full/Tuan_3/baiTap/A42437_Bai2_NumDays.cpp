/*
NumDays 
Thiết kế lớp NumDays để lưu trữ số giờ làm việc và chuyển đổi nó thành số ngày làm việc. 
Ví dụ: 8 giờ được coi là 1 ngày làm việc, 12 giờ đổi thành 1,5 ngày làm và 18 giờ đổi thành 2,25 ngày làm. 
Lớp gồm các thành viên:
•hour: lưu trữ số giờ làm việc
•day: lưu trữ số ngày làm việc
•Hàm tạo 1 tham số gán giá trị cho số giờ làm việc.
•Các hàm cập nhật, truy xuất hour, day.
•Nạp chồng toán tử+: trả về tổng số giờ của hai đối tượng.
•Nạp chồng toán tử-: trả về hiệu số giờ của hai đối tượng.
•Nạp chồng toán tử++ tiền tố và hậu tố sẽ tăng số giờ làm việc thêm 1 giờ. Khi tăng, số ngày sẽ được tự động tính lại.
•Nạp chồng toán tử-- tiền tố và hậu tố sẽ giảm số giờ làm việc đi 1 giờ. Khi giảm, số ngày sẽ được tự động tính lại
*/

#include <iostream>
using namespace std;

class NumDays {
private:
    double hour;
    double day;

public:
    NumDays(double h) : hour(h) {
        calculateDays();
    }

    void setHours(double h) {
        hour = h;
        calculateDays();
    }

    double getHours() const {
        return hour;
    }

    double getDays() const {
        return day;
    }

    void calculateDays() {
        day = hour / 8.0; // Mỗi ngày làm việc 8 giờ
    }

    NumDays operator+(const NumDays &other) const {
        return NumDays(hour + other.hour);
    }

    NumDays operator-(const NumDays &other) const {
        return NumDays(hour - other.hour);
    }

    NumDays operator++() {
        ++hour;
        calculateDays();
        return *this;
    }

    NumDays operator++(int) {
        NumDays temp(*this);
        hour++;
        calculateDays();
        return temp;
    }

    NumDays operator--() {
        --hour;
        calculateDays();
        return *this;
    }

    NumDays operator--(int) {
        NumDays temp(*this);
        hour--;
        calculateDays();
        return temp;
    }
};

int main() {
    NumDays workHours1(8); // 8 giờ làm việc
    NumDays workHours2(12); // 12 giờ làm việc

    NumDays totalHours = workHours1 + workHours2;
    NumDays diffHours = workHours2 - workHours1;

    cout << "Tong gio: " << totalHours.getHours() << ", Tong ngay: " << totalHours.getDays() << endl;
    cout << "Gio chenh lech: " << diffHours.getHours() << ", Ngay chenh lech: " << diffHours.getDays() << endl;

    ++workHours1;
    cout << "Cap nhat gio: " << workHours1.getHours() << ", Cap nhat ngay: " << workHours1.getDays() << endl;

    --workHours2;
    cout << "Cap nhat gio: " << workHours2.getHours() << ", Cap nhat ngay: " << workHours2.getDays() << endl;

    return 0;
}


































// #include <iostream>
// using namespace std;
// class NumDays{
//     private: 
//         double hour;
//         double day;
//     public:
//         NumDays(double gio = 0, double ngay = 0){
//             hour = gio;
//             day = ngay;
//         }
//         void set(double h, double d){
//             hour = h;
//             day = d;
//         }
//         double getHour() const { return hour; }
//         double getDay() const { return day; }

//         void print(){
//             cout <<"So gio la: "<<hour<<endl;
//             cout <<"So ngay la: "<<hour/8<<endl;
//         }
        
//         // Nạp chồng toán tử+: trả về tổng số giờ của hai đối tượng.
//         NumDays operator + (NumDays b){
//             NumDays c;
//             c.set(hour + b.hour, day + b.day);
//             return c;
//         }
//         // // Nạp chồng toán tử-: trả về hiệu số giờ của hai đối tượng.
//         // NumDays operator - (NumDays b){
//         //     NumDays c;
//         //     c.set(hour - b.hour, day - b.day);
//         //     return c;
//         // }
//         // // Nạp chồng toán tử ++ tiền tố tăng thêm 1h
//         // NumDays &operator++(){
//         //     hour += 1;
//         //     return *this;
//         // }
//         // // Nạp chồng toán tử ++ hậu tố tăng thêm 1h
//         // NumDays operator++(int){
//         //     NumDays tmp = *this;
//         //     hour += 1;
//         //     return tmp;
//         // }

//         // Nạp chồng toán tử -- tiền tố giảm 1h
//         NumDays &operator--(){
//             hour -= 1;
//             return *this;
//         }
//         // Nạp chồng toán tử -- hậu tố giảm 1h
//         NumDays operator--(int){
//             NumDays tmp = *this;
//             hour -= 1;
//             return tmp;
//         }
        

// };

// int main(){
//     NumDays a, b;
//     a.set(20, 15);
//     b.set(10, 5);
//     // NumDays c = a+b;
//     // c.print();
//     cout << "Tien to: \n";
//     (--a).print();
//     cout << "\nHau to: \n";
//     (a--).print();
//     return 0;
// }