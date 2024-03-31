#include <bits/stdc++.h>
using namespace std;
struct MovieData{
    string tieude, daodien;
    int namph, thoigian;
    long long cost, sale;
};
void print(const MovieData &a){
    cout << "Tieu de: " << a.tieude << endl;
    cout << "Dao dien: " << a.daodien << endl;
    cout << "Nam phat hanh: " << a.namph << endl;
    cout << "Thoi gian phat: " << a.thoigian << endl;
    cout << "So lai cua nam dau tien: " << a.sale - a.cost << endl;
}
int main() {
    MovieData c= {"Co gai den tu qua khu", "Ninh Duong Lan Ngoc", 2022, 105, 100000, 250000};
    MovieData b= {"Nguoc dong thoi gian de yeu anh", "ABCDXYZ", 2022, 145, 125000, 170000};
    print(c);
    cout << endl;
    print(b);
    return 0;
}