#ifndef MONTH_H
#define MONTH_H
class Month
{
    private:
        string name;
        int monthNumber;
        static string thang[12];

    public:
        Month():name("January"), monthNumber(1){}
        Month(string n){setName(n);}
        Month(int number){setMonthNumber(number);}
        // ham set 
        void setName(string ten){
            name = ten;
            for(int i=0; i<12; i++){
                if(ten == thang[i]){
                    monthNumber = i+1;
                }
            }
        }
        void setMonthNumber(int t){
            monthNumber = t;
            name = thang[monthNumber-1];
        }

        // ham get
        string getName() const {return name; }
        int getMonthNumber() const {return monthNumber; }

        // nap chong toan tu tien to
        Month & operator++(){
            monthNumber++;
            if(monthNumber == 13) monthNumber = 1;
            setName(thang[monthNumber-1]);
            // name = thang[monthNumber-1];
            return *this;
        }

        // nap chong toan tu hau to
        Month operator++(int){
            Month tmp =*this;
            monthNumber++;
            if(monthNumber == 13) monthNumber = 1;
            setName(thang[monthNumber-1]);
            // name = thang[monthNumber-1];
            return tmp;
        }

        // nap chong toan tu cin>> va cout<<
        // cout 
        friend ostream & operator<< (ostream &out, const Month & r){
            out << r.monthNumber <<" "<<r.name<<endl;
            return out;
        }
        // cin
        friend istream & operator>> (istream &in, Month & r){
            int mont;
            in >> mont;
            r.monthNumber = mont;
            return in;
        }
        // friend ostream & operator<< (ostream & out, class..)
        // friend istream & operator>> (istream & in, class..)


};
string Month::thang[] = {"January", "February", "March", "April", "May", "June", 
                         "July", "August", "September", "October", "November", "December"};

#endif