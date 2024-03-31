#include<bits/stdc++.h>
#include "Inventory.h"
using namespace std;
int main(){
    int i, q;
    double c;
    double t;
    cout<<"Nhap itemNumber: ";
    cin>>i;
    while(i<0){
        cout<<"Nhap lai intemNumber: ";
        cin>>i;
    }
    cout<<"Nhap quantity: ";
    cin>>q;
    while(q<0){
        cout<<"Nhap lai quantity: ";
        cin>>i;
    }
    cout<<"Nhap cost: ";
    cin>>c;
    while(c<0){
        cout<<"Nhap lai cost: ";
        cin>>i;
    }
    Inventory v1(i, q, c);
    cout<<"itemNumber: "<<v1.getItemNumber()<<endl;
    cout<<"quantity: "<<v1.getQuantity()<<endl;
    cout<<"cost: "<<v1.getCost()<<endl;
    cout<<"total cost: "<<v1.getTotalCost()<<endl;
    return 0;
}