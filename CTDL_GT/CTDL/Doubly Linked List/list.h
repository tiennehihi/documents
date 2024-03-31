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

    // Hàm trao đổi giá trị giữa hai nút
    void Swap(Node<T>* a, Node<T>* b) {
        T temp = a->data;
        a->data = b->data;
        b->data = temp;
    }

public:
    List()
    {
        head = nullptr;
        tail = nullptr;
    }

    // Thêm 1 node 
    void Add(T t)
    {
        Node<T> *p = new Node<T>;
        p->data = t;
        p->next = nullptr;
        if (head == nullptr)
        {
            head = p;
            tail = p;
        }
        else
        {
            tail->next = p;
            tail = p;
        }
    }

    // Lấy giá trị ở vị trí pos
    T get(int pos) const
    {
        Node<T> *p = head;
        for (int i = 0; i < pos && p != nullptr; i++)
        {
            p = p->next;
        }
        return p->data;
    }

    // Thêm phần tử vào vị trí đầu danh sách
    void addToHead(T value) {
        Node<T> *newNode = new Node<T>;
        newNode->data = value;
        newNode->next = head;

        if (head == nullptr) {
            // Nếu danh sách đang rỗng, cập nhật cả tail
            tail = newNode;
        }

        head = newNode;
    }

    // Thêm phần tử vào vị trí cuối danh sách
    void addToTail(T value) {
        Node<T> *newNode = new Node<T>;
        newNode->data = value;
        newNode->next = nullptr;

        if (tail == nullptr) {
            // Nếu danh sách đang rỗng, cập nhật cả head
            head = newNode;
        } else {
            tail->next = newNode;
        }

        tail = newNode;
    }

    // Thêm vào vị trí bất kỳ
    void InsertAt(T t, int pos)
    {
        if (pos == 0)
        {
            Node<T> *p = new Node<T>;
            p->data = t;
            p->next = head;
            head = p;
            if (tail == nullptr)
                tail = p;
        }
        else
        {
            Node<T> *p = head;
            for (int i = 0; i < pos - 1 && p != nullptr; i++)
                p = p->next;
            if (p != nullptr)
            {
                Node<T> *q = new Node<T>;
                q->data = t;
                q->next = p->next;
                p->next = q;
                if (q->next == nullptr)
                    tail = q;
            }
        }
    }

    // In ra màn hình
    void PrintList() const
    {
        Node<T> *p = head;
        while (p != nullptr)
        {
            cout << p->data << " ";
            p = p->next;
        }
        cout << endl;
    }

    // Xóa phần tử ở vị trí pos
    void Delete(int pos)
    {
        if (pos == 0)
        {
            Node<T> *p = head;
            head = head->next;
            delete p;
            if (head == nullptr)
                tail = nullptr;
        }
        else
        {
            Node<T> *p = head;
            for (int i = 0; i < pos - 1 && p != nullptr; i++)
                p = p->next;
            if (p != nullptr)
            {
                Node<T> *q = p->next;
                p->next = p->next->next;
                delete q;
                if (p->next == nullptr)
                    tail = p;
            }
        }
    }

    // Xóa phần tử đầu tiên
    void DeleteFirst()
    {
        if (head != nullptr)
        {
            Node<T> *p = head;
            head = head->next;
            delete p;
            if (head == nullptr)
                tail = nullptr;
        }
    }

    // Xóa phần tử cuối cùng
    void DeleteLast()
    {
        if (head != nullptr)
        {
            if (head == tail)
            {
                delete head;
                head = tail = nullptr;
            }
            else
            {
                Node<T> *p = head;
                while (p->next != tail)
                    p = p->next;
                delete tail;
                tail = p;
                tail->next = nullptr;
            }
        }
    }

    // Xóa nếu trùng lặp
    void DeleteDuplicates() {
        Node<T>* current = head;

        // Duyệt qua danh sách liên kết
        while (current != nullptr) {
            Node<T>* compare = current->next;
            Node<T>* prev = current;

            // Duyệt qua các nút phía sau nút hiện tại để so sánh
            while (compare != nullptr) {
                if (current->data == compare->data) {
                    // Nếu giá trị trùng lặp, xóa nút compare
                    prev->next = compare->next;
                    delete compare;
                    compare = prev->next;
                } else {
                    // Nếu giá trị không trùng lặp, di chuyển tới nút kế tiếp
                    prev = compare;
                    compare = compare->next;
                }
            }

            // Di chuyển tới nút kế tiếp trong danh sách
            current = current->next;
        }
    }
    /* Giải thích
    Duyệt qua danh sách liên kết:

    Sử dụng con trỏ current để duyệt qua danh sách liên kết từ đầu đến cuối.
    Duyệt qua các nút phía sau:

    Sử dụng con trỏ compare để duyệt qua các nút phía sau nút hiện tại để so sánh.
    So sánh giá trị:

    So sánh giá trị của nút hiện tại (current) với giá trị của các nút phía sau (compare).
    Xóa nút trùng lặp:

    Nếu giá trị của nút hiện tại và nút phía sau trùng lặp, thì xóa nút compare và di chuyển compare tới nút kế tiếp của nó.
    Di chuyển tới nút kế tiếp:

    Nếu giá trị không trùng lặp, di chuyển con trỏ prev và compare tới nút kế tiếp để tiếp tục so sánh.
    Di chuyển tới nút kế tiếp trong danh sách:

    Sau khi kiểm tra xong tất cả các nút phía sau nút hiện tại, di chuyển con trỏ current tới nút kế tiếp trong danh sách.
    */

    // Hàm sắp xếp tăng dần
    void SortAscending() {
        bool swapped;
        Node<T>* current;
        Node<T>* last = nullptr;

        // Nếu danh sách rỗng hoặc chỉ có một nút, không cần sắp xếp
        if (head == nullptr || head == tail) {
            return;
        }

        do {
            swapped = false;
            current = head;

            while (current->next != last) {
                if (current->data > current->next->data) {
                    Swap(current, current->next);
                    swapped = true;
                }
                current = current->next;
            }
            last = current;
        } while (swapped);
    }

    // Hàm sắp xếp giảm dần
    void SortDescending() {
        bool swapped;
        Node<T>* current;
        Node<T>* last = nullptr;

        // Nếu danh sách rỗng hoặc chỉ có một nút, không cần sắp xếp
        if (head == nullptr || head == tail) {
            return;
        }

        do {
            swapped = false;
            current = head;

            while (current->next != last) {
                if (current->data < current->next->data) {
                    Swap(current, current->next);
                    swapped = true;
                }
                current = current->next;
            }
            last = current;
        } while (swapped);
    }

    ~List() {
        // Hàm hủy danh sách (giữ lại để đơn giản hóa)
        while (head != nullptr) {
            Node<T> *temp = head;
            head = head->next;
            delete temp;
        }
    }
};

