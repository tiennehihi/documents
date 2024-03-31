class NhanVien:
    'Lop nay mo ta ve cac nhan vien'

    # phuong thuc khoi tao cua lop
    def __init__(self, ma, ten, tuoi, diachi):
        self.ma = ma
        self.ten = ten
        self.tuoi = tuoi
        self.diachi = diachi

    # dinh nghia method cua lop
    def display(self):
        print('Ma = ', self.ma)
        print('Ho ten = ', self.ten)
        print('Tuoi = ', self.tuoi)
        print('Dia chi = ', self.diachi)


id = int(input('Moi ban nhap ma nhan vien: '))
name = input('Moi ban nhap ho ten nhan vien: ')
age = int(input('Moi ban nhap tuoi nhan vien: '))
address = input('Moi ban nhap dia chi nhan vien: ')

# khoi tao doi tuong cua lop
nv1 = NhanVien(id, name, age, address)

# goi method cua doi tuong nv1
nv1.display()