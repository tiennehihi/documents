# Viết một chương trình Python cho phép tính diện tích và chu vi của các hình học
# như sau:
# 1. Tính diện tích và chu vi hình chữ nhật.
# 2. Tính diện tích và chu vi hình vuông.
# 3. Tính diện tích và chu vi hình tròn.
# 4. Tính diện tích và chu vi hình tam giác
# 5. Thoát.
# Chương trình sẽ được thể hiện theo dạng menu, cần tạo ra các class thể hiện các
# hình trên, mỗi class sẽ bao gồm một constructor cho phép truyền vào các tham số
# cần thiết, VD như hình chữ nhật sẽ bao gồm 2 tham số là chiều dài và chiều rộng.
# Mỗi một class sẽ bao gồm một method tính diện tích và một method tính chu vi.
# Hãy thực thi chương trình và in kết quả.

class HinhChuNhat():
    def __init__(self, cd, cr):
        self.cd = cd
        self.cr = cr
    def tinh_dien_tich(self):
        return self.cd * self.cr
    def tinh_chu_vi(self):
        return 2 * (self.cd + self.cr)
    
class HinhVuong():
    def __init__(self, dodai):
        self.dodai = dodai
    def tinh_dien_tich(self):
        return self.dodai**2
    def tinh_chu_vi(self):
        return 4*self.dodai

class HinhTron():
    def __init__(self, r):
        self.r = r
    def tinh_dien_tich(self):
        return 3.14 * (self.r ** 2)
    def tinh_chu_vi(self):
        return 2 * 3.14 * self.r

class HinhTamGiac():
    def __init__(self, a, b, c):
        self.a = a
        self.b = b
        self.c = c
    def tinh_dien_tich(self):
        pass
        