#endif


/*
Sắp xếp tăng dần

Biến và Con trỏ:

swapped: Biến boolean để kiểm tra xem có sự đổi chỗ nào không trong lần duyệt hiện tại.
current: Con trỏ duyệt qua danh sách từ đầu đến cuối.
last: Con trỏ giữ lại vị trí của nút cuối cùng đã được sắp xếp.
Kiểm tra Danh sách Rỗng hoặc chỉ có Một Nút:

Nếu danh sách chỉ có một nút hoặc rỗng, không cần sắp xếp vì đã ở trong trạng thái đã sắp xếp.
Thuật toán Sắp xếp Nổi bọt:

Sử dụng thuật toán sắp xếp nổi bọt để sắp xếp danh sách tăng dần.
Duyệt qua danh sách từ đầu đến cuối.
So sánh giá trị của nút hiện tại với giá trị của nút kế tiếp.
Nếu giá trị của nút hiện tại lớn hơn giá trị của nút kế tiếp, đổi chỗ hai nút và gán swapped = true.
Gán con trỏ last:

Sau mỗi lần duyệt, gán con trỏ last bằng con trỏ current, giữ lại vị trí của nút cuối cùng đã được sắp xếp.
Vòng lặp do-while:

Tiếp tục lặp cho đến khi không có sự đổi chỗ nào xảy ra trong một lần duyệt.
*/

