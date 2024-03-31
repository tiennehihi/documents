from flask_restful import Resource
from flask import request
from models import NhanVien, db
from flask_cors import CORS, cross_origin


# dinh nghia class cung cap cac method cho phep goi API tu frontend
class NhanVienManager(Resource):
    @cross_origin()
    def get(self):
        # lay ve tat ca cac nhan vien tu db
        employees = NhanVien.query.all()
        # chuyen doi danh sach nhan vien thanh JSON tra ve response
        listemployee = [
            {
                'ma': employee.ma,
                'hoten': employee.hoten,
                'tuoi': employee.tuoi,
                'diachi': employee.diachi,
                'anh': employee.anh
                # 'gioiTinh': employee.gioiTinh,
                # 'ngaySinh': employee.ngaySinh,
                # 'email': employee.email,
            }
            for employee in employees
        ]
        return {'listemployee': listemployee}
    
    def post(self):
        # Lay JSON data tu request
        response_data = request.get_json()
        # kiem tra xem du lieu hop le khong
        if not response_data:
            return {'message': 'No data provided'}, 400
        # # lay thong tin cua JSON
        # ma = response_data.get('ma')
        # hoTen = response_data.get('hoTen')
        # tuoi = response_data.get('tuoi')
        # diaChi = response_data.get('diaChi')
        # # gioiTinh = response_data.get('gioiTinh')
        # # ngaySinh = response_data.get('ngaySinh')
        # # email = response_data.get('email')
        # # kiem tra xem cac thong tin co ton tai khong
        # if not ma:
        #     return {'message': 'No ma provided'}, 400
        # if not hoTen:
        #     return {'message': 'No hoTen provided'}, 400
        # if not tuoi:
        #     return {'message': 'No tuoi provided'}, 400
        # if not diaChi:
        #     return {'message': 'No diaChi provided'}, 400
        hoten = response_data.get('hoten')
        if not hoten:
            return {'message': 'Ho ten khong duoc bo trong!'}, 400
        # Them nhan vien moi vao DB
        # new_employee = NhanVien(hoten='Đặng Thu Thảo', tuoi=30, diachi='Đố biết')
        new_employee = NhanVien(
            hoten = response_data.get('hoten'),
            tuoi = response_data.get('tuoi'),
            diachi = response_data.get('diachi'),
            anh = response_data.get('anh')
        )
        db.session.add(new_employee)
        # Ghi du lieu vào DB
        db.session.commit()
        # return {'message': 'New employee added'}, 201

        # tra ve mot message cho nguoi dung
        return {'message': 'Đã thêm nhân viên mới', 'nhanvien': {
                                                        'ma': new_employee.ma,
                                                        'hoten': new_employee.hoten,
                                                        'tuoi': new_employee.tuoi,
                                                        'diachi': new_employee.diachi,
                                                        'anh': new_employee.anh
                                                    }}
