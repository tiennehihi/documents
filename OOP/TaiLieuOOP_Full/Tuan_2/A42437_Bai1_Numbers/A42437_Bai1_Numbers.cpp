/*1.Numbers Thiết kếlớp Numbers đểchuyểnsốtừ  0 đến 9999sang dạng chữ viết tiếng Anh. 
Ví dụ: 713 thành  chuỗi “seven  hundred  thirteen”; 8203  thành “eight  thousand  two  hundred  three”. 
Lớp gồm các thành viên:
•number: biến kiểu sốnguyên.
•Một mảng string đểlưu trữcác chuỗi được chuyển từcác sốtương ứng. 
string lessThan20[20]= {"zero", "one", ..., "eighteen", "nineteen"};string hundred= "hundred";string thousand= "thousand";
•Hàm tạo nhận một sốnguyên không âmđểkhởi tạo number.
•Hàm print()đểin mô tảsốdưới dạng chữviếttiếng Anh.
Demo  class  này  trong  hàm main: yêu cầu người  dùng  nhập  một  sốtrong  phạm  vi  thích hợp và sau đó in ra mô tảbằng tiếng Anh*/
#include <iostream>
#include "ClassNumbers.h"
#include "Number.cpp"

using namespace std;

int main()
{
    Numbers number(1234);
    number.print();
    return 0;
}
