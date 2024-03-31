#include<fstream>
#include<iostream>
using namespace std;
int main()
{
    ofstream out;
    out.open("file.dat ", ios::out | ios::binary);
    if (!out){cout <<"false";} 

    else 
        {int a=3;
        out.write(reinterpret_cast<char*>(&a), sizeof(a));
        float b=1.2;
        out.write(reinterpret_cast<char*>(&b), sizeof(b));
        bool c=false;
        out.write(reinterpret_cast<char*>(&c), sizeof(c));
        char d='C';
        out.write(reinterpret_cast<char*>(&d), sizeof(d));
        float e[2]={1.2,2.5};
        out.write(reinterpret_cast<char*>(e), sizeof(e)*2);
        out.close();}

        ifstream in;
        in.open("file.dat", ios::binary);
        if (!in){cout <<"false";}
        else{

        int a;
        in.read(reinterpret_cast<char*>(&a), sizeof(a));
        float b;
        in.read(reinterpret_cast<char*>(&b), sizeof(b));
        bool c;
        in.read(reinterpret_cast<char*>(&c), sizeof(c));
        char d;
        in.read(reinterpret_cast<char*>(&d), sizeof(d));
        float e[2];
        in.read(reinterpret_cast<char*>(e), sizeof(float)*2);

        cout<<a<<" "<<b<<" "<<c<<" " <<d<<" " <<e[1]<<endl;
        in.close();
        }
    return 0;
}