
import tkinter as tk
from tkinter import messagebox
import sqlite3

ws = tk.Tk()
ws.title('ITVoyagers Registration Form')
ws.config(bg='#0B5A81')

f = ('Arial', 15, 'bold')

# Ket noi CSDL va tao bang
con = sqlite3.connect('quanlysinhvien.db')
cursor = con.cursor()
cursor.execute('''CREATE TABLE IF NOT EXISTS sinhvien (
                        name TEXT,
                        language TEXT,
                        sex TEXT,
                        address TEXT,
                        contact TEXT,
                        country TEXT,
                        state TEXT
                    )
                ''')
con.commit()

countries = []
variable = tk.StringVar()

var = tk.StringVar()
var.set('male')

# Đọc dữ liệu từ file countries.txt để lấy thông tin
with open('countries.txt', 'r') as world:
    for country in world:
        country = country.rstrip('\n')
        countries.append(country)

right_frame = tk.Frame(
    ws, bd=2, bg='#cccccc',
    relief=tk.SOLID, padx=10, pady=10
)

tk.Label(
    right_frame, text="Name of visitor:", font=f, fg='blue'
).grid(row=0, column=0, sticky=tk.W, pady=10, padx=10)
tk.Label(
    right_frame, text="Favorite programming language:", font=f, fg='blue'
).grid(row=1, column=0, sticky=tk.W, pady=10, padx=10)
tk.Label(
    right_frame, text="Gender:", font=f, fg='blue'
).grid(row=2, column=0, sticky=tk.W, pady=10, padx=10)
tk.Label(
    right_frame, text="Address:", font=f, fg='blue'
).grid(row=3, column=0, sticky=tk.W, pady=10, padx=10)
tk.Label(
    right_frame, text="Email ID:", font=f, fg='blue'
).grid(row=4, column=0, sticky=tk.W, pady=10, padx=10)
tk.Label(
    right_frame, text="Contact No:", font=f, fg='blue'
).grid(row=5, column=0, sticky=tk.W, pady=10, padx=10)
tk.Label(
    right_frame, text="Country:", font=f, fg='blue'
).grid(row=6, column=0, sticky=tk.W, pady=10, padx=10)
tk.Label(
    right_frame, text="State:", font=f, fg='blue'
).grid(row=7, column=0, sticky=tk.W, pady=10, padx=10)
tk.Label(
    right_frame, text="Select topics you wish to learn:", font=f, fg='blue'
).grid(row=8, column=0, sticky=tk.W, pady=10, padx=10)

name_entry = tk.Entry(right_frame, font=f, bg='white', fg='black')
language_entry = tk.Entry(right_frame, font=f, bg='white', fg='black')
address_entry = tk.Entry(right_frame, font=f, bg='white', fg='black')
email_entry = tk.Entry(right_frame, font=f, bg='white', fg='black')
contact_entry = tk.Entry(right_frame, font=f, bg='white', fg='black')
state_entry = tk.Entry(right_frame, font=f, bg='white', fg='black')
country_entry = tk.Entry(right_frame, font=f, bg='white', fg='black')

male_rb = tk.Radiobutton(
    right_frame, text="Male", bg='#cccccc', variable=var, value="male", font=f
)
female_rb = tk.Radiobutton(
    right_frame, text="Female", bg='#cccccc', variable=var, value="female", font=f
)

python_cb = tk.Checkbutton(right_frame, text="Python", bg='#cccccc', font=f)
javascript_cb = tk.Checkbutton(right_frame, text="JavaScript", bg='#cccccc', font=f)


def saverecord():
    try:    
        con = sqlite3.connect('quanlysinhvien.db')
        cur = con.cursor()
        cur.execute("INSERT INTO sinhvien VALUES (:name, :language, :address, :contact, :sex, :country, :state)", {
            'name': name_entry.get(),
            'language': language_entry.get(),
            'address': address_entry.get(),
            'contact': contact_entry.get(),
            'sex': var.get(),
            'country': country_entry.get(),
            'state': state_entry.get()
        })
        con.commit()
        messagebox.showinfo('Thông báo !', 'Thêm mới thành công !')
    
    except Exception as ep:
        messagebox.showerror('', ep)
    else: 
        messagebox.showerror('Error', 'Co loi trong khi tham moi !')



def validate_fields():
    name = name_entry.get()
    language = language_entry.get()
    gender = var.get()
    address = address_entry.get()
    email = email_entry.get()
    contact = contact_entry.get()
    country = country_entry.get()
    state = state_entry.get()

    if not name:
        messagebox.showerror("Error", "Name is required")
        return False

    if not language:
        messagebox.showerror("Error", "Favorite programming language is required")
        return False

    if not gender:
        messagebox.showerror("Error", "Gender is required")
        return False

    if not address:
        messagebox.showerror("Error", "Address is required")
        return False

    if not email:
        messagebox.showerror("Error", "Email ID is required")
        return False

    if not contact:
        messagebox.showerror("Error", "Contact No is required")
        return False

    if not country:
        messagebox.showerror("Error", "Country is required")
        return False

    if not state:
        messagebox.showerror("Error", "State is required")
        return False
    
    messagebox.showinfo("Success", "Registration Successful")
    return True

    
def register():
    if validate_fields():
        saverecord()

register_btn = tk.Button(
    right_frame, width=30, text='REGISTER HERE', bg='#0B5A81', fg='white',
    font=f, relief=tk.SOLID, cursor='hand2', command=register
)

name_entry.grid(row=0, column=1, pady=10, padx=10)
language_entry.grid(row=1, column=1, pady=10, padx=10)
male_rb.grid(row=2, column=1, pady=10, padx=10)
female_rb.grid(row=2, column=2, pady=10, padx=10)
address_entry.grid(row=3, column=1, pady=10, padx=10)
email_entry.grid(row=4, column=1, pady=10, padx=10)
contact_entry.grid(row=5, column=1, pady=10, padx=10)
country_entry.grid(row=6, column=1, pady=10, padx=10)
state_entry.grid(row=7, column=1, pady=10, padx=10)
python_cb.grid(row=8, column=1, pady=10, padx=10)
javascript_cb.grid(row=8, column=2, pady=10, padx=10)
register_btn.grid(row=9, columnspan=2, pady=10)

right_frame.pack()

ws.mainloop()