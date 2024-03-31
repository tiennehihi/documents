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
    public:
        List()
        {
            head = NULL; // gán head = 0, vị trí đầu tiên trong node này rỗng
        }



        // thêm 1 phần tử t vào cuối List
        void add(T t)   
        {
            Node<T> *p = new Node<T>;  //  con trỏ p được khai báo và gán bằng một đối tượng Node<T>
            p->data = t;  // gán giá trị của p = t, lúc này t sẽ là node cuối cùng
            p->next = NULL;   // địa chỉ cuối cùng của list = 0
            if(head == NULL)   // ban đầu chưa có node nào, head = 0
            {
                head = p;   // chưa có node nào nên p sẽ là giá trị đầu tiên, gán head = p
            }
            else 
            {
                Node<T> *n = head;  // gán con trỏ p = head ở vị trí đầu tiên, để head không chạy quanh
                while(n->next != NULL)  // next != NULL thì vẫn chạy, vì đằng sau vẫn còn giá trị
                {
                    n = n->next; // p sẽ trỏ đến địa chỉ tiếp theo
                }
                n->next = p;  // gán địa chỉ của node tiếp theo = p
            }
        }

        T get(int pos) const
        {
            Node<T> *p = head; // khai báo con trỏ p gán ở vị trí đầu tiên trong List
            for(int i=0; i < pos; i++)
            {
                p = p->next;
            }
            return p->data;
        }

        // in ra List
        void printList() const
        {
            Node<T> *p = head; 
            while(p != NULL)
            {
                cout << p->data << " ";
                p = p->next;
            }
        }

        // xóa phần tử ở vị trí pos
        void Delete(int pos)
        {
            if(pos == 0) // TH đặc biệt xóa ở vị trí 0
            {
                head = head->next;  // xóa phần tử ở đầu, phần tử t2 lúc này sẽ là phần tử t1
            }
            else
            {
                Node<T> *p = head;
                for(int i=1; i <= pos-1; i++)
                {
                    p = p->next;
                }
                p = p->next->next;  // con trỏ p lúc này sẽ chạy tới địa chỉ next thứ 2, vì next t1 bị xóa nên bỏ qua
            }
        }

};

#endif