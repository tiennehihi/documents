import os

# cmd = 'date'
# os.system(cmd)
# cmd = 'notepad'
# os.system(cmd)

# Lấy về số lượng CPU của hệ thống
# cpuCnt = os.cpu_count()
# print("Number of CPUs in the system: ", cpuCnt)

# Duyệt qua các file trong thư mục hiện tại bang method scandir()
obj = os.scandir()
# Liệt kê danh sách các file và thư mục của OS
for entry in obj:
    if entry.is_dir() or entry.is_file():
        print(entry.name)

# CLose obj
obj.close()