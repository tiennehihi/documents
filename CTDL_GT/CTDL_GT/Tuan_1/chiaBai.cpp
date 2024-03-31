/*
#include <iostream>
#include <cstdlib>
#include <ctime>
#include <algorithm>
#include <vector>

using namespace std;

int main()
{
    // Khởi tạo mảng gồm 52 phần tử
    vector<string> array = {"Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King"};
    // Thêm 4 lá bài cho mỗi loại bài trên
    for (int i = 0; i < 4; i++)
    {
        array.insert(array.end(), array.begin(), array.end());
    }

    // Tráo bài ngẫu nhiên
    random_shuffle(array.begin(), array.end());

    // Chia bài cho 4 người
    for (int i = 0; i < 4; i++)
    {
        cout << "Nguoi " << i + 1 << ": ";
        for (int j = i * 13; j < i * 13 + 13; j++)
        {
            cout << array[j] << " ";
        }
        cout << endl;
    }

    return 0;
}
*/


#include <iostream>
#include <algorithm>
#include <vector>
#include <ctime>
// #include <bits/stdc++.h>

using namespace std;

int main()
{
    srand(time(0));
    // Khởi tạo mảng gồm 52 phần tử
    vector<string> array = {"AC", "2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "10C", "JC", "QC", "KC",
                            "AR", "2R", "3R", "4R", "5R", "6R", "7R", "8R", "9R", "10R", "JR", "QR", "KR",
                            "AT", "2T", "3T", "4T", "5T", "6T", "7T", "8T", "9T", "10T", "JT", "QT", "KT",
                            "AB", "2B", "3B", "4B", "5B", "6B", "7B", "8B", "9B", "10B", "JB", "QB", "KB"};

    // vector<int> array = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 
    //                      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 
    //                      27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 
    //                      41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52};

    // Tráo bài ngẫu nhiên
    random_shuffle(array.begin(), array.end());

    // Chia bài cho 4 người
    cout << "\t\t\t\t  TIEN LEN MIEN NAM\n" << endl;
    for (int i = 0; i < 4; i++)
    {
        cout << "Nguoi " << i + 1 << ": ";
        for (int j = i * 13; j < i * 13 + 13; j++)
        {
            cout << array[j] << " ";
        }
        cout << endl;
    }

    return 0;
}




