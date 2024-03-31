#include <bits/stdc++.h>
using namespace std;
int main(){
    srand(time(NULL));
    string bai[] = {"AC", "2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "10C", "JC", "QC", "KC",
                    "AR", "2R", "3R", "4R", "5R", "6R", "7R", "8R", "9R", "10R", "JR", "QR", "KR",
                    "AT", "2T", "3T", "4T", "5T", "6T", "7T", "8T", "9T", "10T", "JT", "QT", "KT",
                    "AB", "2B", "3B", "4B", "5B", "6B", "7B", "8B", "9B", "10B", "JB", "QB", "KB"};
    void TienLen()
    {
        cout << "Bai cua nguoi thu 1: ";
        for(int i=0; i < 13; i++)
        {
            int ran = rand() % 52;
            if(bai[ran] != bai[ran+1])
                cout << bai[ran] << " ";
        }
        cout << endl;
        cout << "Bai cua nguoi thu 2: ";
        for(int i=13; i < 26; i++)
        {
            int ran = rand() % 52;
            if(bai[ran] != bai[ran+1])
                cout << bai[ran] << " ";
        }
        cout << endl;
        cout << "Bai cua nguoi thu 3: ";
        for(int i=26; i < 39; i++)
        {
            int ran = rand() % 52;
            if(bai[ran] != bai[ran+1])
                cout << bai[ran] << " ";
        }
        cout << endl;
        cout << "Bai cua nguoi thu 4: ";
        for(int i=39; i < 52; i++)
        {
            int ran = rand() % 52;
            if(bai[ran] != bai[ran+1])
                cout << bai[ran] << " ";
        }
    };

    void Phom_TaLa()
    {
        cout << "Bai cua nguoi thu 1: ";
        for(int i=0; i < 10; i++)
        {
            int ran = rand() % 52;
            if(bai[ran] != bai[ran+1])
                cout << bai[ran] << " ";
        }
        cout << endl;
        cout << "Bai cua nguoi thu 2: ";
        for(int i=0; i < 9; i++)
        {
            int ran = rand() % 52;
            if(bai[ran] != bai[ran+1])
                cout << bai[ran] << " ";
        }
        cout << endl;
        cout << "Bai cua nguoi thu 3: ";
        for(int i=0; i < 9; i++)
        {
            int ran = rand() % 52;
            if(bai[ran] != bai[ran+1])
                cout << bai[ran] << " ";
        }
        cout << endl;
        cout << "Bai cua nguoi thu 4: ";
        for(int i=0; i < 9; i++)
        {
            int ran = rand() % 52;
            if(bai[ran] != bai[ran+1])
                cout << bai[ran] << " ";
        }
    };
}