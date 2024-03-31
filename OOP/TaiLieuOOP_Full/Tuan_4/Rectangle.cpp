// Nhớ lại, lớp Rectangle có các thành viên sau:
// ◼ width, length và setter, getter tương ứng
// ◼ hàm tạo 2 tham số khởi tạo cho 2 biến, có 2 đối số mặc định là 0
// ◼ getArea trả về diện tích hình chữ nhật
// Viết lớp Cube mô tả khối hộp kế thừa Rectangle, có thêm:
// ◼ Chiều cao height và thể tích volume
// ◼ Danh sách setter, getter hợp lý
// ◼ Hàm tạo mặc định gán rộng, dài, cao bằng 0
// ◼ Hàm tạo 3 tham số khởi tạo cho cả rộng, dài, cao
// Demo tạo ra một Cube với rộng, dài, cao nào đó, gọi mọi hàm có thể

#include<bits/stdc++.h>
using namespace std;
class Retangle
{
    private:
        double width, length;
    public:
        // Retangle(){}
        Retangle(double wi=0, double le=0)
        {
            width = wi;
            length = le;
        }
        void setWidth(double w){ width = w; }
        void setLength(double l){ length = l; }
        double getWidth() const { return width; }
        double getLength() const { return length; }
        double getArea() const { return width*length;}
};

class Cube: public Retangle
{
        double height, volume;
        void setVolume() {volume = getArea()*height;}
    public:
        Cube():Retangle(), height(){}
        Cube(double w=0, double l=0, double h=0):Retangle(w, l), height(h) {
            setVolume();
        }
        void setHeight(double h=0) { height = h; }
        void setVolume(double v) { volume = v; }
        double getHeight() const { return height; }
        double getVolume() const { return getArea() * height;}
};


int main()
{
    Cube a(1, 3, 4);
    // a.setVolume(4);
    cout<<a.getArea()<<" "<<a.getVolume()<<endl;
    return 0;
}