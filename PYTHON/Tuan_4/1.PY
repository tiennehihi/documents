# Hãy khởi tạo một mảng các số thực sử dụng NumPy, mảng 2 chiều gồm 3 dòng 4 cột,
# sau đó thực hiện các thao tác sau:
# - Làm tròn số các phần tử của mảng rồi hiển thị.
# - Thực hiện làm tròn lên (ceil()) và làm tròn xuống (floor()) rồi hiển thị kết quả.
# - Hãy hiển thị các giá trị min, max của từng axis trong mảng
# - Tính tổng và trung bình cộng của các phần tử trong mảng
# - Hiển thị các giá trị thống kê: median, mean, average trong mảng
# - Hãy lưu các giá trị được tính toán ở các câu trên vào một file CSV với tên là
# calculate.csv.

import numpy as np
import random
import csv
arr = np.empty([3, 4], dtype=float)
for i in range(3):
    for j in range(4):
        arr[i][j] = random.random() * 10

print(arr)

# - Làm tròn số các phần tử của mảng rồi hiển thị.
print(np.round(arr))
    
# - Thực hiện làm tròn lên (ceil()) và làm tròn xuống (floor()) rồi hiển thị kết quả.
print(np.ceil(arr))
print(np.floor(arr))

# - Hãy hiển thị các giá trị min, max của từng axis trong mảng
print("Giá trị lớn nhất của các dòng là: ", np.amax(arr, 0))
print("Giá trị nhỏ nhất của các dòng là: ", np.amin(arr, 0))
print("Giá trị lớn nhất của các cột là: ", np.amax(arr, 1))
print("Giá trị nhỏ nhất của các cột là: ", np.amin(arr, 1))

# - Tính tổng và trung bình cộng của các phần tử trong mảng
print("Giá trị trung bình của mảng là: ", np.average(arr))

# - Hiển thị các giá trị thống kê: median, mean, average trong mảng
print("Median: ", np.median(arr))
print("Mean: ", np.mean(arr))
print("Average: ", np.average(arr))

# - Hãy lưu các giá trị được tính toán ở các câu trên vào một file CSV với tên là calculate.csv.
with open('E:\PYTHON\Tuan_4\calculate.csv', mode='w', encoding='utf-8') as file:
    writer = csv.writer(file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
    
    writer.writerow(["Mảng: ", arr])
    writer.writerow(["Mảng sau khi làm tròn: ", np.round(arr)])
    writer.writerow(["Mảng sau khi làm tròn lên: ", np.ceil(arr)])
    writer.writerow(["Mảng sau khi làm tròn xuống: ", np.floor(arr)])
    writer.writerow(["Giá trị lớn nhất của các dòng là: ", np.amax(arr, 0)])
    writer.writerow(["Giá trị nhỏ nhất của các dòng là: ", np.amin(arr, 0)])
    writer.writerow(["Giá trị lớn nhất của các cột là: ", np.amax(arr, 1)])
    writer.writerow(["Giá trị nhỏ nhất của các cột là: ", np.amin(arr, 1)])
    writer.writerow(["Giá trị trung bình của mảng là: ", np.average(arr)])
    writer.writerow(["Mean: ", np.mean(arr)])
    writer.writerow(["Average: ", np.average(arr)])
    writer.writerow(["Median: ", np.median(arr)])