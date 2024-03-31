#include <iostream>
using namespace std;

class NhanVien
{
        string mnv;
        float luong;
        virtual float tinhLuong() = 0;
    protected:
        void setInfor(string m)
        {
            mnv = m;
            luong = tinhLuong();
        }
    public:
        virtual void print()const 
        {
            cout << "Ma nhan vien: " << mnv << endl;
            cout << "Luong: " << luong << "$" << endl;
        }
        virtual ~NhanVien(){}
    
};

class NhanVienSanXuat: public NhanVien
{
        int ssp;
        float tien1sp;
        float tinhLuong()
        {
            return ssp*tien1sp;
        }
    public:
        NhanVienSanXuat(int s, float t, string m){setInfor(s, t, m);}
        void setInfor(int s, float t, string m)
        {
            ssp = s;
            tien1sp = t;
            NhanVien::setInfor(m);
        }
        void print()const
        {
            NhanVien::print();
            cout << "So san pham: " << ssp << endl;
            cout << "Tien luong 1 san pham: " << tien1sp << "$" << endl;
        }
};

class NhanVienVanPhong: public NhanVien
{
        int songc;
        float luongcb;
        float tinhLuong()
        {
            return songc*luongcb/30;
        }
    public:
        NhanVienVanPhong(int s, float l, string m){setInfor(s, l, m);}
        void setInfor(int s, float l, string m)
        {
            songc = s; 
            luongcb = l;
            NhanVien::setInfor(m);
        }
        void print()const 
        {
            NhanVien::print();
            cout << "So ngay cong: "<< songc << endl;
            cout << "Luong co ban: " << luongcb << "$" << endl;
        }
};

int main()
{
    NhanVienSanXuat a(19, 1000, "A42084");
    NhanVienSanXuat b(18, 2000, "M12345" );
    NhanVienVanPhong c(30, 3000, "B98765");
    NhanVien *sp[5] = {&a, &b, new NhanVienSanXuat(20, 4000, "ABCDE"), &c, new NhanVienVanPhong(29, 2500, "POIYIU")};
    for(int i=0; i<5; i++)
    {
        sp[i]->print();
    }

    return 0;
}