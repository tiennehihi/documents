#ifndef LIST_H
#define LIST_H
#include "node.h"
#include <iostream>
using namespace std;
template<class T>
class List
{
    private:
        Node<T> *head;
        Node<T> *tail;
    public:
        List()
        {
            head = 0;
            tail = 0;
        }

        // thêm 1 node 
        void Add(T t){
            Node<T> *p = new Node<T>;
            p->data = t;
            p->next = NULL;
            if(head = NULL){
                head = p;
                tail = p;
            } else {
                tail->next = p;
                tail = p;
            }
        }  

        // get
        T get(int pos) const {
            Node<T> *p = new Node<T>;
            for(int i=0; i<pos; i++){
                p = p->next;
            }
            return p->data;
        }    

        // in ra man hinh
        void printList() const {
            Node<T> *p = head;
            while (p->next != NULL){
                cout << p->data << " ";
                p = p->next;
            }
        }   

        // xoa phan tu o vi tri pos
        void Delete(int pos){
            if (pos == 0) {
              Node<T> *p = head;
              head = head->next;
              delete p;
              if (head == 0)
                tail = NULL;
            } else {
              Node<T> *p = head;
              for (int i = 0; i < pos - 1; i++)
                p = p->next;
              Node<T> *q = p->next;
              p->next = p->next->next;
              delete q;
              if (p->next == NULL)
                tail = p;
            }
        }

};

#endif

/*
#ifndef list_h
#define list_h
#include "node.h"
#include <iostream>
using namespace std;

template <class T> class List {
private:
  Node<T> *head;
  Node<T> *tail;

public:
  List() {
    head = NULL;
    tail = NULL;
  }

  void printAll() const {
    Node<T> *h = head;
    while (h != NULL) {
      cout << h->data << "; ";
      h = h->next;
    }
  }

  int Count() const {
    Node<T> *h = head;
    int dem = 0;
    while (h != NULL) {
      ++dem;
      h = h->next;
    }
    return dem;
  }

  void add(T t) {
    Node<T> *n = new Node<T>;
    n->data = t;
    n->next = NULL;
    if (head == NULL) {
      head = n;
      tail = n;
    } else {
      tail->next = n;
      tail = n;
    }
  }

  T get(int pos) const {
    Node<T> *p = head;
    for (int i = 0; i < pos; i++)
      p = p->next;
    return p->data;
  }

  void Delete(int pos) {
    if (pos == 0){
      Node<T> *p = head;
      head = head->next;
      delete p;
      if (head == 0)
        tail = NULL;
    }
    else {    
      Node<T> *p = head;  
      for (int i = 0; i < pos - 1; i++)
        p = p->next;
      Node<T> * q = p->next;
      p->next = p->next->next;
      delete q;
      if (p->next == NULL)
        tail = p;
      }
    }
};

#endif

*/