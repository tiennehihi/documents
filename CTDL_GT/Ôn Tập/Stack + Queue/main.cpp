#include <bits/stdc++.h>
#include "Stack.h"
#include "Queue.h"
using namespace std;
int main(){
    Stack<int> ds;
    ds.Push(3);
    ds.Push(4);
    ds.Push(9);
    ds.Push(1);
    ds.Push(8);
    ds.Push(2);
    cout << ds.Pop() << endl;
    cout << ds.Pop() << endl;
    cout << ds.Pop() << endl;
    cout << ds.Pop() << endl;
    cout << ds.IsEmpty() << endl;
    cout << ds.getTop() << endl;
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