#include <iostream>
using namespace std;
class khoangcach{
    private:
        double cm;
        double mm;
    public:
        khoangcach(double c=0, double m=0){
            cm = c;
            mm = m;
        }
        // khoangcach(){
        //     com = 0;
        //     mm = 0;
        // }
        // khoangcach(double c, double m){
        //     cm = c;
        //     mm = m;
        // }
        void setMm(double m){ mm = m; }
        void setCm(double c){ cm = c; }
        double getMm() const { return mm; }
        double getCm() const { return cm; }

        friend istream & operator >> (istream &in, khoangcach &a){
            in >> a.cm;
            in >> a.mm;
            return in;
        }
        // friend ostream & operator << (ostream &out, const khoangcach &a) {}
        friend ostream & operator << (ostream &out, khoangcach a){
            out <<"cm: "<< a.cm << endl;
            out <<"mm: "<< a.mm << endl;
            return out;
        }
};
int main(){
    khoangcach d(1, 3);
    cout << d;
    return 0;
}