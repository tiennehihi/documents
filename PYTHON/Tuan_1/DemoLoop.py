# i = 1
#
# while i <= 10:
#     print('i = ', i)
#     i += 1
#
# list = [5, 9 ,4, 6, 3, 2, 4, 7]
#
# # minh hoa vong lap for
# for i in list:
#     print(i)
# else:
#     print('Ket thuc vong lap !')



# Hãy sử dụng vòng lặp while để thực hiện chương trình sau:
# Hãy nhập vào một số từ bàn phím. Sau đó hãy tính và in ra tổng của các số từ 1 đến số
# vừa nhập vào bàn phím.
# Tiếp theo, hãy sử dụng vòng lặp while để in ra các số lẻ từ 100-50 (duyệt từ 100 về 50)

# sum = 0
# n = int(input())
# while n>=0:
#     sum += n;
#     n = n - 1
# print (sum)
#
# i = 100
# while i > 50:
#     i-=1
#     if i%2 != 0:
#         print(i, " ")



# Bài 1: Viết một chương trình Python thực hiện vòng lặp for cho phép tính tổng và tổng
# bình phương của một trăm số nguyên đầu tiên

# i=1
# sum=0
# sum_2 = 0
# for i in range(1, 101):
#     sum+=i
#     i = i+1
# print(sum, sum_2)



# Bài 2: Viết một chương trình Python tính trung bình cộng của 100 số nguyên đầu tiên.

# i=1
# sum=0
# for i in range(1, 101):
#     sum+=i
#     i+=1
# print(sum/100)



# Bài 3: Viết chương trình Python cho phép tính và in ra giai thừa của một số được nhập
# vào từ bàn phím.

# i=1
# gt = 1
# n = int(input())
# for i in range(1, n+1):
#     gt = gt*i
#     i+=1
# print(gt)



# Hãy viết một chương trình Python cho phép sử dụng vòng lặp for và hàm range() để
# thực hiện các công việc sau:
# - Nhập vào một số từ bàn phím (từ 1-10)
# - In ra bảng cửu chương của số đó.
# - In ra tất cả các số từ 1 cho đến số được nhập (với bước nhảy là 2)

# i=1
# tich = 1
# n = int(input())
# for i in range(0, 10):
#     tich*=i
#     i+=1
#     print(n ,' * ', i, ' = ', n*i )

# for i in range(i, n+1, 2):
#     print(i)





