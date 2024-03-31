#ifndef stack2_h
#define stack2_h

#include <iostream>
#include "Node.h"
using namespace std;

template <class T>
class Stack_2
{
    private:
        Node<T> *top;
    public:
        Stack_2() {top=0;}

        void Push(T value)
        {
            Node<T> *p = new Node<T>;
            p->data = value;
            p->next = top;
            top=p;
        }

        T Pop()
        {
            T t = top->data;
            Node<T> *p = top;
            top = top->next;
            delete p;
            return t;
        }

        bool IsEmpty()
        {
            return top==0;
        }

        T getTop()
        {
            return top->data;
        }
};

#endif
