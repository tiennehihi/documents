#include <bits/stdc++.h>
using namespace std;
struct CourseGrade{
    string name, id;
    float *test, average;
    char grade;
};
char check(float c){
    char diem;
    if(c<=60) diem= 'F';
    else if(c>60 && c<=70) diem='D';
    else if(c>70 && c<=80) diem= 'C';
    else if(c>80 && c<=90) diem= 'B';
    else if(c>90 && c<=100) diem= 'A';
    return c;
}
void print(CourseGrade q[], int s){
    for(int i=0; i<s; i++){
        cout << "Ten: " << q[i].name << end;
        cout << "ID: " << q[i].id << end;
        cout << "Diem TB: " << q[i].average << end;
        cout << "Diem chu: " << check(q[i].average) << endl;
    }
}
int main(){
    int sohs;
    float sum=0;
    cout<<"Co bao nhieu hoc sinh: ";
    cin>>sohs;
    CourseGrade *a = new CourseGrade[sohs];
    for(int i=0; i<sohs; i++){
        cout << "Nhap id, ten va cac diem kiem tra: ";
        cin>>a[i].id>>a[i].name;
        a[i].test = new float[3];
        for(int j=0; j<3; j++){
            do{
                cin>>a[i].test[j];
            }while(a[i].test[j] < 0);
            sum += a[i].test[j];
            a[i].average = sum / 3;
        }
    }
    print(a, sohs);
    return 0;
}