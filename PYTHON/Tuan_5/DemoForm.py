# from flask import Flask, render_template, request
# app = Flask(__name__)

# @app.route('/formdangky')
# def nhanvien():
#     return render_template('formdangky.html')

# @app.route('/dangky', methods = ['POST', 'GET'])
# def result():
#     if request.method == 'POST':
#         result = request.form
#         return render_template("hienthi.html", result = result)
    
# if __name__ == '__main__':
#     app.run(debug=True)

from flask import Flask, render_template, request
app = Flask(__name__)

@app.route('/formdangky')
def nhanvien():
    return render_template('formdangky.html')

@app.route('/dangky', methods=['POST', 'GET'])
def result():
    if request.method == 'POST':
        result = request.form
        return render_template("hienthi.html", result = result)
    
if __name__ == '__main__':
    app.run(debug=True)