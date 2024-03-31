/*3.Circle Class.
Viết lớp Circlecó các thành viên sau:
•radius: Một sốdouble là bán kính
•pi: một sốdouble được khởi tạo với giá trị3.14159
•Hàm tạo nhận 1 giá trịvà gán giá trịnày cho radius
•setRadius. Một hàm cập nhật chobiến radius.
•getRadius. Một hàm truy cập cho biến radius.
•getArea. Trảvềdiện tích của hình tròn, được tính là diện tích = pi*radius*radius
•getDiameter. Trảvềđường kính của hình tròn, được tính là đường kính = radius*2
•getCircumference. Trảvềchu vi của hình tròn, được tính là chu vi = 2*pi*radius
Viết chương trình minh họa lớp Circlebằng cách hỏi người dùng về
radiuscủa hình tròn, tạo đối tượng Circle, sau đó in ra diện tích, đường kính và chu vi của hình tròn.*/

#include<iostream>

using namespace std;

class Circle{
    private:
        double radius;
        double pi = 3.14159;
    public:
        // double radius;
        // double pi = 3.14159;
        Circle(double r){
            radius = r;
            pi = 3.14159;
        }
        void setRadius(double r){
            radius = r;
        }
        double getRadius() { return radius; }
        double getArea(){
            return pi*radius*radius;
        }
        double getDiameter(){
            return radius*2;
        }
        double getCircumference(){
            return 2*pi*radius;
        }
};


int main(){
    double r;
    cout<<"Enter radius: ";
    cin>>r;
    Circle c(r);
    cout<<"Dien tich:"<< c.getArea()<<endl;
    cout<<"Duong kinh: "<<c.getDiameter()<<endl;
    cout<<"Chu vi: "<<c.getCircumference()<<endl;
    
    return 0;
}