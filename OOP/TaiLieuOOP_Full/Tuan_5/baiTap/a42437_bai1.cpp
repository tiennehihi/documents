/*
1.Thiết kế lớp Essay kế thừa lớp GradedActivity. 
Lớp Essay phải lưu các điểm mà học sinh làm được trong bài luận.
Điểm bài luận của sinh viên tối đa là 100, gồm các phần có điểm tối đa như sau:
• Grammar: 30 điểm
• Spelling: 20 điểm
• Correct length: 20 điểm
• Content: 30 điểm
Demo lớp trong một chương trình đơn giản. 
*/
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
        char getDiemchu()const{
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
class Essay : public GrateActivity
{
        int grammar, spelling, correct, content;
        int checkGrammar(int g)const{
            if(g<0 || g>30) throw "LOI!";
            return g;
        }
        int checkSpelling(int s)const{
            if(s<0 || s>20) throw "LOI!";
            return s;
        }
        int checkCorrect(int c)const{
            if(c<0 || c>20) throw "LOI!";
            return c;
        }
        int checkContent(int co)const{
            if(co<0 || co>30) throw "LOI!";
            return co;
        }
    public:
        Essay(int gr=0, int sp=0, int cor=0, int con=0):grammar(checkGrammar(gr)), spelling(checkSpelling(sp)), correct(checkCorrect(cor)), content(checkContent(con)){
            setScore();
        }
        void setter(int gra, int spe, int corr, int cont){
            grammar = gra;
            spelling = spe;
            correct = corr;
            content = cont;
        }
        int getGrammar() const { return grammar; }
        int getSpelling() const { return spelling; }
        int getCorrect() const { return correct; }
        int getContent() const { return content; }
        // int getTong () const {
        //     return getGrammar() + getSpelling() + getCorrect() + getContent();
        // }
        void setScore(){
            GrateActivity::setScore(getGrammar() + getSpelling() + getCorrect() + getContent());
        }


};
int main(){
    try
    {
        int a, b, c, d;
        cin >> a >> b >> c >> d;
        Essay e(a, b, c, d);
        cout << "Grammar: " << e.getGrammar() << endl;
        cout << "Spelling: " << e.getSpelling() << endl;
        cout << "Correct: " << e.getCorrect() << endl;
        cout << "Content: " << e.getContent() << endl;
        // cout << "Tong diem: " << e.getTong() << endl;
        cout << "Diem chu: " << e.getDiemchu() << endl;
    }
    catch (const char *e) 
    {  
        cout << e << endl;
    }

    return 0;
}