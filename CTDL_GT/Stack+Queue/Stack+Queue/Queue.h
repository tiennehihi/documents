#ifndef QUEUE_H
#define QUEUE_H
#include"Node.h"
#include<iostream>

using namespace std;

template<class T>
class Queue{
    private:
        Node<T> *f;
        Node<T> *l;
    public:
        Queue(){
            f=0;
            l=0;
        }
        
        void EnQueue(T value){
            Node<T> *n=new Node<T>;
            n->data=value;
            n->next=0;
            if(f==0){
                f=n;
                l=n;
            }
            else{
                l->next=n;
                l=n;
            }
        }
        T DeQueue(){
            T t=f->data;
            Node<T> *p=f;
            f=f->next;
            delete p;
            if(f==0){
                l=0;
            }
            return t;
        }

        bool IsEmpty(){
            return f==0;
        }

        T getFirst(){
            return f->data;
        }
};


#endif