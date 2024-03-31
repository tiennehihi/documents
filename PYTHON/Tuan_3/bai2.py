import numpy as np
seafood_type = [('name', (np.str_, 30)), ('age', np.int32), ('address', (np.str_, 50))]

a = np.array([('Tiểu Vy', 23, "Nam Định"), ('Nguyễn Phương Nhi', 20, "Hà Nội"),
              ('Trần Phương Ly', 30, 'Thanh Hóa'), ('Quỳnh Kool', 18, 'Nam Định'),
               ('Thảo Vi', 40, 'Hà Nam'), ('Hà Kiều Anh', 18, 'An Giang')], dtype=seafood_type)

e = np.array([('Ngọc Huyền', 20, 'Nam Định'), ('Nguyễn Phưng Nga', 18, 'Thai Binh')], dtype=seafood_type)

# b = np.sort(a, order='age')
# c = np.sort(a, order='name')
# d = np.sort(a, order='address')

concat_data = np.concatenate((a, e))
print('Mảng sau khi concat: ', concat_data)

# print('Sap xep mang theo thuoc tinh age: ', b)
# print('\nSap xep mang theo thuoc tinh name: ', c)
# print('\nSap xep mang theo thuoc tinh address: ', d)