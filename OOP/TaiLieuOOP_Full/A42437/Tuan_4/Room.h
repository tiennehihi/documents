#ifndef ROOM_H
#define ROOM_H

class Room
{
    private:
        string name;
        double dienTich;
    public:
        Room(string ten="Phong khach", double s=10):name(ten), dienTich(s){}
        double getDienTich() const { return dienTich; }
        string getName () const { return name; }

        ~Room(){ }
};

#endif