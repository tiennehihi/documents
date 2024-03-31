// #include <iostream>
// using namespace std;
// #define PI 3.14;
// class Shape
// {
//     private:
//         double area;
//     public:
//         // Shape(double a):area(a){}
//         // Shape(){cout<<"Chay ham tao Shape";}
//         // ~Shape(){cout<<"Chay ham huy Shape";}
//         void setArea(double a){
//             area = a;
//         }
//         double getArea() const { return area; }
// };

// class Circle: public Shape
// {
//         double radius;
//     public:
//         // Circle(double r):radius(r) {}
//         // Circle(){cout<<"Chay ham tao Circle";}
//         // ~Circle(){cout<<"Chay ham huy Circle";}
//         void setRadius(double r){
//             radius = r;
//             setArea(r*r*3.14);
//         }
//         double getRadius() const { return radius; }
//         // double getArea() const { return Shape :: getArea(); }     // protected
// };

// int main()
// {
//     Circle b;
//     b.setRadius(5);
//     cout << "Ban kinh: "<< b.getRadius()<<endl;
//     cout << "Dien tich: "<< b.getArea()<<endl;
//     // cout<<"Tao doi tuong Circle"<<endl;
//     // Circle a;

    
//     return 0;
// }

// #include <string.h>
// #include<iostream>
// #include <math.h>
// using namespace std;
// class shape {
//     private :
//         double area;
        
//     public :
//         shape(){}
//         shape(double a) : area(a) {}
//         ~shape() {
//             cout << "Da huy lop cha \n";
//         }
// };
// class circle : public shape {
//     private :
//         double radius;
//     public :
//         circle(){}
//         ~circle() {
//             cout << "Da huy lop con \n";
//         }
// };
// int main () {
//     // shape v1(20) ;
//     // cout << "dien tich cua hinh la " << v1.getArea() << endl;
//     // circle v2(3.5);
//     // cout << "ban kinh  cua hinh tron la "  << v2.getRadius() << endl;
//     // cout << "dien tich cua hinh tron la " << v2.getArea() << endl; 

//     circle v2;
// }



// Viết lớp Shape3D mô tả hình 3D, có các thành viên:
// ❑ Biến volume chỉ thể tích, với setter và getter cho nó
// ◼ Viết lớp Cube mô tả hình hộp vuông, kế thừa
// Shape3D và bổ sung:
// ❑ Biến size chỉ độ dài cạnh hình hộp, với setter và getter cho nó
// ◼ Viết main demo 2 lớp trên:
// ❑ Tạo biến Shape3D, đặt thể tích, rồi in ra thể tích
// ❑ Tạo biến Cube, đặt độ dài cạnh, in ra độ dài cạnh và thể tích hình


#include <iostream>
using namespace std;

class Shape3D {
private:
    double volume;

public:
    Shape3D() : volume(0.0) {}
    
    void setVolume(double v) {
        volume = v;
    }

    double getVolume() const {
        return volume;
    }
};

class Cube : public Shape3D {
private:
    double size;

public:
    Cube() : size(0.0) {}

    void setSize(double s) {
        size = s;
        setVolume(s * s * s);
    }

    double getSize() const {
        return size;
    }
};

int main() {
    Shape3D shape;
    shape.setVolume(100.0); // Set the volume

    cout << "Shape3D Volume: " << shape.getVolume() << endl;

    Cube cube;
    cube.setSize(5.0); 

    cout << "Cube Size: " << cube.getSize() << endl;
    cout << "Cube Volume: " << cube.getVolume() << endl;

    return 0;
}
