#ifndef queue1_h
#define queue1_h
#include <iostream>
#include "Node.h"
using namespace std;

template <class T>
class Queue_1
{
    private:
        Node<T> *f;
        Node<T> *l;
    public:
        Queue_1()
        {
            f = 0;
            l = 0;
        }

        void EnQueue(T value)
        {
            Node<T> *p = new Node<T>;
            p->data = value;
            p->next = NULL;
            if(f==0)
            {
                f = p;
                l = p;
            } else {
                l->next = p;
                l = p;
            }
        }

        T DeQueue()
        {
            T t = f->data;
            Node<T> *p = f;
            f = f->next;
            delete p;
            if (f==0)
                l = 0;
            return t;
        }

        bool IsEmpty() { return f==0; }
        T getFirst() const { return f->data; }
};


#endif