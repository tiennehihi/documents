#include <bits/stdc++.h>
using namespace std;
int main(){
    ifstream in;
    in.open("random.txt"); 
    int n, count=0;
    float sum=0, tb=0;
    while(in>>n){
        sum += n;
        count++;
        tb = sum / count;
    }
    in.close();

    ofstream out;
    out.open("result.txt");
    out << "Tong so la: " << count << endl;
    out << "Tong la: " << sum << endl;
    out << "Trung binh la: " << tb << endl;
    out.close();

    return 0;
}