import numpy as np
a = np.empty((3, 4), dtype=np.int64)
for i in range(3):
    for j in range(4):
        a[i][j] = int(input())
f = open('data.txt', 'w+', encoding='utf-8')
f.write("Mảng: " + '\n')
f.write(str(a) + '\n')
f.write("Phần tử ở dòng 2 cột 3 là: " + str(a[1][2]) + '\n')
f.write("Các giá trị max của các dòng là: " + str(a.max(axis=1)) + '\n')
f.write("Các giá trị min của các dòng là: " + str(a.min(axis=1)) + '\n')
f.write("Các giá trị max của các cột là:" + str(a.max(axis=0)) + '\n')
f.write("Các giá trị min cua các cột là: " + str(a.min(axis=0)) + '\n')
f.write("Size của mảng là: " + str(a.size) + '\n')
f.write("Shape của mảng là: " + str(a.shape) + '\n')
f.write("Số chiều của mảng là: " + str(a.ndim) + '\n')
a = a.reshape(4, 3)
f.write("Mảng sau khi reshape là: " + '\n')
f.write(str(a) + '\n')
f.seek(0)
print(f.read())



# import numpy

# # doan code minh hoa nhap mang NumPy vao tu ban phim
# my_array = []
# a = int(input("Size of array:"))
# for i in range(a):
#     my_array.append(float(input("Element:")))
# my_array = numpy.array(my_array)
# print(numpy.floor(my_array))