#ifndef stack_h
#define stack_h
#include "node.h"
#include <bits/stdc++.h>
using namespace std;

template <class T> 
class Stack{
    private:
        Node<T> *top;
    public:
        Stack(){top=0;}
        void Push(T value){
            Node<T> *n = new Node<T>;
            n->data = value;
            n->next = top;
            top=n;
        }
        T Pop() {
            T t = top->data;
            Node<T> *p = top;
            top = top->next;
            delete p;
            return t;
        }
        bool IsEmpty() {return top==0;}
        T getTop() {return top->data;}
        ~Stack(){
            while(top != NULL){
                Node<T> *p = top;
                top = top->next;
                delete p;
            }
        }
};

#endif