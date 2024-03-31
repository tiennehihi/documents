/*
Chương trình sẽ được thực hiện tốt nhất dưới dạng chương trình nhiều tệp.Thiết kế một lớp chung để chứa thông tin sau về tài khoản ngân hàng:
    •Balance: số dư tài khoản
    •Number of deposits this month: Số tiền gửi trong tháng này
    •Number of withdrawals: Số lần rút tiền
    •Annual interest rate: Lãi suất hằng năm
    •Monthly service charges: Phí dịch vụ hàng tháng 
Lớp phải có các chức năng thành viên sau:
    •Hàm tạo: Chấp nhận các đối số cho số dư và lãi suất hàng năm.
    •deposit: Một chức năng ảo chấp nhận một đối số cho số tiền gửi. Hàm sẽ thêm đối số vào số dư tài khoản. 
    Nó cũng sẽ làm tăng biến số giữ số lượng tiền gửi.
    •withdraw: Một chức năng ảo chấp nhận một đối số cho số tiền rút. Hàm sẽ trừ đối số khỏi số dư. Nó cũng sẽ tăng biến số nắm giữ số lần rút tiền.
    •calcInt: Một chức năng ảo cập nhật số dư bằng cách tính lãi hàng tháng mà tài khoản kiếm được và cộng lãi này vào số dư. Điều này được thực hiện theo các công thức sau:
    Lãi suất hàng tháng = (Lãi suất hàng năm / 12) Tiền lãi hàng tháng = Số dư * lãi suất hàng tháng = Số dư + Tiền lãi hàng tháng
    •monthProc: Một hàm ảo trừ phí dịch vụ hàng tháng khỏi số dư, gọi hàm calcInt, sau đó đặt các biến giữ số lần rút tiền,
    số lần gửi tiền và phí dịch vụ hàng tháng bằng 0.
*/
#ifndef BANK_H
#define BANK_H

class Bank
{
        long long int Balanced; // số dư tài khoản đầu
        long long int Balancec; // số dư tài khoản cuối 
        long long int Nbdtm; // số tiền gửi trong tháng này
        long long int Nod; // số lần gửi tiền 
        long long int tienrut; // số tiền rút trong tháng này 
        long long int Now; // số lần rút tiền 
        long long int Air; // lãi suất hằng năm
        long long int Msc; // phí dịch vụ hàng tháng
    public:
        Bank(long long int b = 0, long long int c = 0, long long int d = 0, long long int m = 0, long long int a = 0)
        {
            setInfor(b, c, d, m, a);
            deposit(c);
            withdraw(d);
            monthProc();
        }
        void setInfor(long long int b = 0, long long int c = 0, long long int d = 0, long long int m = 0, long long int a = 0)
        {
            Balanced = b;
            Balancec = b;
            Nbdtm = c;
            tienrut = d;
            Msc = m;
            Air = a;
        }
        long long int getBalance()const {return Balanced;}
        void setMsc(long long int m) {Msc = m;}
        long long int getMsc()const {return Msc;}
        long long int getTienrut()const {return tienrut;}
        virtual void deposit(long long int b) 
        {
            Nbdtm = b;
            Balancec += b;
            Nod++;
        }
        virtual void withdraw(long long int n)
        {
            tienrut = n;
            Balancec-= n;
            Now++;   
        }
        virtual void calcInt()
        {
            long long int lsht = Air/12;
            long long int tlht = lsht*Balancec + Balancec;
        }
        virtual void monthProc()
        {
            Balancec -= Msc;
            calcInt();
            Nod = 0;
            Now = 0;
            Air = 0;
        }
        virtual void print()const 
        {
            cout << "So du dau ky: " << Balanced << endl;
            cout << "Tong so tien gui:  " << Nbdtm << endl;
            cout << "Tong so tien rut: " << tienrut << endl;
            cout << "Phi dich vu: " << Msc << endl;
            cout << "So du cuoi ki: " << Balancec << endl;
        }
        virtual ~Bank(){}


};

#endif