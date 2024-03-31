#include<bits/stdc++.h>
using namespace std;

struct sach{
    string name;string tentg; int nxb; int trang;
};
int main()

{  
    sach a={"bai bai","kien",2002,1112}, b2;
    ofstream out;
    out.open("sinhvien.dat",ios::binary);
    if (!out){cout <<"False" <<endl;}
    else{ 
        out.write(reinterpret_cast<char*>(&a), sizeof(a));
    }
    out.close();

    ifstream in;
    in.open("sinhvien.dat",ios::binary);
    in.read(reinterpret_cast<char*>(&a), sizeof(a));
    cout<<"name sach"<<b2.name<<endl;
    cout<<"name tac gia"<<endl;
    cout<<"nam sx"<<endl;
    return 0;
}