#include <bits/stdc++.h>
using namespace std;

class PhanSo
{
        float tuso, mauso;
    public:
        PhanSo(float t = 0, float m = 1)
        {
            tuso = t;
            mauso = m;
        }
        void SetTuso(float t) {tuso = t;}
        void SetMauso(float m) {mauso = m;}
        float getTuso()const {return tuso;}
        float getMauso()const {return mauso;}
        void print()const
        {
            cout << tuso << "/" << mauso << endl;
        }
        bool operator > (const PhanSo & b)
        {
                return (tuso/mauso) > (b.tuso/b.mauso);
        }
};

class HonSo: public PhanSo
{
        float phannguyen;
    public:
        HonSo(float p = 0, float t = 0, float m = 1)
        {
            phannguyen = p;
            SetTuso(t);
            SetMauso(m);
        }

        friend HonSo operator + (PhanSo b, HonSo a)
        {
            float hs = (a.phannguyen * a.getMauso() + a.getTuso()) / a.getMauso();
            float phs = b.getTuso() / b.getMauso();
            return phs + hs;
        }
        void print()const
        {
            cout << (phannguyen * getMauso() + getTuso())/getMauso() << endl;
        }
};

int main()
{
    // Bài 1
    // PhanSo a(3,4);
    // PhanSo b;
    // b.SetTuso(1);
    // b.SetMauso(2);
    
    // if (a > b) 
    //     a.print();
    // else
    //     b.print();

    // Bài 2
    HonSo a(4, 1, 2);

    PhanSo b;
    b.SetTuso(1);
    b.SetMauso(2);
    

    HonSo c = b + a;
    c.print();
    

    return 0;

}