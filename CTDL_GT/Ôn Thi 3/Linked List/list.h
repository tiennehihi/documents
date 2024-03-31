#ifndef list_h
#define list_h
#include "node.h"
#include <bits/stdc++.h>
using namespace std;

template <class T>
class List{
    private:
        Node<T> *head;
    public:
        List(){head=0;}
        void Add(T value){
            Node<T> *n = new Node<T>;
            n->data = value;
            n->next = NULL;
            if(head == 0)
                head = n;
            else {
                Node<T> *h = head;
                while(h->next != NULL){
                    h = h->next;
                }
                n->next = h->next;
                h->next = n;
            }
        }
        void Print() const {
            Node<T> *h = head;
            while(h != NULL){
                cout << h->data << " ";
                h = h->next;
            }
        }
        T Get(int pos){
            Node<T> *h = head;
            for(int i=0; i < pos; i++){
                h = h->next;
            }
            return h->data;
        }
        void Delete(int pos){
            if(pos == 0){
                head = head->next;
            } else {
                Node<T> *p = head;
                for(int i=1; i < pos; i++){
                    p = p->next;
                }
                Node<T> *q = p->next;
                p->next = p->next->next;
                delete q;
            }
        }
        void Insert(int pos, T value){
            Node<T> *p = new Node<T>;
            p->data = value;
            if(pos == 0){
                p->next = head;
                head = p;
            } else {
                Node<T> *h = head;
                for(int i=1; i<pos; i++){
                    h = h->next;
                }
                p->next = h->next;
                h->next = p;
            }
        }
        void Update(int pos, T value){
            Node<T> *p = head;
            for(int i=0; i < pos; i++){
                p = p->next;
            }
            p->data = value;
        }
        int FirstIndex(T value){
            Node<T> *p = head;
            int i=0;
            while(p != NULL){
                if(p->data == value){
                    return i;
                }
                ++i;
                p = p->next;
            }
            return -1;
        }
        int LastIndex(T value){
            Node<T> *p = head;
            int i=0, last = -1;
            while(p != NULL){
                if(p->data == value){
                    last = i;
                }
                ++i;
                p = p->next;
            }
            return last;
        }
        int Size() {
            Node<T> *h = head;
            int cnt = 0;
            while(h != NULL){
                ++cnt;
                h = h->next;
            }
            return cnt;
        }
        int CountValue(T value) {
            Node<T> *h = head;
            int cnt = 0;
            while(h != NULL){
                if(h->data == value){
                    ++cnt;
                }
                h = h->next;
            }
            return cnt;
        }
        void UpdateValue(T value_1, T value_2) {
            Node<T> *h = head;
            while(h != NULL){
                if(h->data == value_1){
                    h->data = value_2;
                }
                h = h->next;
            }
        }
        bool Check(T value){
            Node<T> *h = head;
            while(h != NULL){
                if(h->data == value)
                    return true;
                h = h->next;
            }
            return false;
        }
        ~List(){
            Node<T> *p = head;
            while(p != NULL){
                Node<T> *nextNode = p->next;
                delete p;
                p = nextNode;
            }
            head = 0;
        }
};


#endif