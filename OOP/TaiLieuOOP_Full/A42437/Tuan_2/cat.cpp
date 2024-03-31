#include <bits/stdc++.h>
using namespace std;

class cat{
    private:
        string name;
        int age;
        float weigth;
        static int count;
    public:
        cat() {}
        cat(string n, int a, float w):name(n), age(a), weigth(w){
            count++;
        }
        void setInfor(string j, int q, float k){
            name = j;
            age = q;
            weigth = k;
            count++;
        }
        string getName() const {return name; }
        int getAge() const {return age; }
        float getWeigth() const {return weigth; }
        static int getCount() {return count; }

        // nap chong tien to
        cat operator++()
        {
            weigth += 1;
            return *this;
        }

        // nap chong hau to
        cat operator++(int)
        {
            cat tmp;
            tmp = *this;
            weigth+=1;
            return tmp;
        }
        
};
int cat::count=0;

int main(){
    // cat meow1("Bibi", 3, 4.5);
    // cat meow3;
    // meow3 = meow1;
    // cout << meow1.getAge() << endl;
    // cout << meow1.getWeigth() << endl;
    // cout << meow1.getName() << endl;
    // cout << "---------------------\n";
    // cout << meow3.getAge() << endl;
    // cout << meow3.getWeigth() << endl;
    // cout << meow3.getName() << endl;

    cat meow1("Bibi", 3, 4.5);
    cout << meow1.getWeigth() << endl;
    // ++meow1;
    // meow1++;
    cout << (meow1++).getWeigth() << endl;
    cout << meow1.getWeigth() << endl;
    return 0; 
}