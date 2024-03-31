# Viết một chương trình Python cho phép định nghĩa lớp. Tạo ra một lớp có tên là Person,
# bao gồm 3 thuộc tính là name, address và age. Định nghĩa 2 method của lớp này có tên
# là inputDetails() và displayDetails() để cho phép nhập các giá trị cho các thuộc tính, và
# hiển thị giá trị của các thuộc tính của lớp.
# Tiếp theo, hãy khai báo 2 đối tượng của lớp, rồi gọi các method của 2 đối tượng này để
# xem kết quả
class Person():
    name = ""
    address = ""
    age = 0
    def __init__(self, name, address, age):
        self.name = name
        self.address = address
        self.age = age
    def inputDetails(self):
        self.name = input("Ten: ")
        self.address = input("Dia chi: ")
        self.age = int(input("Tuoi: "))
    def displayDetails(self):
        print("Ho ten la: " + str(self.name) + ". \nDia chi la: " + str(self.address) + ". \nTuoi la: " + str(self.age))

nv1 = Person()
nv2 = Person()
nv1.inputDetails()
nv1.displayDetails()
print("Nhap person 2: ")
nv2.inputDetails()
nv2.displayDetails()
