from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Dinh nghia clss de mapping voi bang nhan vien trong DB
class NhanVien(db.Model):
    ma = db.Column(db.Integer, primary_key=True)
    # Khai bao nullable=False de cot bat buoc phai nhap
    hoten = db.Column(db.String(50), nullable=False)
    tuoi = db.Column(db.Integer)
    diachi = db.Column(db.String(50))
    anh = db.Column(db.String(200))

    def __repr__(self):
        # Method cho phép hien thi thong tin chi tiết ve doi tuong
        return f'Task {self.ma} : {self.tuoi} : {self.diachi} : {self.anh} : {self.anh}'