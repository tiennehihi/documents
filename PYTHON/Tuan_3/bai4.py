import tkinter as tk
from tkinter import ttk

# win = tk.Tk()
# win.title("Demo Grid method")
# win.geometry("300x200")

# for i in range(5):
#     for j in range(3):
#         frame = tk.Frame(
#             master = win,
#             relief = tk.RAISED,
#             borderwidth=1
#         )
#         frame.grid(row=i, column=j)
#         label = tk.Label(master=frame, text=f"Row {i}\nColumn {j}")
#         label.pack()

# win.mainloop()


#root window
root = tk.Tk()
root.geometry("240x100")
root.title("Login")
root.resizable(0, 0)

#configure the grid
root.columnconfigure(0, weight=1)
root.columnconfigure(1, weight=3)

#username
username_label = ttk.Label(root, text="UserName:")
username_label.grid(column=0, row=0, sticky=tk.W, padx=5, pady=5)

username_entry = ttk.Entry(root)
username_entry.grid(column=1, row=0, sticky=tk.E, padx=5, pady=5)

#password
password_label = ttk.Label(root, text="Password:")
password_label.grid(column=0, row=1, sticky=tk.W, padx=5, pady=5)

password_entry = ttk.Entry(root, show="*")
password_entry.grid(column=1, row=1, sticky=tk.E, padx=5, pady=5)

# login button
login_button = ttk.Button(root, text="login")
login_button.grid(column=1, row=3, sticky=tk.E, padx=5, pady=5)

root.mainloop()
