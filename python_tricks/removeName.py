# import os

# folder_path = "d:\\Users\\VUTIEN\\Downloads\\estXoa"
  
# # Thay đổi thành đường dẫn của thư mục chứa các tệp

# # Duyệt qua tất cả các tệp trong thư mục
# for filename in os.listdir(folder_path):
#     full_path = os.path.join(folder_path, filename)
    
#     # Kiểm tra nếu tên tệp bắt đầu bằng "Bản sao của"
#     if filename.startswith("bản sao của"):
#         new_filename = filename.replace("Bản sao của", "", 1)  # Loại bỏ phần "Bản sao của" (chỉ lần xuất hiện đầu tiên)
#         new_full_path = os.path.join(folder_path, new_filename)
#         os.rename(full_path, new_full_path)  # Đổi tên tệp

# print("Đã đổi tên các tệp.")

import os

# Đường dẫn tới thư mục chứa tệp cần thay đổi tên
folder_path = r"d:\Users\VUTIEN\Downloads\Future"

# Tìm các tệp trong thư mục
file_list = os.listdir(folder_path)

# Lặp qua từng tệp và thay đổi tên
for old_name in file_list:
    if old_name.startswith("Bản sao của"):
        new_name = old_name.replace("Bản sao của", "").strip()
        old_path = os.path.join(folder_path, old_name)
        new_path = os.path.join(folder_path, new_name)
        os.rename(old_path, new_path)
