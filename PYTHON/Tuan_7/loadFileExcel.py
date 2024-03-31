from tkinter import *
from tkinter import ttk, filedialog
import numpy
import pandas as pd

# Khoi tao tkinter frame
win = Tk()

# Thiet lap kich thuoc va title cua tkinter window
win.geometry("800x400")
win.title("Minh họa Tkinter mở file Excel")

# Định nghĩa Style widget
style = ttk.Style()
style.theme_use('clam')

# Tạo ra đối tượng frame
frame = Frame(win)