// #include <iostream>

// class BasicShape {
// private:
//     double area;

// public:
//     void setArea(double a) {
//         area = a;
//     }

//     double getArea() const {
//         return area;
//     }

//     virtual void calcArea() = 0; // Hàm thuần ảo, sẽ được triển khai trong các lớp con
// };

// class Circle : public BasicShape {
// private:
//     double centerX;
//     double centerY;
//     double radius;

// public:
//     Circle(double x, double y, double r) : centerX(x), centerY(y), radius(r) {
//         calcArea();
//     }

//     double getCenterX() const {
//         return centerX;
//     }

//     double getCenterY() const {
//         return centerY;
//     }

//     double getRadius() const {
//         return radius;
//     }

//     void calcArea() override {
//         setArea(3.14159265359 * radius * radius);
//     }
// };

// class Rectangle : public BasicShape {
// private:
//     double length;
//     double width;

// public:
//     Rectangle(double l, double w) : length(l), width(w) {
//         calcArea();
//     }

//     double getLength() const {
//         return length;
//     }

//     double getWidth() const {
//         return width;
//     }

//     void setLength(double l) {
//         length = l;
//         calcArea();
//     }

//     void setWidth(double w) {
//         width = w;
//         calcArea();
//     }

//     void calcArea() override {
//         setArea(length * width);
//     }
// };

// int main() {
//     Circle circle(0, 0, 5.0);
//     Rectangle rectangle(4.0, 6.0);

//     std::cout << "Circle Area: " << circle.getArea() << std::endl;
//     std::cout << "Rectangle Area: " << rectangle.getArea() << std::endl;

//     return 0;
// }






#include <bits/stdc++.h>
using namespace std;
class BasicPhape{
    private:
        float area;
        virtual float calcArea() = 0;
    protected:
        void setArea(){ area = calcArea(); }
    public:
        // BasicPhape(float dtich):area(dtich){}
        float getArea() const { return area; }
        virtual ~BasicPhape(){}
        
};
class Circle: public BasicPhape{
        float centerX, centerY, radius;
        float calcArea() {
            return radius*radius*3.14;
        }
    public:
        Circle(float x=0, float y=0, float r=0):centerX(x), centerY(y), radius(r){
            setArea();
        }
        float getCenterX() const { return centerX; }
        float getCenterY() const { return centerY; }
        float getRadius() const { return radius; }
        
};
int main(){
    Circle a(2, 3, 3);
    cout<<a.getArea()<<endl;
    return 0;
}