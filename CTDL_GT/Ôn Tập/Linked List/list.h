#ifndef list_h
#define list_h
#include "node.h"
#include <iostream>
using namespace std;

template <class T>
class List {
    private:
        Node<T> *head;
    public:
        List() {head = 0};

        void Add(T value){
            Node<T> *p = new Node<T>;
            p->data = value;
            p->next = nullptr;
            if(head == 0){
                head = p;
            } else {
                Node<T> *h = head;
                while(h->next != nullptr){
                    h = h->next;
                }
                h->next = p;
            }
        }

        T Get(int pos) const {
            for(int i=0; i < pos; i++){
                p = p->next;
            }
            return p->data;
        }

        void Print(){
            Node<T> *p = head;
            while(p != nullptr){
                cout << p->data << " ";
                p = p->next;
            }
        }

        void Delete(int pos){
            if(pos==0){
                head = head->next;
            } else {
                Node<T> *p = head;
                for(int i=1; i <= pos-1; i++){
                    p = p->next;
                }
                p->next = p->next->next;
            }
        }

        void Insert(int pos, T value){
            Node<T> *p = new Node<T>;
            p->data = value;
            if(pos==0){
                p->next = head;
                head = p;
            } else {
                Node<T> *h = head;
                for(int i=1; i < pos; i++){
                    h = h->next;
                }
                p->next = h->next;
                h->next = p;
            }
        }
};


#endif