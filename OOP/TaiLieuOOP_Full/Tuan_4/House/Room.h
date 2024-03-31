// Minh hoạ sự hợp thành - quan hệ part of 
// Chứa đặc tả và cài đặt lớp Room

#ifndef ROOM_H
#define ROOM_H
#include <iostream> 
using namespace std; 

//Khai báo lớp Room

class Room{
    string name; 
    float area;
public: 
    Room(string name = "Phong khach", float area = 10)
    { setInfor(name, area); }
    void setInfor (string n, float a){
        name = n; 
        area = a; 
    }
    string getName()const{return name;}
    float getArea() const {return area;}
}; 
#endif

