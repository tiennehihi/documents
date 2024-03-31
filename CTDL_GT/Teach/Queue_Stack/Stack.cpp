#include <bits/stdc++.h>
using namespace std;

template <class T>
struct Node{
    T data;
    Node<T> *next;
};

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

        // // Sắp xếp
        // void Sort() {
        //     Node<T> *t = top;
        //     if (Size() <= 1) return;
        //     while(t != NULL) {
        //         if(t->data > t->next->data){
        //             swap(t, t->next);
        //             // T temp = t->data;
        //             // t->data = t->next->data;
        //             // t->next->data = temp;
        //         }
        //         t = t->next;
        //     }
        // }

        void Sort() {
            int size = Size();
            T* array = new T[size];
            int i=0;
            Node<T> *current = top;
            while(current != NULL) {
                array[i] = current->data;
                current = current->next;
                i++;
            }

            // Sắp xếp mảng
            for(int i=0; i < size-1; i++) {
                for(int j=i+1; j < size; j++) {
                    if(array[i] > array[j]) {
                        swap(array[i], array[j]);
                    }
                }
            }

            // Cập nhật lại Stack từ mảng đã sắp xếp
            current = top;
            i = 0;
            while(current != NULL) {
                current -> data = array[i];
                current = current -> next;
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
}
