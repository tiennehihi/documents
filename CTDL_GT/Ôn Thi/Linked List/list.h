#ifndef list_h
#define list_h
#include "node.h"
#include <iostream>
using namespace std;
template <class T>

class List{
    private:
        Node<T> *head;
    public:
        List() {head = 0;}
        void Add(T value){
            Node<T> *n = new Node<T>;
            n->data = value;
            n->next = nullptr;
            if(head==0) 
                head = n;
            else {
                Node<T> *h = head;
                while (h->next != 0){
                    h = h->next;
                }
                n->next = h->next;
                h->next = n;
            }
        }
        void PrintAll() const {
            Node<T> *p = head;
            while(p != 0){
                cout << p->data << " ";
                p = p->next;
            }
        }
        void Delete(int pos){
            if(pos == 0){
                head = head->next;
            } else {
                Node<T> *p = head;
                for(int i=1; i <= pos-1; i++){
                    p = p->next;
                }
                Node<T> *q = p->next;
                p->next = p->next->next;
                delete q;
            }
        }
        T Get(int pos) const {
            Node<T> *p = head;
            for(int i=0; i < pos; i++){
                p = p->next;
            }
            return p->data;
        }
        void Insert(int pos, int value){
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
        void Update(int pos, T value){
            Node<T> *p = head;
            for(int i=0; i<pos; i++){
                p = p->next;
            }
            p->data = value;

        }
        void UpdateValue(T value_1, T value_2){
            Node<T> *p = head;
            while(p != nullptr){
                if(p->data == value_1){
                    p->data = value_2;
                }
                p = p->next;
            }
        }
        int Size(){
            int size = 0;
            Node<T> *p = head;
            while(p != nullptr){
                ++size;
                p = p->next;
            }
            return size;
        }
        int CountValue(T value){
            int cnt = 0;
            Node<T> *p = head;
            while(p != NULL){
                if(p->data == value){
                    ++cnt;
                }
                p = p->next;
            }
            return cnt;
        }
        int FirstIndex(T value){
            int i=0;
            Node<T> *p = head;
            while(p != NULL){
                ++i;
                if(p->data == value)
                    return i;
                p = p->next;
            }
            return -1;
        }
        int LastIndex(T value){
            int i=0, last=0;
            Node<T> *p = head;
            while(p != NULL){
                ++i;
                if(p->data == value)
                    last = i;
                p = p->next;
            }
            return last;
        }
};


#endif