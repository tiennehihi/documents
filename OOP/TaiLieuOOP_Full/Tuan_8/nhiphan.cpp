// a) Mở file.dat ở dạng nhị phân, ghi ra các thông tin sau rồi đóng file:
// ❑ Một số nguyên 3;
// ❑ Một số thực bằng 1.2
// ❑ Một giá trị bool là false
// ❑ Một ký tự ‘C’
// ❑ Một mảng 2 phần tử số thực, đã khởi tạo giá trị nào đó
// b) Mở lại file.dat ở dạng nhị phân để lần lượt đọc các thông tin sau:
// ❑ Đọc từ file vào một số nguyên, rồi số thực, rồi số bool, rồi ký tự, rồi
// mảng số thực 2 phần tử
// ❑ In ra các giá trị đọc được để kiểm tra
// c) Thay đoạn mã mảng 2 phần tử thành mảng 10 phần tử, song từ file
// sẽ chỉ đọc vào 2 phần tử đầu mảng

#include <bits/stdc++.h>
using namespace std;

int main()
{
    ofstream fout ("file.dat", ios::binary);
    if (!fout) cout << "LOI!" << endl;
    else 
    {
        int a = 3;
        fout.write(reinterpret_cast<char*>(&a), sizeof(a));

        float b = 1.2;
        fout.write(reinterpret_cast<char*>(&b), sizeof(b));

        bool c = false;
        fout.write(reinterpret_cast<char*>(&c), sizeof(c));

        char d = 'C';
        fout.write((&d), sizeof(d));

        float e[10] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
        fout.write(reinterpret_cast<char*>(e), sizeof(e));

        fout.close();

    }

    ifstream fin ("file.dat", ios::binary);
    if (!fin) cout << "LOI!" << endl;
    else
    {
        int a;
        float b;
        bool c;
        char d;
        float e[10];

        fin.read(reinterpret_cast<char*>(&a), sizeof(a));
        fin.read(reinterpret_cast<char*>(&b), sizeof(b));
        fin.read(reinterpret_cast<char*>(&c), sizeof(c));
        fin.read((&d), sizeof(d));
        fin.read(reinterpret_cast<char*>(e), 10*sizeof(float));

        cout << a << " " << b << " " << c << " " << d << " " << e[0] << " " << e[1] << endl;

        fin.close();
    }
    return 0;
}