# Tạo một chương trình Python cho phép thực hiện những công việc sau:
# - Tạo ra một file text với tên được nhập vào từ bàn phím.
# - Sau đó sử dụng một vòng lặp, nhập 10 dòng văn bản vào file.
# - Đọc ra nội dung của file vừa được ghi.
# - Đếm xem trong file có bao nhiêu dòng có nội dung bắt đầu bằng chuỗi “Tony”
# - Đếm xem trong file có bao nhiêu dòng có nội dung kết thúc bằng chuỗi “Hải”
import string

nameFile = str(input("Nhập tên file: "))
f = open(nameFile, 'w')
for i in range(1, 11):
    f.write("Du lieu dong thu " + str(i) + "\n")
    if(i%3 == 0):
        f.write("Tony thu " + str(i) + " ahihi nyc la do con cho \n")
    elif(i%3 != 1):
        f.write("Noi dung dong " + str(i) + " co Hai\n")
f.close()

cntTony = 0
cntHai = 0
openFile = str(input("Nhap ten file muon mo: "))
f = open(openFile, 'r')
contents = f.readlines()
# Xác định các dấu câu kết thúc câu
punctuations = set(string.punctuation)
for i in contents:
    print(i)
    if i.startswith('Tony'):
        cntTony += 1
    # Tách các từ trong câu
    words = i.split()
    if len(words) > 0:
        last_word = words[-1].strip(string.punctuation)
        if last_word == 'Hai':
            cntHai += 1
print(str(cntTony) + " " + str(cntHai))
f.close()

# punctuations = set(string.punctuation): Đoạn mã này tạo ra một tập hợp (set) chứa các ký tự dấu câu từ module string.punctuation. 
# Module string cung cấp một chuỗi các ký tự dấu câu tiêu chuẩn trong Python. Bằng cách chuyển nó thành một tập hợp (set), 
# chúng ta loại bỏ các ký tự trùng lặp và tạo ra một tập hợp có thể được sử dụng để kiểm tra xem một ký tự có phải là dấu câu hay không.

# words = i.split(): Đoạn mã này tách câu thành các từ bằng cách sử dụng phương thức split(). 
# Phương thức này tách chuỗi thành các phần tử riêng biệt dựa trên khoảng trắng mặc định. 
# Kết quả là một danh sách (list) chứa các từ trong câu.

# if len(words) > 0:: Đoạn mã này kiểm tra xem danh sách words có chứa ít nhất một từ hay không. 
# Nếu danh sách không rỗng, chúng ta tiếp tục kiểm tra từ cuối cùng trong câu.

# last_word = words[-1].strip(string.punctuation): Đoạn mã này lấy từ cuối cùng trong danh sách words bằng cách sử dụng chỉ số âm -1. 
# Sau đó, chúng ta sử dụng phương thức strip(string.punctuation) để loại bỏ các ký tự dấu câu từ từ cuối cùng. 
# Nếu từ cuối cùng chỉ chứa ký tự dấu câu, các ký tự đó sẽ được loại bỏ.

# if last_word == 'Hai':: Đoạn mã này kiểm tra xem từ cuối cùng đã được xử lý (last_word) có trùng khớp với chuỗi "Hai" hay không. 
# Nếu trùng khớp, biến cntHai được tăng lên 1, đếm số câu mà từ "Hai" nằm ở cuối cùng.