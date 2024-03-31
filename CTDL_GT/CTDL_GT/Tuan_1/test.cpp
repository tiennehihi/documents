// #include <bits/stdc++.h>
#include <iostream>
#include <string>
#include <chrono>
#include <thread>
#include <vector>
#include <ctime>
#include <random>
#include <algorithm>
using namespace std;
// void Labai()
// {
//     vector<int> array = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 
//                  14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 
//                  27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 
//                  41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52};

//     random_shuffle(array.begin(), array.end());
// }
void ThucDon()
{
    cout << endl;
    string str = "Mot vi phap su nguoi Viet Nam da tung noi: \nOi gioi, cac anh hoc Cong Nghe Thong Tin (IT) ma khong biet choi co bac online la vut :33\n";
    string str2 = "\n\t\tCHUONG TRINH CHIA BAI ONLINE\n\n";

    // Duyệt từng kí tự trong chuỗi và in ra màn hình sau mỗi 50 milli giây
    for (int i = 0; i < str.length(); i++) {
        cout << str[i];
        // Dừng chương trình 0.05 giây
        this_thread::sleep_for(chrono::milliseconds(50));
    }

    for (int i = 0; i < str2.length(); i++) {
        cout << str2[i];
        this_thread::sleep_for(chrono::milliseconds(50));
    }
    cout << "1. Tien Len Mien Nam\n";
    cout << "2. Tan\n";
    cout << "3. Ba Cay\n";
    cout << "4. Phom - Ta La\n";
    cout << "0. Thoat\n";
    
}
void TienLenMienNam()
{
    int n;
    cout << "Nhap so nguoi choi: ";
    cin >> n;

    // 1 vector khai báo 52 quan bài
    vector<string> array = {"AC", "2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "10C", "JC", "QC", "KC",
                            "AR", "2R", "3R", "4R", "5R", "6R", "7R", "8R", "9R", "10R", "JR", "QR", "KR",
                            "AT", "2T", "3T", "4T", "5T", "6T", "7T", "8T", "9T", "10T", "JT", "QT", "KT",
                            "AB", "2B", "3B", "4B", "5B", "6B", "7B", "8B", "9B", "10B", "JB", "QB", "KB"};

    random_shuffle(array.begin(), array.end());
    cout << "\t\tTIEN LEN MIEN NAM\n" << endl;
    for (int i = 0; i < n; i++)
    {
        cout << "Nguoi " << i + 1 << ": ";
        for (int j = i * 13; j < i * 13 + 13; j++)
        {
            cout << array[j] << " ";
        }
        cout << endl;
    }
}
void Tan()
{
    int n;
    cout << "Nhap so nguoi choi: ";
    cin >> n;

    // mảng kí tự gồm chất của 4 quan bai cơ, rô, bích, tép
    char a[] = {'C', 'R', 'B', 'T'};

    // 1 vector khai báo 52 quan bài
    vector<string> array = {"AC", "2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "10C", "JC", "QC", "KC",
                            "AR", "2R", "3R", "4R", "5R", "6R", "7R", "8R", "9R", "10R", "JR", "QR", "KR",
                            "AT", "2T", "3T", "4T", "5T", "6T", "7T", "8T", "9T", "10T", "JT", "QT", "KT",
                            "AB", "2B", "3B", "4B", "5B", "6B", "7B", "8B", "9B", "10B", "JB", "QB", "KB"};

    random_shuffle(array.begin(), array.end());
    cout << "\t\tTAN \n" << endl;
    for (int i = 0; i < n; i++)
    {
        cout << "Nguoi " << i + 1 << ": ";
        for (int j = i * 8; j < i * 8 + 8; j++)
        {
            cout << array[j] << " ";
        }
        cout << endl;
    }
    cout << "La bai chat truong la: ";
    int r = rand() % 4;         // random trong khoảng từ 0-3 (int n = rand() % (b - a + 1) + a;)
    cout << a[r] << endl;
}

void BaCay()
{
    int n;
    cout << "Nhap so nguoi choi: ";
    cin >> n;

    // 1 vector khai báo 52 quan bài
    vector<string> array = {"AC", "2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "10C", "JC", "QC", "KC",
                            "AR", "2R", "3R", "4R", "5R", "6R", "7R", "8R", "9R", "10R", "JR", "QR", "KR",
                            "AT", "2T", "3T", "4T", "5T", "6T", "7T", "8T", "9T", "10T", "JT", "QT", "KT",
                            "AB", "2B", "3B", "4B", "5B", "6B", "7B", "8B", "9B", "10B", "JB", "QB", "KB"};

    random_shuffle(array.begin(), array.end());
    cout << "\t\tBA CAY \n" << endl;
    for(int i=0; i < n; i++)
    {
        cout << "Nguoi " << i+1 << ": ";
        for (int j = i * 3; j < i * 3 + 3; j++)
        {
            cout << array[j] << " ";
        }
        cout << endl;
    }
}

void Phom_TaLa()
{
    int n;
    cout << "Nhap so nguoi choi: ";
    cin >> n;

    // 1 vector khai báo 52 quan bài
    vector<string> array = {"AC", "2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "10C", "JC", "QC", "KC",
                            "AR", "2R", "3R", "4R", "5R", "6R", "7R", "8R", "9R", "10R", "JR", "QR", "KR",
                            "AT", "2T", "3T", "4T", "5T", "6T", "7T", "8T", "9T", "10T", "JT", "QT", "KT",
                            "AB", "2B", "3B", "4B", "5B", "6B", "7B", "8B", "9B", "10B", "JB", "QB", "KB"};

    random_shuffle(array.begin(), array.end());

    cout << "\t\tPhom - Ta La \n" << endl;

    // người thứ 1 có 10 lá
    for(int i = 0; i < 1; i++)
    {
        cout << "Nguoi " << i+1 << ": ";
        for (int j = i * 10; j < i * 10 + 10; j++)
        {
            cout << array[j] << " ";
        }
    }
    cout << endl;

    // các người còn lại có 9 lá
    for(int i=1; i < n; i++)
    {
        cout << "Nguoi " << i+1 << ": ";
        for (int j = i * 9; j < i * 9 + 9; j++)
        {
            cout << array[j+1] << " ";
        }
        cout << endl;
    }
}



int main()
{
    ThucDon();
    int lc;
    srand(time(NULL));
    do
    {
        cout << endl;
        cout << "Moi chon: ";
        cin>>lc;
        switch(lc)
        {
            case 1:
                TienLenMienNam();
                break;
            case 2:
                Tan();
                break;
            case 3:
                BaCay();
                break;
            case 4:
                Phom_TaLa();
                break;
        }
    }while(lc != 0);
}