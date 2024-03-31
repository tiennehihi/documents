#include <iostream>
using namespace std;

#include "DivSales.h"
int main(){
    DivSales sales[6];
    for(int i=0; i<4; i++)
    {
        sales[i].setSoLieu(4+i, 8+i, 10+i, 2+i);
        //sales1: q1=4, q2=8, q3=10, q4=2
        //sales2: q1=5, q2=9, q3=11, q4=3
        //sales3: q1=6, q2=10, q3=12, q4=4
    }
    cout<<sales[0].getSoLieu(0)<<endl;
    // cout<<sales[0].getTongDoanhThu()<<endl;
    // cout<<sales[1].getTongDoanhThu()<<endl;
    // cout<<sales[2].getTongDoanhThu()<<endl;
    for(int i=0; i < 4; i++) {
        cout << sales[i].getTongDoanhThu()<<endl;
    }
}