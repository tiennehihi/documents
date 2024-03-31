import tkinter as tk
from tkinter import messagebox

root = tk.Tk()
# thiet lap 1 windows size
root.geometry("400x200")
root.title('Back-End with Python')

# khai bao cac bien de binding voi cac entry
num1_var = tk.StringVar()
num2_var = tk.StringVar()
result_var = tk.StringVar()

# khoi tao cac Tkinter widget de dua vao man hinh
lblNum1 = tk.Label(root, text='So thu nhat: ', font=('calibre', 10, 'bold'))
txtNum1 = tk.Entry(root, textvariable=num1_var, font=('calibre', 10, 'bold'))
lblNum2 = tk.Label(root, text='So thu hai: ', font=('calibre', 10, 'bold'))
txtNum2 = tk.Entry(root, textvariable=num2_var, font=('calibre', 10, 'bold'))
lblResult = tk.Label(root, text='Ket qua: ', font=('calibre', 10, 'bold'))
txtResult = tk.Entry(root, textvariable=result_var, font=('calibre', 10, 'bold'))

#dinh nghia ham tinh toan phep tinh
def tinhtoan():
    # Kiem tra du lieu tren form
    if num1_var.get() == "":
        messagebox.showinfo("ERROR !", "Trường không được để trống.")
        txtNum1.focus_set()
        return
    
    if num2_var.get() == "":
        messagebox.showinfo("ERROR !", "Trường không được để trống.")
        txtNum2.focus_set()
        return
    
    num1 = num1_var.get()
    num2 = num2_var.get()
    
    print("Num 1 is: " + num1)
    print("Num 2 is: " + num2)
    
    # tinh toan 
    result = int(num1) + int(num2)
    
    num1_var.set("")
    num2_var.set("")
    result_var.set(str(result))
    
# tao ra Button de moi khi click vao thi se hoi ham tinhtoan()
sub_btn = tk.Button(root, text="Tính toán", command=tinhtoan)

# dat cac widget giao dien vao form
lblNum1.grid(row=0, column=0)
txtNum1.grid(row=0, column=1)
lblNum2.grid(row=1, column=0)
txtNum2.grid(row=1, column=1)
lblResult.grid(row=2, column=0)
txtResult.grid(row=2, column=1)
sub_btn.grid(row=3, column=1)

# hien thi man hinh
root.mainloop()