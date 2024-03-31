from flask import Flask, redirect, url_for, request
app = Flask(__name__)

@app.route('/success/<name>/<age>/<address>')
def success(name, age, address):
    return 'Xin chào bạn %s ' % name + ' %s ' % age + ' %s ' % address

# func xử lý quá trình đăng nhập
@app.route('/hienthi', methods = ['POST', 'GET'])
def hienthi():
    if request.method == "POST":
        name = request.form['txtname']
        age = request.form['txtage']
        address = request.form['txtaddress']
        return redirect(url_for('success', name=name, age=age, address=address))
    else: # Xử lý method GET
        user = request.args.get('txtname')
        age = request.args.get('txtage')
        address = request.args.get('txtaddress')
        return redirect(url_for('success', name=user))
    
if __name__ == '__main__':
    app.run(debug=True)
