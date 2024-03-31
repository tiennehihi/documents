#include<iostream>
#include"BST.h"

using namespace std;

int main(){
    BST<int> ds;
    ds.Add(7);
    ds.Add(5);
    ds.Add(9);
    ds.Add(3);
    ds.Add(14);
    cout<<ds.Search(9)<<endl;
    ds.Print();
}