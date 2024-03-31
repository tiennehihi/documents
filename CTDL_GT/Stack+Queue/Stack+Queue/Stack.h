#ifndef stack_h
#define stack_h
#include"Node.h"
#include<iostream>

using namespace std;
template<class T>
class Stack{
    private:
        Node<T> *top;
    public:
        Stack(){
            top=0;
        }

        void Push(T value){
            Node<T> *n=new Node<T>;
            n->data=value;
            n->next=top;
            top=n;
        }

        T Pop(){
            T t=top->data;
            Node<T> *p=top;
            top=top->next;
            delete p;
            return t;
        }

        bool IsEmpty() const {
            return top==0;
        }

        T getTop() const {
            return top->data;
        }

        void printStack() {
            Node<T>* temp = top;
            while (temp != NULL) {
                cout << temp->data << " ";
                temp = temp->next;
            }
        }
};  
#endif