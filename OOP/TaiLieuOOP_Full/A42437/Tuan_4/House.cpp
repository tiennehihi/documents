#include <bits/stdc++.h>
using namespace std;
#include "Room.h"
#include "House.h"
int main()
{
    Room room1;
    Room room2("Phong ngu", 3), room3("WC", 4), room4("Nha an", 7);
    House nha(room1, room2, room3, room4);
    cout << "Dien tich nha: "<< nha.getDienTich() << endl;
    // cout << "Phong 1: "<< room1.getName() <<"  " << room1.getDienTich()<<endl;
    // cout << "Phong 2: "<< room2.getName() <<"  " << room2.getDienTich()<<endl;
    // cout << "Phong 3: "<< room3.getName() <<"  " << room3.getDienTich()<<endl;
    // cout << "Phong 4: "<< room4.getName() <<"  " << room4.getDienTich()<<endl;
    return 0;
}