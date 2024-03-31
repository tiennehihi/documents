# Tạo một chương trình Python cho phép thực hiện những công việc sau:
# - Tạo ra một file text có tên là data.txt.
# - Sau đó sử dụng một vòng lặp, nhập 5 dòng văn bản vào file.
# - Đọc ra nội dung của file vừa được ghi.
f = open('data.txt', 'w+')
i=0
for i in range(1, 6):
    f.write("Du lieu dong " + str(i) + "\n") 
    i += 1
f.close()
f = open('data.txt', 'r')
contents = f.readlines()
for i in contents:
    print(i)
f.close()