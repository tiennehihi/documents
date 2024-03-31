#ifndef stack1_h
#define stack1_h

#include <iostream>
#include "Node.h"
using namespace std;

template <class T>
class Stack_1
{
    private:
        Node<T> *top;
    public:
        Stack_1(){ top=0; }

        void Push(T value)
        {
            Node<T> *p = new Node<T>;
            p->data = value;
            p->next = top;
            top = p;
        }

        T Pop()
        {
            T t = top-> data;
            Node<T> *p = top;
            top = top->next;
            delete p;
            return t;
        }

        bool IsEmpty() { return top==0; }

        T getTop() const { return top->data; }
};

#endif
