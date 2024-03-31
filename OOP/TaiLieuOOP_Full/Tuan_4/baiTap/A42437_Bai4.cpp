/*
Có 2 dạng lưu trữ thời gian là dạng  chuẩn và dạng quân đội với quy tắc sau:
    •4h 5 phút 20 giây trong dạng chuẩn sẽ lưu thành 4, 5, 20 ứng với giờ  phút giây, 
    còn trong dạng quân đội sẽ lưu thành bộ chỉ có hai số 405, 20  ứng với “giờ quân đội” và giây.
Thiết kế lớp MilTime kế thừa lớp Time. Viết class MilTime kế thừa từ class Time ở trên, 
cho phép nhập vào thời gian dạng quân đội và chuyển thành dữ liệu giờ dạng chuẩn 
    Lớp phải có các biến thành viên sau:
    ●milHours: Lưu giờ định dạng quân sự. Ví dụ: 6:00 sáng sẽ được lưu là 600 giờ và 4:30 chiều sẽ được lưu là 1630 giờ.
    ●milSeconds:Lưu giây ở định dạng chuẩn.
    ●Hàm setTime: nhận đối số để lưu vào milHours và milSeconds.
     Sau đó, thời gian sẽ được chuyển đổi thành thời gian chuẩn và lưu trong các biến hour, min, sec của lớp Time.
    •Hàm tạo nhận 2 tham số giờ và giây ở định dạng quân sự. 
     Sau đó, thời gian sẽ được chuyển đổi thành thời gian chuẩn và lưu trong các biến hour, min, sec của lớp Time.
    •Hàm getHour: Trả về giờ ở định dạng giờ quân sự. 
    •Hàm getStandHr: Trả về giờ ở định dạng chuẩn.
    Demo lớp trong một chương trình. 
    Chương trình yêu cầu người dùng nhập thời gian ở định dạng quân sự rồi hiển thị thời gian ở cả định dạng quân sự và tiêu chuẩn.
    Xác thực đầu vào: Với lớp Time, sinh viên tự xác định tiêu chuẩn đầu vào phù hợp. 
    Với lớp MilTime, không chấp nhận milHours lớn hơn 2359 hoặc nhỏ hơn 0. Không chấp nhận milSeconds lớn hơn 59 hoặc nhỏ hơn 0.
*/

#include <iostream>
using namespace std;

class Time
{
    protected:
        int hour, min, sec;
        int checkH(int h)
        {
            if (h > 24 || h < 0) throw "LOi!";
            return h;
        }
        int checkM(int m)
        {
            if (m > 59 || m < 0) throw "LOI!";
            return m;
        }
        int checkS(int s)
        {
            if (s > 59 ||s < 0) throw "LOI!";
            return s;
        }
    public:
        Time(): hour(0), min(0), sec(0){}
        Time(int h, int m, int s): hour(checkH(h)), min(checkM(m)), sec(checkS(s)){}
        int getHour()const {return hour;}
        int getMin()const {return min;}
        int getSec()const {return sec;}
};

class MilTime: public Time
{
        int milHours, milSeconds;
        int checkHours(int m)
        {
            if (m > 2359 || m < 0) throw "LOI!";
            return m;  
        }
        int checkSeconds(int s)
        {
            if (s > 59 || s < 0) throw "LOI!";
            return s;
        }
    public:
        void setTime(int h, int s)
        {
            milHours =  checkHours(h);
            milSeconds = checkHours(s);
            hour = milHours / 100;
            min = milHours % 100;
            sec = milSeconds;
        }
        MilTime(int milHours, int milSeconds)
        {
            this->milHours = checkHours(milHours);
            this->milSeconds = checkSeconds(milSeconds);
            hour = milHours / 100;
            min = milHours % 100;
            sec = milSeconds;
        }
        int getHour()const
        {
            return milHours;
        }
        int getSecond()const
        {
            return milSeconds;
        }
        int getStandHr()const 
        {
            return hour;
        }
};

int main()
{
    try
    {
        int h, s;
        cout<<"Nhap vao thoi gian dinh dang quan su: ";
        cin>>h>>s;
        MilTime a(h, s);
        cout<<"Gio quan su: "<<a.getHour()<<", "<<a.getSecond()<<endl;
        cout<<"Gio tieu chuan: "<<a.getStandHr()<<", "<<a.getMin()<<", "<<a.getSec()<<endl;
    }
    catch(const char * s)
    {
        cout<<s<<endl;
    }
    return 0;
}


