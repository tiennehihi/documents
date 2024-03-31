from flask import Flask, render_template, request, redirect, url_for
import sqlite3

app = Flask(__name__)

# Khởi tạo SQLite Database
conn = sqlite3.connect('quanlykhachhang.db')
cursor = conn.cursor()

# Tạo bảng customer nếu chưa tồn tại
cursor.execute('''
    CREATE TABLE IF NOT EXISTS customer (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        age INTEGER NOT NULL,
        sex TEXT NOT NULL,
        working_exp INTEGER NOT NULL,
        highest INTEGER NOT NULL
    )
''')
conn.commit()
conn.close()

@app.route('/', methods=['GET', 'POST'])
def registration_form():
    if request.method == 'POST':
        # Lấy giá trị từ form
        name = request.form['name']
        age = request.form['age']
        sex = request.form['sex']
        working_exp = request.form['working_exp']
        highest = request.form['highest']
        
        
        
        # Validate form
        if not (name and age and sex and working_exp and highest):
            return render_template('index.html', error_message='Trường không được bỏ trống !')

        # Chèn dữ liệu vào bảng customer
        conn = sqlite3.connect('quanlykhachhang.db')
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO customer (name, age, sex, working_exp, highest)
            VALUES (?, ?, ?, ?, ?)
        ''', (name, age, sex, working_exp, highest,))
        conn.commit()
        conn.close()

        return render_template('index.html', success_message='Thêm thành công !')
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)