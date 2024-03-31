#ifndef ROOM_H
#define ROOM_H

class Room
{
    private:
        string ten;
        float dientich;
    public:
        Room(string t = "phong khach", float d = 10)
        {
             ten = t;
             dientich = d;
        }
        void setInfo(srting t, float d)
        {
            ten = t;
            dientich = d;
        }
        float getDientich()const {return dientich;}
};

#endif
