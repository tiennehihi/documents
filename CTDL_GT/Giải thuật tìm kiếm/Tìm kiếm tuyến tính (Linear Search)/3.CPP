// Hãy in ra những phần tử lẻ ở chỉ số chẵn, sau mỗi phần tử có đúng một dấu cách, nếu không có phần tử nào thõa mãn thì in ra "NULL".
#include <bits/stdc++.h>
using namespace std;
int main(){
    int a[10001];
    int n;
    cin >> n;
    for(int i=0; i<n; i++){
        cin >> a[i];
    }
    bool kt = true;
    for(int i=0; i<n; i++){
        if (a[i]%2 != 0 && i%2 == 0){
            cout << a[i] << " ";
            kt = false;
        }
    }
    if (kt){
        cout << "NULL";
    }
    return 0;
}