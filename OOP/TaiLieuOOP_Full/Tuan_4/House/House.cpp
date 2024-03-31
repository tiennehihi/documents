#include "House.h"

int main(){
    cout << endl; 
    string name[] = {"Phong khach", "Phong tam", "Phong ngu", "Phong an"}; 
    float area[] = {16, 6, 12, 12 }; 
    // Room a[] = {Room("Phong khach", 16), Room("Phong tam", 6),Room("Phong ngu", 10),
    //             Room("Phong an", 10),};
    House o1 (name, area);
    //, o2 (a); 
    cout << "Dien tich nha: " << o1.getArea() << endl; 
  //  cout <<"Dien tich nha: " << o2.getArea() <<endl;
    cout << endl; 
    return 0; 
}

