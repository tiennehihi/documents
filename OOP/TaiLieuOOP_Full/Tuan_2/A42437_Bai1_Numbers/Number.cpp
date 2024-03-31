#include <iostream>
#include <string>
#include "ClassNumbers.h"

using namespace std;
// các số nhỏ hơn 20 thì sẽ có quy tắc đọc khác nên tách riêng ra 1 mảng các số nhỏ hơn 20
string Numbers::lessThan20[] = {"zero", "one", "two", "three", "four", "five",
                                "six", "seven", "eight", "nine", "ten", "eleven",
                                "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
                                "seventeen", "eighteen", "nineteen"};
// Các chữ số hàng chục tròn từ 10 - 90
string Numbers::tens[] = {"twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "nighty"};
// Hàng trăm
string Numbers::hundred = "hundred";
// Hàng nghìn
string Numbers::thousand = "thousand";

// Toán tử "::" được sử dụng theo cú pháp "TênLớp::TênThànhPhần" để truy cập đến các thành phần tĩnh của lớp như biến tĩnh (static variable)
// và phương thức tĩnh (static method). 
// Thông qua toán tử này, ta có thể truy cập đến các thành phần tĩnh của lớp mà không cần tạo đối tượng của lớp đó.

Numbers::Numbers(int number)
{
    if (number < 0 || number > 9999)
        cout << "Invalid number!" << endl;
    else
        this->number = number;
}

void Numbers::print()
{
    int newNumber = number;
    // Nếu number >= 1000 thì chia cho 1000 để ra phần thousand
    if (number >= 1000)
    {
        cout << lessThan20[number / 1000] << " " << thousand << " ";
        // number %= 1000 tương đương number = number % 1000, tức là chia lấy dư ví dụ ở đây là 3456 thì sẽ dư 456, phần nguyên là 3 (lọt vào lessThan20 vì 3 < 20)
        number %= 1000;
        
    }
    if (number >= 100)
    {
        cout << lessThan20[number / 100] << " " << hundred << " ";
        // 456 / 100 sẽ nguyên 4 thì 4 cx lọt vào lessThan20 và dư 56
        number %= 100;
    }
    if (number >= 20)
    {
        // Trường hợp lớn hơn 20 thì chia lấy nguyên cho 10, lúc này là 56 / 10 nguyên 5 và dư 6 thì 5 sẽ lọt vào tens
        cout << tens[number / 10 - 2] << " ";
        if (number % 10 != 0)
            // Nếu số dư chẵn không chia hết cho 10 thì lọt vào lessTan20 
            cout << lessThan20[number % 10] << " ";
    }
    else
    {
        // else là trường hợp còn lại 
        // nếu chia lấy nguyên cho 10 mà số nguyên khác không thì số cuối lại lọt vào lessThan20
        if (newNumber % 10 != 0)
            cout << lessThan20[number] << " ";
    }
}

Numbers::~Numbers()
{
}