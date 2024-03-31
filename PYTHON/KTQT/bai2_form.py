# from flask import Flask, render_template, request, redirect, url_for
# import sqlite3

# app = Flask(__name__)

# # Khởi tạo SQLite Database
# conn = sqlite3.connect('quanlykhachhang.db')
# cursor = conn.cursor()

# # Tạo bảng customer nếu chưa tồn tại
# cursor.execute('''
#     CREATE TABLE IF NOT EXISTS customer (
#         id INTEGER PRIMARY KEY AUTOINCREMENT,
#         first_name TEXT NOT NULL,
#         last_name TEXT NOT NULL,
#         address TEXT NOT NULL,
#         password TEXT NOT NULL,
#         email TEXT NOT NULL,
#         sex TEXT NOT NULL,
#         birth_month INTEGER NOT NULL,
#         birth_day INTEGER NOT NULL,
#         birth_year INTEGER NOT NULL,
#         languages TEXT NOT NULL,
#         receipt TEXT NOT NULL
#     )
# ''')
# conn.commit()
# conn.close()

# @app.route('/', methods=['GET', 'POST'])
# def registration_form():
#     if request.method == 'POST':
#         # Lấy giá trị từ form
#         first_name = request.form['first_name']
#         last_name = request.form['last_name']
#         address = request.form['address']
#         password = request.form['password']
#         email = request.form['email']
#         sex = request.form['sex']
#         birth_month = request.form['birth_month']
#         birth_day = request.form['birth_day']
#         birth_year = request.form['birth_year']
#         languages = ', '.join(request.form.getlist('languages'))
#         receipt = request.form['receipt']

#         # Validate form
#         if not (first_name and last_name and address and password and email and sex and birth_month and birth_day and birth_year and languages and receipt):
#             return render_template('form.html', error_message='All fields must be filled.')

#         # Chèn dữ liệu vào bảng customer
#         conn = sqlite3.connect('quanlykhachhang.db')
#         cursor = conn.cursor()
#         cursor.execute('''
#             INSERT INTO customer (first_name, last_name, address, password, email, sex, birth_month, birth_day, birth_year, languages, receipt)
#             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
#         ''', (first_name, last_name, address, password, email, sex, birth_month, birth_day, birth_year, languages, receipt))
#         conn.commit()
#         conn.close()

#         return render_template('form.html', success_message='Registration successful!')
#     return render_template('form.html')

# if __name__ == '__main__':
#     app.run(debug=True)


from flask import Flask, render_template, request, redirect, url_for
import sqlite3
import re

app = Flask(__name__)

# Khởi tạo SQLite Database
conn = sqlite3.connect('quanlykhachhang.db')
cursor = conn.cursor()

# Tạo bảng customer nếu chưa tồn tại
cursor.execute('''
    CREATE TABLE IF NOT EXISTS customer (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        address TEXT NOT NULL,
        password TEXT NOT NULL,
        email TEXT NOT NULL,
        sex TEXT NOT NULL,
        birth_month INTEGER NOT NULL,
        birth_day INTEGER NOT NULL,
        birth_year INTEGER NOT NULL,
        languages TEXT NOT NULL,
        receipt TEXT NOT NULL
    )
''')
conn.commit()
conn.close()

def is_valid_email(email):
    # Kiểm tra định dạng email hợp lệ
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(pattern, email)

@app.route('/', methods=['GET', 'POST'])
def registration_form():
    if request.method == 'POST':
        # Lấy giá trị từ form
        first_name = request.form['first_name']
        last_name = request.form['last_name']
        address = request.form['address']
        password = request.form['password']
        # retype_password = request.form['retype_password']
        email = request.form['email']
        sex = request.form['sex']
        birth_month = request.form['birth_month']
        birth_day = request.form['birth_day']
        birth_year = request.form['birth_year']
        languages = ', '.join(request.form.getlist('languages'))
        receipt = request.form['receipt']

        # Kiểm tra điều kiện và xác thực dữ liệu đầu vào
        if not (first_name and last_name and address and password and email and sex and birth_month and birth_day and birth_year and languages and receipt):
            return render_template('form.html', error_message='All fields must be filled.')
        elif len(first_name) > 25:
            return render_template('form.html', error_message='First name should not exceed 25 characters.')
        elif len(last_name) > 25:
            return render_template('form.html', error_message='Last name should not exceed 25 characters.')
        elif len(password) < 6:
            return render_template('form.html', error_message='Password should be at least 6 characters long.')
        # elif password != retype_password:
        #     return render_template('form.html', error_message='Passwords do not match.')
        elif not is_valid_email(email):
            return render_template('form.html', error_message='Invalid email address.')
        elif not languages:
            return render_template('form.html', error_message='Please select at least one programming language.')
        elif receipt not in ['Weekly', 'Monthly', 'Every when news come']:
            return render_template('form.html', error_message='Invalid receipt option.')

        # Chèn dữ liệu vào bảng customer
        conn = sqlite3.connect('quanlykhachhang.db')
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO customer (first_name, last_name, address, password, email, sex, birth_month, birth_day, birth_year, languages, receipt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (first_name, last_name, address, password, email, sex, birth_month, birth_day, birth_year, languages, receipt))
        conn.commit()
        conn.close()

        return render_template('form.html', success_message='Registration successful!')
    
    return render_template('form.html')

if __name__ == '__main__':
    app.run(debug=True)