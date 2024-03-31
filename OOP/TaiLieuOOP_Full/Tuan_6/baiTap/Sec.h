/*
Tiếp theo, thiết kế một lớp tài khoản séc, cũng có nguồn gốc từ lớp tài khoản chung. 
    Nó phải có các chức năng thành viên sau:
    •withdraw: Trước khi hàm lớp cơ sở được gọi, hàm này sẽ xác định xem liệu việc rút tiền (một tờ séc được viết) có khiến số dư xuống dưới $ 0 hay không. 
    Nếu số dư dưới $ 0, phí dịch vụ $ 15 sẽ được tính từ tài khoản. (Việc rút tiền sẽ không được thực hiện.) 
    Nếu không có đủ trong tài khoản để thanh toán phí dịch vụ, số dư sẽ trở nên thiếu và khách hàng sẽ nợ ngân hàng số tiền âm.
    •monthProc: Trước khi hàm lớp cơ sở được gọi, 
    hàm này sẽ thêm phí hàng tháng là 5 đô la cộng với 0,10 đô la cho mỗi lần rút tiền (bằng văn bản séc) vào biến lớp cơ sở chứa phí dịch vụ hàng tháng.
*/

#ifndef SEC_H
#define SEC_H

#include "Bank.h"

class Sec: public Bank
{
    public:
        Sec(long long int b = 0, long long int c = 0, long long int d = 0, long long int m = 0, long long int a = 0)
        {
            Bank::setInfor(b, c, d, m, a);
            Bank::deposit(c);
            withdraw(d);
            monthProc();
        }
        void withdraw(long long int n)
        {
            if (n > getBalance())
            {
                setMsc(15);
                if (getBalance() < 15) cout << "Khach hang no ngan hang so tien: " << "$ " << 15 - getBalance() << endl;
            }
            else Bank::withdraw(n);
        }
        void monthProc()
        {
            setMsc(5);
            withdraw(getTienrut());
            setMsc(getMsc()+0.01);
            Bank::monthProc();
        }
        void print()const 
        {
            Bank::print();
        }
     

};

#endif
