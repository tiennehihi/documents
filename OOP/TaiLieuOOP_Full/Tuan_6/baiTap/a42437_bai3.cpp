/*
Chương trình này nên được thiết kế và viết bởi một nhóm sinh viên. Đây là một vài gợi ý:
    •Một hoặc nhiều học sinh có thể làm việc trong một lớp học.
    •Các yêu cầu của chương trình nên được phân tích để mỗi học sinh được giao cho khối lượng công việc như nhau.
    •Các tham số và kiểu trả về của từng hàm và hàm thành viên lớp nên được quyết định trước.
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
    Lãi suất hàng tháng = (Lãi suất hàng năm / 12) Tiền lãi hàng tháng = Số dư * Số dư lãi suất hàng tháng = Số dư + Tiền lãi hàng tháng
    •monthProc: Một hàm ảo trừ phí dịch vụ hàng tháng khỏi số dư, gọi hàm calcInt, sau đó đặt các biến giữ số lần rút tiền,
    số lần gửi tiền và phí dịch vụ hàng tháng bằng 0.
Tiếp theo, thiết kế một lớp tài khoản séc, cũng có nguồn gốc từ lớp tài khoản chung. Nó phải có các chức năng thành viên sau:
    •withdraw: Trước khi hàm lớp cơ sở được gọi, hàm này sẽ xác định xem liệu việc rút tiền (một tờ séc được viết) có khiến số dư xuống dưới $ 0 hay không. 
    Nếu số dư dưới $ 0, phí dịch vụ $ 15 sẽ được tính từ tài khoản. (Việc rút tiền sẽ không được thực hiện.) 
    Nếu không có đủ trong tài khoản để thanh toán phí dịch vụ, số dư sẽ trở nên thiếu và khách hàng sẽ nợ ngân hàng số tiền âm.
    •monthProc: Trước khi hàm lớp cơ sở được gọi, 
    hàm này sẽ thêm phí hàng tháng là 5 đô la cộng với 0,10 đô la cho mỗi lần rút tiền (bằng văn bản séc) vào biến lớp cơ sở chứa phí dịch vụ hàng tháng.
Viết một chương trình hoàn chỉnh thể hiện các lớp này bằng cách yêu cầu người dùng nhập số tiền gửi và rút tiền cho tài khoản tiết kiệm và tài khoản séc. 
Chương trình sẽ hiển thị số liệu thống kê trong tháng, bao gồm số dư đầu kỳ, tổng số tiền gửi, tổng số tiền rút, phí dịch vụ và số dư cuối kỳ
*/

#include <iostream>
using namespace std;

#include "Sec.h"

int main()
{
    long long int a, b, c, d, e;
    cout << "Nhap vao so du, so tien gui, so tien rut, phi dich vu va lai suat hang nam: ";
    cin >> a >> b >> c >> d >> e;
    Bank tk(a, b, c, d, e);
    Bank *tks;
    tks = new Sec(a, b, c, d, e);
    //tk.print();
    tks->print();
    return 0;
}