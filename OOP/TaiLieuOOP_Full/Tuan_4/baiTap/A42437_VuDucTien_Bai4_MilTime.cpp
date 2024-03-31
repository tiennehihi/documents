/*
4.Time & MilTime
Có 2 dạng lưu trữ thời gian là dạng chuẩn và dạng quân đội với quy tắc sau:
•4h 5 phút 20 giây trong dạng chuẩn  sẽ lưu thành 4, 5, 20 
ứng với giờ  phút giây, còn trong dạng quân đội  sẽ lưu thành bộ chỉ có hai số 405, 20  
ứng với “giờ quân đội” và giây.
Lớp Time có khai báo và cài đặt như sau: 
...
Thiết kế lớp MilTime kế thừa lớp Time.
Viết class MilTime kế thừa từ class Time ở trên, 
cho phép nhập vào thời gian dạng quân đội và chuyển thành dữ liệu giờ dạng chuẩn
Lớp phải có các biến thành viên sau:
●milHours: Lưu giờ định dạng quân sự. 
Ví dụ: 6:00 sáng sẽ được lưu là 600 giờ và 4:30 chiều sẽ được lưu là 1630 giờ.
●milSeconds:Lưu giây ở định dạng chuẩn.
●Hàm setTime: nhận đối số để lưu vào milHours và milSeconds. 
Sau đó, thời gian sẽ được chuyển đổi thành thời gian chuẩn và lưu trong các biến hour, min, sec của lớp Time. 
•Hàm tạo nhận 2 tham số giờ và giây ở định dạng quân sự. 
Sau đó, thời gian sẽ ược chuyển đổi thành thời gian chuẩn và lưu trong các biến hour, min, seccủa lớp Time.
•Hàm getHour: Trả về giờ ở định dạng giờ quân sự.  
•Hàm getStandHr: Trả về giờ ở định dạng chuẩn.
Demo lớp trong một chương trình. Chương trình yêu cầu người dùng nhập thời gian ở định dạng quân sự rồi 
hiển thị thời gian ở cả định dạng quân sự và tiêu chuẩn.
Xác thực đầu vào: 
Với lớp Time, sinh viên tự xác định tiêu chuẩn đầu vào phù hợp. 
Với lớp MilTime, không chấp nhận milHours lớn hơn 2359 hoặc nhỏ hơn 0. Không chấp nhận milSeconds lớn hơn 59 hoặc nhỏ hơn 0.
*/
// #include <bits/stdc++.h>
// using namespace std;
// class Time{
//     protected:
//         int hour, min, sec;
//     public:
//         Time():hour(0), min(0), sec(0){}
//         Time(int h, int m, int s): hour(h), min(m), sec(s){}
//         int getHour() const{ return hour; }
//         int getMin() const{ return min; }
//         int getSec() const{ return sec; }
// };
// class MilTime: public Time{
        

// };



// int main(){

//     return 0;
// }

#include <iostream>
using namespace std;

class Time {
protected:
    int hour;
    int min;
    int sec;

public:
    Time() : hour(0), min(0), sec(0) {}

    Time(int h, int m, int s) : hour(h), min(m), sec(s) {}

    void setTime(int h, int m, int s) {
        hour = h;
        min = m;
        sec = s;
    }

    int getHour() const { return hour; }
    int getMin() const { return min; }
    int getSec() const { return sec; }
};

class MilTime : public Time {
private:
    int milHours;
    int milSeconds;

public:
    MilTime(int h, int s) : milHours(h), milSeconds(s) {
        setTime(milHours / 100, milHours % 100, s);
    }

    void setTime(int h, int m, int s) {
        milHours = h * 100 + m;
        milSeconds = s;
        if(m > 59) {
            cout << "ERROR!\n";
        } else {
            Time::setTime(h, m, s);
        }
    }

    int getHour() const { return milHours; }

    int getStandHr() const {
        int standHour = (milHours % 100) % 12;
        if (standHour == 0) {
            standHour = 12;
        }
        return standHour;
    }
};

int main() {
    int milHours, milSeconds;
    cout << "Enter military time (HHMMSS): ";
    cin >> milHours >> milSeconds;

    if (milHours >= 0 && milHours <= 2359 && milSeconds >= 0 && milSeconds <= 59) {
        MilTime mt(milHours, milSeconds);
        cout << "Military Time: " << mt.getHour() << endl;
        cout << "Standard Time: " << mt.getStandHr() << ":" << mt.getMin() << ":" << mt.getSec() << endl;
    } else {
        cout << "Invalid input. MilHours should be between 0 and 2359, and milSeconds between 0 and 59." << endl;
    }

    return 0;
}
