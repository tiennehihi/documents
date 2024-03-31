/*
3. Bank Accounts 
Chương trình sẽ được thực hiện tốt nhất dưới dạng chương trình nhiều tệp.Thiết kế một 
lớp chung để chứa thông tin sau về tài khoản ngân hàng:
• Balance: số dư tài khoản
• Number of deposits this month: Số tiền gửi trong tháng này
• Number of withdrawals: Số lần rút tiền
• Annual interest rate: Lãi suất hằng năm
• Monthly service charges: Phí dịch vụ hàng tháng

Lớp phải có các chức năng thành viên sau:
• Hàm tạo: Chấp nhận các đối số cho số dư và lãi suất hàng năm.
• deposit: Một chức năng ảo chấp nhận một đối số cho số tiền gửi. 
Hàm sẽ thêm đối số vào số dư tài khoản. 
Nó cũng sẽ làm tăng biến số giữ số lượng tiền gửi.
• withdraw: Một chức năng ảo chấp nhận một đối số cho số tiền rút. 
Hàm sẽ trừ đối số khỏi số dư. 
Nó cũng sẽ tăng biến số nắm giữ số lần rút tiền.
• calcInt: Một chức năng ảo cập nhật số dư bằng cách tính lãi hàng tháng mà tài 
khoản kiếm được và cộng lãi này vào số dư. 
Điều này được thực hiện theo các công thức sau: 
Lãi suất hàng tháng = (Lãi suất hàng năm / 12) 
Tiền lãi hàng tháng = Số dư * Số dư lãi suất hàng tháng = Số dư + Tiền lãi hàng tháng
• monthProc: Một hàm ảo trừ phí dịch vụ hàng tháng khỏi số dư, gọi hàm calcInt, 
sau đó đặt các biến giữ số lần rút tiền, số lần gửi tiền và phí dịch vụ hàng tháng 
bằng 0. 
*/
// balance (số dư): Biến này lưu trữ số dư hiện tại trong tài khoản ngân hàng. 
// Đây là số tiền mà tài khoản đang có sau khi thực hiện gửi tiền hoặc rút tiền.

// numDeposits (số tiền gửi trong tháng này): Biến này lưu trữ số lượng lần gửi tiền trong tháng hiện tại. 
// Nó được sử dụng để kiểm tra xem người dùng đã thực hiện bao nhiêu giao dịch gửi tiền trong tháng.

// numWithdrawals (số lần rút tiền): Biến này lưu trữ số lần rút tiền trong tháng hiện tại. 
// Nó được sử dụng để kiểm tra xem người dùng đã thực hiện bao nhiêu giao dịch rút tiền trong tháng.

// annualInterestRate (lãi suất hàng năm): Biến này lưu trữ lãi suất hàng năm được áp dụng cho số dư trong tài khoản. 
// Nó được sử dụng để tính toán tiền lãi hàng tháng.

// monthlyServiceCharges (phí dịch vụ hàng tháng): Biến này lưu trữ tổng số phí dịch vụ hàng tháng mà tài khoản ngân hàng phải trả. 
// Nó bao gồm các loại phí dịch vụ như phí rút tiền, phí dịch vụ hàng tháng và các loại phí khác.

#include <iostream>
using namespace std;

class BankAccount {
protected:
    double balance;
    int numDeposits;
    int numWithdrawals;
    double annualInterestRate;
    double monthlyServiceCharges;

public:
    BankAccount(double bal, double rate)
        : balance(bal), annualInterestRate(rate),
          numDeposits(0), numWithdrawals(0), monthlyServiceCharges(0) {}

    virtual void deposit(double amount) {
        balance += amount;
        numDeposits++;
    }

    virtual void withdraw(double amount) {
        balance -= amount;
        numWithdrawals++;
    }

    virtual void calcInt() {
        double monthlyInterestRate = annualInterestRate / 12.0;
        double monthlyInterest = balance * monthlyInterestRate;
        balance += monthlyInterest;
    }

    virtual void monthProc() {
        balance -= monthlyServiceCharges;
        calcInt();
        numWithdrawals = 0;
        numDeposits = 0;
        monthlyServiceCharges = 0;
    }

    double getBalance() const {
        return balance;
    }

    int getNumDeposits() const {
        return numDeposits;
    }

    int getNumWithdrawals() const {
        return numWithdrawals;
    }

    double getAnnualInterestRate() const {
        return annualInterestRate;
    }

    double getMonthlyServiceCharges() const {
        return monthlyServiceCharges;
    }
};

class SavingsAccount : public BankAccount {
public:
    SavingsAccount(double bal, double rate) : BankAccount(bal, rate) {}

    void withdraw(double amount) override {
        if (numWithdrawals >= 3) {
            monthlyServiceCharges += 1.0; // Charge a fee after 3 withdrawals
        }
        BankAccount::withdraw(amount);
    }

    void monthProc() override {
        if (numWithdrawals > 4) {
            monthlyServiceCharges += (numWithdrawals - 4); // Charge fee for extra withdrawals
        }
        BankAccount::monthProc();
    }
};

class CheckingAccount : public BankAccount {
public:
    CheckingAccount(double bal, double rate) : BankAccount(bal, rate) {}

    void withdraw(double amount) override {
        if (balance - amount < 0) {
            monthlyServiceCharges += 15.0; // Charge an overdraft fee
        }
        BankAccount::withdraw(amount);
    }

    void monthProc() override {
        monthlyServiceCharges += 5.0; // Charge monthly service fee
        BankAccount::monthProc();
    }
};

int main() {
    SavingsAccount savings(1000.0, 0.03);
    CheckingAccount checking(500.0, 0.02);

    savings.deposit(100.0);
    checking.deposit(200.0);

    savings.withdraw(50.0);
    checking.withdraw(100.0);

    savings.monthProc();
    checking.monthProc();

    cout << "Savings Account Balance: $" << savings.getBalance() << endl;
    cout << "Checking Account Balance: $" << checking.getBalance() << endl;

    return 0;
}
