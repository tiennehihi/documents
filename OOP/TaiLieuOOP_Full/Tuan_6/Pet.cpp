#include <bits/stdc++.h>
using namespace std;
class Pet{
        string ten, moiTruong;
    protected:
        void setInfor(string name, string mt){
            ten = name;
            moiTruong = mt;
        }
    public:

        virtual void print() const {
            cout << "Ten: "<<ten<<endl;
            cout << "Moi truong: "<<moiTruong<<endl;
        }
        virtual ~Pet(){}
};
class Cat: public Pet{
        float doDaiLong;
        string check(string m){
            if (m == "nuoc")    throw "LOI!\n";
            return m;
        }
    public:
        Cat(string t, string m, float d){
            setInfor(t, m, d);
        }
        void setInfor(string name, string mt, float doDai){
            Pet::setInfor(name, mt);
            doDaiLong = doDai;
        }
        void print() const {
            cout<<"Cat"<<endl;
            Pet::print();
            cout <<"Do dai long: "<<doDaiLong<<endl;
            cout << endl;
        }
}; 
class Fish: public Pet{
        string loaiCa;
        string checkF(string f){
            if(f == "rung")    throw "LOI!\n";
            return f;
        }
    public:
        Fish(string t, string m, string l){
            setInfor(t, m, l);
        }
        void setInfor(string name, string mt, string lc){
            Pet::setInfor(name, mt);
            loaiCa = lc;
        }
        void print() const {
            cout<<"Fish"<<endl;
            Pet::print();
            cout <<"Loai ca: "<<loaiCa<<endl;
            cout << endl;
        }
};
int main(){
    try{
        Pet *t[3];
        string luaChon;
        string name, dk, loai;
        float ddl;
        for(int i=0; i<3; i++){
            cout << "Chon Cat hoac Fish: ";
            cin>>luaChon;
            if(luaChon == "cat"){
                cout << "Nhap vao ten, moi truong song, do dai long: ";
                cin>>name>>dk>>ddl;
                t[i]= new Cat(name, dk, ddl);
            }
            else if(luaChon == "fish"){
                cout<<"Nhap vao ten, moi truong song, loai ca: ";
                cin>>name>>dk>>loai;
                t[i]= new Fish(name, dk, loai);
            }
            else{
                cout <<"LOI!"<<endl;
            }

        }    
        for(int i=0; i<3; i++){
            t[i] -> print();
        }

    }
    catch(const char *s){
        cout << s << endl;
    }
    return 0;
}