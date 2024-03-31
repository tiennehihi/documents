// sinh ra 2 mảng 100 phần tử, đếm xem các phần tử nằm trong mảng 1 xuất hiện bao nhiêu lần ở mảng 2

#include <bits/stdc++.h>
using namespace std;
int main()
{
    int size = 10;
    int a[size];
    int b[size];
    int cnt[size] = {0};
    srand(time(NULL));
    for (int i = 0; i < size; i++){
        a[i] = rand() % 20;
        b[i] = rand() % 20;
    }

    for (int i = 0; i <size; i++){
        int temp = a[i];
        for (int j = 0; j < size; j++){
            if(b[j] == temp){
                cnt[i]++;
            }
        }
    }

    cout << "Mang 1: ";
    for (int i = 0; i <size; i++){
        cout << a[i] << " ";
    }
    cout << endl;

    cout << "Mang 2: ";
    for (int i = 0; i <size; i++){
        cout << b[i] << " ";
    }
    cout << endl;

    for (int i = 0; i <size; i++){
        cout << a[i] <<": " << cnt[i] << endl;
    }
}