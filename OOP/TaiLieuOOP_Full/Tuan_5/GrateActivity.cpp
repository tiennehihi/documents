#include<bits/stdc++.h>
using namespace std;
class GrateActivity{
        float score;
        float checkScore(float d)const{
            if(d<0 || d>100) throw "Loi\n";
            return d;
        }
    public:
        GrateActivity(float sc=0):score(checkScore(sc)){}
        void setScore(float sco){
            score = checkScore(sco);
        }
        float getScore() const {
            return score;
        }
        char getLetterGrade()const{
            // cout<<"Diem goc: "<<score<<endl;
            char diem;
            if(score<=60) diem= 'F';
            else if(score>60 && score<=70) diem='D';
            else if(score>70 && score<=80) diem= 'C';
            else if(score>80 && score<=90) diem= 'B';
            else if(score>90 && score<=100) diem= 'A';
            return diem;
        }
};
// class FinalExam: public GrateActivity{
//         int tong, sai;
//     public:
//         FinalExam(int to=0, int sa=0):tong(to), sai(sa){
//             setScore(100-(100/tong)*sai);
//         }
//         void setTong(int t){ 
//             tong = t; 
//             setScore(100-(100/tong)*sai);
//         }
//         void setSai(int s){
//             sai = s;
//             setScore(100-(100/tong)*sai);
//         }
//         int getTong() const{ return tong; }
//         int getSai() const{ return sai; }


// };

// class CurvedActivity: public GrateActivity{
//         int rawScore;
//         float rate;
//         void setScore(){
//             GrateActivity::setScore(rawScore*rate);
//         }
//     public:
//         CurvedActivity(float saw=0, float ra=0):rawScore(saw), rate(ra){setScore();}
//         void setrawScore(int s){
//             rawScore = s;
//             setScore();
//         }
//         void setRate(float r){
//             rate = r;
//             setScore();
//         }
//         int getrawScore() const{
//             return rawScore;
//         }
//         float getRate() const{
//             return rate;
//         }

// };

class PassFailActivity : public GrateActivity
{
        int minPassing;
    public:
        PassFailActivity(int s=0, int m=0){
            setScore(s);
            minPassing=m;
        }
        char getLetterGrade() const {
            char diem;
            if(getScore()>=minPassing) diem='P';
            else if(getScore()<minPassing) diem='F';
            return diem;
        }
        void setMinPassing(int min){ minPassing = min; }
        int getMinPassing() const{ return minPassing; }
};
class PassFailExam: public PassFailActivity{
        int tongCau, cauSai;
    public:
        PassFailExam(int tc=0, int cs=0, int m=0):tongCau(tc), cauSai(cs){
            // setScore(100-(100/tongCau)*cauSai);
            setMinPassing(m);   
            setScore();
        }
        void setTongCau(int t){ 
            tongCau = t; 
            setScore();
            // setScore(100-(100/tongCau)*cauSai);
        }
        void setCauSai(int c){ 
            cauSai = c; 
            setScore();
            // setScore(100-(100/tongCau)*cauSai);
        }

        int getTongCau() const{ return tongCau; }
        int getCauSai() const{ return cauSai; }
        void setScore(){
            GrateActivity::setScore(100-(100/tongCau)*cauSai);
        }
        
};
int main(){
    try
    {
        // int a, b, c;
        // cin>>a>>b>>c;
        // PassFailExam e(a, b, c);
        // cout<<e.getLetterGrade()<<endl;
        GrateActivity a(85);
        PassFailActivity b(80, 65);
        PassFailExam c(40, 40, 10);
        cout << a.getLetterGrade()<<endl;
        cout << b.getLetterGrade()<<endl;
        cout << c.getLetterGrade()<<endl;
    }
    catch(const char * s)
    {
        cout << s << endl;
    }
    return 0;
}