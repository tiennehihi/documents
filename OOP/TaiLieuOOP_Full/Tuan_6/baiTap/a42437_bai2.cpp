/*
2. Hinh3D & HinhHop & HinhCau
Hinh3D & HinhHop & HinhCau Cho lớp trừu tượng Hinh3D, gồm các thành viên: 
• Các thuộc tính private: thể tích, màu sắc 
• Hàm ảo thuần tuý tinhThetich nhằm tính thể tích, sẽ được cài ở lớp con 
• Hàm setInfor thiết lập giá trị cho mọi thuộc tính cần thiết 
• Hàm ảo print in ra thể tích, màu sắc 
Lớp HinhHop kế thừa Hinh3D, có: 
• Các thuộc tính private: 3 cạnh a, b, c 
• override hàm tinhThetich để trả về thể tích hình hộp là a * b * c 
• Hàm setInfor thiết lập giá trị cho mọi thuộc tính cần thiết 
• override hàm print in ra ba cạnh, thể tích, màu sắc. 
Lớp HinhCau kế thừa Hinh3D, có: 
• Các thuộc tính private: bán kính r 
• override hàm tinhThetich để trả về thể tích hình cầu là 4/3* pi * r * r * r 
với pi = 3.14 
• Hàm setInfor thiết lập giá trị cho mọi thuộc tính cần thiết 
• override hàm print in ra bán kính r, thể tích, màu sắc. 
Viết hàm main tạo một mảng 10 Hinh3D, có cả HinhHop hay HinhCau, cuối cùng in ra thông tin cả mảng
*/
#include <bits/stdc++.h>
using namespace std;

class Hinh3D
{
    private:
        float theTich;
        string mauSac;
        virtual float tinhThetich() = 0;
    protected:
        void setInfor(string m)
        {
            mauSac = m;
            theTich = tinhThetich();
        }
    public:
        Hinh3D(){}
        float getTheTich() const { return theTich; }
        string getMauSac() const { return mauSac; }
        virtual void print() const
        {
            cout << "The tich: " << theTich << endl;
            cout << "Mau sac: " << mauSac << endl;
        }
        virtual ~Hinh3D(){}
};
class HinhHop: public Hinh3D
{
        float a, b, c;
        float tinhThetich()
        {
            return a * b * c;
        }
    public:
        HinhHop(float cd, float cr, float cc, string m)
        {
            setInfor(cd, cr, cc, m);
        }
        void setInfor(float cd, float cr, float cc, string m)
        {
            a = cd;
            b = cr;
            c = cc;            
            Hinh3D::setInfor(m);
        }
        void print() const 
        {
            cout<<endl;
            cout<<"Hinh hop"<<endl;
            Hinh3D::print();
            cout<<"Chieu dai: "<<a<<endl;
            cout<<"Chieu rong: "<<b<<endl;
            cout<<"Chieu cao: "<<c<<endl;
            cout<<endl;
        }
};
class HinhCau: public Hinh3D
{
        float r;
        float tinhThetich() 
        {
            return 4/3* 3.14 * r * r * r;
        }
    public:
        HinhCau(float bk, string m)
        {
            setInfor(bk, m);
        }
        void setInfor(float bkinh, string m)
        {         
            r = bkinh;
            Hinh3D::setInfor(m);
        }
        void print() const
        {
            cout<<endl;
            cout<<"Hinh cau"<<endl;
            Hinh3D::print();
            cout << "Ban kinh: "<<r<<endl;
            cout<<endl;
        }
};
int main()
{
    int lc;
    float cd, cr, cc, bk;
    string ms;
    Hinh3D *t[10];
    for(int i=0; i<10; i++)
    {
        cout << "Hinh hop (1), hinh cau(2): ";
        cin>>lc;
        if(lc == 1)
        {
            cout << "Nhap chieu dai, chieu rong, chieu cao, mau sac: ";
            cin>>cd>>cr>>cc;
            getline(cin, ms);
            t[i] = new HinhHop(cd, cr, cc, ms);
        }
        else if(lc == 2)
        {
            cout << "Nhap ban kinh, mau sac: ";
            cin >> bk;
            getline(cin, ms);
            t[i] = new HinhCau(bk, ms);
        }
    }
    for(int i=0; i<10; i++)
    {
        t[i] -> print();
    }
    return 0;
}