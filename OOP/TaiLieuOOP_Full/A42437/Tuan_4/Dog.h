#ifndef DOG_H
#define DOG_H
class Dog
{
    private:
        string tend;
        int tuoid;
    public:
        Dog(){}
        Dog(string name="", int age=0)
        {
            tend = name;
            tuoid = age;
        }
        void print()
        {
            cout<<tend<<endl;
            cout<<tuoid<<endl;
        }
};



#endif