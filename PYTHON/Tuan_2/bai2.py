# Viết một chương trình Python cho phép định nghĩa lớp. Tạo ra một lớp Calculator thể
# hiện máy tính điện tử. Định nghĩa 4 method add(), minus(), devide(), multiple() cho phép
# thể hiện 4 phép tính cơ bản.
# Sau đó hãy định nghĩa method factorial() cho phép tính và in ra giai thừa của tham số.
# Tiếp theo hãy khởi tạo một đối tượng của lớp, rồi gọi 4 method của lớp để xem kết quả.
# Chú ý: Hai số được nhập vào từ bàn phím.

class Calculator():
    def __init__(self, a, b):
        self.a = a
        self.b = b
    def add(self):
        return self.a + self.b
    def minus(self):
        return self.a - self.b
    def devide(self):
        return self.a / self.b
    def multiple(self):
        return self.a * self.b
    def factorial(self):
        if self.a < 0:
            return None
        elif self.a == 0:
            return 1
        else:
            gt = 1
            for i in range(1, self.a + 1):
                gt *= i
            return gt
        # else:
        #     return self.a * self.factorial(self.a - 1)


a = int(input("Nhập số a: "))
b = int(input("Nhập số b: "))
calculator = Calculator(a, b)
print("Phép cộng: ", calculator.add())
print("Phép trừ: ", calculator.minus())
print("Phép chia: ", calculator.devide())
print("Phép nhân: ", calculator.multiple())
print("Giai thừa của a: ", calculator.factorial())
            