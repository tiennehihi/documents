#ifndef list_h
#define list_h 
#include <iostream>
#include "node.h"

template <class T>
class List {
    private:
        Node<T> *head;
    public:
        List() {head=nullptr;}
        void Add(T value)
        {
            Node<T> *p = new Node<T>;
            p->data = value;
            p->next = NULL;
            if(head == 0){
                head = p;
            } else {
                Node<T> *h = head;
                while(h->next != NULL){
                    h = h->next;
                }
                h->next = p;
            }
        }
        T Get(int pos) const 
        {
            Node<T> *p = head;
            for(int i=0; i < pos; i++)
            {
                p = p->next;
            }
            return p->data;
        }
        void PrintAll() const 
        {
            Node<T> *p = head;
            while(p != NULL)
            {
                cout << p->data << " ";
                p = p->next;
            }
        }
        void Delete(int pos) 
        {
            if (pos == 0){
                head = head->next;
            } else {
                Node<T> *p = head;
                for(int i=1; i <= pos-1; i++)
                {
                    p = p->next;
                }
                p->next = p->next->next;
            }
        }
        void Insert(T value, int pos)
        {
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