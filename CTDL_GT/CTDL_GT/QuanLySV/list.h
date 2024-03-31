#include <iostream>
using namespace std;
#include "node.h"

// tạo node mới (sinh viên)
sv makeNode()
{
    Student s;
    cout << "Nhap ten: ";
    cin.ignore();
    cin >> s.name;
    cout << "Nhap ID: ";
    cin >> s.id;
    cout << "Nhap GPA: ";
    cin >> s.gpa;
    sv tmp = new SinhVien();
    tmp->s = s;
    tmp->next = nullptr;
    return tmp;
}

// check rỗng
bool empty(sv a)
{
    return a==NULL;
}

// đếm số lượng sinh viên
int Count(sv a)
{
    int cnt=0;
    while(a != 0)
    {
        ++cnt;
        a = a->next; // gan dia chi cua not tiep theo cho node hien tai
		//cho node hien tai nhay sang not tiep theo
    }
    return cnt;
}

// them 1 phan tu vao dau danh sach lien ket
void insertFirst(sv &a)
{
    sv tmp = makeNode();
    if(a == nullptr)
    {
        a = tmp;
    }
    else {
        tmp->next = a;
        a = tmp;
    }
}

// them 1 phan tu vao cuoi danh sach lien ket
void insertLast(sv &a)
{
    sv tmp = makeNode();
    if (a == NULL)
    {
        a = tmp;
    }
    else {
        sv p = a;
        while (p->next != NULL)
        {
            p = p->next;
        }
        p->next = tmp;
    }
}