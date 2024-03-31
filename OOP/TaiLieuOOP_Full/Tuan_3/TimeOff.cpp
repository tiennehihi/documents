#include<iostream>
using namespace std;
class TimeOff{
    private:
        string name;
        int ID;
        int maxSickDays;
        int diseaseTaken;
        int maxVacation;
        int vacTaken;
        int maxUnpaid;
        int unpaidTaken;
    public:
        TimeOff(string n="", int i=0, int maxS=0, int dis=0, int maxV=0, int vac=0, int maxU=0, int unp=0){
            name = n;
            ID = i;
            maxSickDays = maxS;
            diseaseTaken = dis;
            maxVacation = maxV;
            vacTaken = vac;
            maxUnpaid = maxU;
            unpaidTaken = unp;
        }

        friend istream & operator >> (istream &in, TimeOff &a){
            in >> a.name >> a.ID >> a.maxSickDays >> a.diseaseTaken >> a.maxVacation >> a.vacTaken >> a.maxUnpaid >> a.unpaidTaken;
            return in;
        }

        friend ostream & operator << (ostream &out, TimeOff &a){
            out << a.name <<" "<< a.ID << " " << a.maxSickDays<<" " << a.diseaseTaken<<" " << a.maxVacation<<" " << a.vacTaken<<" " << a.maxUnpaid<<" " << a.unpaidTaken<< endl;
            return out;
        }
};

int main(){
    TimeOff d("Alice", 3, 4, 5, 8, 10, 11, 15);
    cout << d << endl;
    return 0;
}