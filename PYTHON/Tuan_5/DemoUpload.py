from flask import Flask, render_template, request
app = Flask(__name__)

# Ham hien thi form upload
@app.route('/upload')

def upload_file():
    return render_template('upload.html')

# ham cho phép upload file
@app.route('/uploader', methods = ['GET', 'POST'])
def upload():
    if request.method == 'POST':
        f = request.files['file']
        # f.save(secure_filename(f.filename))
        f.save(f.filename)
        return 'File uploaded successfully'
        # return render_template('upload.html', message = 'File uploaded successfully')

if __name__ == '__main__':
    app.run(debug=True)