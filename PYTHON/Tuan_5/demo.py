from flask import Flask

app = Flask(__name__)

@app.route('/')
def demo():
    return "Tom hum nuong phomai"


@app.route('/chao/<name>')
def chaohoi(name):
    return 'Xin chao ban %s' %name


@app.route('/tuoi/<int:age>')
def tuoi(age):
    return 'Tuổi của bạn là %d' %age


@app.route('/diem/<float:avg>')
def showAvg(avg):
    return 'Điểm trung bình là %f' %avg


@app.route('/hoaqua/')
def showFruits():
    return 'Bưởi - Chanh - Ổi - Cam - Quýt - Sầu Riêng'



if __name__ == '__main__':
    app.run(debug=True)


