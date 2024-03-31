# Tạo một chương trình Python cho phép thực hiện những công việc đọc ghi file như sau:
# - Tạo ra một file text có tên là fruits.txt.
# - Hãy khai báo một list gồm 10 phần tử, mỗi phần tử chứa tên của một loại trái cây bằng
# tiếng anh, sau đó ghi cả list này vào file sử dụng hàm writelines()
# - Sau đó, hãy đọc nội dung của file và hiển thị ra chương trình, sử dụng hàm readlines()
# - Hãy đếm xem có bao nhiêu dòng trong file có nội dung bắt đầu bằng chữ ‘b’ và in kết quả.
# - Hãy đếm xem có bao nhiêu dòng trong file có nội dung kết thúc bằng chữ ‘a’ và in ra kết quả.

# f = open('fruits.txt', 'w')
# fruits = ["Pitaya ", "Apple", "Orange", "Lemon", "Banana", "Coconut", "Breadfruit", "Papaya", "Lychee", "Guava", "Maracuja", "Chirimoya"]
# for i in fruits:
#     f.write(i + "\n")
# f.close()

def create_and_write_file():
    fruits = ["Pitaya ", "Apple", "Orange", "Lemon", "Banana", "Coconut", "Breadfruit", "Papaya", "Lychee", "Guava", "Maracuja", "Chirimoya"]
    with open("fruits.txt", "w") as file:
        file.writelines([fruit  + "\n" for fruit in fruits])
        
def read_file():
    with open('fruits.txt', 'r') as file:
        lines = file.readlines()
        for line in lines:
            print(line.strip())

def cnt_line_start_b():
    cnt = 0
    with open('fruits.txt', 'r') as file:
        lines = file.readlines()
        for line in lines:
            if line.strip().startswith('B'):
                # print(line.strip() + "\n")
                cnt += 1
        print("So hoa qua bat dau bang chu B la: ", cnt)
        
def cnt_line_end_a():
    cnt = 0
    with open('fruits.txt', 'r') as file:
        lines = file.readlines()
        for line in lines:
            if line.strip().endswith('a'):
                # print(line.strip() + "\n")
                cnt += 1
        print("So hoa qua ket thuc bang chu A la: ", cnt)

create_and_write_file()
read_file()
cnt_line_end_a()
cnt_line_start_b()