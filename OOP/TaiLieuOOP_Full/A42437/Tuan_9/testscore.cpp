// #include<iostream>
// using namespace std;
// template <class V>
// class TestScores
// {
//     protected:
//         int size;
//         V *b;
//     public:
//         TestScores(int a, V c[])
//         {
//             size = a;
//             b = new V[a];
//             for (int i = 0; i < a; i++)
//             {
//                 b[i] = c[i];
//             }
//         }
//         V Min(){
//             V min = b[0];
//             for(int i = 0; i < size; i++)
//             {
//                 if(min > b[i])
//                     min = b[i];
//             }
//             return min;
//         }
// };
// template <class T>
// class Child: public TestScores<int>
// {
//     public:
//         Child(int n, int e[])
//         {
//             int sum = 0;
//             size = n;
//             b = new T[n];
//         }
//         T Sum(){
//             int sum = 0;
//             for (int i = 0; i<size; i++)
//             {
//                 sum += b[i];
//             }
//             return sum;
//         }
// };
// int main()
// {
//     int a = 6;
//     int b[a];
//     for(int i = 0; i < a; i++)
//     {
//         cin >> b[i];
//     }
//     TestScores<int> m(a, b);
//     Child<int> c(a, b);
//     cout << m.Min() << endl;
//     cout << c.Sum() << endl;
//     return 0;
// }




#include <iostream>
using namespace std;

template <class V>
class TestScores
{
protected:
    int size;
    V *b;

public:
    TestScores(int a, V c[])
    {
        size = a;
        b = new V[a];
        for (int i = 0; i < a; i++)
        {
            b[i] = c[i];
        }
    }

    V Min()
    {
        V min = b[0];
        for (int i = 0; i < size; i++)
        {
            if (min > b[i])
                min = b[i];
        }
        return min;
    }
};

template <class T>
class Child : public TestScores<T>
{
public:
    Child(int n, T e[]) : TestScores<T>(n, e) {} // Sửa đổi constructor để gọi constructor của lớp cơ sở

    T Sum()
    {
        T sum = 0;
        for (int i = 0; i < this->size; i++) // Thay đổi size thành this->size
        {
            sum += this->b[i]; // Thay đổi b thành this->b
        }
        return sum;
    }
};

int main()
{
    int a = 6;
    int b[a];
    for (int i = 0; i < a; i++)
    {
        cin >> b[i];
    }

    TestScores<int> m(a, b);
    Child<int> c(a, b);

    cout << "Minimum: " << m.Min() << endl;
    cout << "Sum: " << c.Sum() << endl;

    return 0;
}
