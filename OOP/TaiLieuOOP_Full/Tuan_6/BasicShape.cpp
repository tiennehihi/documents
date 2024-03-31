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