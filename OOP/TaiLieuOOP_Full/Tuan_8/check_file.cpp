#include <bits/stdc++.h>
using namespace std;
int main(){
    ifstream in;
    in.open("tiendz.txt");
    if(!in){
        cout << "LOI!" << endl;
    } else {
        cout << "Thanh cong!" << endl;
    }

    ofstream out;
    out.open("tienne.txt");
    if(!out){
        cout << "LOI!" << endl;
    } else {
        cout << "Thanh cong!" << endl;
    }

    fstream inout;
    inout.open("InputOutput.txt");
    if(!inout){
        cout << "LOI!" << endl;
    } else {
        cout << "Thanh cong!" << endl;
    }
    return 0;
}