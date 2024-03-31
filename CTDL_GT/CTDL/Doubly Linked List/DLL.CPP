#include<bits/stdc++.h>
using namespace std;

template <class T>
struct Node {
    T data;
    Node<T> *next;
};

template <class T>
class List {
private:
    Node<T> *head;
    Node<T> *tail;

public:
    List() {
        head = nullptr;
        tail = nullptr;
    }

    // Thêm 1 node
    void Add(T t) {
        Node<T> *p = new Node<T>;
        p->data = t;
        p->next = nullptr;
        if (head == nullptr) {
            head = p;
            tail = p;
        } else {
            tail->next = p;
            tail = p;
        }
    }

    // Lấy ra giá trị ở vị trí bất kì
    T Get(int pos) {
        Node<T> *p = head;
        for (int i = 0; i < pos && p != nullptr; i++) {
            p = p->next;
        }
        return p->data;
    }

    // In ra màn hình
    void PrintList() {
        Node<T> *p = head;
        while (p != nullptr) {
            cout << p->data << " ";
            p = p->next;
        }
        cout << endl;
    }

    // Thêm vào đầu
    void addToHead(T value) {
        Node<T> *newNode = new Node<T>;
        newNode->data = value;
        newNode->next = head;
        if (head == nullptr) {
            tail = newNode;
        }
        head = newNode;
    }

    // Thêm vào cuối
    void addToTail(T value) {
        Node<T> *newNode = new Node<T>;
        newNode->data = value;
        newNode->next = nullptr;
        if (tail == nullptr) {
            head = newNode;
        } else {
            tail->next = newNode;
        }
        tail = newNode;
    }
};

int main() {
    List<int> t;
    t.Add(1);
    t.Add(2);
    t.Add(3);
    t.PrintList();

    t.addToHead(0);
    t.PrintList();

    t.addToTail(4);
    t.PrintList();

    return 0;
}
