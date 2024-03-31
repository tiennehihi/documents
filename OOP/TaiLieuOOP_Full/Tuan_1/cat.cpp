#include <bits/stdc++.h>
using namespace std;
class cat{
    private:
        string name = "Tom";
        int age = 1;
        float weight = 2;
    public:
        cat(){};  // hàm tạo

        // cat():name("Tom"), age(1), weight(2){}; 

        // cat (){
        //     setInfor("Tom", 1, 2);
        // };

        // cat(){
        //     name = "Bibi";
        //     age = 1;
        //     weight = 2;
        // }

        // cat(string n):age(1), weight(2), name(n){};  //có 1 tham số khởi tạo name, còn age, weight gán bằng 1 và 2

        // cat(string n, int a): weight(2), name(n), age(a){};   // có 2 tham số khởi tạo là name và age còn weight gán bằng 2

        // cat(string n, int a, float w):name(n), age(a), weight(w){};   //có 3 tham số khởi tạo là name age weight

        cat(string n, int a, float w){
            setInfor(n, a, w);
        };

        void setInfor(string n, int a, float w){
            name = n;
            age = a;
            weight = w;
        };
        void setName(string);
        void setAge(int);
        void setWeight(float);
        string getName() const {
            return name;
        };
        int getAge() const {
            return age;
        };
        float getWeight() const {
            return weight;
        };
        void meow();
        int chaseMouse(int);
};
void cat::meow(){
    cout<<"Meow, I am "<<name<<endl;
};
int cat::chaseMouse(int chuot){
    srand(time(NULL));
    cin>>chuot;
    int count = 0;
    for(int i=1; i<=chuot; i++){
        i = rand() % 2;
        if(i) count++;
    }
    return count;
}
int main(){
    cat meo;
    cout << meo.getName() << " "<< meo.getAge()<<" "<<meo.getWeight()<<endl;
}
