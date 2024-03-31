# Hãy viết một chương trình Python cho phép sử dụng module để tính toán diện tích của các hình
# nâng cao. Hãy tạo một module bao gồm các hàm sau:
# Tính chu vi và diện tích hình bình hành (các cạnh được nhập vào từ bàn phím)
# Tính chu vi và diện tích hình trụ (chiều cao và thông số khác được nhập vào từ bàn phím)
# Tính chu vi và diện tích hình thoi
# Tính chu vi và diện tích hình ngũ giác đều
# Tính chu vi và diện tích hình thang cân
# Các hàm này sẽ trả về chu vi và diện tích của hình tương ứng. Mỗi hình sẽ bao gồm 2 hàm tính
# chu vi và diện tích riêng.
# Sau đó, hãy import tất cả các hàm của module này (có tên là hinhhocnangcao.py), rồi gọi các
# hàm trong module ra để sử dụng.

import hinhhocnangcao as hhnc

# Tính chu vi và diện tích hình bình hành
a = float(input("Nhập vào chiều dài cạnh a của hình bình hành: "))
b = float(input("Nhập vào chiều dài cạnh b của hình bình hành: "))
chu_vi, dien_tich = hhnc.tinh_chu_vi_dien_tich_hinh_binh_hanh(a, b)
print("Chu vi hình bình hành:", chu_vi)
print("Diện tích hình bình hành:", dien_tich)

# Tính chu vi và diện tích hình trụ
r = float(input("Nhập vào bán kính r của hình trụ: "))
h = float(input("Nhập vào chiều cao h của hình trụ: "))
chu_vi, dien_tich = hhnc.tinh_chu_vi_dien_tich_hinh_tru(r, h)
print("Chu vi hình trụ:", chu_vi)
print("Diện tích hình trụ:", dien_tich)

# Tính chu vi và diện tích hình thoi
d = float(input("Nhập vào đường chéo d của hình thoi: "))
t = float(input("Nhập vào đường cao t của hình thoi: "))
chu_vi, dien_tich = hhnc.tinh_chu_vi_dien_tich_hinh_thoi(d, t)
print("Chu vi hình thoi:", chu_vi)
print("Diện tích hình thoi:", dien_tich)

# Tính chu vi và diện tích hình ngũ giác đều
a = float(input("Nhập vào cạnh a của hình ngũ giác đều: "))
chu_vi, dien_tich = hhnc.tinh_chu_vi_dien_tich_hinh_ngu_giac_deu(a)
print("Chu vi hình ngũ giác đều:", chu_vi)
print("Diện tích hình ngũ giác đều:", dien_tich)

# Tính chu vi và diện tích hìnhthang cân
a = float(input("Nhập vào đáy lớn a của hình thang cân: "))
b = float(input("Nhập vào đáy nhỏ b của hình thang cân: "))
h = float(input("Nhập vào chiều cao h của hình thang cân: "))
chu_vi, dien_tich = hhnc.tinh_chu_vi_dien_tich_hinh_thang_can(a, b, h)
print("Chu vi hình thang cân:", chu_vi)
print("Diện tích hình thang cân:", dien_tich)