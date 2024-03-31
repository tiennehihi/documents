from tkinter import *
from tkinter import messagebox
import sqlite3

ws = Tk()
ws.title('Đăng ký tài khoản - Python desktop')
ws.config(bg='#0b5a81')
f = ('Times', 14)
var = StringVar()
var.set('male')

# Ket noi CSDL va tao bang
con = sqlite3.connect('quanlynhanvien.db')
cur = con.cursor()
cur.execute('''CREATE TABLE IF NOT EXISTS employee(
                    name text,
                    email text,
                    contact number,
                    gender text,
                    country text,
                    password text
                )
            ''')
con.commit()


# Doc file text va load du lieu ra ComboBox
countries = []
variable = StringVar()
world = open("countries.txt", "r")
for country in world:
    country = country.rstrip('\n')
    countries.append(country)

print(countries)
variable.set(countries[1])


right_frame = Frame(
    ws,
    bd=2,
    bg='#ccc',
    relief=SOLID,
    padx=10,
    pady=10
)

Label(
    right_frame,
    text="Họ tên:",
    bg="#cccccc",
    font = f
).grid(row=0, column=0, sticky=W, pady=10)

Label(
    right_frame,
    text="Email:",
    bg="#cccccc",
    font=f
).grid(row=1, column=0, sticky=W, pady=10)

Label(
    right_frame,
    text="Điện thoại:",
    bg="#cccccc",
    font=f
).grid(row=2, column=0, sticky=W, pady=10)

Label(
    right_frame,
    text="Chọn giới tính:",
    bg="#cccccc",
    font=f
).grid(row=3, column=0, sticky=W, pady=10)

Label(
    right_frame,
    text="Chọn quốc gia:",
    bg="#cccccc",
    font=f
).grid(row=4, column=0, sticky=W, pady=10)

Label(
    right_frame,
    text="Password:",
    bg="#cccccc",
    font=f
).grid(row=5, column=0, sticky=W, pady=10)

Label(
    right_frame,
    text="Re-Enter Password:",
    bg="#cccccc",
    font=f
).grid(row=6, column=0, sticky=W, pady=10)

gender_frame = LabelFrame(
    right_frame,
    bg='#cccccc',
    padx=10,
    pady=10
)

register_name = Entry(
    right_frame,
    font=f
)

register_email = Entry(
    right_frame,
    font=f
)

register_mobile = Entry(
    right_frame,
    font=f
)

male_rb = Radiobutton(
    gender_frame,
    text='Nam',
    bg='#cccccc',
    variable=var,
    value='male',
    font=('Times', 10)
)

female_rb = Radiobutton(
    gender_frame,
    text='Nữ',
    bg='#cccccc',
    variable=var,
    value='female',
    font=('Times', 10)
)

others_rb = Radiobutton(
    gender_frame,
    text='Khác',
    bg='#cccccc',
    variable=var,
    value='others',
    font=('Times', 10)
)

register_country = OptionMenu(
    right_frame,
    variable,
    *countries
)

register_country.config(
    width=15,
    font=('Times', 12)
)

register_pwd = Entry(
    right_frame,
    font=f,
    show='*'
)

pwd_again = Entry(
    right_frame,
    font=f,
    show='*'
)


# method nay dung de chen du lieu vao bang
def saverecord():
    try:    
        con = sqlite3.connect('quanlynhanvien.db')
        cur = con.cursor()
        cur.execute("INSERT INTO employee VALUES (:name, :email, :contact, :gender, :country, :password)", {
            'name': register_name.get(),
            'email': register_email.get(),
            'contact': register_mobile.get(),
            'gender': var.get(),
            'country': variable.get(),
            'password': register_pwd.get()
        })
        con.commit()
        messagebox.showinfo('Thông báo !', 'Thêm mới thành công !')
    
    except Exception as ep:
        messagebox.showerror('', ep)
    else: 
        messagebox.showerror('Error', 'Co loi trong khi tham moi !')
        
def validateform():
    check_counter = 0
    warn = ""
    
    if register_name.get() == "":
        warn = "Bạn cần nhập họ tên"
        messagebox.showinfo("Thông báo lỗi !", warn)
    else:
        check_counter += 1
    check_counter = 0
    
    if register_email.get() == "":
        warn = "Bạn cần phải nhập email"
    else:
        check_counter += 1
        
    if register_mobile.get() == "":
        warn = "Bạn cần phải nhập số điện thoại"
    else:
        check_counter += 1
        
    if var.get() == "":
        warn = "Select gender"
    else:
        check_counter += 1
        
    if variable.get() == "":
        warn = "Select Country"
    else:
        check_counter += 1
        
    if register_pwd.get() == "":
        warn = "Password can't be empty"
    else:
        check_counter += 1
        
    if pwd_again.get() == "":
        warn = "Re-Enter Password can't be empty"
    else:
        check_counter += 1
        
    if register_pwd.get() != pwd_again.get():
        warn = "Re-Enter password error !"
    else:
        check_counter += 1
    
    print(warn)
    saverecord()    # them nhan vien
    

register_btn = Button(
    right_frame,
    width=15,
    text='Register',
    font=f,
    relief=SOLID,
    cursor='hand2',
    command=validateform
)

register_name.grid(row=0, column=1, pady=10, padx=20)
register_email.grid(row=1, column=1, pady=10, padx=20)
register_mobile.grid(row=2, column=1, pady=10, padx=20)
register_country.grid(row=4, column=1, pady=10, padx=20)
register_pwd.grid(row=5, column=1, pady=10, padx=20)
pwd_again.grid(row=6, column=1, pady=10, padx=20)
register_btn.grid(row=7, column=1, pady=10, padx=20)
right_frame.pack()

gender_frame.grid(row=3, column=1, pady=10, padx=20)
male_rb.pack(expand=True, side=LEFT)
female_rb.pack(expand=True, side=LEFT)
others_rb.pack(expand=True, side=LEFT)

ws.mainloop()