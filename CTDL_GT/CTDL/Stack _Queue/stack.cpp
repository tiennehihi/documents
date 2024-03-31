// 1. Xây dựng cấu trúc dữ liệu ngăn xếp 
// 2. Xây dựng lớp biểu diễn đồ thị vô hướng có trọng số bằng ma trận kề có các phương thức: 
// a. Nhập đồ thị từ file 
// b. Ghi đồ thị ra file 
// c. Duyệt đồ thị theo chiều sâu (DFS) 
// d. Tìm đường đi ngắn nhất giữa 2 đỉnh bất kỳ 
// 3. Viết hàm main thực hiện các công việc trên
#include <bits/stdc++.h>
#include "node.h"
using namespace std;

// template <class T>
// struct Node{
//     T data;
//     Node<T> *next;
// };

template <class T>
class Stack {
    private:
        Node<T> *top;
    public: 
        Stack() {top=0;}

        void Push(T value) {
            Node<T>* newNode = new Node<T>;
            newNode->data = value;
            newNode->next = top;
            top = newNode;
        }

        T Pop() {
            T t = top->data;
            Node<T> *p = top;
            top = top->next;
            delete p;
            return t; 
        }

        T getTop() {
            return top->data;
        }

        void print() {
            Stack<T> tempStack;

            while (!isEmpty()) {
                cout << getTop() << endl;
                tempStack.Push(Pop());
            }

            // Khôi phục ngăn xếp về trạng thái ban đầu
            while (!tempStack.isEmpty()) {
                Push(tempStack.Pop());
            }
        }

        void printStack() {
            Node<T> *t = top;
            while(t != NULL) {
                cout << t->data << " ";
                t = t -> next;
            }
            cout << endl;
        }

        bool isEmpty() {return top==0;}

        int Size() {
            int count = 0;
            Node<T>* ptr = top;
            while (ptr != 0) {
                count++;
                ptr = ptr -> next;
            }
            return count;
        }

        // Sắp xếp
        void Sort() {
            int size = Size();
            T *array = new T[size];
            int i = 0;
            Node<T> *current = top;
            while(current != NULL) {
                array[i] = current->data;
                current = current->next;
                i++;
            }

            // Sắp xếp mảng
            for (int i = 0; i < size - 1; i++) {
                for (int j = 0; j < size - i - 1; j++) {
                    if (array[j] > array[j + 1]) {
                        T temp = array[j];
                        array[j] = array[j + 1];
                        array[j + 1] = temp;
                    }
                }
            }

            // Cập nhật lại Queue từ mảng đã sắp xếp
            current = top;
            i = 0;
            while(current != NULL) {
                current->data = array[i];
                current = current->next;
                i++;
            }

            delete[] array; // Giải phóng mảng tạm
        }


        ~Stack() {
            // while(!isEmpty()) {
            //     Pop();
            // }
            while(top != NULL) {
                Node<T> *p = top;
                top = top->next;
                delete p;
            }
        }
};

int main() {
    Stack<int> s;
    srand(time(0));
    cout << "Nhap so luong cua cac so: ";
    int n; cin >> n;
    for(int i=0; i<n; i++) {
        int value = rand() % 100;
        s.Push(value);
    }
    s.printStack();
    s.Sort();
    s.printStack();
    // s.Push(3);
    // s.Push(4);
    // s.Push(5);
    // cout<<s.getTop()<<"    "<<endl;
    // cout<<s.Pop()<<"    "<<endl;
    // cout<<s.Pop()<<"    "<<endl;
    // cout<<s.Pop()<<"    "<<endl;
    // cout << s.isEmpty();
    // s.print();
}
