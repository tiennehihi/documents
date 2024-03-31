// Minh hoạ sự hợp thành - quan hệ part of 
// Chứa đặc tả và cài đặt lớp House
// House sẽ hợp thành từ Room
#ifndef HOUSE_H
#define HOUSE_H
#include "Room.h"

const int n = 4; 
class House{
    Room a[n]; 
public: 
    House (string name[], float area[]){
        for (int i = 0; i < n; i++)
            a[i].setInfor(name[i], area[i]); 
    }
    // House (Room b[]){
    //     for (int i = 0; i<n; i++){
    //         a[i] = b[i]; 
    //     }
    // }
    float getArea()const{
        float area = 0; 
        for (int i = 0; i<n; i++) 
            area +=a[i].getArea(); 
        return area;
    }
};

#endif
