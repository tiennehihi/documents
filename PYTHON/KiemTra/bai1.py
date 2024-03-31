import tkinter as tk
from tkinter import messagebox
import sqlite3

ws = tk.Tk()
ws.title('Form')
ws.config(bg='#008000')

f = ('Arial', 15)

# Ket noi CSDL va tao bang
con = sqlite3.connect('quanlynhanvien.db')
cursor = con.cursor()
cursor.execute('''CREATE TABLE IF NOT EXISTS nhanvien (
                        name TEXT,
                        course TEXT,
                        semester TEXT,
                        formNo TEXT,
                        contactNo TEXT,
                        email TEXT,
                        address TEXT
                    )
                ''')
con.commit()


right_frame = tk.Frame(
    ws, bd=2,
    relief=tk.SOLID, padx=10, pady=10
)

tk.Label(
    right_frame, text="Name", font=f, fg='#000',
).grid(row=0, column=0, sticky=tk.W, pady=10, padx=30)
tk.Label(
    right_frame, text="Course", font=f, fg='#000'
).grid(row=1, column=0, sticky=tk.W, pady=10, padx=30)
tk.Label(
    right_frame, text="Semester", font=f, fg='#000'
).grid(row=3, column=0, sticky=tk.W, pady=10, padx=30)
tk.Label(
    right_frame, text="Form No.", font=f, fg='#000'
).grid(row=4, column=0, sticky=tk.W, pady=10, padx=30)
tk.Label(
    right_frame, text="Contact No.", font=f, fg='#000'
).grid(row=5, column=0, sticky=tk.W, pady=10, padx=30)
tk.Label(
    right_frame, text="Email ID", font=f, fg='#000'
).grid(row=6, column=0, sticky=tk.W, pady=10, padx=30)
tk.Label(
    right_frame, text="Addres", font=f, fg='#000'
).grid(row=7, column=0, sticky=tk.W, pady=10, padx=30)

name_entry = tk.Entry(right_frame, font=f, bg='white', fg='black', width=40)
course_entry = tk.Entry(right_frame, font=f, bg='white', fg='black', width=40)
semester_entry = tk.Entry(right_frame, font=f, bg='white', fg='black', width=40)
formNo_entry = tk.Entry(right_frame, font=f, bg='white', fg='black', width=40)
contact_entry = tk.Entry(right_frame, font=f, bg='white', fg='black', width=40)
email_entry = tk.Entry(right_frame, font=f, bg='white', fg='black', width=40)
address_entry = tk.Entry(right_frame, font=f, bg='white', fg='black', width=40)



def saverecord():
    try:    
        con = sqlite3.connect('quanlynhanvien.db')
        cur = con.cursor()
        cur.execute("INSERT INTO nhanvien VALUES (:name, :course, :semester, :formno, :contact, :email, :address)", {
            'name': name_entry.get(),
            'course': course_entry.get(),
            'semester': semester_entry.get(),
            'formno': formNo_entry.get(),
            'contact': contact_entry.get(),
            'email': email_entry.get(),
            'address': address_entry.get()
        })
        con.commit()
        messagebox.showinfo('Thông báo !', 'Thêm mới thành công !')
    
    except Exception as ep:
        messagebox.showerror('', ep)
    else: 
        messagebox.showerror('Error', 'Co loi trong khi tham moi !')



def validate_fields():
    name = name_entry.get()
    course = course_entry.get()
    semester = semester_entry.get()
    formno = formNo_entry.get()
    contact = contact_entry.get()
    email = email_entry.get()
    address = address_entry.get()

    if not (name and course and semester and formno and contact and email and address):
        messagebox.showerror('Error', 'Please enter value')
        return False
    
    messagebox.showinfo("Success", "Registration Successful !")
    return True

    
def register():
    if validate_fields():
        saverecord()

register_btn = tk.Button(
    right_frame, width=10, text='SUBMIT', bg='red', fg='#000',
    font=f, relief=tk.SOLID, cursor='hand2', command=register
)

name_entry.grid(row=0, column=1, pady=10, padx=50)
course_entry.grid(row=1, column=1, pady=10, padx=50)
semester_entry.grid(row=3, column=1, pady=10, padx=50)
formNo_entry.grid(row=4, column=1, pady=10, padx=50)
contact_entry.grid(row=5, column=1, pady=10, padx=50)
email_entry.grid(row=6, column=1, pady=10, padx=50)
address_entry.grid(row=7, column=1, pady=10, padx=50)
register_btn.grid(row=9, columnspan=2, pady=10)

right_frame.pack()

ws.mainloop()