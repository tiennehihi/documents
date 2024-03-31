#include<bits/stdc++.h>
using namespace std;
class date{
    private:
        int ngay;
        int thang;
        int nam;
        string ngay1;
        int checkNgay(int d) const{
            if(d>31 || d<1) throw "Loi: sai so ngay \n";
            return d;
        }
        int checkThang(int m) const{
            if(m>12 || m<1) throw "Loi: so \n";
            return m;
        }
    public:
        date(){}
        date(int d, int m, int y):ngay(checkNgay(d)), thang(checkThang(m)), nam(y){}
        void setNgay(int a) {
            ngay = a ;
        }
        void setThang(int b){
            thang = b ;
        };
        void setNam(int c){
            nam = c ;
        };
        int getNgay() const {return ngay; }
        int getThang() const {return thang; }
        int getNam() const {return nam; }

};
int main(){
    try
    {
        int d, m, y;
        cout<<"Nhap ngay, thang, nam: ";
        cin>>d>>m>>y;
        
        date t(d, m, y);
        cout << t.getNgay()<<"/"<< t.getThang()<<"/"<<t.getNam()<<endl;
    }
    catch(const char * s)
    {
        cout << s << endl;
    }
    return 0;
}