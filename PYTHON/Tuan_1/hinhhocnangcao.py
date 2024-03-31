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

import math

def tinh_chu_vi_dien_tich_hinh_binh_hanh(a, b):
    chu_vi = 2 * (a + b)
    dien_tich = a * b
    return chu_vi, dien_tich

def tinh_chu_vi_dien_tich_hinh_tru(r, h):
    chu_vi = 2 * math.pi * r + 2 * math.pi * r * h
    dien_tich = 2 * math.pi * r * (r + h)
    return chu_vi, dien_tich

def tinh_chu_vi_dien_tich_hinh_thoi(d, t):
    chu_vi = 4 * d
    dien_tich = (d * t) / 2
    return chu_vi, dien_tich

def tinh_chu_vi_dien_tich_hinh_ngu_giac_deu(a):
    chu_vi = 5 * a
    dien_tich = (math.sqrt(5 * (5 + 2 * math.sqrt(5)))) / 4 * a ** 2
    return chu_vi, dien_tich

def tinh_chu_vi_dien_tich_hinh_thang_can(a, b, h):
    chu_vi = a + b + 2 * math.sqrt((0.5 * (a - b)) ** 2 + h ** 2)
    dien_tich = 0.5 * (a + b) * h
    return chu_vi, dien_tich