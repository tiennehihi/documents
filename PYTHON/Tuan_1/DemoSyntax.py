# print('Nhập số thứ nhất: ')
# a = int(input())
# print('Nhập số thứ hai: ')
# b = int(input())
# print('Tổng: ', a+b)
# print('Hiệu: ', a-b)
# print('Tích: ', a*b)
# print('Thương: ', a/b)



# Viết chương trình nhập số giờ làm việc và lương giờ rồi tính tiền lương tổng cộng.
# Nếu số giờ làm lớn hơn 40 thì những giờ làm dôi ra được tính 1.5 lần.
# Mở rộng
# Người lao động phải khấu trừ lại 10% thuế thu nhập cá nhân. Hãy tính ra in ra mức
# lương trước và sau thuế của người lao động

# print('Nhập số giờ làm: ');
# a = float(input())
# print('Nhập số lương CB: ')
# b = float(input())
# if a>40:
#     print('Tổng lương là: ', 40*b + (a-40)*b*1.5)
#     print('Lương sau thuế là: ', (40*b + (a-40)*b*1.5)*0.9)
# else:
#     print('Tổng lương là: ', a*b)
#     print('Lương sau thuế là: ', (a*b) * 0.9)



# Viết một Chương trình Python cho phép nhập vào lương của một nhân viên (là số
# nguyên), sau đó chương trình sẽ kiểm tra lương của người đó để tính thuế, nếu người đó
# có lương >= 500 thì sẽ tính và in ra số tiền thuế mà nhân viên phải nộp (là 20), còn nếu
# mức lương < 500 thì sẽ không phải nộp thuế, và sẽ in ra: “Ban khong phai nop thue”.

# print('Nhập số lương NV: ')
# luong = int(input())
# if luong >= 500:
#     print('Lương nhận được là: ', luong-20, '\nThuế nộp là: 20')
# else:
#     print('Lương nhận được là: ', luong)



# Viết một Chương trình cho phép tính tiền điện. Mỗi hộ gia đình sẽ được sử dụng 100 số
# điện đầu tiên (Giá rẻ ) với giá 450D/1KW. Công thức tính tiền điện cụ thể như sau:
# Từ số 101 – 200: Giá tiền sẽ là 600/KW
# Từ số 201 – 300: Giá tiền sẽ là 750/KW
# Từ số 301 – 500: Giá tiền sẽ là 900/KW
# Từ số 501 – 1000: Giá tiền sẽ là 1000/KW
# Từ số 1000 trở lên: Giá tiền sẽ là 1200/KW
# Yêu cầu: Nhập vào số KW tiêu thụ điện. Chương trình sẽ tính và in ra tổng số tiền mà ta
# phải nộp trước và sau khi tính thuế VAT (Thuế suất VAT = 10% tiền điện).

so_KW = float(input())
gia_re = 450
if so_KW <= 100:
    tong_tien_truoc_vat = so_KW * gia_re
    print('Tổng tiền trước VAT: ', tong_tien_truoc_vat)
    print('Tổng tiền sau VAT: ', tong_tien_truoc_vat + tong_tien_truoc_vat*0.1)
elif so_KW <= 200:
    tong_tien_truoc_vat = 100 * gia_re + (so_KW - 100) * 600
    print('Tổng tiền trước VAT: ', tong_tien_truoc_vat)
    print('Tổng tiền sau VAT: ', tong_tien_truoc_vat + tong_tien_truoc_vat * 0.1)
elif so_KW <= 300:
    tong_tien_truoc_vat = 100 * gia_re + 100 * 600 + (so_KW - 200) * 750
    print('Tổng tiền trước VAT: ', tong_tien_truoc_vat)
    print('Tổng tiền sau VAT: ', tong_tien_truoc_vat + tong_tien_truoc_vat * 0.1)
elif so_KW <= 500:
    tong_tien_truoc_vat = 100 * gia_re + 100 * 600 + 100 * 750 + (so_KW - 300) * 900
    print('Tổng tiền trước VAT: ', tong_tien_truoc_vat)
    print('Tổng tiền sau VAT: ', tong_tien_truoc_vat + tong_tien_truoc_vat * 0.1)
elif so_KW <= 1000:
    tong_tien_truoc_vat = 100 * gia_re + 100 * 600 + 100 * 750 + 200 * 900 + (so_KW - 500) * 1000
    print('Tổng tiền trước VAT: ', tong_tien_truoc_vat)
    print('Tổng tiền sau VAT: ', tong_tien_truoc_vat + tong_tien_truoc_vat * 0.1)
else:
    tong_tien_truoc_vat = 100 * gia_re + 100 * 600 + 100 * 750 + 200 * 900 + 500 * 1000 + (so_KW - 1000) * 1200
    print('Tổng tiền trước VAT: ', tong_tien_truoc_vat)
    print('Tổng tiền sau VAT: ', tong_tien_truoc_vat + tong_tien_truoc_vat * 0.1)
