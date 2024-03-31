#include<iostream>
using namespace std;
#include "Stack.h"
#include "Queue.h"
int main()
{
    Stack<int> s;
    s.Push(3);
    s.Push(4);
    s.Push(5);
    cout<<s.getTop()<<"    "<<endl;
    cout<<s.Pop()<<"    "<<endl;
    cout<<s.Pop()<<"    "<<endl;
    cout<<s.Pop()<<"    "<<endl;
    // Queue<int> a;
    // a.EnQueue(2);
    // a.EnQueue(4);
    // a.EnQueue(6);
    // cout<<a.getFirst()<<endl;
    // cout<<a.DeQueue()<<endl;
    // cout<<a.DeQueue()<<endl;
    // cout<<a.DeQueue()<<endl;
    return 0;
}
