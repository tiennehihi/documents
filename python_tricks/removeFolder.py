# import os

# # Đường dẫn đến thư mục cần xóa
# folder_path = "E:\Ecommerce-Flask-React"

# # Kiểm tra nếu thư mục tồn tại
# if os.path.exists(folder_path):
#     # Xóa thư mục
#     os.rmdir(folder_path)
#     print("Đã xóa thư mục thành công.")
# else:
#     print("Thư mục không tồn tại.")

# import shutil

# # Đường dẫn đến thư mục cần xóa
# folder_path = "E:\Ecommerce-Flask-React\client"

# # Xóa thư mục
# shutil.rmtree(folder_path)
# print("Đã xóa thư mục thành công.")


# import subprocess

# # Đường dẫn đến thư mục cần xóa
# folder_path = r"E:\Ecommerce-Flask-React\client\node_modules"

# # Xóa thư mục bằng lệnh hệ thống
# subprocess.run(["rmdir", folder_path, "/s", "/q"], shell=True)
# print("Đã xóa thư mục thành công.")



# import subprocess

# # Đường dẫn đến thư mục cần xóa
# folder_path = r"E:\Ecommerce-Flask-React\client\node_modules"

# # Xóa thư mục bằng lệnh hệ thống
# subprocess.run(["rmdir", folder_path, "/s", "/q"], shell=True)
# print("Đã xóa thư mục thành công.")

import os

# Đường dẫn đến thư mục chứa các tệp tin
folder_path = r"E:\Ecommerce-Flask-React\client\node_modules"

# Lặp qua tất cả các tệp tin trong thư mục
for filename in os.listdir(folder_path):
    # Tạo đường dẫn tới tệp tin ban đầu
    old_filepath = os.path.join(folder_path, filename)
    
    # Tạo tên mới cho tệp tin
    new_filename = "new_" + filename
    
    # Tạo đường dẫn tới tệp tin mới
    new_filepath = os.path.join(folder_path, new_filename)
    
    # Đổi tên tệp tin
    os.rename(old_filepath, new_filepath)

print("Đã đổi tên tất cả các tệp tin thành công.")