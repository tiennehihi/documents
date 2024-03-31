#ifndef HOUSE_H
#define HOUSE_H
#include "Room.h"
class House
{
    private:
        Room room1, room2, room3, room4;
    public:
        House(const Room & a, const Room & b, const Room & c, const Room & d)
        {
            room1 = a;
            room2 = b;
            room3 = c;
            room4 = d;
        }
        void setAll(const Room &a, const Room &b, const Room &c, const Room &d){
            room1 = a;
            room2 = b;
            room3 = c;
            room4 = d;
        }
        double getDienTich() const {
            return room1.getDienTich() + room2.getDienTich() + room3.getDienTich() + room4.getDienTich();
        }
        ~House(){}
};

#endif