/*

*/




// #ifndef LIST_H
// #define LIST_H
// #include "node.h"
// #include <iostream>
// using namespace std;
// template<class T>
// class List
// {
//   private:
//       Node<T> *head;
//       Node<T> *tail;
//   public:
//       List()
//       {
//           head = 0;
//           tail = 0;
//       }

//       // thêm 1 node 
//       void Add(T t){
//           Node<T> *p = new Node<T>;
//           p->data = t;
//           p->next = NULL;
//           if(head = NULL){
//               head = p;
//               tail = p;
//           } else {
//               tail->next = p;
//               tail = p;
//           }
//       }  

//       // get
//       T get(int pos) const {
//           Node<T> *p = new Node<T>;
//           for(int i=0; i<pos; i++){
//               p = p->next;
//           }
//           return p->data;
//       }    

//       // in ra man hinh
//       void printList() const {
//           Node<T> *p = head;
//           while (p != NULL){
//               cout << p->data << " ";
//               p = p->next;
//           }
//           cout << endl;
//       }   

//       // xoa phan tu o vi tri pos
//       void Delete(int pos){
//           if (pos == 0) {
//             Node<T> *p = head;
//             head = head->next;
//             delete p;
//             if (head == 0)
//               tail = NULL;
//           } else {
//             Node<T> *p = head;
//             for (int i = 0; i < pos - 1; i++)
//               p = p->next;
//             Node<T> *q = p->next;
//             p->next = p->next->next;
//             delete q;
//             if (p->next == NULL)
//               tail = p;
//           }
//       }

//       // xoa phan tu dau tien
//       void DeleteFirst() {
//         if (head != NULL) {
//           Node<T> *p = head;
//           head = head->next;
//           delete p;
//           if (head == NULL)
//             tail = NULL;
//         }
//       }

//       // xoa phan tu cuoi cung
//       void DeleteLast() {
//         if (head != NULL) {
//           if (head == tail) {
//             delete head;
//             head = tail = NULL;
//           } else {
//             Node<T> *p = head;
//             while (p->next != tail)
//               p = p->next;
//             delete tail;
//             tail = p;
//             tail->next = NULL;
//           }
//         }
//       }

//       // them vao vi tri bat kì
//       void InsertAt(T t, int pos) {
//         if (pos == 0) {
//           Node<T> *p = new Node<T>;
//           p->data = t;
//           p->next = head;
//           head = p;
//           if (tail == NULL)
//             tail = p;
//         } else {
//           Node<T> *p = head;
//           for (int i = 0; i < pos - 1 && p != NULL; i++)
//             p = p->next;
//           if (p != NULL) {
//             Node<T> *q = new Node<T>;
//             q->data = t;
//             q->next = p->next;
//             p->next = q;
//             if (q->next == NULL)
//               tail = q;
//           }
//         }
//       }

//       // xoa neu trung lap
//       void DeleteDuplicates() {
//         Node<T> *current = head;
//         while (current != NULL) {
//           Node<T> *compare = current->next;
//           Node<T> *prev = current;
//           while (compare != NULL) {
//             if (current->data == compare->data) {
//               prev->next = compare->next;
//               delete compare;
//               compare = prev->next;
//             } else {
//               prev = compare;
//               compare = compare->next;
//             }
//           }
//           current = current->next;
//         }
//       }
// };

// #endif

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