from flask import Flask, redirect, url_for
app = Flask(__name__)

# func danh cho Admin
@app.route('/admin')
def adminpage():
    return 'Xin chào Admin.'

# func danh cho User 
@app.route('/guest/<guest>')
def userpage(guest):
    return 'Xin chào %s bạn là Guest' %guest

@app.route('/user/<name>')
def chaohoi(name):
    if name == 'admin':
        return redirect(url_for('adminpage'))
    else:
        return redirect(url_for('userpage', guest = name))
    
if __name__ == '__main__':
    app.run(debug = True)