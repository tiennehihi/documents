#include<bits/stdc++.h>
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
    while(i<0){
        cout<<"Nhap lai quantity: ";
        cin>>i;
    }
    cout<<"Nhap cost: ";
    cin>>c;
    while(i<0){
        cout<<"Nhap lai cost: ";
        cin>>i;
    }
    
    // do{
    //     cout<<"Dau vao khong chap nhan so am, nhap lai!!!"<<endl;
    //     cout<<"Nhap itemNumber: ";
    //     cin>>i;
    //     cout<<"Nhap quantity: ";
    //     cin>>q;
    //     cout<<"Nhap cost: ";
    //     cin>>c;
    // }while(i<0 || q<0 || c<0);

    return 0;
}