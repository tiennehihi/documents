#include <string>
using namespace std;
#ifndef NUMBERS_H
#define NUMBERS_H
class Numbers
{
private:
    int number;
    static string lessThan20[];
    static string tens[];
    static string hundred;
    static string thousand;

public:
    Numbers(int);
    void print();
    ~Numbers();
};
#endif