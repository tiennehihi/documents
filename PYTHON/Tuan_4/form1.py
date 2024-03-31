from tkinter import *
from tkinter import messagebox

ws = Tk()
ws.title('Registration Form')
ws.config(bg='#d2d2d2')

f = ('Time', 14)
var = StringVar()
var.set('male')
var1 = StringVar()
var1.set('English')

countries = []
variable = StringVar()

#doc du lieu trong file counties.txt de lay thong tin
world = open('countries.txt', 'r')
for country in world:
    country = country.rstrip('\n')
    countries.append(country)

right_frame = Frame(
    ws, bd=2, bg='#cccccc',
    relief=SOLID, padx=10, pady=10
)

Label(
    right_frame, text="Họ tên: ", bg='#cccccc', font=f
).grid(row=0, column=0, sticky=W, pady=10)
Label(
    right_frame, text="Email: ", bg='#cccccc', font=f
).grid(row=1, column=0, sticky=W, pady=10)
Label(
    right_frame, text="Chọn giới tính: ", bg='#cccccc', font=f
).grid(row=2, column=0, sticky=W, pady=10)
Label(
    right_frame, text="Chọn quốc gia: ", bg='#cccccc', font=f
).grid(row=3, column=0, sticky=W, pady=10)
Label(right_frame, text="Language: ", bg='#cccccc', font=f
).grid(row=4, column=0, sticky=W, pady=10)

gender_frame = LabelFrame(
    right_frame, bg='#cccccc', padx=10, pady=10
)

lang_frame = LabelFrame(
    right_frame, bg='#cccccc', padx=10, pady=10
)

txtName = Entry(right_frame, font=f)
txtEmail = Entry(right_frame, font=f)
txtMobile = Entry(right_frame, font=f)

male_rb = Radiobutton(gender_frame, 
                      text="Nam", bg='#cccccc', variable=var, 
                      value="male", font=('Times', 10))

female_rb = Radiobutton(gender_frame, 
                      text="Nữ", bg='#cccccc', variable=var, 
                      value="female", font=('Times', 10))

CheckVar1 = IntVar()
CheckVar2 = IntVar()
eng_check = Checkbutton(
    lang_frame,
    text="English",
    bg="#CCCCCC",
    variable=CheckVar1,
    onvalue=1,
    offvalue=0,
    font=("calibre", 10),
)

vn_check = Checkbutton(
    lang_frame,
    text="VietNam",
    bg="#CCCCCC",
    variable=CheckVar2,
    onvalue=1,
    offvalue=0,
    font=("calibre", 10),
)

register_country = OptionMenu(right_frame, variable, *countries)
register_country.config(width=15, font=('Times', 12))

txtPassword = Entry(right_frame, font=f, show='*')
txtConfirmPassword = Entry(right_frame, font=f, show='*')

#medthod dung de kiem tr du lieu tren form
def validateform():
    if txtName.get() == "":
        messagebox.showinfo("Thông báo lỗi !", "Bạn cần nhập họ tên !")
        txtName.focus_set()
        return

    if txtEmail.get() == "":
        messagebox.showinfo("Thông báo lỗi !", "Bạn cần nhập Email !")
        txtEmail.focus_set()
        return
    
    if variable.get() == "":
        messagebox.showinfo("Thông báo lỗi !", "Bạn cần chọn quốc gia !")
        txtName.focus_set()
        return
    
register_btn = Button(
    right_frame, width=15, text='Submit', bg='#000', 
    font=f, relief=SOLID, cursor='hand2', command=validateform
)

txtName.grid(row=0, column=1, pady=10, padx=20)
txtEmail.grid(row=1, column=1, pady=10, padx=20)
register_country.grid(row=3, column=1, pady=10, padx=20)
register_btn.grid(row=5, column=1, pady=10, padx=20)
right_frame.pack()

gender_frame.grid(row=2, column=1, pady=10, padx=20)
male_rb.pack(expand=True, side=LEFT)
female_rb.pack(expand=True, side=LEFT)

lang_frame.grid(row=4, column=1, pady=10, padx=10)
eng_check.pack(expand=True, side=LEFT)
vn_check.pack(expand=True, side=LEFT)

ws.mainloop()