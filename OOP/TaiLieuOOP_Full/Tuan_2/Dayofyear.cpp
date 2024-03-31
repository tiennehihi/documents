#include <iostream>
#include "Dayofyear.h"
using namespace std;

DayOfYear::DayOfYear(int day){
   if(day<0||day>365){
    cout << "Error" << endl;
   } else {
    this -> day = day;
   }
}

DayOfYear::DayOfYear(string month, int day){
    this -> day = day;
}

void DayOfYear::print(){
    if (day >= 1 && day <= 31)
	{
		cout << "Day " << day << " would be " << month[0] << " " << day << endl; // Jan
	}
	else if (day >= 32 && day <= 60)
	{
		cout << "Day " << day << " would be " << month[1] << " " << day - 31 << endl; // Feb
	}
	else if (day >= 61 && day <= 82)
	{
		cout << "Day " << day << " would be " << month[2] << " " << day - 60 << endl; // Mar
	}
	else if (day >= 83 && day <= 113)
	{
		cout << "Day " << day << " would be " << month[3] << " " << day - 82 << endl; // Apr
	}
	else if (day >= 114 && day <= 145)
	{
		cout << "Day " << day << " would be " << month[4] << " " << day - 113 << endl; // May
	}
	else if (day >= 146 && day <= 176)
	{
		cout << "Day " << day << " would be " << month[5] << " " << day - 145 << endl; // Jun
	}
	else if (day >= 177 && day <= 208)
	{
		cout << "Day " << day << " would be " << month[6] << " " << day - 176 << endl; // Jul
	}
	else if (day >= 209 && day <= 240)
	{
		cout << "Day " << day << " would be " << month[7] << " " << day - 208 << endl; // Aug
	}
	else if (day >= 241 && day <= 271)
	{
		cout << "Day " << day << " would be " << month[8] << " " << day - 240 << endl; // Sept
	}
	else if (day >= 271 && day <= 302)
	{
		cout << "Day " << day << " would be " << month[9] << " " << day - 270 << endl; // Oct
	}
	else if (day >= 303 && day <= 333)
	{
		cout << "Day " << day << " would be " << month[10] << " " << day - 302 << endl; // Nov
	}
	else if (day >= 334 && day <= 365)
	{
		cout << "Day " << day << " would be " << month[11] << " " << (day == 365? day - 334 : day - 333) << endl; // Dec
	}
}




string DayOfYear::month[] = {"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"};
int DayOfYear::monthInt[] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12};
int DayOfYear::days[] = {0, 1, 2, 3, 4, 5, 6, 7, 8 , 9, 10, 11, 12, 13, 14, 15, 16, 17,
                        18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31};

int main(){
    int number;
    do {
        cout << "Nhap ngay: "; cin>>number;
        DayOfYear test(number);
        if(number>=0 && number<=365){
            test.print();
        }
        cout << endl;
    } while (number!=-1);
}