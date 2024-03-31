# // Hãy phát triển chương trình Python cho phép cài đặt tính thừa kế. Định nghĩa một lớp
# // Vehicle thể hiện các phương tiện, trong lớp này gồm 2 thuộc tính là: price, color và một
# // method accelerate(). Tiếp theo, hãy định nghĩa 3 lớp con lần lượt là Bike, Car và Bus kế
# // thừa lớp Vehicle. Mỗi lớp này hãy định nghĩa method printDetails() để hiển thị thông tin
# // chi tiết của đối tượng.
# // Sau đó, hãy khởi tạo 3 đối tượng thuộc 3 lớp con và hiển thị thông tin chi tiết của từng
# // đối tượng này.

class Vehicle():
    def __init__(self, price, color):
        self.price = price
        self.color = color
    def accelerate():
        print("Xe đang tăng tốc...")

class Bike(Vehicle):
    def __init__(self, price, color, number_of_gears):
        super().__init__(price, color)
        self.number_of_gears = number_of_gears
    def printDetails(self):
        print("Loại xe: xe đạp")
        print("Giá: ", self.price)
        print("Màu: ", self.color)
        print("Số lượng bánh: ", self.number_of_gears)
        
class Car(Vehicle):
    def __init__(self, price, color, number_of_gears):
        super().__init__(price, color)
        self.number_of_gears = number_of_gears
    def printDetails(self):
        print("Loại xe: xe ô tô")
        print("Giá: ", self.price)
        print("Màu: ", self.color)
        print("Số lượng bánh: ", self.number_of_gears)
        
class Bus(Vehicle):
    def __init__(self, price, color, number_of_gears):
        super().__init__(price, color)
        self.number_of_gears = number_of_gears
    def printDetails(self):
        print("Loại xe: xe bus")
        print("Giá: ", self.price)
        print("Màu: ", self.color)
        print("Số lượng bánh: ", self.number_of_gears)
        
if __name__ == "__main__":
    bike1 = Bike(50000, "Đen", 2)
    car1 = Car(70000, "Đỏ", 4)
    bus1 = Bus(80000, "Xanh da trời", 8)
    bike1.printDetails()
    car1.printDetails()
    bus1.printDetails()