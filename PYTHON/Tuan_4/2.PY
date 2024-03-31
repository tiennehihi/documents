# Hãy viết một chương trình Python có sử dụng NumPy để cho phép thao tác với mảng.
# Hãy thực hiện các thao tác sau:
# - Hãy thử tạo ra mảng với các hàm zeros(), ones(), empty()
# - Hãy khai báo 2 mảng gồm 3 dòng 4 cột, rồi thực hiện các thao tác cộng, trừ, nhân 2
# mảng này.
# - Hãy nối 2 mảng này theo 2 chiều dọc và chiều ngang, sử dụng 2 hàm vstack() và
# hstack().
# - Hãy tính và in ra min, max, sum của mảng. Sau đó tìm và in ra min, max, sum của từng
# trục trong mảng (axis = 0, axis = 1)
# - Tiếp theo, hãy ghi dữ liệu tính toán được ra file JSON với tên là dulieu.json.

import numpy as np

# - Hãy thử tạo ra mảng với các hàm zeros(), ones(), empty()
arrz = np.zeros([3, 4], dtype=float)
arro = np.ones([3, 4], dtype=float)
arre = np.empty([3, 4], dtype=float)

# print(arrz)
# print(arro)
# print(arre)

arr1 = np.array([[1, 2, 3, 0], [4, 5, 6, 0], [7, 8, 9, 0]])
arr2 = np.array([[9, 8, 7, 1], [6, 5, 4, 1], [4, 3, 2, 1]])
# - Hãy khai báo 2 mảng gồm 3 dòng 4 cột, rồi thực hiện các thao tác cộng, trừ, nhân 2 mảng này.
# print(arr1 + arr2)
# print(arr1 - arr2)
# print(arr1 * arr2)

# - Hãy nối 2 mảng này theo 2 chiều dọc và chiều ngang, sử dụng 2 hàm vstack() và hstack().
# print(np.vstack((arr1, arr2)))
# print(np.hstack((arr1, arr2)))

# - Hãy tính và in ra min, max, sum của mảng. Sau đó tìm và in ra min, max, sum của từng trục trong mảng (axis = 0, axis = 1)
# print(np.max(arr1, axis=0))
# print(np.max(arr1, axis=1))
# print(np.sum(arr1))

# - Tiếp theo, hãy ghi dữ liệu tính toán được ra file JSON với tên là dulieu.json.
file = open("dulieu.json", "w+", encoding="utf-8")
file.write("Mảng 1:" + "\n")
file.write(str(arr1) + "\n")
file.write("Mảng 2:" + "\n")
file.write(str(arr2) + "\n")
file.write("Cộng hai mảng:" + "\n")
file.write(str(arr1 + arr2) + "\n")
file.write("Trừ hai mảng:" + "\n")
file.write(str(arr1 - arr2) + "\n")
file.write("Nhân hai mảng:" + "\n")
file.write(str(arr1 * arr2) + "\n")
file.write("Mảng nối theo chiều dọc là:")
file.write(str(np.vstack((arr1, arr2))) + "\n")
file.write("Mảng nối theo chiều ngang là:")
file.write(str(np.hstack((arr1, arr2))) + "\n")
file.write("Min của mảng 1 là:" + str(np.min(arr1)) + "\n")
file.write("Max của mảng 1 là: " + str(np.max(arr1)) + "\n")
file.write("Sum của mảng 1 là: " + str(np.sum(arr1)) + "\n")
file.write("Min của các dòng của mảng 1 là:" + str(np.amin(arr1, 0)) + "\n")
file.write("Max của từng cột của mảng 1 là:" + str(np.amax(arr1, 1)) + "\n")
file.write("Sum của từng dòng trong mảng 1 là: " + str(np.sum(arr1, 0)) + "\n")