#include <string>
#ifndef DAYOFYEAR_H
#define DAYOFYEAR_H
using namespace std;
class DayOfYear{
    private:
        int day;
        static string month[];
        static int monthInt[];
        static int days[];
    public:
        DayOfYear(int);
        DayOfYear(string, int);
        void print();
};
#endif