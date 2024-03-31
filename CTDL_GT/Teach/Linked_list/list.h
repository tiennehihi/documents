#ifndef LIST_H
#define LIST_H
#include "node.h"
#include <iostream>
using namespace std;

template <class T>
class List {
    private:
        Node<T> *head;
    public:
        List() { head = 0; }

        // Thêm 1 node
        void Add(T t) {
            Node<T> *p = new Node<T>;
            p->data = t;
            p->next = NULL;
            if(head == NULL){
                head = p;
            } else {
                Node<T> *h = head;
                while(h->next != NULL) {
                    h = h->next;
                }
                h->next = p;
            }
        }

        // Lấy ra phần tử ở vị trí pos
        T Get(int pos) const {
            Node<T> *p = head;
            for(int i=1; i < pos; i++) {
                p = p->next;
            }
            return p->data;
        }

        // Hàm in
        void PrintList() const {
            Node<T>* p = head;
            while(p != NULL) {
                cout << p->data << " ";
                p = p->next;
            }
            cout << endl;
        }

        // Xóa
        void Delete(int pos) {
            if (pos == 0) {
                head = head->next;
            } else {
                Node<T> *p = head;
                for(int i=1; i <= pos-1; i++) {
                    p = p->next;
                }
                p->next = p->next->next;
            }
        }

        // Size or Count
        int Count() {
            int cnt = 0;
            Node<T> *p = head;
            while(p != NULL){
                ++cnt;
                p = p->next;
            }
            return cnt;
        }

        // Hàm chèn vị trí bất kì
        void Insert(T t, int pos) {
            Node<T> *p = new Node<T>;
            p->data = t;
            if(pos==0) {
                p->next = head;
                head = p;
            } else {
                Node<T> *h = head;
                for(int i=1; i<pos; i++) {
                    h = h->next;
                }
                p->next = h->next;
                h->next = p;
            }
        }

        // Update value ở vị trí bất kì
        void Update(T value, int pos) {
            Node<T>* h = head;
            for(int i=0; i<pos; i++){
                h = h->next;
            }
            h->data = value;
        }

        // Update value_1 thành value_2
        void UpdateValue(T value_1, T value_2) {
            Node<T>* h = head;
            while(h != NULL) {
                if(h->data == value_1){
                    h->data = value_2;
                }
                h = h->next;
            }
        }

        // Đếm số lần xuất hiện của 1 phần tử
        int CountValue(T value) {
            int cnt = 0;
            Node<T>* h = head;
            while(h != NULL) {
                if(h->data == value){
                    cnt++;
                } 
                h = h->next;
            }
            return cnt;
        }

        // Vị trí xuất hiện đầu tiên của phần tử
        int FirstIndex(T value) {
            int i=0;
            Node<T>* h = head;
            while(h != 0) {
                i++;
                if(h->data == value)
                    return i;
                h = h->next;
            }
        }

        // Sắp xếp
        void sapXep() {
            if(head == NULL || head->next == NULL)
                return;
            bool swapped;
            Node<T> *ptr1;
            Node<T> *lptr = NULL;
            do {
                swapped = false;
                ptr1 = head;
                while(ptr1 -> next != lptr) {
                    if(ptr1->data > ptr1->next->data) {
                        T temp = ptr1->data;
                        ptr1->data = ptr1->next->data;
                        ptr1->next->data = temp;
                        swapped = true;
                    }
                    ptr1 = ptr1->next;
                }
                lptr = ptr1;
            } while (swapped);
        }
};


#endif