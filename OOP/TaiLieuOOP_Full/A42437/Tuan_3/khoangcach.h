#ifndef KhoangCach_H
#define KhoangCach_H
class KhoangCach
{
private:
    int cm;
    int mm;
public:
    KhoangCach (){}
    // KhoangCach(int cm, int mm):cm(cm),mm(mm){}
    ~KhoangCach(){};
    // ham in
    void print() const {
        cout << "CM: " <<cm
             << "\nMM: "<<mm;
        cout <<endl;
    }
    // ham setter và getter
    void set(int c, int m){
        cm = c;
        mm = m;
    }
    int getCm() const {return cm;}
    int getMm() const {return mm;}
    void setCm(int c){
        cm = c;
    }
    void setMm(int m){
        mm = m;
    }
    // // tien to tang mm len 1
    // KhoangCach operator++(){
    //     mm+=1;
    //     return *this;
    // }
    // // hau to tang mm len 1
    // KhoangCach operator++(int){
    //     KhoangCach tmp;
    //     tmp = *this;
    //     mm+=1;
    //     return tmp;
    // }
    // tien to tang mm len 3 lan
    KhoangCach operator++(){
        mm = mm*3;
        return *this;
    }
    // hau to tang mm len 3 lan
    KhoangCach operator++(int){
        KhoangCach tmp;
        tmp = *this;
        mm = mm*3;
        return tmp;
    }
    bool operator==(KhoangCach &r){
        return (r.cm == cm);
    }
    bool operator!=(KhoangCach &r){
        return (r.mm != mm);
    }
};
#endif