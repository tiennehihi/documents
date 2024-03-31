#include <bits/stdc++.h>
using namespace std;

class Boomer{
    public:
        Boomer(){ cout <<"I belong to Boomer\n"; }
        void eatDogs() const { cout<<"I eat dogs\n"; }
        void likeEatingDogs() const { cout<<"I like eating dogs\n"; }
};
class GenX: public Boomer{
    protected:
        int like;
    public:
        GenX(): like(rand()%2){
            // like = rand()%2;
        }
        void likeEatingDogs(){
            if(like)
                cout << "I like eating dogs\n";
            else 
                cout << "I don't like dogs\n";
        }
};
class GenY: public GenX{
        void likeEatingDogs();
    public:
        int eat;
        GenY(): eat (rand()%2) {
            like = 0;
            // eat = rand()%2;
        }
        void eatDogs(){
            if(eat)
                cout << "I eat dogs\n";
            else
                cout << "I don't eat dogs\n";
        }
};
class GenZ: public GenY{
        void eatDogs();
};

int main(){
    srand(time(NULL));
    GenX x;
    x.likeEatingDogs();
    GenY y;
    y.eatDogs();
    // GenZ z;
    return 0;
}