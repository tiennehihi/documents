#ifndef HOUSE_H
#define HOUSE_H
#include "Room.h"

const int n = 4;
class House
{
    private:
        Room phong1, phong2, phong3, phong4;
    public:
        // House(string name[], float area[])
        // {
        //     for(int i=0; i<n; i++)
        //     {
        //         a[i].setInfor(name[i], area[i]);
        //     }
        // }
        House(const Room & a, const Room & b, const Room & c, const Room & d):
        phong1(a), phong2(b), phong3(c), phong4(d){}
        // void setAll(const Room & a, const Room & b, const Room & c, const Room & d)
        // {
        //     phong1 = a;
        //     phong2 = b;
        //     phong3 = c;
        //     phong4 = d;
        // }

        float getDientich()const 
        {
            return phong1.getDientich()+phong2.getDientich()+phong3.getDientich()+phong4.getDientich();
        }
};

#endif