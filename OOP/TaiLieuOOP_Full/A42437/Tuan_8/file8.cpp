#include<fstream>
#include<iostream>
using namespace std;
int main()
{
    ifstream in;
    in.open("sinhvien.txt");
    if(!in){
        cout<<"file false"<<endl;
    } 
    else{ cout<<"thanh cong"<<endl; }
    in.close();

    ofstream out;
    out.open("diemso2.txt");
    if(!out){
        cout<<"file false"<<endl;
    } 
    else{cout<<"thanh cong"<<endl;}
    out.close();

    fstream iq;
    iq.open("inputoutput.txt");
    if(!iq){
        cout<<"file false"<<endl;
    } 
    else{ cout<<"thanh cong"<<endl;}
    iq.close();


    return 0;
}