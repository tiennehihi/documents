# Viết một Chương trình Python cho phép tính toán các hình số học. Chương
# trình sẽ bao gồm các chức năng như sau:
# 1. Tính diện tích hình tròn
# 2. Tính diện tích hình chữ nhật
# 3. Tính diện tích tam giác
# 4. Tính diện tích hình vuông
# 5. Tính diện tích hình thoi
# 6. Tính diện tích hình bình hành
# 7. Kết thúc
# Hãy định nghĩa các hàm nhận các giá trị tham số đầu vào và trả về diện tích
# của các hình trên. Chương trình sẽ hiển thị menu như trên, mỗi khi người
# dùng chọn một mục trên menu thì sẽ gọi hàm tương ứng để thực hiện rồi in
# kết quả. Hãy cho phép nhập các giá trị vào từ bàn phím.

print('1. Tính diện tích hình tròn', '\n2. Tính diện tích hình chữ nhật', '\n3. Tính diện tích tam giác', '\n4. Tính diện tích hình vuông', '\n5. Tính diện tích hình thoi', '\n6. Tính diện tích hình bình hành', '\n7. Ket thuc')
lc = int(input())
def S_hinhTron(r):
    PI = 3.1415
    return PI * (r**2)
def S_hcn(a, b):
    return a*b
def S_tamGiac(cc, day):
    return (cc*day)/2
def S_hinhThoi(c1, c2):
    return (c1*c2)/2
def S_hinhVuong(a):
    return a**2
def S_hbh(cc, day):
    return cc*day

if lc==1:
    a = float(input())
    print(S_hinhTron(a))
elif lc == 2:
    a = float(input())
    b = float(input())
    print(S_hcn(a, b))
elif lc==3:
    a = float(input())
    b = float(input())
    print(S_tamGiac(a, b))
elif lc==4:
    a = float(input())
    print(S_hinhVuong(a))
elif lc==5:
    a = float(input())
    b = float(input())
    print(S_hinhThoi(a, b))
elif lc==6:
    a = float(input())
    b = float(input())
    print(S_hbh(a, b))
elif lc==7:
    print('Moi chuyen cung da ket thuc tu rat lau ròi !!!')