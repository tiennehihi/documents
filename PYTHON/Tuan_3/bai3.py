import csv
with open('E:\PYTHON\Tuan_3\haisan.csv', mode='w') as file:
    writer = csv.writer(file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
    
    data = [(['Ten mon', 'Loai mon', 'Gia', 'Xuat su']),
            (['Tom hum phomai', 'Mon an chinh', '3000000', 'Nha Trang']),
            (['Cua Ca Mau sot me', 'Mon khai vi', '350000', 'Vung Tau']),
            (['Lau bao ngu', 'Mon an chinh', '3500000', 'Khanh Hoa'])]
    
    for i in data:
        writer.writerow(i)
    
    # Ghi từng dữ liệu lên file
    # writer.writerow(['Ten mon', 'Loai mon', 'Gia', 'Xuat su'])
    # writer.writerow(['Tom hum phomai', 'Mon an chinh', '3000000', 'Nha Trang'])
    # writer.writerow(['Cua Ca Mau sot me', 'Mon khai vi', '350000', 'Vung Tau'])
    # writer.writerow(['Lau bao ngu', 'Mon an chinh', '3500000', 'Khanh Hoa'])
    # writer.writerow(['Hau sua tuoi song', 'Mon trang mieng', '5000000', 'Nam Dinh'])
    # writer.writerow(['So huyet khong long', 'Mon trang mieng', '4500000', 'Quy Nhon'])
    # writer.writerow(['Ghe tuoi hap', 'Mon an chinh', '3500000', 'Nha Trang'])
    
# import csv

# with open('E:\PYTHON\Tuan_3\haisan1.csv',mode='w') as file:
#     writer = csv.writer(file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)

#     writer.writerow(['Tom hum bo lo phomai', 'Mon an chinh', '3000000', 'Nha Trang'])
#     writer.writerow(['Cua Ca Mau sot me', 'Mon khai vi', '2220000', 'Ca Mau'])
#     writer.writerow(['Lau ca chinh bao ngu muc ong', 'Mon an chinh', '1540000', 'Vung Tau'])