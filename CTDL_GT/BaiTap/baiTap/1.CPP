// QuickSort
// Tạo ra 2 file mảng gồm 100000 phần tử ngẫu nhiên, viết thuật toán để tìm các phần tử trong file 1 xuất hiện trong file 2, sắp xếp rồi viết ra file 3
// sinh ra 2 mảng 100 phần tử, đếm xem các phần tử nằm trong mảng 1 xuất hiện bao nhiêu lần ở mảng 2
// biểu thức dạng trung tố --> chuyển về biểu thức hậu tố

#include <bits/stdc++.h>
using namespace std;
// ofstream fout1("File1.txt");
// ofstream fout2("File2.txt");
int size = 20;

// Tìm kiếm
void Search(int arr1[], int arr2[])
{
    int arr3[size];
    int n=0;
    for(int i=0; i<size; i++)
    {
        for(int j=0; j<size; j++)
        {
            if(arr1[i] == arr2[j])
            {
                arr3[n] = arr1[i];
                n++;
                break;
            }
        }
    }
}

// Sắp xếp
void Sort(int arr1[], int arr2[])
{
    int arr3[size*2];
    int i = 0, j = 0, k = 0;
    while (i < size && j < size) {
        if (arr1[i] < arr2[j]) {
            arr3[k] = arr1[i];
            i++;
            k++;
        } else if (arr2[j] < arr1[i]) {
            arr3[k] = arr2[j];
            j++;
            k++;
        } else {
            arr3[k] = arr1[i];
            i++;
            j++;
            k++;
        }
    }
}

int main()
{
    int arr1[size];
    int arr2[size];
    srand(time(NULL));
    for(int i = 0; i<size; i++)
    {
        arr1[i] = rand() % 100;
        arr2[i] = rand() % 100;
    }
    // for(int i = 0; i<size; i++)
    // {
    //     fout1 <<i <<": "<< arr1[i] << endl;
    //     fout2 <<i <<": "<< arr2[i] << endl;
    // }
    // fout1.close();
    // fout2.close();
    Sort(arr1, arr2);

    // // mở file 1
    // ifstream fin1("File1.txt");
    // int n;
    // while(!fin1.eof())
    // {
    //     fin1 >> n;
    // }
    // fin1.close();

    // // mở file 2
    // ifstream fin2("File1.txt");
    // int m;
    // while(!fin2.eof())
    // {
    //     fin2 >> m;
    // }
    // fin2.close();
    // return 0;
}