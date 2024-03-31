#ifndef PERSONALINFOR_H
#define PERSONALINFOR_H
class PersonalInfor
{
    private:
        string ten;
        string diaChi;
        int tuoi;
        string soDienThoai;
    public:

        PersonalInfor ()  // Cấu tử/Hàm tạo mặc định
        {
            ten = "";
            diaChi = "";
            tuoi = 0;
            soDienThoai = "";
        }

        PersonalInfor (string t, int tt) // Cấu tử/Hàm tạo hai tham số (tên và tuổi)
        {
            ten = t;
            diaChi = "";
            tuoi = tt;
            soDienThoai = "";
        }

        PersonalInfor (string ten, string dc, int t, string sdt) // Cấu tử/Hàm tạo bốn tham số (tên, địa chỉ, tuổi, sđt)
        {
            this-> ten = ten;
            diaChi = dc;
            tuoi = t;
            soDienThoai = sdt;
        }

        void setter(string ten, string dc, int t, string sdt) // setter cho 4 tham số (tên, địa chỉ, tuổi, sđt)
        {
            this-> ten = ten;
            diaChi = dc;
            tuoi = t;
            soDienThoai = sdt;
        }

        string getTen() // getter cho thuộc tính tên
        {
           return ten;
        }

        string getDiaChi() // getter cho thuộc tính địa chỉ 
        {
           return diaChi;
        }

        int getTuoi()  // getter cho thuộc tuổi
        {
           return tuoi;
        }

        string getSoDienThoai() // getter cho thuộc số điện thoại
        {
           return soDienThoai;
        }

        void print() 
        {
            cout << "Ten la: " << ten << endl;
            cout << "Dia chi: " << diaChi << endl;
            cout << "Tuoi: " << tuoi << endl;
            cout << "So dien thoai: " << soDienThoai << endl;
        }
};


#endif