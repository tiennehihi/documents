#ifndef queue2_h
#define queue2_h
#include <iostream>
#include "Node.h"
using namespace std;

template <class T>
class Queue2
{
    public:
        Node<T> *f;
        Node<T> *l;
    private:
        Queue2()
        {
            f = 0;
            l = 0;
        }
        void EnQueue(T value)
        {
            Node<T> *p = new Node<T>;
            p->data = value;
            p->next = nullptr;
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
            T t = top->data;
            Node<T> *p = f;
            f = f->next;
            delete p;
            if(f == 0)
                l = 0;
            return t;
        }
        
        bool IsEmpty()
        {
            return f==0;
        }

        T getFirst() const 
        {
            return f->data;
        }
};


#endif