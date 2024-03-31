#include <iostream>
#include <ctime>
using namespace std;

template <class T>
struct Node {
    T data;
    Node<T> *next;
};

template <class T>
class Queue {
    private:
        Node<T> *f;
        Node<T> *l;
    public: 
        Queue() {
            f = 0;
            l = 0;
        }
        // Thêm 1 Node
        void EnQueue(T value) {
            Node<T> *n = new Node<T>;
            n->data = value;
            n->next = NULL;
            if(f==0) {
                f=n;
                l=n;
            } else {
                l -> next = n;
                l = n;
            }
        }

        // Hàm xóa
        T DeQueue() {
            T t = f->data;
            Node<T> *p = f;
            f = f->next;
            delete p;
            if(f==0) {
                l == 0;
            }
            return t;
        }

        // Check
        bool IsEmpty() {
            return f == 0;
        }

        // Lấy giá trị đầu tiên
        T getFirst() const {
            return f->data;
        }

        // In ra 
        void printQueue() {
            Node<T>* p = f; 
            while (p != 0) {
                cout << p->data << " ";
                p = p->next;
            }
            cout << endl;
        }

        // Size 
        int Size() {
            Node<T> *p = f;
            int cnt = 0;
            while (p != 0) {
                cnt++;
                p = p->next;
            }
            return cnt;
        }

        // Sort
        void Sort() {
            // Chuyển Queue thành một mảng
            int size = Size(); // Lấy kích thước của Queue
            T* array = new T[size]; // Tạo một mảng tạm để chứa các giá trị
            int index = 0;
            Node<T>* currentNode = f;
            while (currentNode != nullptr) {
                array[index] = currentNode->data;
                currentNode = currentNode->next;
                index++;
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
            currentNode = f;
            index = 0;
            while (currentNode != nullptr) {
                currentNode->data = array[index];
                currentNode = currentNode->next;
                index++;
            }

            delete[] array; // Giải phóng mảng tạm

            // Queue đã được sắp xếp
        }
};

int main() {
    Queue<int> q;
    srand(time(0));
    for (int i=1;i<=5;i++) {
        int value = rand() % 100;
        q.EnQueue(value);
    }
    q.printQueue();
    cout << q.Size() << endl;
    q.Sort();
    q.printQueue();
}