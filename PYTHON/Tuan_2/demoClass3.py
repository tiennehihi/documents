# Hãy phát triển một chương trình OOP trong đó có định nghĩa các class có kế thừa với
# nhau theo quan hệ phân cấp như hình bên dưới. Học viên tự định nghĩa nội dung chi tiết
# của từng class, bao gồm các thuộc tính và method tương ứng. Mỗi class sẽ bao gồm một
# method display() để hiển thị giá trị các thuộc tính của lớp.
# Sau đó hãy khởi tạo đối tượng của các class trên và gọi các method display(), rồi xem kết quả

class Shape():
    def display():
        print("Đây là hình học")

class TwoDShape(Shape):
    def display():
        print("Đây là hình 2 chiều")

class Circle(TwoDShape):
    def __init__(self, r):
        self.r = r
    def display(self):
        print("Đây là hình tròn")
        print("Bán kính hình tròn là:", self.r)

class Square(TwoDShape):
    def __init__(self, canh):
        self.canh = canh
    def display(self):
        print("Đây là hình vuông")
        print("Cạnh hình vuông là:", self.canh)

class Triangle(TwoDShape):
    def __init__(self, cd, cr):
        self.cd = cd
        self.cr = cr
    def display(self):
        print("Đây là hình chữ nhật")
        print(f"Hình chữ nhật có chiều dài là {self.cd}, chiều rộng là {self.cr}")

class ThreeDShape(Shape):
    def display(self):
        print("Đây là hình 3 chiều")

class Sphere(ThreeDShape):
    def display(self):
        print("Đây là hình cầu")

class Cube(ThreeDShape):
    def display(self):
        print("Đây là hình lập phương")

class Tetrahedron(ThreeDShape):
    def display(self):
        print("Đây là hình tứ diện")

tron = Circle(2)
tron.display()
vuong = Square(4)
vuong.display()
chu_nhat = Triangle(1,2)
chu_nhat.display()
cau = Sphere()
cau.display()
lap_phuong = Cube()
lap_phuong.display()
tu_dien = Tetrahedron()
tu_dien.display()