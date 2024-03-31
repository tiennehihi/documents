from flask import Flask
from flask_restful import Api
from models import db
import config
from services import NhanVienManager
from flask_cors import CORS

# Khởi tạo Flask application và Flask-RESTful API manager
app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

app.config.from_object(config)

# Khởi tạo đối tượng Flask-SQLALchemy
db.init_app(app)
# Tạo đối tượng Flask-RESTful API manager
api = Api(app)
# Tạo endponints
api.add_resource(NhanVienManager, '/nhanvien')

if __name__ == '__main__':
    # Tạo database tables.
    with app.app_context():
        db.create_all()
    # Start Flask development web server
    app.run(debug=True)
    

# Tool for Database: https://drive.google.com/drive/folders/1fiCj7663io-Zl4YxH8aklVcCSBf8bFhZ