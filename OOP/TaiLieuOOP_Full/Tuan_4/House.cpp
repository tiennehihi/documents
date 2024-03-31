#include <iostream>
using namespace std;

#include "House.h"

int main()
{
    Room phong1;
    Room phong2("phong ngu", 5), phong3("phong bep", 5), phong4("WC", 2);
    House nha(phong1, phong2, phong3, phong4);
  
    cout<<"Dien tich nha: "<<nha.getDientich()<<endl;


    return 0;
}