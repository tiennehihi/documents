#include <bits/stdc++.h>
using namespace std;
class PhanSo{
    float tuSo, mauSo;
    public:
        PhanSo(int t=0, int m=0):tuSo(t), mauSo(m){}
        void setTuSo(int ts){
            tuSo = ts;
        }
        void setMauSo(int ms){
            mauSo = ms;
        }
        float getTuSo() const { return tuSo; }
        float getMauSo() const { return mauSo; }
        void print() const {
            cout << tuSo <<"/"<<mauSo <<endl;
        }
        bool operator > (PhanSo &b){
            if (mauSo == b.mauSo)
                return tuSo > b.tuSo;
            else 
                return (tuSo/mauSo) > (b.tuSo/b.mauSo);
        }
};
int main() {
    PhanSo a(3,4);
    PhanSo b;
    b.setTuSo(1);
    b.setMauSo(2);
    if (a>b)
        a.print();
    else    
        b.print();
    return 0;
}