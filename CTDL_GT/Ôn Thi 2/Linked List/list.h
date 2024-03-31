// #ifndef list_h
// #define list_h 
// #include <bits/stdc++.h>
// #include "node.h"
// using namespace std;

// template <class T>
// class List
// {
//     Node<T> *head;
//     public:
//         List() {head=0;}
//         void Add(T value)
//         {
//             Node<T> *n = new Node<T>;
//             n->data = value;
//             n->next = nullptr;
//             if(head == 0)
//             {
//                 head = n;
//             }
//             else
//             {
//                 Node<T> *h = head;
//                 while(h->next != NULL)
//                 {
//                     h = h->next;
//                 }
//                 n->next = h->next;
//                 h->next = n;
//             }
//         }
//         void Print() const {
//             Node<T> *p = head;
//             while(p != nullptr){
//                 cout << p->data << " ";
//                 p = p->next;
//             }
//         }
//         void Delete(int pos){
//             if(pos == 0){
//                 head = head->next;
//             }
//             else {
//                 Node<T> *p = head;
//                 for(int i=1; i < pos; i++){
//                     p = p->next;
//                 }
//                 Node<T> *q = p->next;
//                 p->next = p->next->next;
//                 delete q;
//             }
//         }
//         T Get(int pos) const {
//             Node<T> *p = head;
//             for(int i = 0; i < pos-1; i++){
//                 p = p->next;
//             }
//             return p->data;
//         }
//         void Insert(int pos, T value){
//             Node<T> *p = new Node<T>;
//             p->data = value;
//             if(pos==0){
//                 p->next = head;
//                 head = p;
//             } else {
//                 Node <T> *h = head;
//                 for(int i=1; i < pos; i++){
//                     h = h->next;
//                 }
//                 p->next = h->next;
//                 h->next = p;
//             }
//         }
//         void Update(int pos, T value){
//             Node<T> *p = head;
//             for(int i=0; i < pos; i++){
//                 p = p->next;
//             }
//             p->data = value;
//         }
//         void UpdateValue(T value_1, T value_2){
//             Node<T> *p = head;
//             while(p != nullptr){
//                 if(p->data == value_1){
//                     p->data = value_2;
//                 }
//                 p = p->next;
//             }
//         }
//         int Size() const {
//             int cnt = 0;
//             Node<T> *p = head;
//             while(p != nullptr){
//                 ++cnt;
//                 p = p->next;
//             }
//             return cnt;
//         }
//         int CountValue(T value) {
//             int cnt = 0;
//             Node<T> *p = head;
//             while(p != nullptr){
//                 if(p->data == value) {
//                     ++cnt;
//                 }
//                 p = p->next;
//             }
//             return cnt;
//         }
//         int FirstIndex(T value) const {
//             Node<T> *p = head;
//             int i = 0;
//             while(p != nullptr){
//                 ++i;
//                 if(p->data == value){
//                     return i;
//                 }
//                 p = p->next;
//             }
//             return -1;
//         }
//         int LastIndex(T value) const {
//             Node<T> *p = head;
//             int i=0, last = 0;
//             while(p != nullptr){
//                 ++i;
//                 if(p->data == value){
//                     last = i;
//                 }
//                 p = p->next;
//             }
//             return last;
//         }
// };


// #endif

#ifndef list_h
#define list_h
#include <bits/stdc++.h>
#include "node.h"
using namespace std;

template <class T>
class List {
    private:
        Node<T> *head;
    public:
        List() {head=0;}
        void Add(T value){
            Node<T> *p = new Node<T>;
            p->data = value;
            p->next = NULL;
            if (head == 0)
                head = p;
            else {
                Node<T> *h = head;
                while(h->next != NULL){
                    h = h->next;
                }
                p->next = h->next;
                h->next = p;
            }
        }
        void Print() const {
            Node<T> *h = head;
            while(h != NULL){
                cout << h->data << " ";
                h = h->next;
            }
        }
        T Get(int pos) const {
            Node<T> *p = head;
            for(int i=0; i < pos-1; i++){
                p = p->next;
            }
            return p->data;
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
                for(int i=1; i < pos; i++){
                    h = h->next;
                }
                p->next = h->next;
                h->next = p;
            }
        }
        int FirstIndex(T value){
            Node<T> *p = head;
            int i=0;
            while(p != NULL){
                ++i;
                if(p->data == value){
                    return i;
                }
                p = p->next;
            }
            return -1;
        }
        int LastIndex(T value){
            Node<T> *h = head;
            int i = 0, last = -1;
            while(h != NULL){
                ++i;
                if(h->data == value){
                    last = i;
                }
                h = h->next;
            }
            return last;
        }
        bool Check(T value){
            Node<T> *h = head;
            while(h != NULL){
                if(h->data == value){
                    return true;
                }
                h = h->next;
            }
            return false;
        }
        void Update(int pos, T value){
            Node<T> *p = head;
            for(int i=0; i < pos; i++){
                p = p->next;
            }
            p->data = value;
        }
        void UpdateValue(T value_1, T value_2){
            Node<T> *p = head;
            while(p != NULL){
                if (p->data == value_1){
                    p->data = value_2;
                }
                p = p->next;
            }
        }
        int Size() const {
            int cnt = 0;
            Node<T> *p = head;
            while(p != NULL){
                ++cnt;
                p = p->next;
            }
            return cnt;
        }
        int CountValue(T value) const {
            int cnt = 0;
            Node<T> *p = head;
            while(p != NULL){
                if(p->data == value)
                    ++cnt;
                p = p->next;
            }
            return cnt;
        }
        ~List(){
            Node<T> *p = head;
            while(p != NULL){
                Node<T> *nextNode = p->next;
                delete p;
                p = nextNode;
            }
            head = NULL;
        }
};


#endif